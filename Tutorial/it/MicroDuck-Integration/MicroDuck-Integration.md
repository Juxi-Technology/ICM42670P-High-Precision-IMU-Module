# Usare il modulo IMU con MicroDuck

Questo modulo può sostituire l'IMU del tronco di MicroDuck — la scheda `imu_to_dxl` che viaggia sul bus dei servo — collegandosi via I²C.

## Stato

| | |
|---|---|
| Catena dati IMU: campionamento, decodifica, slot di osservazione | **verificata su hardware reale** |
| Integrazione nel runtime di MicroDuck (`robotd`) | **prevista per la fase di integrazione** |

> **Nota**: il modulo I²C esterno è una soluzione transitoria. La versione finale integrerà l'IMU nell'hardware del robot e nel controller principale; cablaggio, assi e calibrazione di questa pagina restano validi.

**Guida completa e codice: [Juxi-Technology/imu-displace-microduck](https://github.com/Juxi-Technology/imu-displace-microduck)**

Quel repository è la versione autorevole di questa pagina: cablaggio esatto, procedura di calibrazione, checklist di accettazione e misure sono lì. Questa pagina è solo l'ingresso.

## Cablaggio

| | |
|---|---|
| Modulo | ICM-42670-P, slave I²C **0x23** |
| Pin | GND / 3V3 / SDA / SCL |
| Alimentazione | **3V3 — non 5V**; l'I/O dell'host è a 3,3 V |
| Bus (HAT ufficiale) | `/dev/i2c-pihat` = `/dev/i2c-3`; `/dev/i2c-4` dopo aver spostato R18/R19 su R16/R17 in J6 |
| Conflitti di indirizzo | 0x18 (audio), 0x19/0x68 o 0x6A (IMU integrata) e 0x29 (ToF) sono già su quel bus — **0x23 non ne collide con nessuno** |

```bash
sudo apt install -y i2c-tools
sudo i2cdetect -y -r <numero di bus>        # atteso: 23
```

## Perché non è l'ID 200 di Dynamixel

L'ID 200 è un numero di dispositivo sul **bus dei servo** — TTL half-duplex a filo singolo a 1 Mbps, Dynamixel Protocol V2. Questo modulo parla **I²C**: due fili, accessi ai registri. Collegarlo al connettore I²C dell'HAT non lo trasforma in ID 200; l'host legge i due bus separatamente e li fonde in un unico campione del sensore.

## Verifica (solo modulo, senza servo)

```bash
cargo run -p duck-control --example imu_probe -- /dev/i2c-7 20
cargo run -p duck-control --example imu_to_observation -- /dev/i2c-7 20
```

| Atteso | |
|---|---|
| Frequenza di campionamento | ~100 Hz, nessun errore di lettura |
| Secondo comando | nessuna discrepanza in `obs[0..3]` (giroscopio), `obs[3..6]` (gravità) e nei blocchi delle articolazioni |

Misurato su un Jetson Orin Nano con `/dev/i2c-7`: 99,4 Hz, 0,92 ms per campione, nessun errore di lettura.

## Montaggio di riferimento

Gli assi del modulo coincidono con quelli del tronco — **X avanti / Y sinistra / Z su** — cioè fisicamente **lato componenti verso l'alto, Type-C verso poppa**. La rotazione di montaggio è quindi l'**identità**.

Il sistema di riferimento proprio del modulo, misurato su tre pose ortogonali: piatto con il lato componenti in alto, la gravità vale `[0, 0, -1]`; Type-C in alto, `[1, 0, 0]`; di taglio con il lato componenti a destra, `[0, 1, 0]`.

---
## Prossimi passi

- Integrare il modulo nel runtime `robotd`: percorso bus, sorgente IMU e mount configurabili.
- Dare all'IMU un thread di acquisizione dedicato e uno slot condiviso, così la lettura I²C non occupa il tick di controllo.
- Validare il robot completo con il bus reale da 15 servo e la policy di camminata; la versione finale integrerà l'IMU nell'hardware del robot e nel controller principale.
