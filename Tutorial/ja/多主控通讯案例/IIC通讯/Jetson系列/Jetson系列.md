# Jetsonシリーズ

## 1\.デバイスの接続

本チュートリアルではJetson Orin NXボードを例にします。

IMU姿勢センサーを下図のようにJetson Orin NXのI2Cインターフェースに接続します。

![Jetson orin IIC通讯\.jpg](../../../../en/多主控通讯案例/IIC通讯/Jetson系列/图片和附件/Jetson%20orin%20IIC通讯.jpg)

![image\.png](../../../../en/多主控通讯案例/IIC通讯/Jetson系列/图片和附件/image.png)

## 2\.デバイス状態の確認

まずI2Ctoolをインストールします。ターミナルに入力：

```PowerShell
sudo apt-get update
sudo apt-get install -y i2c-tools
```

I2Cデバイスを確認します

```PowerShell
sudo i2cdetect -y -r -a 7
```

![Screenshot from 2026\-02\-05 11\-09\-35\.png](../../../../en/多主控通讯案例/IIC通讯/Jetson系列/图片和附件/Screenshot%20from%202026-02-05%2011-09-35.png)

## 3\.ドライバライブラリのインストール

3\.1**コードに必要なPythonライブラリのインストール**

```PowerShell
sudo apt update
sudo apt install -y python3-serial
sudo apt install -y python3-smbus2
```

3\.2 ファイルの転送

[IMU\_ROS2\.zip](/downloads/IMU_ROS2.zip)

MobaXtermでのファイル転送方法がまだわからない方は、以下のWebページでMobaXtermの詳細なインストールと操作方法を確認してください：[ファイルリモート転送](https://juxitech.feishu.cn/wiki/KB0Jw2o6Wis9f0ksyeFceVmgnfd)

MobaXtermソフトで 解凍後のファイル を Raspberry Pi 5 にドラッグします。

![截图\_20260203182313\.png](../../../../en/多主控通讯案例/IIC通讯/Jetson系列/图片和附件/截图_20260203182313.png)

## 4\.IMUデータの確認

**\~/IMU\_Libraryディレクトリに入り、IMU\_Serial\_Library\.pyファイルを実行します**

```PowerShell
cd ~/imu_ros2/src/IMU_ROS2/IMU_Library

# IMU データ出力ファイルを実行
python3 -m IMU_Library.IMU_I2C_Library
```

![Screenshot from 2026\-02\-05 11\-07\-24\.png](../../../../en/多主控通讯案例/IIC通讯/Jetson系列/图片和附件/Screenshot%20from%202026-02-05%2011-07-24.png)

注意：以上は10軸IMUのデータ読み取りです。6軸には磁力計（Magnetometer）と気圧計（Barometer）のデータがなく、9軸には気圧計（Barometer）のデータがありません。

## **5\.IMUキャリブレーション**

**\~/IMU\_Libraryディレクトリに入り、imu\_calibration\_tool\.pyファイルを実行します**

```PowerShell
cd ~/IMU_Library

# IMU キャリブレーションコードファイルを実行 --I2C 通信用キャリブレーション
# すべてのキャリブレーションを実行（全体、磁力計、温度）
python3 -m IMU_Library.imu_calibration_tool --mode i2c --port 7

# 全体キャリブレーションのみ
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 7 --calibrate imu

# 磁力計キャリブレーションのみ
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 7 --calibrate mag

# 温度キャリブレーションのみ
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 7 --calibrate temp
```

![Screenshot from 2026\-02\-05 11\-08\-46\.png](../../../../en/多主控通讯案例/IIC通讯/Jetson系列/图片和附件/Screenshot%20from%202026-02-05%2011-08-46.png)

## 6\.注意事項

orinシリーズのボードを使用する場合、実際の状況に応じてI2Cバス番号を変更する必要があります。変更箇所は下図のとおりです。通常は7番バスです

![截图\_20260203191332\.png](../../../../en/多主控通讯案例/IIC通讯/Jetson系列/图片和附件/截图_20260203191332.png)

![截图\_20260203191406\.png](../../../../en/多主控通讯案例/IIC通讯/Jetson系列/图片和附件/截图_20260203191406.png)



