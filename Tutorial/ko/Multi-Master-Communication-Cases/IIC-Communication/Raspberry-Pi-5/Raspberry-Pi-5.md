# Raspberry Pi 5

## 1\.장치 연결

본 튜토리얼에서는 Raspberry Pi 5 보드, 공식 64비트 버전 이미지를 예로 듭니다.

IMU 자세 센서를 아래 그림과 같이 Raspberry Pi 5의 I2C 인터페이스에 연결합니다.

![树莓派5 IIC通讯\.jpg](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/raspberry-pi-5-iic-communication.jpg)

![image\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/image.png)

## 2\.장치 상태 확인

먼저 I2Ctool을 설치합니다. 터미널에 입력：

```PowerShell
sudo apt-get update
sudo apt-get install -y i2c-tools
```

I2C 장치 확인

```PowerShell
sudo i2cdetect -y -r -a 1
```

![截图\_20260203181146\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/screenshot-20260203181146.png)

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

![截图\_20260203182313\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/screenshot-20260203182313.png)

## 4\.IMU 데이터 확인

**\~/IMU\_Library 디렉토리로 들어가 IMU\_Serial\_Library\.py 파일을 실행합니다**

```PowerShell
cd ~/imu_ros2/src/IMU_ROS1/IMU_Library

# IMU 데이터 출력 파일 실행
python3 -m IMU_Library.IMU_I2C_Library
```

![截图\_20260203175633\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/screenshot-20260203175633.png)

주의：위 내용은 10축 IMU의 데이터 읽기입니다. 6축에는 자력계(Magnetometer)와 기압계(Barometer) 데이터가 없고, 9축에는 기압계(Barometer) 데이터가 없습니다.

## **5\.IMU 캘리브레이션**

**\~/IMU\_Library 디렉토리로 들어가 imu\_calibration\_tool\.py 파일을 실행합니다**

```PowerShell
cd ~/IMU_Library

# IMU 캘리브레이션 코드 파일 실행 --I2C 통신 캘리브레이션
# 모든 캘리브레이션 실행 (전체, 자력계, 온도)
python3 -m IMU_Library.imu_calibration_tool --mode i2c --port 1

# 전체 캘리브레이션만
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 1 --calibrate imu

# 자력계 캘리브레이션만
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 1 --calibrate mag

# 온도 캘리브레이션만
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 1 --calibrate temp
```

![截图\_20260203174958\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/screenshot-20260203174958.png)

## 6\.주의사항

Raspberry Pi 5는 미리 i2c 핀을 활성화해야 합니다.

활성화 방법은 다음과 같습니다：

터미널에서 명령을 실행합니다

```PowerShell
sudo raspi-config
```

키보드의 방향 키로 선택하고, 선택 후 키보드의 Enter 키를 눌러 진입합니다

![截图\_20260203181325\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/screenshot-20260203181325.png)

I2C를 선택하고, 선택 후 키보드의 Enter 키를 눌러 진입합니다,

![截图\_20260203181405\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/screenshot-20260203181405.png)

I2C를 선택한 후 키보드의 Enter 키를 누르고, 방향 키로 Yes를 선택한 뒤 다시 Enter 키를 눌러 확인합니다.

![截图\_20260203181427\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/screenshot-20260203181427.png)

Enter 키를 눌러 확인합니다

![截图\_20260203181447\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/screenshot-20260203181447.png)

방향 키로 Finish를 선택한 후 Enter 키를 눌러 설정을 종료합니다.

![截图\_20260203181510\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/screenshot-20260203181510.png)



