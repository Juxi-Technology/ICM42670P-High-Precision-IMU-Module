# Web-Host-Konsole – Benutzerhandbuch

Dieses Handbuch beschreibt die browserbasierte **JX IMU Studio** zur Verbindung, Überwachung und Kalibrierung des JuxiTech-Hochpräzisions-IMU-Moduls. Die Web-Version benötigt keine Installation, verbindet sich über die Web Serial API direkt mit dem seriellen Port und kann auf GitHub Pages bereitgestellt werden.

> Die Web-Version unterstützt nur Desktop-Chrome / Edge. Browser können nicht auf I2C zugreifen; I2C-Nutzer sollten weiterhin den Systemtreiber oder die Desktop-Tools verwenden. Die Oberfläche kann zwischen Chinesisch und Englisch umgeschaltet werden; die Screenshots zeigen die englische Oberfläche.

## 1. Seite öffnen

Online:

<https://juxi-technology.github.io/ICM42670P-High-Precision-IMU-Module/>

Lokale Vorschau (optional, Python erforderlich):

```bash
python -m http.server 5173 --directory <web-Verzeichnis>
```

Öffnen Sie dann <http://localhost:5173>. Web Serial benötigt einen sicheren Kontext (HTTPS oder localhost); beim Öffnen von `index.html` über `file://` kann der serielle Zugriff deaktiviert sein.

## 2. Voraussetzungen

- Desktop **Chrome / Edge** (empfohlen ab Version 89)
- USB-Seriell-Treiber (CH340, CP210x usw.)
- Gerät eingeschaltet, Baudrate **115200**
- Firefox, Safari und mobile Browser unterstützen Web Serial nicht
- Keine Installation von Python, Qt oder Client-Software erforderlich

## 3. Gerät verbinden

1. Öffnen Sie die Seite; die Datenquelle ist fest auf **Seriell** eingestellt.
2. Klicken Sie auf **Serielles Gerät wählen…** und wählen Sie im Browserdialog den IMU-Port (z. B. `USB-SERIAL CH340`).
3. Klicken Sie auf **Verbinden**. Der Status wechselt zu **Verbunden** und zeigt Firmware-Version, erkannte Achsen und Datenrate.
4. Die Konsole erkennt 6 / 9 / 10-Achsen-Hardware automatisch und zeigt den Fusionsalgorithmus an; 10-Achsen-Geräte verwenden den 9-Achsen-Algorithmus.
5. Klicken Sie zum Beenden auf **Trennen**. Wird das Gerät abgezogen, trennt die Seite automatisch.

![Verbindung und Monitor](../../en/Web-Host-Console-Tutorial/Images/01-overview.png)

> Beim ersten Zugriff fragt der Browser nach der Berechtigung für den seriellen Port. Ist die Liste leer, installieren Sie zuerst den USB-Seriell-Treiber.

## 4. Oberfläche

Die obere Leiste enthält seriellen Port, Fusionsalgorithmus, magnetische Deklination, Pitch-Umkehr, Kompass-Umkehr und den Verbinden-Button. Darunter befinden sich fünf Registerkarten:

| Registerkarte | Funktion |
|---------------|----------|
| Monitor | Beschleuniger, Gyroskop, Magnetometer, Euler-Winkel, Quaternion, Barometer |
| Diagramme | Vier rollende Kurvengruppen, Pause und Löschen |
| 3D-Lage | 3D-Würfel, Achsenpfeile, Kompass, Nullpunkt-Kalibrierung |
| Instrumente | Drehende Kompasskarte und künstlicher Horizont |
| Kalibrierung | IMU-, Magnetometer-, Temperaturkalibrierung und Zurücksetzen |

Mit der Schaltfläche **EN / 中文** oben rechts wechseln Sie die Sprache.

## 5. Monitor

Sechs Karten zeigen Live-Werte:

- **Beschleunigungsmesser**: Einheit g, ±16 g; waagerecht in Ruhe etwa +1 g auf Z.
- **Gyroskop**: Einheit rad/s, ±2000 °/s; in Ruhe nahe 0.
- **Magnetometer**: Einheit μT, ±800 μT; Erdmagnetfeld etwa 25–65 μT.
- **Euler-Winkel**: Roll / Pitch / Yaw in Grad; Yaw von 0 bis 360°.
- **Quaternion**: W / X / Y / Z, Einheitsnorm.
- **Barometer**: Höhe (m), Temperatur (℃), Luftdruck (hPa) und Referenzdruck (hPa) bei 10-Achsen-Modellen.

Der farbige Balken unter jedem Wert zeigt den Anteil am Vollbereich.

## 6. Diagramme

- Oben die Gruppen umschalten: Beschleuniger (g) / Gyroskop (rad/s) / Magnetometer (μT) / Euler-Winkel (°).
- Jede Gruppe hat drei Kurven für X/Y/Z bzw. Roll/Pitch/Yaw mit festen Farben.
- Jede Kurve speichert die letzten **300 Samples** bei etwa 100 Hz.
- **Pause** friert das Diagramm ein, **Löschen** setzt die Puffer zurück. Der Gruppenwechsel löscht keine anderen Gruppen.
- Die Legende zeigt den aktuellen Wert jedes Kanals.

![Echtzeitdiagramme](../../en/Web-Host-Console-Tutorial/Images/02-plots.png)

> Bei den Euler-Winkeln entsteht ein vertikaler Sprung, wenn Yaw von 360° auf 0° zurückspringt. Das ist ein Winkel-Wrap, kein Datenfehler.

## 7. 3D-Lage

- Der Würfel dreht sich in Echtzeit mit Roll / Pitch / Yaw.
- **Linke Maustaste ziehen** dreht die Ansicht, **Mausrad** zoomt.
- Die X-/Y-/Z-Achsen sind rote/grüne/blaue Pfeile und werden immer über dem Würfel gezeichnet.
- Der Kompass rechts ist eine drehende Karte: Skala und N/E/S/W drehen sich mit dem Gerät, der goldene Bugmarker oben zeigt die Geräteausrichtung.
- **Aktuelle Position als Nullpunkt**: setzt die aktuelle Lage als Nullpunkt; wirkt nur auf die 3D-Ansicht und wird nicht ins Gerät geschrieben.
- **Kalibrierung zurücksetzen**: entfernt den Nullpunkt-Offset.

![3D-Lage](../../en/Web-Host-Console-Tutorial/Images/03-attitude.png)

## 8. Instrumente

- **Kompass**: Die Karte dreht sich mit dem Kurs, der goldene Bugmarker bleibt oben fixiert; der Kurs wird über und unter der Skala angezeigt.
- **Künstlicher Horizont**: Himmel/Boden verschieben sich mit Pitch und drehen sich mit Roll. Horizont oberhalb der Mitte bedeutet Nase hoch, darunter Nase tief.
- Wenn N dem Gerät folgt statt nach Norden zu zeigen, aktivieren Sie **Compass invert**.
- Wenn Nase hoch als Nase tief dargestellt wird, aktivieren Sie **Pitch flip** (Roll und Pitch werden beide invertiert).

![Instrumente](../../en/Web-Host-Console-Tutorial/Images/04-instruments.png)

## 9. Sensorkalibrierung

Die Kalibrierungsseite bietet vier Aktionen; das Protokoll zeigt den vom Gerät zurückgegebenen Statuscode:

1. **IMU-Kalibrierung**: Gerät waagerecht und ruhig legen, klicken und einige Sekunden still halten, um Beschleuniger- und Gyro-Bias zu kalibrieren.
2. **Magnetometer-Kalibrierung**: Nach dem Klick das Gerät langsam in Achterfiguren etwa 10–30 Sekunden drehen, um alle Richtungen abzudecken; von Handys, Motoren und ferromagnetischen Objekten fernhalten.
3. **Temperaturkalibrierung**: Aktuelle Umgebungstemperatur (−50 ℃ bis 50 ℃) eingeben und auf **Temperatur kalibrieren** klicken.
4. **Kalibrierung zurücksetzen**: Löscht alle im Flash gespeicherten Kalibrierwerte. Vorsichtig verwenden und anschließend neu kalibrieren.

Während der Kalibrierung sind die Schaltflächen deaktiviert und zeigen **Kalibrierung läuft…**. Danach erscheint **Kalibrierung abgeschlossen (Status 0)** oder der zurückgegebene Status. Bei Zeitüberschreitung erscheint eine Warnung; Verbindung prüfen und erneut versuchen.

![Sensorkalibrierung](../../en/Web-Host-Console-Tutorial/Images/05-calibration.png)

## 10. Richtungskorrekturen

- **Deklination**: Kurskorrektur im Bereich ±180°. Negativ, wenn der Kompass westlich von Norden zeigt, positiv bei östlicher Abweichung; in Ostchina etwa −4° bis −10°. Auch zur Korrektur des Montagewinkels geeignet.
- **Pitch-Umkehr**: Invertiert Roll und Pitch gemeinsam, wenn das Gerätekoordinatensystem der Softwarekonvention entgegengesetzt ist.
- **Kompass-Umkehr**: Dreht nur die Kompasskarte um; 3D-Lage und Zahlenwerte bleiben unverändert.

Alle drei Optionen befinden sich in der Verbindungsleiste und wirken sofort, ohne erneutes Verbinden.

## 11. Fehlerbehebung

**Q1: Bei „Serielles Gerät wählen…“ erscheint kein Gerät.**
USB-Kabel und Stromversorgung prüfen, CH340/CP210x-Treiber installieren und einen anderen USB-Port oder ein anderes Kabel testen.

**Q2: Verbunden, aber keine Daten.**
Baudrate 115200 prüfen und sicherstellen, dass der Port nicht von anderer Software belegt ist; Gerät ab- und wieder anstecken.

**Q3: Der Browser meldet, dass Web Serial nicht unterstützt wird.**
Desktop-Chrome / Edge über HTTPS oder localhost verwenden. Firefox, Safari und mobile Browser werden nicht unterstützt.

**Q4: Das Gerät wird während der Verbindung abgezogen.**
Die Seite wechselt automatisch in den getrennten Zustand und zeigt einen Hinweis; Gerät wieder anschließen und erneut verbinden.

**Q5: Yaw driftet langsam.**
Ein 6-Achsen-Gerät hat keine Magnetometer-Referenz, daher ist die Yaw-Drift normal. Bei 9/10-Achsen-Geräten zuerst IMU- und Magnetometer-Kalibrierung durchführen und Magnetstörungen vermeiden.

**Q6: Der Kompass hat einen festen Versatz zu Norden.**
**Deklination** anpassen: negativ für West, positiv für Ost. Bei umgekehrter Drehrichtung **Compass invert** aktivieren.

**Q7: 3D-Ansicht oder Instrument zeigt Nase hoch/tief vertauscht.**
**Pitch flip** aktivieren; Roll und Pitch werden gemeinsam invertiert.

## 12. Daten und Datenschutz

Die Web-Version ist eine rein statische Seite ohne Backend. Serielle Daten werden ausschließlich im Browser verarbeitet und angezeigt und nicht ins Netzwerk übertragen. Es werden keine Drittanbieter-Skripte oder Analyse-Codes geladen. Beim Schließen der Seite werden die Daten verworfen.
