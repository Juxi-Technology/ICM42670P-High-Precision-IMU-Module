# Using the IMU Module with MicroDuck

This module can replace MicroDuck's trunk IMU — the `imu_to_dxl` board that rides the servo bus — with the module on I²C instead.

## Status

| | |
|---|---|
| IMU data path: sampling, decoding, observation slots | **verified on hardware** |
| MicroDuck runtime (`robotd`) wiring | **planned for the integration phase** |

> **Scope**: the external I²C module is a transitional arrangement. The final design integrates the IMU into the robot hardware and main controller; the wiring, frame conventions and calibration here remain valid.

**Full guide and code: [Juxi-Technology/imu-displace-microduck](https://github.com/Juxi-Technology/imu-displace-microduck)**

That repository is the authoritative version of this page. It carries the exact wiring, the calibration procedure, the acceptance checklist and the measured numbers; this page is only the entry point.

## Wiring

| | |
|---|---|
| Module | ICM-42670-P, I²C slave **0x23** |
| Pins | GND / 3V3 / SDA / SCL |
| Supply | **3V3 — not 5V**; the host's I/O is 3.3 V |
| Bus (official HAT) | `/dev/i2c-pihat` = `/dev/i2c-3`; `/dev/i2c-4` after moving J6's R18/R19 to R16/R17 |
| Address conflicts | 0x18 (audio), 0x19/0x68 or 0x6A (onboard IMU), 0x29 (ToF) already sit on that bus — **0x23 collides with none** |

```bash
sudo apt install -y i2c-tools
sudo i2cdetect -y -r <bus>        # expect 23
```

## Why it is not Dynamixel ID 200

ID 200 is a device number on the **servo bus** — single-wire half-duplex TTL at 1 Mbps, Dynamixel Protocol V2. This module speaks **I²C**: two wires, register reads. Wiring it to the HAT's I²C header does not turn it into ID 200; the host reads the two buses separately and merges them into one sensor sample.

## Verifying it (module only, no servos)

```bash
cargo run -p duck-control --example imu_probe -- /dev/i2c-7 20
cargo run -p duck-control --example imu_to_observation -- /dev/i2c-7 20
```

| Expected | |
|---|---|
| Sample rate | ~100 Hz, zero read failures |
| Second command | zero mismatches in `obs[0..3]` (gyro), `obs[3..6]` (gravity) and the joint blocks |

Measured on a Jetson Orin Nano with `/dev/i2c-7`: 99.4 Hz, 0.92 ms per sample, no read failures.

## Reference mounting

The module's axes coincide with the trunk's — **X forward / Y left / Z up** — which physically means component side up, Type-C aft. That makes the mount rotation **identity**.

The module's own frame, measured over three orthogonal poses: flat with the component side up, gravity reads `[0, 0, -1]`; Type-C up, `[1, 0, 0]`; on edge with the component face right, `[0, 1, 0]`.

---
## Next steps

- Wire the module into the `robotd` runtime: configurable bus path, IMU source and mount.
- Give the IMU its own capture thread and a shared slot so the I²C read does not occupy the control tick.
- Validate the full robot with the real 15-servo bus and walking policy; the final design integrates the IMU into the robot hardware and main controller.
