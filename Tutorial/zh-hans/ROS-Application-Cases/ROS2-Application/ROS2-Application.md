# ROS2应用

**系统配置：ubuntu22\.04**

**ROS2版本：humble**

### ROS2环境配置

1. **更新下载源**

```PowerShell
sudo apt update
```

2. **输入ros2下载指令**

```PowerShell
wget http://fishros.com/install -O fishros && . fishros
```

### 设备连接至虚拟机

1. **查看设备**

```PowerShell
ll /dev/ttyUSB*
```

2. **建立端口映射**

```PowerShell
sudo gedit /etc/udev/rules.d/99-serial-imu.rules
```

3. **填写映射文件内容**

```PowerShell
KERNEL=="ttyUSB*", ATTRS{idVendor}=="1a86", ATTRS{idProduct}=="7523", MODE:="0777", SYMLINK+="imu-serial"
```

4. **保存退出，运行命令使规则生效**

```PowerShell
sudo udevadm trigger
sudo service udev reload
sudo service udev restart
```

5. **验证**

```PowerShell
ll /dev/imu-serial
```

### 导入准备好的压缩包

1. **飞书同级目录下有**[IMU\_ROS2\.zip](https://juxitech.feishu.cn/wiki/ZL8XwrPriifnASk41AhcoPj1nnb)

2. **通过文件传输软件传输到虚拟机中**

3. **安装IMU\_Library库**

```PowerShell
# 下载解压IMU_ROS2压缩文件后，进入到IMU_Library目录下，运行setup.py
cd IMU_ROS2/IMU_Library

# 安装库及其依赖
pip install -e .

# 或使用setup.py安装
python setup.py install
```

### python相关库安装

```PowerShell
sudo pip3 install pyserial
sudo pip3 install smbus2
```

### 构建ROS2项目

1. **返回到\~/IMU\_ROS2目录**

```PowerShell
cd IMU_ROS2
colcon build --symlink-install
```

1. **把工作目录\~/IMU\_ROS2写入到环境变量中**

```PowerShell
# 编辑 ~/.bashrc
sudo gedit ~/.bashrc

# 把下面命令写到末尾
source ~/IMU_ROS2/install/setup.bash
```

编译成功后，执行以下命令查看imu\_ros2功能包下是否有可执行文件

`ros2 pkg executables imu_ros2`

### 开启ROS2节点

```PowerShell
source install/setup.bash
ros2 run imu_ros2 imu_publisher
```

### IMU数据打印

1. **打开新的终端，查看imu话题**

```PowerShell
ros2 topic list
```

2. **打印/imu/data话题数据**

```PowerShell
ros2 topic echo /imu/data
```

3. **打开新的终端，查看msg话题**

```PowerShell
ros2 topic echo /imu/mag
```

### RViz2可视化

1. **运行命令，打开rviz可视化界面**

```PowerShell
ros2 launch imu_ros2 imu_visualization.launch.py
```

### 常见问题

1. 启动节点如出现打开失败，请尝试以下指令

```PowerShell
# 在~/IMU_ROS2目录下运行
source install/setup.bash

# 端口号问题
sudo chmod 666 /dev/imu-serial
```





