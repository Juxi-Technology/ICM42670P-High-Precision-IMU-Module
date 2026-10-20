# RDK Series

## 1\. Connect the Device

This tutorial takes the image of the ? version of the RDK X5 board as an example.

Connect the IMU attitude sensor to the I2C interface of the RDK X5 as shown in the figure below.

![RDK IIC通讯\.jpg](Images/rdk-iic-communication.jpg)

![RDK X5 针脚图\.jpg](Images/rdk-x5-pinout.jpg)

## 2\. Check the Device Status

Check the I2C device

```PowerShell
python3 /app/40pin_samples/test_i2c.py
```

![image\.png](Images/image.png)

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
cd ~/imu_ros1/src/IMU_ROS1/IMU_Library
# Or
cd ~/imu_ros2/src/IMU_ROS2/IMU_Library

# Run the IMU data printing file
python3 -m IMU_Library.IMU_I2C_Library
```

![截图\_20260203175633\.png](Images/screenshot-20260203175633.png)

Note: The above is the data reading for a 10-axis IMU. The 6-axis has no magnetometer (Magnetometer) or barometer (Barometer) data, and the 9-axis has no barometer (Barometer) data.

## **5\.IMU Calibration**

**Enter the \~/IMU\_Library directory and run the imu\_calibration\_tool\.py file**

```PowerShell
cd ~/IMU_Library

# Run the IMU calibration code file -- I2C communication calibration
# Run all calibrations (overall, magnetometer, temperature)
python3 -m IMU_Library.imu_calibration_tool --mode i2c --port 0

# Overall calibration only
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 0 --calibrate imu

# Magnetometer calibration only
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 0 --calibrate mag

# Temperature calibration only
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 0 --calibrate temp
```

![截图\_20260203174958\.png](Images/screenshot-20260203174958.png)

## 6\. Notes

When using the RDK X5 board, you need to modify the I2C bus number according to the actual situation. The modification location is shown in the figure below. It is usually bus 0.

![截图\_20260203191332\.png](Images/screenshot-20260203191332.png)

![截图\_20260203191406\.png](Images/screenshot-20260203191406.png)



