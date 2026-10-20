# Jetson Series

## 1\. Connect the Device

This tutorial takes the Jetson Orin NX board as an example.

Connect the IMU attitude sensor to the I2C interface of the Jetson Orin NX as shown in the figure below.

![Jetson orin IIC通讯\.jpg](Images/jetson-orin-iic-communication.jpg)

![image\.png](Images/image.png)

## 2\. Check the Device Status

First install I2Ctool, enter in the terminal:

```PowerShell
sudo apt-get update
sudo apt-get install -y i2c-tools
```

Check the I2C device

```PowerShell
sudo i2cdetect -y -r -a 7
```

![Screenshot from 2026\-02\-05 11\-09\-35\.png](Images/Screenshot%20from%202026-02-05%2011-09-35.png)

## 3\. Install the Driver Library

3\.1**Install the python libraries required by the code**

```PowerShell
sudo apt update
sudo apt install -y python3-serial
sudo apt install -y python3-smbus2
```

3\.2 Transfer files

[IMU\_ROS2\.zip](/downloads/IMU_ROS2.zip)

If you still do not know how to use MobaXterm to transfer files, please refer to the following webpage for the detailed installation and usage of MobaXterm: [Remote File Transfer](https://juxitech.feishu.cn/wiki/KB0Jw2o6Wis9f0ksyeFceVmgnfd)

Drag the extracted files onto the Raspberry Pi 5 via the MobaXterm software.

![截图\_20260203182313\.png](Images/screenshot-20260203182313.png)

## 4\. View imu Data

**Enter the \~/IMU\_Library directory and run the IMU\_Serial\_Library\.py file**

```PowerShell
cd ~/imu_ros2/src/IMU_ROS2/IMU_Library

# Run the IMU data printing file
python3 -m IMU_Library.IMU_I2C_Library
```

![Screenshot from 2026\-02\-05 11\-07\-24\.png](Images/Screenshot%20from%202026-02-05%2011-07-24.png)

Note: The above is the data reading for a 10-axis IMU. The 6-axis has no magnetometer (Magnetometer) or barometer (Barometer) data, and the 9-axis has no barometer (Barometer) data.

## **5\.IMU Calibration**

**Enter the \~/IMU\_Library directory and run the imu\_calibration\_tool\.py file**

```PowerShell
cd ~/IMU_Library

# Run the IMU calibration code file -- I2C communication calibration
# Run all calibrations (overall, magnetometer, temperature)
python3 -m IMU_Library.imu_calibration_tool --mode i2c --port 7

# Overall calibration only
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 7 --calibrate imu

# Magnetometer calibration only
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 7 --calibrate mag

# Temperature calibration only
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 7 --calibrate temp
```

![Screenshot from 2026\-02\-05 11\-08\-46\.png](Images/Screenshot%20from%202026-02-05%2011-08-46.png)

## 6\. Notes

When using the orin series boards, you need to modify the I2C bus number according to the actual situation. The modification location is shown in the figure below. It is usually bus 7

![截图\_20260203191332\.png](Images/screenshot-20260203191332.png)

![截图\_20260203191406\.png](Images/screenshot-20260203191406.png)



