# ROS1應用

**系統配置：ubuntu20\.04**

**ROS1****版本：noetic**

### ROS1環境配置

1. **設定****ROS1****安裝源**

```PowerShell
sudo sh -c '. /etc/lsb-release && echo "deb http://mirrors.tuna.tsinghua.edu.cn/ros/ubuntu/ `lsb_release -cs` main" > /etc/apt/sources.list.d/ros-latest.list'
```

2. **設定Key**

```PowerShell
sudo apt-key adv --keyserver 'hkp://keyserver.ubuntu.com:80' --recv-key C1CF6E31E6BADE8868B172B4F42ED6FBAB17C654
```

```Plain Text
sudo apt update
```

3. **安裝****ROS1（官方下載）**

```PowerShell
sudo apt install ros-noetic-desktop-full
```

代理加速下載安裝ROS1

wget http://fishros\.com/install \-O fishros \&\& \. fishros

4. **配置環境變量**

```Plain Text
echo "source /opt/ros/noetic/setup.bash">> ~/.bashrc
```

```PowerShell
source ~/.bashrc
```

### 裝置連接至虛擬機

1. **查看裝置**

```PowerShell
ll /dev/ttyUSB*
```

2. **建立連接埠映射**

```PowerShell
sudo gedit /etc/udev/rules.d/99-serial-imu.rules
```

3. **填寫映射檔案內容**

```PowerShell
KERNEL=="ttyUSB*", ATTRS{idVendor}=="1a86", ATTRS{idProduct}=="7523", MODE:="0777", SYMLINK+="imu-serial"
```

4. **保存退出，運行命令使規則生效**

```PowerShell
sudo udevadm trigger
```

```Plain Text
sudo service udev reload
```

```Plain Text
sudo service udev restart
```

5. **驗證**

```PowerShell
ll /dev/imu-serial
```

```Bash
sudo usermod -aG dialout ash
```

### 導入準備好的壓縮包

1. **飛書同級目錄下有**[IMU\_ROS1\.zip](https://juxitech.feishu.cn/wiki/BcWGwW2yDiXex9k6qjTcleTvnPb)

2. **解壓後****通過檔案傳輸軟件傳輸到虛擬機中**

3. **安裝IMU\_Library庫**

```PowerShell
cd IMU_ROS1
# 下載解壓IMU_ROS1壓縮檔案後，進入到IMU_Library目錄下，運行以下指令
cd IMU_Library

# 安裝庫及其依賴
pip install -e .

# 或使用setup.py安裝
python setup.py install
```

### python相關庫安裝

```PowerShell
sudo pip3 install pyserial
sudo pip3 install smbus2
```

**如果出現渲染有問題的時候，執行以下命令**

```PowerShell
sudo apt-get install ros-noetic-imu-filter-madgwick
sudo apt-get install ros-noetic-rviz-imu-plugin
```

### 構建ROS1項目

1. **在/home目錄下新開終端，新建ros1工作空間**

```PowerShell
mkdir imu_ros1
cd imu_ros1
mkdir src
cd src/
catkin_init_workspace
```

2. **將傳輸過來的檔案IMU\_ROS1資料夾複製到\~/imu\_ros1/src/目錄下**

```PowerShell
# 複製 IMU_ROS1 資料夾到新建的 src 目錄下
cp -r ~/IMU_ROS1 ~/imu_ros1/src
cd ~/imu_ros1
catkin_make
```

3. **把工作目錄\~/imu\_ros1寫入到環境變量中**

```PowerShell
# 編輯 ~/.bashrc
sudo gedit ~/.bashrc

# 把下面命令寫到末尾
source ~/imu_ros1/devel/setup.bash

source ~/.bashrc
```

### 開啟ROS1節點

1. **打開終端，輸入roscore啟動節點**

```PowerShell
# 啟動roscore
roscore

# 新開終端，設定環境，啟動節點
source ~/imu_ros1/devel/setup.bash
```

2. **給 Python 腳本添加可執行權限（關鍵）**

進入腳本所在的 `scripts` 目錄，執行 `chmod +x` 命令賦予可執行權限（`+x` 即 add execute 增加執行權限）：

```PowerShell
# 進入imu_driver.py所在目錄（按你的實際路徑）
cd ~/imu_ros1/src/IMU_ROS1/scripts/ 

# 賦予可執行權限（僅需執行1次，永久生效）
chmod +x imu_driver.py
chmod +x mag_visualizer.py
```

返回imu\_ros1資料夾下運行imu\_driver\.py

```Plain Text
cd ~/imu_ros1
```

```Plain Text
rosrun IMU_ROS1 imu_driver.py
```

### IMU數據列印

1. **打開新的終端，查看imu話題**

```PowerShell
# 查看當前發布的所有話題
rostopic list
```

2. **列印話題數據**

```PowerShell
# 打印IMU原始數據
rostopic echo /imu/data_raw

# 打印磁力計數據
rostopic echo /imu/mag
```

### RViz可視化

1. **運行命令啟動rviz****\(\)**

```PowerShell
roslaunch IMU_ROS1 imu_display.launch
```

### 常見問題

1. 啟動節點如出現打開失敗，請嘗試以下指令

```PowerShell
# 在~/imu_ros1目錄下運行
source devel/setup.bash

# 連接埠號問題
sudo chmod 666 /dev/imu-serial
```

2. RVIZ可視化中三軸顯示很小，重新勾選 Enable axes

![截图\_20260203101944\.png](../../../en/ROS-Application-Cases/ROS1-Application/Images/screenshot-20260203101944.png)



