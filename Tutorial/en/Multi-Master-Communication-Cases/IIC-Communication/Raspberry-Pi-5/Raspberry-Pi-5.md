# Raspberry Pi 5

## 1\. Connect the Device

This tutorial takes the Raspberry Pi 5 board with the official 64-bit version image as an example.

Connect the IMU attitude sensor to the I2C interface of the Raspberry Pi 5 as shown in the figure below.

![树莓派5 IIC通讯\.jpg](Images/raspberry-pi-5-iic-communication.jpg)

![image\.png](Images/image.png)

## 2\. Check the Device Status

First install I2Ctool, enter in the terminal:

```PowerShell
sudo apt-get update
sudo apt-get install -y i2c-tools
```

Check the I2C device

```PowerShell
sudo i2cdetect -y -r -a 1
```

![截图\_20260203181146\.png](Images/screenshot-20260203181146.png)

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
cd ~/imu_ros2/src/IMU_ROS1/IMU_Library

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
python3 -m IMU_Library.imu_calibration_tool --mode i2c --port 1

# Overall calibration only
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 1 --calibrate imu

# Magnetometer calibration only
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 1 --calibrate mag

# Temperature calibration only
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 1 --calibrate temp
```

![截图\_20260203174958\.png](Images/screenshot-20260203174958.png)

## 6\. Notes

The Raspberry Pi 5 needs to enable the i2c pins in advance.

The enabling operation is as follows:

Run the command in the terminal

```PowerShell
sudo raspi-config
```

Use the arrow keys on the keyboard to select; after selecting, press the Enter key on the keyboard to enter

![截图\_20260203181325\.png](Images/screenshot-20260203181325.png)

Select I2C; after selecting, press the Enter key on the keyboard to enter,

![截图\_20260203181405\.png](Images/screenshot-20260203181405.png)

After selecting I2C, press the Enter key on the keyboard, use the arrow keys to select Yes, then press the Eneter key to confirm.

![截图\_20260203181427\.png](Images/screenshot-20260203181427.png)

Press the Enter key to confirm

![截图\_20260203181447\.png](Images/screenshot-20260203181447.png)

Use the arrow keys to select Finish, then press the Enter key to exit the configuration.

![截图\_20260203181510\.png](Images/screenshot-20260203181510.png)



