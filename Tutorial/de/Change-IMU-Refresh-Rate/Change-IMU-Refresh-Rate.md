# Ändern der Ausgaberate des IMU-Moduls

**Kurz gesagt:** **Über die serielle Schnittstelle kannst du 10–100 Hz einstellen; über I²C nicht — dort ist die Rate fest bei etwa 115–118 Hz.** Die Einstellung wird im Flash gespeichert und bleibt nach dem Ausschalten erhalten.

---

## 1. Seriell: So wird sie eingestellt

### Frame-Format

```
7E 23 07 60 <rate in Hz> 5F <checksum>
```

| Feld | Wert |
|-|-|
| Header | `7E 23` |
| Länge | **fest `0x07`** (insgesamt 7 Bytes) |
| Funktion | **`0x60`** = Datenausgaberate setzen |
| Parameter 1 | Rate, **10–100 Hz** |
| Parameter 2 | **fest `0x5F`** |
| Prüfsumme | Summe von `7E` bis `5F`, niederwertiges Byte |

> ⚠️ **Lass Parameter 2 mit `0x5F` nicht weg.** Ohne ihn stimmen sowohl die Länge als auch die Prüfsumme nicht, und das Modul **meldet keinen Fehler und gibt keinen Fehlschlag zurück — es ignoriert den gesamten Frame stillschweigend**, sodass man leicht fälschlich zu dem Schluss kommt, das Modul könne die Rate nicht ändern.

### Gängige Frames

| Rate | Vollständiger Frame |
|-|-|
| 10 Hz | `7E 23 07 60 0A 5F 71` |
| **20 Hz** | `7E 23 07 60 14 5F 7B` |
| 25 Hz | `7E 23 07 60 19 5F 80` |
| 50 Hz | `7E 23 07 60 32 5F 99` |
| 100 Hz | `7E 23 07 60 64 5F CB` |

### So wird sie gesendet

- **Serielles Terminal**: 115200 8N1, die oben genannten Hex-Bytes direkt senden.
- **Offizielle Bibliothek**: `set_report_rate(hz)` in `IMU_Serial_Library`.
- Etwa 1 Sekunde warten, bis die Einstellung wirksam wird.

---

## 2. Messergebnisse

| Einstellung | Frame-Ankunftsrate | **Effektive Ausgaberate** | Längste aufeinanderfolgende Wiederholung |
|-|-|-|-|
| 20 Hz | 20.8 Hz | **20.7 Hz** | 1 (keine Wiederholung) |
| 50 Hz | 52.9 Hz | **52.8 Hz** | 1 |
| 100 Hz | 105.6 Hz | **104.0 Hz** | 2 |

Zwei Beobachtungen:

1. **Die effektive Ausgaberate ≈ die Ankunftsrate**, was bedeutet, dass die interne Fusion des Moduls tatsächlich mit der konfigurierten Rate läuft und **bei niedrigen Raten nicht denselben Frame fortlaufend erneut sendet**.
2. Der tatsächliche Wert liegt **3–8 % über der Einstellung** (20 eingestellt, 20.8 erhalten; 100 eingestellt, 105.6 erhalten). Das ist die eigene Takt-Toleranz des Moduls und normal.

---

## 3. Bleibt die Einstellung nach dem Ausschalten erhalten?

Auf 20 Hz einstellen → Type-C für 3 Sekunden abziehen → wieder anschließen → erneut messen: **weiterhin 20.7 Hz**.

**Die Einstellung liegt im Flash, daher reicht ein einmaliges Einstellen** — es ist nicht nötig, sie bei jedem Einschalten erneut zu senden.

> Folgerung: **Neue Module werden mit der Werkseinstellung von 25 Hz ausgeliefert**, daher sollte man sie bei der Erstinstallation einmal einstellen und bestätigen; danach kann man sie vergessen.

---

## 4. I²C: nicht änderbar

Alle drei Prüfungen wurden durchgeführt:

| Prüfung | Ergebnis |
|-|-|
| 20 Hz über seriell einstellen, dann Register `0x16` über I²C abfragen | das Quaternion ändert sich weiterhin mit **115.4 Hz** (Abfrage mit 115.8 Hz) → **unverändert** |
| So schnell wie möglich ohne Verzögerung abfragen (1779 Hz) und die mediane Wiederholungslänge betrachten | entspricht **~111 Hz** → feste Rate |
| Register `0x60 = 20` direkt über I²C schreiben | Rate **unverändert**; `0x60` liest immer `0` zurück |

**Fazit: Keine Schnittstelle kann die I²C-Rate ändern; sie ist fest bei etwa 115–118 Hz.** Es handelt sich nicht um eine „Drosselung auf ein Maximum" — es ist die feste Fusions-Ausgaberate des Moduls.

---

## 5. Eine Sache, die du wissen musst: zu schnelles Abfragen liefert zerrissene Werte

Abfragen mit 471 Hz und Zählen, ob zwei aufeinanderfolgende Lesevorgänge identisch sind, ergibt folgende Verteilung der Wiederholungslängen:

```
length 1: 333 times     ← read the middle of a register update
length 3: 114 times     ← normal
length 4: 182 times     ← normal
```

471 ÷ 4 ≈ 118 Hz, was der Aktualisierungsrate entspricht. Die **333 Lesevorgänge der Länge 1 sind zerrissen** — halb alte, halb neue Werte, die gelesen wurden, während das Modul seinen 16-Byte-Registerblock aktualisierte.

**Die Gefahr besteht darin, dass ein zerrissenes Quaternion immer noch ein gültiges Einheitsquaternion ist** (zwei benachbarte Posen unterscheiden sich nur um etwa 9 ms, sodass die Mischung sehr nahe beieinanderliegt), und eine Normprüfung kann das nicht erkennen.

👉 **Frage nicht viel schneller als mit 150 Hz ab.** 50–100 Hz ist am stabilsten, und genau das ist der Bereich der MicroDuck-Steuerschleife (50 Hz) und des IMU-Threads (100 Hz).

---

## 6. Was das für MicroDuck bedeutet

| | |
|-|-|
| **I²C-Pfad** (Modul am I²C-Header des HAT angeschlossen) | **keine Raten-Einstellung nötig**; die festen ~115 Hz sind bereits ausreichend |
| Rate des seriellen Pfads | betrifft nur die automatische serielle Ausgabe und steht in keinem Zusammenhang mit dem, was I²C zurückgibt |
| Das „100 Hz ab Werk, bei einem neuen Modul bestätigen" aus der Doku | **betrifft nur Nutzer der seriellen Schnittstelle**; I²C-Nutzer müssen sich nicht darum kümmern |

Vollständige Integrationsanleitung: [Juxi-Technology/imu-displace-microduck](https://github.com/Juxi-Technology/imu-displace-microduck)
