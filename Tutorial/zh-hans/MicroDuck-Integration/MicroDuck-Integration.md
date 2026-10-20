# 将 IMU 模块用于 MicroDuck

本模块可以替换 MicroDuck 的躯干 IMU —— 也就是挂在舵机总线上的 `imu_to_dxl` 小板 —— 改用 I²C 模块。

## 状态

| | |
|---|---|
| IMU 数据链：采样、解码、观测槽位 | **已在真硬件上验证** |
| MicroDuck 运行时（`robotd`）接线 | **尚未实现** |

**完整教程与代码：[Juxi-Technology/imu-displace-microduck](https://github.com/Juxi-Technology/imu-displace-microduck)**

那个仓库是本文的权威版本：精确接线、标定流程、验收清单和实测数据都在里面。本页只是入口。

## 接线

| | |
|---|---|
| 模块 | ICM-42670-P，I²C 从机 **0x23** |
| 引脚 | GND / 3V3 / SDA / SCL |
| 供电 | **3V3，不要 5V**；主控 I/O 是 3.3 V |
| 总线（官方 HAT）| `/dev/i2c-pihat` = `/dev/i2c-3`；J6 的 R18/R19 改到 R16/R17 后是 `/dev/i2c-4` |
| 地址冲突 | 该总线上已有 0x18（音频）、0x19/0x68 或 0x6A（板载 IMU）、0x29（ToF）—— **0x23 都不冲突** |

```bash
sudo apt install -y i2c-tools
sudo i2cdetect -y -r <总线号>        # 应看到 23
```

## 为什么不是 Dynamixel ID 200

ID 200 是**舵机总线**上的设备编号：单线半双工 TTL、1 Mbps、Dynamixel Protocol V2。本模块说的是 **I²C**：两线、寄存器读写。把它接到 HAT 的 I²C 口不会变成 ID 200；主控是**分别读两条总线**，再合并成一份传感器数据。

## 验证（只需模块，不需要舵机）

```bash
cargo run -p duck-control --example imu_probe -- /dev/i2c-7 20
cargo run -p duck-control --example imu_to_observation -- /dev/i2c-7 20
```

| 期望 | |
|---|---|
| 采样率 | 约 100 Hz，零次读失败 |
| 第二条命令 | `obs[0..3]`（陀螺）、`obs[3..6]`（重力）和关节块 **零失配** |

Jetson Orin Nano + `/dev/i2c-7` 实测：99.4 Hz，每帧 0.92 ms，零读失败。

## 参考装法

模块三轴与躯干重合 —— **X 前 / Y 左 / Z 上** —— 物理上即**元件面朝上、Type-C 朝后**，此时 mount 旋转为**单位四元数**。

模块自身坐标系（三个正交姿态实测）：平放、元件面朝上时重力读 `[0, 0, -1]`；Type-C 朝上读 `[1, 0, 0]`；侧立、元件面朝右读 `[0, 1, 0]`。
