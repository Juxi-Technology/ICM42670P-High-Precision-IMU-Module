# RDK系列

## 1\.連接裝置

本教程以RDK X5主板的？版本的鏡像為例。

將IMU姿態傳感器按照下圖連接到RDK X5的I2C接口。

![RDK IIC通讯\.jpg](../../../../en/多主控通讯案例/IIC通讯/RDK系列/图片和附件/RDK%20IIC通讯.jpg)

![RDK X5 针脚图\.jpg](../../../../en/多主控通讯案例/IIC通讯/RDK系列/图片和附件/RDK%20X5%20针脚图.jpg)

## 2\.查看裝置狀態

查看I2C裝置

```PowerShell
python3 /app/40pin_samples/test_i2c.py
```

![image\.png](../../../../en/多主控通讯案例/IIC通讯/RDK系列/图片和附件/image.png)

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

![截图\_20260203182313\.png](../../../../en/多主控通讯案例/IIC通讯/RDK系列/图片和附件/截图_20260203182313.png)

## 4\.查看imu數據

**進入 \~/IMU\_Library目錄，運行IMU\_Serial\_Library\.py檔案**

```PowerShell
cd ~/imu_ros1/src/IMU_ROS1/IMU_Library
# 或
cd ~/imu_ros2/src/IMU_ROS2/IMU_Library

# 運行 IMU 數據打印檔案
python3 -m IMU_Library.IMU_I2C_Library
```

![截图\_20260203175633\.png](../../../../en/多主控通讯案例/IIC通讯/RDK系列/图片和附件/截图_20260203175633.png)

注意：以上為10軸IMU的數據讀取，6軸無磁力計（Magnetometer）與氣壓計（Barometer）數據，9軸無氣壓計（Barometer）數據。

## **5\.IMU校準**

**進入 \~/IMU\_Library目錄，運行imu\_calibration\_tool\.py檔案**

```PowerShell
cd ~/IMU_Library

# 運行 IMU 校準程式碼檔案 --I2C通訊校準
# 執行所有校準（整體、磁力計、溫度）
python3 -m IMU_Library.imu_calibration_tool --mode i2c --port 0

# 僅整體校準
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 0 --calibrate imu

# 僅磁力計校準
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 0 --calibrate mag

# 僅溫度校準
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 0 --calibrate temp
```

![截图\_20260203174958\.png](../../../../en/多主控通讯案例/IIC通讯/RDK系列/图片和附件/截图_20260203174958.png)

## 6\.注意事項

使用RDK X5主板時，需要根據實際情況修改I2C的總線的序號，修改位置如下圖。通常是0號總線。

![截图\_20260203191332\.png](../../../../en/多主控通讯案例/IIC通讯/RDK系列/图片和附件/截图_20260203191332.png)

![截图\_20260203191406\.png](../../../../en/多主控通讯案例/IIC通讯/RDK系列/图片和附件/截图_20260203191406.png)



