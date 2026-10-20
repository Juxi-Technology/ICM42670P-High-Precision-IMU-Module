# 將 IMU 模組用於 MicroDuck

本模組可以替換 MicroDuck 的軀幹 IMU —— 也就是掛在舵機匯流排上的 `imu_to_dxl` 小板 —— 改用 I²C 模組。

## 狀態

| | |
|---|---|
| IMU 資料鏈：取樣、解碼、觀測槽位 | **已在真硬體驗證** |
| MicroDuck 執行環境（`robotd`）接線 | **將在整合階段推進** |

> **方案定位**：目前的 I²C 外置模組方案是過渡形態，最終形態會把 IMU 整合到整機硬體與主控中。本文的接線、座標系和校正方法在整合後仍然適用。

**完整教學與程式碼：[Juxi-Technology/imu-displace-microduck](https://github.com/Juxi-Technology/imu-displace-microduck)**

那個倉庫是本頁的權威版本：精確接線、校正流程、驗收清單與實測數據都在裡面。本頁只是入口。

## 接線

| | |
|---|---|
| 模組 | ICM-42670-P，I²C 從機 **0x23** |
| 腳位 | GND / 3V3 / SDA / SCL |
| 供電 | **3V3，不要 5V**；主控 I/O 為 3.3 V |
| 匯流排（官方 HAT）| `/dev/i2c-pihat` = `/dev/i2c-3`；J6 的 R18/R19 改到 R16/R17 後為 `/dev/i2c-4` |
| 位址衝突 | 該匯流排上已有 0x18（音訊）、0x19/0x68 或 0x6A（板載 IMU）、0x29（ToF）—— **0x23 皆不衝突** |

```bash
sudo apt install -y i2c-tools
sudo i2cdetect -y -r <匯流排號>        # 應看到 23
```

## 為什麼不是 Dynamixel ID 200

ID 200 是**舵機匯流排**上的裝置編號：單線半雙工 TTL、1 Mbps、Dynamixel Protocol V2。本模組說的是 **I²C**：兩線、暫存器讀寫。接到 HAT 的 I²C 埠不會變成 ID 200；主控是**分別讀兩條匯流排**，再合併成一份感測資料。

## 驗證（只需模組，不需要舵機）

```bash
cargo run -p duck-control --example imu_probe -- /dev/i2c-7 20
cargo run -p duck-control --example imu_to_observation -- /dev/i2c-7 20
```

| 期望 | |
|---|---|
| 取樣率 | 約 100 Hz，零次讀取失敗 |
| 第二條命令 | `obs[0..3]`（陀螺儀）、`obs[3..6]`（重力）與關節區塊 **零不符** |

Jetson Orin Nano + `/dev/i2c-7` 實測：99.4 Hz，每幀 0.92 ms，零讀取失敗。

## 參考安裝

模組三軸與軀幹重合 —— **X 前 / Y 左 / Z 上** —— 實體上即**元件面朝上、Type-C 朝後**，此時 mount 旋轉為**單位四元數**。

模組自身座標系（三個正交姿態實測）：平放、元件面朝上時重力讀 `[0, 0, -1]`；Type-C 朝上讀 `[1, 0, 0]`；側立、元件面朝右讀 `[0, 1, 0]`。

---
## 後續工作

- 將模組接入 `robotd` 執行環境：匯流排路徑、IMU 來源和 mount 支援設定化選擇。
- 為 IMU 增加獨立擷取執行緒和共享資料槽，避免 I²C 讀取佔用控制 tick。
- 接上真實 15 舵機匯流排和行走策略做整機驗證；最終形態會把 IMU 整合到整機硬體與主控中。
