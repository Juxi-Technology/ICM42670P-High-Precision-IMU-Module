# ROS1应用

**系统配置：ubuntu20\.04**

**ROS1****版本：noetic**

### ROS1环境配置

1. **设置****ROS1****安装源**

```PowerShell
sudo sh -c '. /etc/lsb-release && echo "deb http://mirrors.tuna.tsinghua.edu.cn/ros/ubuntu/ `lsb_release -cs` main" > /etc/apt/sources.list.d/ros-latest.list'
```

2. **设置Key**

```PowerShell
sudo apt-key adv --keyserver 'hkp://keyserver.ubuntu.com:80' --recv-key C1CF6E31E6BADE8868B172B4F42ED6FBAB17C654
```

```Plain Text
sudo apt update
```

3. **安装****ROS1（官方下载）**

```PowerShell
sudo apt install ros-noetic-desktop-full
```

代理加速下载安装ROS1

wget http://fishros\.com/install \-O fishros \&\& \. fishros

4. **配置环境变量**

```Plain Text
echo "source /opt/ros/noetic/setup.bash">> ~/.bashrc
```

```PowerShell
source ~/.bashrc
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
```

```Plain Text
sudo service udev reload
```

```Plain Text
sudo service udev restart
```

5. **验证**

```PowerShell
ll /dev/imu-serial
```

```Bash
sudo usermod -aG dialout ash
```

### 导入准备好的压缩包

1. **飞书同级目录下有**[IMU\_ROS1\.zip](https://juxitech.feishu.cn/wiki/BcWGwW2yDiXex9k6qjTcleTvnPb)

2. **解压后****通过文件传输软件传输到虚拟机中**

3. **安装IMU\_Library库**

```PowerShell
cd IMU_ROS1
# 下载解压IMU_ROS1压缩文件后，进入到IMU_Library目录下，运行以下指令
cd IMU_Library

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

**如果出现渲染有问题的时候，执行以下命令**

```PowerShell
sudo apt-get install ros-noetic-imu-filter-madgwick
sudo apt-get install ros-noetic-rviz-imu-plugin
```

### 构建ROS1项目

1. **在/home目录下新开终端，新建ros1工作空间**

```PowerShell
mkdir imu_ros1
cd imu_ros1
mkdir src
cd src/
catkin_init_workspace
```

2. **将传输过来的文件IMU\_ROS1文件夹复制到\~/imu\_ros1/src/目录下**

```PowerShell
# 复制 IMU_ROS1 文件夹到新建的 src 目录下
cp -r ~/IMU_ROS1 ~/imu_ros1/src
cd ~/imu_ros1
catkin_make
```

3. **把工作目录\~/imu\_ros1写入到环境变量中**

```PowerShell
# 编辑 ~/.bashrc
sudo gedit ~/.bashrc

# 把下面命令写到末尾
source ~/imu_ros1/devel/setup.bash

source ~/.bashrc
```

### 开启ROS1节点

1. **打开终端，输入roscore启动节点**

```PowerShell
# 启动roscore
roscore

# 新开终端，设置环境，启动节点
source ~/imu_ros1/devel/setup.bash
```

2. **给 Python 脚本添加可执行权限（关键）**

进入脚本所在的 `scripts` 目录，执行 `chmod +x` 命令赋予可执行权限（`+x` 即 add execute 增加执行权限）：

```PowerShell
# 进入imu_driver.py所在目录（按你的实际路径）
cd ~/imu_ros1/src/IMU_ROS1/scripts/ 

# 赋予可执行权限（仅需执行1次，永久生效）
chmod +x imu_driver.py
chmod +x mag_visualizer.py
```

返回imu\_ros1文件夹下运行imu\_driver\.py

```Plain Text
cd ~/imu_ros1
```

```Plain Text
rosrun IMU_ROS1 imu_driver.py
```

### IMU数据打印

1. **打开新的终端，查看imu话题**

```PowerShell
# 查看当前发布的所有话题
rostopic list
```

2. **打印话题数据**

```PowerShell
# 打印IMU原始数据
rostopic echo /imu/data_raw

# 打印磁力计数据
rostopic echo /imu/mag
```

### RViz可视化

1. **运行命令启动rviz****\(\)**

```PowerShell
roslaunch IMU_ROS1 imu_display.launch
```

### 常见问题

1. 启动节点如出现打开失败，请尝试以下指令

```PowerShell
# 在~/imu_ros1目录下运行
source devel/setup.bash

# 端口号问题
sudo chmod 666 /dev/imu-serial
```

2. RVIZ可视化中三轴显示很小，重新勾选 Enable axes

![截图\_20260203101944\.png](../../../en/ROS应用案例/ROS1应用/图片和附件/截图_20260203101944.png)



