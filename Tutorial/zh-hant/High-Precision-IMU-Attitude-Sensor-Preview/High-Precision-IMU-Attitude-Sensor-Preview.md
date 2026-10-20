# 高精度IMU姿態傳感器使用預覽

### 下載壓縮包 [IMU\_ROS1\.zip](https://juxitech.feishu.cn/wiki/BcWGwW2yDiXex9k6qjTcleTvnPb) 或者[IMU\_ROS2\.zip](https://juxitech.feishu.cn/wiki/ZL8XwrPriifnASk41AhcoPj1nnb)，解壓後進入\~/IMU\_Library

1. **安裝代碼所需python庫**

```PowerShell
pip install pyserial
pip install smbus2
```

2. **安裝IMU\_Library庫**

```PowerShell
# 安裝庫及其依賴
pip install -e .

# 或使用setup.py安裝
python setup.py install
```

3. **設定連接埠映射**

```PowerShell
# 防止插拔後連接埠變更，請設定連接埠映射
sudo gedit /etc/udev/rules.d/99-serial-imu.rules

# 如出現沒有gedit命令相關內容，先下載安裝
sudo apt install gedit

# 填寫映射內容
KERNEL=="ttyUSB*", ATTRS{idVendor}=="1a86", ATTRS{idProduct}=="7523", MODE:="0777", SYMLINK+="imu-serial"

# 參數說明：
`--mode`: 通信模式，可选值为`serial`(串口)或`i2c`
`--port`: 串口名(如`/dev/ttyUSB0`)或I2C端口号(如`7`)
`--rate`: 数据打印频率(Hz)，默认10Hz
`--debug`: 启用调试模式，显示详细信息

# 保存退出，運行命令使規則生效
sudo udevadm trigger
sudo service udev reload
sudo service udev restart

# 驗證
ll /dev/imu-serial

# 輸出示例：
lrwxrwxrwx 1 root root 7 1月 22 10:00 /dev/imu-serial -> ttyUSB0
```

### 串口通訊

1. **進入 \~/IMU\_Library/IMU\_Library目錄，運行IMU\_Serial\_Library\.py檔案**

```PowerShell
cd ~/imu_ros1/src/IMU_ROS1/IMU_Library/IMU_Library 
# 或
cd ~/imu_ros2/src/IMU_ROS2/IMU_Library/IMU_Library

# 運行 IMU 數據打印檔案
python3 IMU_Serial_Library.py
```

### I2C通訊

1. **進入 \~/IMU\_Library/IMU\_Library目錄，運行IMU\_I2C\_Library\.py檔案**

```PowerShell
cd ~/IMU_Library/IMU_Library

# 運行 IMU 數據打印檔案
python3 IMU_I2C_Library.py
```

### imu校準

1. **進入 \~/IMU\_Library/IMU\_Library目錄，運行imu\_calibration\_tool\.py檔案**

```PowerShell
cd ~/IMU_Library/IMU_Library

# 運行 IMU 校準程式碼檔案 --串口通訊校準
# 執行所有校準（整體、磁力計、溫度）
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial

# 僅整體校準
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial --calibrate imu

# 僅磁力計校準
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial --calibrate mag

# 僅溫度校準
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial --calibrate temp

# 運行 IMU 校準程式碼檔案 --I2C通訊校準
# 執行所有校準（整體、磁力計、溫度）
python3 imu_calibration_tool.py --mode i2c --port 1

# 僅整體校準
python3 imu_calibration_tool.py --mode i2c --port 1 --calibrate imu

# 僅磁力計校準
python3 imu_calibration_tool.py --mode i2c --port 1 --calibrate mag

# 僅溫度校準
python3 imu_calibration_tool.py --mode i2c --port 1 --calibrate temp
```



