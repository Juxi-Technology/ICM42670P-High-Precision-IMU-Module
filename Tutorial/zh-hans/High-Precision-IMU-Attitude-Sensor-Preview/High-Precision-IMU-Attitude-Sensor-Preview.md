# 高精度IMU姿态传感器使用预览

### 下载压缩包 [IMU\_ROS1\.zip](https://juxitech.feishu.cn/wiki/BcWGwW2yDiXex9k6qjTcleTvnPb) 或者[IMU\_ROS2\.zip](https://juxitech.feishu.cn/wiki/ZL8XwrPriifnASk41AhcoPj1nnb)，解压后进入\~/IMU\_Library

1. **安装代码所需python库**

```PowerShell
pip install pyserial
pip install smbus2
```

2. **安装IMU\_Library库**

```PowerShell
# 安装库及其依赖
pip install -e .

# 或使用setup.py安装
python setup.py install
```

3. **设置端口映射**

```PowerShell
# 防止插拔后端口变更，请设置端口映射
sudo gedit /etc/udev/rules.d/99-serial-imu.rules

# 如出现没有gedit命令相关内容，先下载安装
sudo apt install gedit

# 填写映射内容
KERNEL=="ttyUSB*", ATTRS{idVendor}=="1a86", ATTRS{idProduct}=="7523", MODE:="0777", SYMLINK+="imu-serial"

# 参数说明：
`--mode`: 通信模式，可选值为`serial`(串口)或`i2c`
`--port`: 串口名(如`/dev/ttyUSB0`)或I2C端口号(如`7`)
`--rate`: 数据打印频率(Hz)，默认10Hz
`--debug`: 启用调试模式，显示详细信息

# 保存退出，运行命令使规则生效
sudo udevadm trigger
sudo service udev reload
sudo service udev restart

# 验证
ll /dev/imu-serial

# 输出示例：
lrwxrwxrwx 1 root root 7 1月 22 10:00 /dev/imu-serial -> ttyUSB0
```

### 串口通讯

1. **进入 \~/IMU\_Library/IMU\_Library目录，运行IMU\_Serial\_Library\.py文件**

```PowerShell
cd ~/imu_ros1/src/IMU_ROS1/IMU_Library/IMU_Library 
# 或
cd ~/imu_ros2/src/IMU_ROS2/IMU_Library/IMU_Library

# 运行 IMU 数据打印文件
python3 IMU_Serial_Library.py
```

### I2C通讯

1. **进入 \~/IMU\_Library/IMU\_Library目录，运行IMU\_I2C\_Library\.py文件**

```PowerShell
cd ~/IMU_Library/IMU_Library

# 运行 IMU 数据打印文件
python3 IMU_I2C_Library.py
```

### imu校准

1. **进入 \~/IMU\_Library/IMU\_Library目录，运行imu\_calibration\_tool\.py文件**

```PowerShell
cd ~/IMU_Library/IMU_Library

# 运行 IMU 校准代码文件 --串口通讯校准
# 执行所有校准（整体、磁力计、温度）
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial

# 仅整体校准
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial --calibrate imu

# 仅磁力计校准
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial --calibrate mag

# 仅温度校准
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial --calibrate temp

# 运行 IMU 校准代码文件 --I2C通讯校准
# 执行所有校准（整体、磁力计、温度）
python3 imu_calibration_tool.py --mode i2c --port 1

# 仅整体校准
python3 imu_calibration_tool.py --mode i2c --port 1 --calibrate imu

# 仅磁力计校准
python3 imu_calibration_tool.py --mode i2c --port 1 --calibrate mag

# 仅温度校准
python3 imu_calibration_tool.py --mode i2c --port 1 --calibrate temp
```



