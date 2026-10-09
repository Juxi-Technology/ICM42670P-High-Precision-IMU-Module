# Jetsonシリーズ

## 1\.デバイスの接続

本チュートリアルではJetson orin nxボードを例にします。

IMU姿勢センサーをtype\-cケーブルでマスターのUSBに接続します。

![Jetson orin 串口通讯\.jpg](../../../../en/多主控通讯案例/串口通讯/Jetson系列/图片和附件/Jetson%20orin%20串口通讯.jpg)

## 2\.デバイス状態の確認

デバイスIDを確認します

```PowerShell
lsusb
```

デバイス番号を確認します

```PowerShell
ls -l /dev/ttyU*
```

![Screenshot from 2026\-02\-05 10\-18\-43\.png](../../../../en/多主控通讯案例/串口通讯/Jetson系列/图片和附件/Screenshot%20from%202026-02-05%2010-18-43.png)

ポートマッピングを設定します

```Bash
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

## 3\.ドライバライブラリのインストール

**3\.1 コードに必要なPythonライブラリのインストール**

```PowerShell
sudo apt update
sudo apt install -y python3-serial
sudo apt install -y python3-smbus2
```

**3\.2 ファイルの転送**

[IMU\_ROS2\.zip](/downloads/IMU_ROS2.zip)

MobaXtermでのファイル転送方法がまだわからない方は、以下のWebページでMobaXtermの詳細なインストールと操作方法を確認してください：[ファイルリモート転送](https://juxitech.feishu.cn/wiki/KB0Jw2o6Wis9f0ksyeFceVmgnfd)

MobaXtermソフトで 解凍後のファイル を Jetson にドラッグします。

![截图\_20260203182313\.png](../../../../en/多主控通讯案例/串口通讯/Jetson系列/图片和附件/截图_20260203182313.png)

## 4\.IMUデータの確認

**\~/IMU\_Libraryディレクトリに入り、IMU\_Serial\_Library\.pyファイルを実行します**

```PowerShell
cd ~/IMU_ROS2/IMU_Library

# IMU データ出力ファイルを実行
python3 -m IMU_Library.IMU_Serial_Library
```

![image\.png](../../../../en/多主控通讯案例/串口通讯/Jetson系列/图片和附件/image%201.png)

注意：以上は10軸IMUのデータ読み取りです。6軸には磁力計（Magnetometer）と気圧計（Barometer）のデータがなく、9軸には気圧計（Barometer）のデータがありません。

## **5\.IMUキャリブレーション**

**\~/IMU\_Libraryディレクトリに入り、imu\_calibration\_tool\.pyファイルを実行します**

```PowerShell
cd ~/IMU_Library

# IMU キャリブレーションコードファイルを実行 --シリアル通信用キャリブレーション
# すべてのキャリブレーションを実行（全体、磁力計、温度）
python3 -m IMU_Library.imu_calibration_tool --mode serial --port /dev/imu-serial

# 全体キャリブレーションのみ
python3 -m IMU_Library.imu_calibration_tool --mode serial --port /dev/imu-serial --calibrate imu

# 磁力計キャリブレーションのみ
python3 -m IMU_Library.imu_calibration_tool --mode serial --port /dev/imu-serial --calibrate mag

# 温度キャリブレーションのみ
python3 -m IMU_Library.imu_calibration_tool --mode serial --port /dev/imu-serial --calibrate temp
```

![image\.png](../../../../en/多主控通讯案例/串口通讯/Jetson系列/图片和附件/image.png)

## 6\.注意事項

デバイスIDは確認できるがデバイス番号が確認できない場合は、以下のコマンドを参考にch34xドライバをインストールしてください

```PowerShell
sudo apt remove brltty
git clone https://github.com/clhchan/CH341SER.git
cd CH341SER
make -j6
sudo make install
sudo modprobe ch34x
```



