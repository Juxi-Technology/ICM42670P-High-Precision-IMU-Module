# High-Precision IMU Attitude Sensor Usage Preview

### Download the compressed package [IMU\_ROS1\.zip](https://juxitech.feishu.cn/wiki/BcWGwW2yDiXex9k6qjTcleTvnPb) or [IMU\_ROS2\.zip](https://juxitech.feishu.cn/wiki/ZL8XwrPriifnASk41AhcoPj1nnb), and after extracting, enter \~/IMU\_Library

1. **Install the python libraries required by the code**

```PowerShell
pip install pyserial
pip install smbus2
```

2. **Install the IMU\_Library library**

```PowerShell
# Install the library and its dependencies
pip install -e .

# Or install using setup.py
python setup.py install
```

3. **Set up port mapping**

```PowerShell
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

### Serial Communication

1. **Enter the \~/IMU\_Library/IMU\_Library directory and run the IMU\_Serial\_Library\.py file**

```PowerShell
cd ~/imu_ros1/src/IMU_ROS1/IMU_Library/IMU_Library 
# Or
cd ~/imu_ros2/src/IMU_ROS2/IMU_Library/IMU_Library

# Run the IMU data printing file
python3 IMU_Serial_Library.py
```

### I2C Communication

1. **Enter the \~/IMU\_Library/IMU\_Library directory and run the IMU\_I2C\_Library\.py file**

```PowerShell
cd ~/IMU_Library/IMU_Library

# Run the IMU data printing file
python3 IMU_I2C_Library.py
```

### IMU Calibration

1. **Enter the \~/IMU\_Library/IMU\_Library directory and run the imu\_calibration\_tool\.py file**

```PowerShell
cd ~/IMU_Library/IMU_Library

# Run the IMU calibration code file -- serial port communication calibration
# Run all calibrations (overall, magnetometer, temperature)
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial

# Overall calibration only
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial --calibrate imu

# Magnetometer calibration only
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial --calibrate mag

# Temperature calibration only
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial --calibrate temp

# Run the IMU calibration code file -- I2C communication calibration
# Run all calibrations (overall, magnetometer, temperature)
python3 imu_calibration_tool.py --mode i2c --port 1

# Overall calibration only
python3 imu_calibration_tool.py --mode i2c --port 1 --calibrate imu

# Magnetometer calibration only
python3 imu_calibration_tool.py --mode i2c --port 1 --calibrate mag

# Temperature calibration only
python3 imu_calibration_tool.py --mode i2c --port 1 --calibrate temp
```



