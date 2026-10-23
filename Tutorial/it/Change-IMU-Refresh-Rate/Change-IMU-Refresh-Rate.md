# Modificare la frequenza di uscita del modulo IMU

**In breve:** **via seriale potete impostare 10–100 Hz; via I²C no — è fissa a circa 115–118 Hz.** L'impostazione è memorizzata nella flash e sopravvive allo spegnimento.

---

## 1. Seriale: come impostarla

### Formato del frame

```
7E 23 07 60 <rate in Hz> 5F <checksum>
```

| Campo | Valore |
|-|-|
| Header | `7E 23` |
| Lunghezza | **fisso `0x07`** (7 byte in totale) |
| Funzione | **`0x60`** = imposta la frequenza di uscita dei dati |
| Parametro 1 | frequenza, **10–100 Hz** |
| Parametro 2 | **fisso `0x5F`** |
| Checksum | somma da `7E` a `5F`, byte basso |

> ⚠️ **Non omettere il `0x5F` del Parametro 2.** Senza di esso sia la lunghezza sia il checksum sono errati, e il modulo **non segnala alcun errore e non restituisce alcun fallimento — ignora silenziosamente l'intero frame**, quindi è facile concludere, a torto, che il modulo non possa cambiare frequenza.

### Frame comuni

| Frequenza | Frame completo |
|-|-|
| 10 Hz | `7E 23 07 60 0A 5F 71` |
| **20 Hz** | `7E 23 07 60 14 5F 7B` |
| 25 Hz | `7E 23 07 60 19 5F 80` |
| 50 Hz | `7E 23 07 60 32 5F 99` |
| 100 Hz | `7E 23 07 60 64 5F CB` |

### Come inviarlo

- **Terminale seriale**: 115200 8N1, inviate direttamente i byte esadecimali qui sopra.
- **Libreria ufficiale**: `set_report_rate(hz)` in `IMU_Serial_Library`.
- Attendete circa 1 secondo perché l'impostazione abbia effetto.

---

## 2. Risultati misurati

| Impostazione | Frequenza di arrivo dei frame | **Frequenza di uscita effettiva** | Ripetizione consecutiva più lunga |
|-|-|-|-|
| 20 Hz | 20.8 Hz | **20.7 Hz** | 1 (nessuna ripetizione) |
| 50 Hz | 52.9 Hz | **52.8 Hz** | 1 |
| 100 Hz | 105.6 Hz | **104.0 Hz** | 2 |

Due osservazioni:

1. **La frequenza di uscita effettiva ≈ la frequenza di arrivo**, il che significa che la fusione interna del modulo funziona davvero alla frequenza configurata, e **alle basse frequenze non continua a ritrasmettere lo stesso frame**.
2. Il valore reale è **superiore del 3–8% rispetto all'impostazione** (impostato 20, ottenuto 20.8; impostato 100, ottenuto 105.6). È la tolleranza dell'orologio interno del modulo ed è normale.

---

## 3. L'impostazione sopravvive allo spegnimento?

Impostatela a 20 Hz → scollegate il Type-C per 3 secondi → ricollegatelo → misurate di nuovo: **ancora 20.7 Hz**.

**L'impostazione risiede nella flash, quindi impostarla una volta è sufficiente** — non serve reinviarla a ogni accensione.

> Corollario: **i moduli nuovi escono dalla fabbrica a 25 Hz**, quindi impostatela una volta durante la prima installazione e verificatela; dopodiché potete dimenticarvene.

---

## 4. I²C: non modificabile

Sono state eseguite tutte e tre le verifiche:

| Verifica | Risultato |
|-|-|
| Impostare 20 Hz via seriale, poi interrogare il registro `0x16` via I²C | il quaternione cambia ancora a **115.4 Hz** (interrogato a 115.8 Hz) → **invariato** |
| Interrogare il più velocemente possibile senza ritardo (1779 Hz) e osservare la lunghezza mediana delle ripetizioni | corrisponde a **~111 Hz** → frequenza fissa |
| Scrivere direttamente il registro `0x60 = 20` via I²C | frequenza **invariata**; `0x60` restituisce sempre `0` |

**Conclusione: nessuna interfaccia può cambiare la frequenza I²C; è fissa a circa 115–118 Hz.** Non è "limitata a un massimo" — è la frequenza di uscita fusa fissa del modulo.

---

## 5. Una cosa che dovete sapere: interrogare troppo velocemente restituisce valori corrotti

Interrogando a 471 Hz e contando se due letture consecutive sono identiche, si ottiene questa distribuzione della lunghezza delle ripetizioni:

```
length 1: 333 times     ← read the middle of a register update
length 3: 114 times     ← normal
length 4: 182 times     ← normal
```

471 ÷ 4 ≈ 118 Hz, che corrisponde alla frequenza di aggiornamento. Le **333 letture con lunghezza 1 sono corrotte** — valori per metà vecchi e per metà nuovi, letti mentre il modulo stava aggiornando il suo blocco di registro da 16 byte.

**Il pericolo è che un quaternione corrotto resta comunque un quaternione unitario valido** (due pose adiacenti differiscono solo di circa 9 ms, quindi la fusione è molto vicina), e un controllo della norma non può rilevarlo.

👉 **Non interrogare molto più velocemente di 150 Hz.** 50–100 Hz è il valore più stabile, ed è esattamente l'intervallo del ciclo di controllo di MicroDuck (50 Hz) e del thread IMU (100 Hz).

---

## 6. Cosa significa per MicroDuck

| | |
|-|-|
| **Percorso I²C** (modulo collegato all'header I²C del HAT) | **nessuna impostazione di frequenza necessaria**; il fisso ~115 Hz è già sufficiente |
| Frequenza del percorso seriale | influisce solo sull'output seriale automatico, ed è indipendente da ciò che restituisce l'I²C |
| Il "100 Hz di fabbrica, verificate su un modulo nuovo" della documentazione | **riguarda solo gli utenti della seriale**; gli utenti I²C non devono preoccuparsene |

Guida completa all'integrazione: [Juxi-Technology/imu-displace-microduck](https://github.com/Juxi-Technology/imu-displace-microduck)
