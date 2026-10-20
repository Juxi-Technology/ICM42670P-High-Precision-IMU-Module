# 고정밀 IMU 자세 센서 사용 미리보기

### 압축 파일 [IMU\_ROS1\.zip](https://juxitech.feishu.cn/wiki/BcWGwW2yDiXex9k6qjTcleTvnPb) 또는[IMU\_ROS2\.zip](https://juxitech.feishu.cn/wiki/ZL8XwrPriifnASk41AhcoPj1nnb)을 다운로드하고, 압축을 푼 후 \~/IMU\_Library로 들어갑니다

1. **코드에 필요한 Python 라이브러리 설치**

```PowerShell
pip install pyserial
pip install smbus2
```

2. **IMU\_Library 라이브러리 설치**

```PowerShell
# 라이브러리 및 의존성 설치
pip install -e .

# 또는 setup.py로 설치
python setup.py install
```

3. **포트 매핑을 설정합니다**

```PowerShell
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

### 시리얼 통신

1. **\~/IMU\_Library/IMU\_Library 디렉토리로 들어가 IMU\_Serial\_Library\.py 파일을 실행합니다**

```PowerShell
cd ~/imu_ros1/src/IMU_ROS1/IMU_Library/IMU_Library 
# 또는
cd ~/imu_ros2/src/IMU_ROS2/IMU_Library/IMU_Library

# IMU 데이터 출력 파일 실행
python3 IMU_Serial_Library.py
```

### I2C 통신

1. **\~/IMU\_Library/IMU\_Library 디렉토리로 들어가 IMU\_I2C\_Library\.py 파일을 실행합니다**

```PowerShell
cd ~/IMU_Library/IMU_Library

# IMU 데이터 출력 파일 실행
python3 IMU_I2C_Library.py
```

### IMU 캘리브레이션

1. **\~/IMU\_Library/IMU\_Library 디렉토리로 들어가 imu\_calibration\_tool\.py 파일을 실행합니다**

```PowerShell
cd ~/IMU_Library/IMU_Library

# IMU 캘리브레이션 코드 파일 실행 --시리얼 통신 캘리브레이션
# 모든 캘리브레이션 실행 (전체, 자력계, 온도)
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial

# 전체 캘리브레이션만
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial --calibrate imu

# 자력계 캘리브레이션만
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial --calibrate mag

# 온도 캘리브레이션만
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial --calibrate temp

# IMU 캘리브레이션 코드 파일 실행 --I2C 통신 캘리브레이션
# 모든 캘리브레이션 실행 (전체, 자력계, 온도)
python3 imu_calibration_tool.py --mode i2c --port 1

# 전체 캘리브레이션만
python3 imu_calibration_tool.py --mode i2c --port 1 --calibrate imu

# 자력계 캘리브레이션만
python3 imu_calibration_tool.py --mode i2c --port 1 --calibrate mag

# 온도 캘리브레이션만
python3 imu_calibration_tool.py --mode i2c --port 1 --calibrate temp
```



