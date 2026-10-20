# 高精度IMU姿勢センサー使用プレビュー

### 圧縮ファイル [IMU\_ROS1\.zip](https://juxitech.feishu.cn/wiki/BcWGwW2yDiXex9k6qjTcleTvnPb) または[IMU\_ROS2\.zip](https://juxitech.feishu.cn/wiki/ZL8XwrPriifnASk41AhcoPj1nnb)をダウンロードし、解凍後\~/IMU\_Libraryに入ります

1. **コードに必要なPythonライブラリのインストール**

```PowerShell
pip install pyserial
pip install smbus2
```

2. **IMU\_Libraryライブラリのインストール**

```PowerShell
# ライブラリとその依存関係をインストール
pip install -e .

# または setup.py でインストール
python setup.py install
```

3. **ポートマッピングを設定します**

```PowerShell
# 抜き差し後のポート変更を防止するため、ポートマッピングを設定してください
sudo gedit /etc/udev/rules.d/99-serial-imu.rules

# gedit コマンドが見つからない旨のメッセージが出た場合は、先にダウンロードしてインストール
sudo apt install gedit

# マッピング内容を記入
KERNEL=="ttyUSB*", ATTRS{idVendor}=="1a86", ATTRS{idProduct}=="7523", MODE:="0777", SYMLINK+="imu-serial"

# パラメータの説明：
`--mode`: 通信模式，可选值为`serial`(串口)或`i2c`
`--port`: 串口名(如`/dev/ttyUSB0`)或I2C端口号(如`7`)
`--rate`: 数据打印频率(Hz)，默认10Hz
`--debug`: 启用调试模式，显示详细信息

# 保存して終了し、コマンドを実行してルールを有効化
sudo udevadm trigger
sudo service udev reload
sudo service udev restart

# 検証
ll /dev/imu-serial

# 出力例：
lrwxrwxrwx 1 root root 7 1月 22 10:00 /dev/imu-serial -> ttyUSB0
```

### シリアル通信

1. **\~/IMU\_Library/IMU\_Libraryディレクトリに入り、IMU\_Serial\_Library\.pyファイルを実行します**

```PowerShell
cd ~/imu_ros1/src/IMU_ROS1/IMU_Library/IMU_Library 
# または
cd ~/imu_ros2/src/IMU_ROS2/IMU_Library/IMU_Library

# IMU データ出力ファイルを実行
python3 IMU_Serial_Library.py
```

### I2C通信

1. **\~/IMU\_Library/IMU\_Libraryディレクトリに入り、IMU\_I2C\_Library\.pyファイルを実行します**

```PowerShell
cd ~/IMU_Library/IMU_Library

# IMU データ出力ファイルを実行
python3 IMU_I2C_Library.py
```

### IMUキャリブレーション

1. **\~/IMU\_Library/IMU\_Libraryディレクトリに入り、imu\_calibration\_tool\.pyファイルを実行します**

```PowerShell
cd ~/IMU_Library/IMU_Library

# IMU キャリブレーションコードファイルを実行 --シリアル通信用キャリブレーション
# すべてのキャリブレーションを実行（全体、磁力計、温度）
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial

# 全体キャリブレーションのみ
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial --calibrate imu

# 磁力計キャリブレーションのみ
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial --calibrate mag

# 温度キャリブレーションのみ
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial --calibrate temp

# IMU キャリブレーションコードファイルを実行 --I2C 通信用キャリブレーション
# すべてのキャリブレーションを実行（全体、磁力計、温度）
python3 imu_calibration_tool.py --mode i2c --port 1

# 全体キャリブレーションのみ
python3 imu_calibration_tool.py --mode i2c --port 1 --calibrate imu

# 磁力計キャリブレーションのみ
python3 imu_calibration_tool.py --mode i2c --port 1 --calibrate mag

# 温度キャリブレーションのみ
python3 imu_calibration_tool.py --mode i2c --port 1 --calibrate temp
```



