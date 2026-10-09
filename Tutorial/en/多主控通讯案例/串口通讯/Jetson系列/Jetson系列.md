# Jetson Series

## 1\. Connect the Device

This tutorial takes the Jetson orin nx board as an example.

Plug the IMU attitude sensor into the USB of the host via a type\-c cable.

![Jetson orin 串口通讯\.jpg](图片和附件/Jetson%20orin%20串口通讯.jpg)

## 2\. Check the Device Status

Check the device id

```PowerShell
lsusb
```

Check the device number

```PowerShell
ls -l /dev/ttyU*
```

![Screenshot from 2026\-02\-05 10\-18\-43\.png](图片和附件/Screenshot%20from%202026-02-05%2010-18-43.png)

Set up port mapping

```Bash
# To prevent the port from changing after unplugging and replugging, set up port mapping
sudo gedit /etc/udev/rules.d/99-serial-imu.rules

# If a message appears saying the gedit command is not found, install it first
sudo apt install gedit

# Fill in the mapping content
KERNEL=="ttyUSB*", ATTRS{idVendor}=="1a86", ATTRS{idProduct}=="7523", MODE:="0777", SYMLINK+="imu-serial"

# Parameter description:
`--mode`: 通信模式，可选值为`serial`(串口)或`i2c`
`--port`: 串口名(如`/dev/ttyUSB0`)或I2C端口号(如`7`)
`--rate`: 数据打印频率(Hz)，默认10Hz
`--debug`: 启用调试模式，显示详细信息

# Save and exit, then run the command to make the rule take effect
sudo udevadm trigger
sudo service udev reload
sudo service udev restart

# Verify
ll /dev/imu-serial

# Example output:
lrwxrwxrwx 1 root root 7 1月 22 10:00 /dev/imu-serial -> ttyUSB0
```

## 3\. Install the Driver Library

**3\.1 Install the python libraries required by the code**

```PowerShell
sudo apt update
sudo apt install -y python3-serial
sudo apt install -y python3-smbus2
```

**3\.2 Transfer files**

[IMU\_ROS2\.zip](/downloads/IMU_ROS2.zip)

If you still do not know how to use MobaXterm to transfer files, please refer to the following webpage for the detailed installation and usage of MobaXterm: [Remote File Transfer](https://juxitech.feishu.cn/wiki/KB0Jw2o6Wis9f0ksyeFceVmgnfd)

Drag the extracted files onto the Jetson via the MobaXterm software.

![截图\_20260203182313\.png](图片和附件/截图_20260203182313.png)

## 4\. View imu Data

**Enter the \~/IMU\_Library directory and run the IMU\_Serial\_Library\.py file**

```PowerShell
cd ~/IMU_ROS2/IMU_Library

# Run the IMU data printing file
python3 -m IMU_Library.IMU_Serial_Library
```

![image\.png](图片和附件/image%201.png)

Note: The above is the data reading for a 10-axis IMU. The 6-axis has no magnetometer (Magnetometer) or barometer (Barometer) data, and the 9-axis has no barometer (Barometer) data.

## **5\.IMU Calibration**

**Enter the \~/IMU\_Library directory and run the imu\_calibration\_tool\.py file**

```PowerShell
cd ~/IMU_Library

# Run the IMU calibration code file -- serial port communication calibration
# Run all calibrations (overall, magnetometer, temperature)
python3 -m IMU_Library.imu_calibration_tool --mode serial --port /dev/imu-serial

# Overall calibration only
python3 -m IMU_Library.imu_calibration_tool --mode serial --port /dev/imu-serial --calibrate imu

# Magnetometer calibration only
python3 -m IMU_Library.imu_calibration_tool --mode serial --port /dev/imu-serial --calibrate mag

# Temperature calibration only
python3 -m IMU_Library.imu_calibration_tool --mode serial --port /dev/imu-serial --calibrate temp
```

![image\.png](图片和附件/image.png)

## 6\. Notes

If the device ID can be found but the device number cannot be found, you can refer to the following commands to install the ch34x driver

```PowerShell
sudo apt remove brltty
git clone https://github.com/clhchan/CH341SER.git
cd CH341SER
make -j6
sudo make install
sudo modprobe ch34x
```



