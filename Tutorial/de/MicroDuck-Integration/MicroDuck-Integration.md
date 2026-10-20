# Das IMU-Modul mit MicroDuck verwenden

Dieses Modul kann den Rumpf-IMU von MicroDuck ersetzen — die `imu_to_dxl`-Platine, die auf dem Servobus mitläuft — und stattdessen über I²C angebunden werden.

## Status

| | |
|---|---|
| IMU-Datenpfad: Abtastung, Dekodierung, Beobachtungs-Slots | **auf echter Hardware verifiziert** |
| Anbindung an die MicroDuck-Runtime (`robotd`) | **folgt mit der Integration** |

> **Einordnung**: Das externe I²C-Modul ist eine Übergangslösung. Die endgültige Ausführung integriert die IMU in die Roboterhardware und den Hauptcontroller; Verdrahtung, Koordinatensystem und Kalibrierung dieser Seite gelten weiterhin.

**Vollständige Anleitung und Code: [Juxi-Technology/imu-displace-microduck](https://github.com/Juxi-Technology/imu-displace-microduck)**

Dieses Repository ist die maßgebliche Fassung dieser Seite: genaue Verdrahtung, Kalibrierablauf, Abnahmeliste und Messwerte stehen dort. Diese Seite ist nur der Einstieg.

## Verdrahtung

| | |
|---|---|
| Modul | ICM-42670-P, I²C-Slave **0x23** |
| Pins | GND / 3V3 / SDA / SCL |
| Versorgung | **3V3 — nicht 5V**; die I/O des Hosts ist 3,3 V |
| Bus (offizielles HAT) | `/dev/i2c-pihat` = `/dev/i2c-3`; `/dev/i2c-4`, nachdem R18/R19 an J6 auf R16/R17 umgesetzt wurden |
| Adresskonflikte | 0x18 (Audio), 0x19/0x68 bzw. 0x6A (Onboard-IMU) und 0x29 (ToF) liegen bereits auf diesem Bus — **0x23 kollidiert mit keiner** |

```bash
sudo apt install -y i2c-tools
sudo i2cdetect -y -r <Busnummer>        # erwartet: 23
```

## Warum es nicht Dynamixel-ID 200 ist

ID 200 ist eine Gerätenummer auf dem **Servobus** — einadriges Halbduplex-TTL mit 1 Mbps, Dynamixel Protocol V2. Dieses Modul spricht **I²C**: zwei Leitungen, Registerzugriffe. Es am I²C-Header des HAT anzuschließen macht daraus keine ID 200; der Host liest beide Busse getrennt und führt sie zu einem Sensor-Sample zusammen.

## Prüfen (nur das Modul, keine Servos)

```bash
cargo run -p duck-control --example imu_probe -- /dev/i2c-7 20
cargo run -p duck-control --example imu_to_observation -- /dev/i2c-7 20
```

| Erwartung | |
|---|---|
| Abtastrate | ~100 Hz, keine Lesefehler |
| Zweiter Befehl | keine Abweichung in `obs[0..3]` (Gyro), `obs[3..6]` (Gravitation) und den Gelenkblöcken |

Gemessen auf einem Jetson Orin Nano mit `/dev/i2c-7`: 99,4 Hz, 0,92 ms pro Sample, keine Lesefehler.

## Referenzmontage

Die Achsen des Moduls fallen mit denen des Rumpfs zusammen — **X vorwärts / Y links / Z oben** — physisch also **Bauteilseite nach oben, Type-C nach achtern**. Damit ist die Mount-Rotation die **Identität**.

Das eigene Koordinatensystem des Moduls, über drei orthogonale Lagen gemessen: flach mit der Bauteilseite oben zeigt die Gravitation `[0, 0, -1]`; Type-C oben `[1, 0, 0]`; hochkant mit der Bauteilseite nach rechts `[0, 1, 0]`.

---
## Nächste Schritte

- Das Modul in die `robotd`-Runtime einbinden: konfigurierbarer Bus-Pfad, IMU-Quelle und Mount.
- Der IMU einen eigenen Erfassungsthread und einen gemeinsamen Slot geben, damit der I²C-Lesevorgang den Steuertakt nicht belegt.
- Den gesamten Roboter mit dem echten 15-Servo-Bus und der Laufstrategie validieren; die endgültige Ausführung integriert die IMU in Roboterhardware und Hauptcontroller.
