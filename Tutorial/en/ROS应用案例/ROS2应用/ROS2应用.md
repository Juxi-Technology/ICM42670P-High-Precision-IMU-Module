# ROS2 Application

**System configuration: ubuntu22\.04**

**ROS2 version: humble**

### ROS2 Environment Configuration

1. **Update the download source**

```PowerShell
sudo apt update
```

2. **Enter the ros2 download command**

```PowerShell
wget http://fishros.com/install -O fishros && . fishros
```

### Connect the Device to the Virtual Machine

1. **Check the device**

```PowerShell
ll /dev/ttyUSB*
```

2. **Create port mapping**

```PowerShell
sudo gedit /etc/udev/rules.d/99-serial-imu.rules
```

3. **Fill in the mapping file content**

```PowerShell
KERNEL=="ttyUSB*", ATTRS{idVendor}=="1a86", ATTRS{idProduct}=="7523", MODE:="0777", SYMLINK+="imu-serial"
```

4. **Save and exit, run the command to make the rules take effect**

```PowerShell
sudo udevadm trigger
sudo service udev reload
sudo service udev restart
```

5. **Verify**

```PowerShell
ll /dev/imu-serial
```

### Import the Prepared Compressed Package

1. **In the same directory level on Feishu there is** [IMU\_ROS2\.zip](https://juxitech.feishu.cn/wiki/ZL8XwrPriifnASk41AhcoPj1nnb)

2. **Transfer it to the virtual machine via file transfer software**

3. **Install the IMU\_Library library**

```PowerShell
# After downloading and extracting the IMU_ROS2 archive, enter the IMU_Library directory and run setup.py
cd IMU_ROS2/IMU_Library

# Install the library and its dependencies
pip install -e .

# Or install using setup.py
python setup.py install
```

### Installing Python-related Libraries

```PowerShell
sudo pip3 install pyserial
sudo pip3 install smbus2
```

### Build the ROS2 Project

1. **Return to the \~/IMU\_ROS2 directory**

```PowerShell
cd IMU_ROS2
colcon build --symlink-install
```

1. **Write the working directory \~/IMU\_ROS2 into the environment variables**

```PowerShell
# Edit ~/.bashrc
sudo gedit ~/.bashrc

# Append the following command to the end
source ~/IMU_ROS2/install/setup.bash
```

After a successful compilation, execute the following command to check whether there are executable files under the imu\_ros2 package

`ros2 pkg executables imu_ros2`

### Start the ROS2 Node

```PowerShell
source install/setup.bash
ros2 run imu_ros2 imu_publisher
```

### IMU Data Printing

1. **Open a new terminal and view the imu topics**

```PowerShell
ros2 topic list
```

2. **Print /imu/data topic data**

```PowerShell
ros2 topic echo /imu/data
```

3. **Open a new terminal and view the msg topics**

```PowerShell
ros2 topic echo /imu/mag
```

### RViz2 Visualization

1. **Run the command to open the rviz visualization interface**

```PowerShell
ros2 launch imu_ros2 imu_visualization.launch.py
```

### FAQ

1. If the node fails to open when starting, please try the following commands

```PowerShell
# Run in the ~/IMU_ROS2 directory
source install/setup.bash

# Port number issues
sudo chmod 666 /dev/imu-serial
```





