# Jetson 시리즈

## 1\.장치 연결

본 튜토리얼에서는 Jetson Orin NX 보드를 예로 듭니다.

IMU 자세 센서를 아래 그림과 같이 Jetson Orin NX의 I2C 인터페이스에 연결합니다.

![Jetson orin IIC通讯\.jpg](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Jetson-Series/Images/jetson-orin-iic-communication.jpg)

![image\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Jetson-Series/Images/image.png)

## 2\.장치 상태 확인

먼저 I2Ctool을 설치합니다. 터미널에 입력：

```PowerShell
sudo apt-get update
sudo apt-get install -y i2c-tools
```

I2C 장치 확인

```PowerShell
sudo i2cdetect -y -r -a 7
```

![Screenshot from 2026\-02\-05 11\-09\-35\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Jetson-Series/Images/Screenshot%20from%202026-02-05%2011-09-35.png)

## 3\.드라이버 라이브러리 설치

3\.1**코드에 필요한 Python 라이브러리 설치**

```PowerShell
sudo apt update
sudo apt install -y python3-serial
sudo apt install -y python3-smbus2
```

3\.2 파일 전송

[IMU\_ROS2\.zip](/downloads/IMU_ROS2.zip)

MobaXterm으로 파일을 전송하는 방법을 아직 모르는 분은 다음 웹페이지에서 MobaXterm의 자세한 설치 및 사용 방법을 확인하십시오：[파일 원격 전송](https://juxitech.feishu.cn/wiki/KB0Jw2o6Wis9f0ksyeFceVmgnfd)

MobaXterm 소프트웨어로 압축을 푼 파일 을 Raspberry Pi 5 에 끌어다 놓습니다.

![截图\_20260203182313\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Jetson-Series/Images/screenshot-20260203182313.png)

## 4\.IMU 데이터 확인

**\~/IMU\_Library 디렉토리로 들어가 IMU\_Serial\_Library\.py 파일을 실행합니다**

```PowerShell
cd ~/imu_ros2/src/IMU_ROS2/IMU_Library

# IMU 데이터 출력 파일 실행
python3 -m IMU_Library.IMU_I2C_Library
```

![Screenshot from 2026\-02\-05 11\-07\-24\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Jetson-Series/Images/Screenshot%20from%202026-02-05%2011-07-24.png)

주의：위 내용은 10축 IMU의 데이터 읽기입니다. 6축에는 자력계(Magnetometer)와 기압계(Barometer) 데이터가 없고, 9축에는 기압계(Barometer) 데이터가 없습니다.

## **5\.IMU 캘리브레이션**

**\~/IMU\_Library 디렉토리로 들어가 imu\_calibration\_tool\.py 파일을 실행합니다**

```PowerShell
cd ~/IMU_Library

# IMU 캘리브레이션 코드 파일 실행 --I2C 통신 캘리브레이션
# 모든 캘리브레이션 실행 (전체, 자력계, 온도)
python3 -m IMU_Library.imu_calibration_tool --mode i2c --port 7

# 전체 캘리브레이션만
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 7 --calibrate imu

# 자력계 캘리브레이션만
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 7 --calibrate mag

# 온도 캘리브레이션만
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 7 --calibrate temp
```

![Screenshot from 2026\-02\-05 11\-08\-46\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Jetson-Series/Images/Screenshot%20from%202026-02-05%2011-08-46.png)

## 6\.주의사항

orin 시리즈 보드를 사용할 때는 실제 상황에 따라 I2C 버스 번호를 수정해야 합니다. 수정 위치는 아래 그림과 같습니다. 일반적으로 7번 버스입니다

![截图\_20260203191332\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Jetson-Series/Images/screenshot-20260203191332.png)

![截图\_20260203191406\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Jetson-Series/Images/screenshot-20260203191406.png)



