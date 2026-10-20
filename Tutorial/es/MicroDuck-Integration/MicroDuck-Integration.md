# Usar el módulo IMU con MicroDuck

Este módulo puede sustituir la IMU del tronco de MicroDuck — la placa `imu_to_dxl` que viaja en el bus de servos — conectándose por I²C.

## Estado

| | |
|---|---|
| Cadena de datos de la IMU: muestreo, decodificación, ranuras de observación | **verificada en hardware real** |
| Integración en el runtime de MicroDuck (`robotd`) | **aún no implementada** |

**Guía completa y código: [Juxi-Technology/imu-displace-microduck](https://github.com/Juxi-Technology/imu-displace-microduck)**

Ese repositorio es la versión autorizada de esta página: allí están el cableado exacto, el procedimiento de calibración, la lista de aceptación y los valores medidos. Esta página es solo la entrada.

## Cableado

| | |
|---|---|
| Módulo | ICM-42670-P, esclavo I²C **0x23** |
| Pines | GND / 3V3 / SDA / SCL |
| Alimentación | **3V3 — no 5V**; la E/S del host es de 3,3 V |
| Bus (HAT oficial) | `/dev/i2c-pihat` = `/dev/i2c-3`; `/dev/i2c-4` tras mover R18/R19 a R16/R17 en J6 |
| Conflictos de dirección | 0x18 (audio), 0x19/0x68 o 0x6A (IMU integrada) y 0x29 (ToF) ya están en ese bus — **0x23 no colisiona con ninguno** |

```bash
sudo apt install -y i2c-tools
sudo i2cdetect -y -r <número de bus>        # se espera 23
```

## Por qué no es el ID 200 de Dynamixel

El ID 200 es un número de dispositivo del **bus de servos** — TTL semidúplex de un solo hilo a 1 Mbps, Dynamixel Protocol V2. Este módulo habla **I²C**: dos hilos, accesos a registros. Conectarlo al conector I²C del HAT no lo convierte en ID 200; el host lee los dos buses por separado y los fusiona en una sola muestra de sensor.

## Verificación (solo el módulo, sin servos)

```bash
cargo run -p duck-control --example imu_probe -- /dev/i2c-7 20
cargo run -p duck-control --example imu_to_observation -- /dev/i2c-7 20
```

| Esperado | |
|---|---|
| Frecuencia de muestreo | ~100 Hz, sin errores de lectura |
| Segundo comando | ninguna discrepancia en `obs[0..3]` (giroscopio), `obs[3..6]` (gravedad) ni los bloques de articulaciones |

Medido en un Jetson Orin Nano con `/dev/i2c-7`: 99,4 Hz, 0,92 ms por muestra, sin errores de lectura.

## Montaje de referencia

Los ejes del módulo coinciden con los del tronco — **X adelante / Y izquierda / Z arriba** — lo que físicamente significa **cara de componentes hacia arriba, Type-C hacia atrás**. Así la rotación de montaje es la **identidad**.

El sistema de referencia propio del módulo, medido en tres poses ortogonales: plano con la cara de componentes arriba, la gravedad vale `[0, 0, -1]`; Type-C arriba, `[1, 0, 0]`; de canto con la cara de componentes a la derecha, `[0, 1, 0]`.
