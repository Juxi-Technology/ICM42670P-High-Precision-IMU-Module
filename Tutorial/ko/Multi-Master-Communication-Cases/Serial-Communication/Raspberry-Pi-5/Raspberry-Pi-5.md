# Raspberry Pi 5

## 1\.장치 연결

본 튜토리얼에서는 Raspberry Pi 5 보드, 공식 64비트 버전 이미지를 예로 듭니다.

IMU 자세 센서를 type\-c 케이블로 마스터의 USB에 연결합니다.

![树莓派5 串口通讯\.jpg](../../../../en/Multi-Master-Communication-Cases/Serial-Communication/Raspberry-Pi-5/Images/raspberry-pi-5-serial-communication.jpg)

## 2\.장치 상태 확인

장치 ID 확인

```PowerShell
lsusb
```

장치 번호 확인

```PowerShell
ls -l /dev/ttyU*
```

![截图\_20260203120748\.png](../../../../en/Multi-Master-Communication-Cases/Serial-Communication/Raspberry-Pi-5/Images/screenshot-20260203120748.png)

포트 매핑 설정

```Bash
# 탈부착 후 포트 변경을 방지하려면 포트 매핑을 설정하세요
sudo gedit /etc/udev/rules.d/99-serial-imu.rules

# gedit 명령이 없다는 내용이 나오면 먼저 다운로드하여 설치
sudo apt install gedit

# 매핑 내용 입력
KERNEL=="ttyUSB*", ATTRS{idVendor}=="1a86", ATTRS{idProduct}=="7523", MODE:="0777", SYMLINK+="imu-serial"

# 파라미터 설명:
`--mode`: 通信模式，可选值为`serial`(串口)或`i2c`
`--port`: 串口名(如`/dev/ttyUSB0`)或I2C端口号(如`7`)
`--rate`: 数据打印频率(Hz)，默认10Hz
`--debug`: 启用调试模式，显示详细信息

# 저장 후 종료하고, 명령을 실행하여 규칙 적용
sudo udevadm trigger
sudo service udev reload
sudo service udev restart

# 검증
ll /dev/imu-serial

# 출력 예시:
lrwxrwxrwx 1 root root 7 1月 22 10:00 /dev/imu-serial -> ttyUSB0
```

## 3\.드라이버 라이브러리 설치

**3\.1 코드에 필요한 Python 라이브러리 설치**

```PowerShell
sudo apt update
sudo apt install -y python3-serial
sudo apt install -y python3-smbus2
```

**3\.2 파일 전송**

[IMU\_ROS2\.zip](/downloads/IMU_ROS2.zip)

MobaXterm으로 파일을 전송하는 방법을 아직 모르는 분은 다음 웹페이지에서 MobaXterm의 자세한 설치 및 사용 방법을 확인하십시오：[파일 원격 전송](https://juxitech.feishu.cn/wiki/KB0Jw2o6Wis9f0ksyeFceVmgnfd)

MobaXterm 소프트웨어로 압축을 푼 파일 을 Raspberry Pi 5 에 끌어다 놓습니다.

![截图\_20260203182313\.png](../../../../en/Multi-Master-Communication-Cases/Serial-Communication/Raspberry-Pi-5/Images/screenshot-20260203182313.png)

## 4\.IMU 데이터 확인

**\~/IMU\_Library 디렉토리로 들어가 IMU\_Serial\_Library\.py 파일을 실행합니다**

```PowerShell
cd ~/IMU_ROS2/IMU_Library

# IMU 데이터 출력 파일 실행
python3 -m IMU_Library.IMU_Serial_Library
```

![截图\_20260203182857\.png](../../../../en/Multi-Master-Communication-Cases/Serial-Communication/Raspberry-Pi-5/Images/screenshot-20260203182857.png)

주의：위 내용은 10축 IMU의 데이터 읽기입니다. 6축에는 자력계(Magnetometer)와 기압계(Barometer) 데이터가 없고, 9축에는 기압계(Barometer) 데이터가 없습니다.

## **5\.IMU 캘리브레이션**

**\~/IMU\_Library 디렉토리로 들어가 imu\_calibration\_tool\.py 파일을 실행합니다**

```PowerShell
cd ~/IMU_Library

# IMU 캘리브레이션 코드 파일 실행 --시리얼 통신 캘리브레이션
# 모든 캘리브레이션 실행 (전체, 자력계, 온도)
python3 -m IMU_Library.imu_calibration_tool --mode serial --port /dev/imu-serial

# 전체 캘리브레이션만
python3 -m IMU_Library.imu_calibration_tool --mode serial --port /dev/imu-serial --calibrate imu

# 자력계 캘리브레이션만
python3 -m IMU_Library.imu_calibration_tool --mode serial --port /dev/imu-serial --calibrate mag

# 온도 캘리브레이션만
python3 -m IMU_Library.imu_calibration_tool --mode serial --port /dev/imu-serial --calibrate temp
```

## 6\.주의사항

장치 ID는 확인되지만 장치 번호를 확인할 수 없는 경우 아래 명령을 참고하여 ch34x 드라이버를 설치하십시오

```PowerShell
sudo apt remove brltty
git clone https://github.com/clhchan/CH341SER.git
cd CH341SER
make -j6
sudo make install
sudo modprobe ch34x
```



