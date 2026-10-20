# 樹莓派5

## 1\.連接裝置

本教程以樹莓派5主板，官方64位版本的鏡像為例。

將IMU姿態傳感器按照下圖連接到樹莓派5的I2C接口。

![树莓派5 IIC通讯\.jpg](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/raspberry-pi-5-iic-communication.jpg)

![image\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/image.png)

## 2\.查看裝置狀態

首先安裝 I2Ctool，終端輸入：

```PowerShell
sudo apt-get update
sudo apt-get install -y i2c-tools
```

查看I2C裝置

```PowerShell
sudo i2cdetect -y -r -a 1
```

![截图\_20260203181146\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/screenshot-20260203181146.png)

## 3\.安裝驅動庫

3\.1**安裝代碼所需python庫**

```PowerShell
sudo apt update
sudo apt install -y python3-serial
sudo apt install -y python3-smbus2
```

3\.2傳輸檔案

[IMU\_ROS2\.zip](/downloads/IMU_ROS2.zip)

如果還不會使用MobaXterm傳輸檔案的朋友，請查看以下網頁MobaXterm詳細安裝和操作方法：[檔案遠程傳輸](https://juxitech.feishu.cn/wiki/KB0Jw2o6Wis9f0ksyeFceVmgnfd)

通過MobaXterm軟件將 解壓後的檔案 拖入 樹莓派5 上。

![截图\_20260203182313\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/screenshot-20260203182313.png)

## 4\.查看imu數據

**進入 \~/IMU\_Library目錄，運行IMU\_Serial\_Library\.py檔案**

```PowerShell
cd ~/imu_ros2/src/IMU_ROS1/IMU_Library

# 運行 IMU 數據打印檔案
python3 -m IMU_Library.IMU_I2C_Library
```

![截图\_20260203175633\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/screenshot-20260203175633.png)

注意：以上為10軸IMU的數據讀取，6軸無磁力計（Magnetometer）與氣壓計（Barometer）數據，9軸無氣壓計（Barometer）數據。

## **5\.IMU校準**

**進入 \~/IMU\_Library目錄，運行imu\_calibration\_tool\.py檔案**

```PowerShell
cd ~/IMU_Library

# 運行 IMU 校準程式碼檔案 --I2C通訊校準
# 執行所有校準（整體、磁力計、溫度）
python3 -m IMU_Library.imu_calibration_tool --mode i2c --port 1

# 僅整體校準
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 1 --calibrate imu

# 僅磁力計校準
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 1 --calibrate mag

# 僅溫度校準
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 1 --calibrate temp
```

![截图\_20260203174958\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/screenshot-20260203174958.png)

## 6\.注意事項

樹莓派5需要提前開啟i2c引腳。

開啟操作如下：

終端運行命令

```PowerShell
sudo raspi-config
```

通過鍵盤的方向鍵選擇，選中後按鍵盤Enter鍵進入

![截图\_20260203181325\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/screenshot-20260203181325.png)

選擇I2C，選中後按鍵盤Enter鍵進入，

![截图\_20260203181405\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/screenshot-20260203181405.png)

選中I2C後，按鍵盤Enter鍵，控制方向鍵選擇Yes，再按Eneter鍵確認。

![截图\_20260203181427\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/screenshot-20260203181427.png)

按Enter鍵確認

![截图\_20260203181447\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/screenshot-20260203181447.png)

按方向鍵選擇Finish，然後按Enter鍵，退出配置。

![截图\_20260203181510\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/screenshot-20260203181510.png)



