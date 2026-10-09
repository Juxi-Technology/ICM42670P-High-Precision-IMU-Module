# ROS2 애플리케이션

**시스템 구성：ubuntu22\.04**

**ROS2 버전：humble**

### ROS2 환경 설정

1. **다운로드 소스를 업데이트합니다**

```PowerShell
sudo apt update
```

2. **ros2 다운로드 명령을 입력합니다**

```PowerShell
wget http://fishros.com/install -O fishros && . fishros
```

### 장치를 가상 머신에 연결

1. **장치를 확인합니다**

```PowerShell
ll /dev/ttyUSB*
```

2. **포트 매핑을 설정합니다**

```PowerShell
sudo gedit /etc/udev/rules.d/99-serial-imu.rules
```

3. **매핑 파일 내용을 작성합니다**

```PowerShell
KERNEL=="ttyUSB*", ATTRS{idVendor}=="1a86", ATTRS{idProduct}=="7523", MODE:="0777", SYMLINK+="imu-serial"
```

4. **저장하고 종료한 뒤 명령을 실행하여 규칙을 적용합니다**

```PowerShell
sudo udevadm trigger
sudo service udev reload
sudo service udev restart
```

5. **확인합니다**

```PowerShell
ll /dev/imu-serial
```

### 준비한 압축 파일 가져오기

1. **Feishu 동일 레벨 디렉토리에**[IMU\_ROS2\.zip](https://juxitech.feishu.cn/wiki/ZL8XwrPriifnASk41AhcoPj1nnb)가 있습니다

2. **파일 전송 소프트웨어로 가상 머신에 전송합니다**

3. **IMU\_Library 라이브러리 설치**

```PowerShell
# IMU_ROS2 압축 파일을 다운로드·압축 해제한 후, IMU_Library 디렉터리로 이동하여 setup.py 실행
cd IMU_ROS2/IMU_Library

# 라이브러리 및 의존성 설치
pip install -e .

# 또는 setup.py로 설치
python setup.py install
```

### Python 관련 라이브러리 설치

```PowerShell
sudo pip3 install pyserial
sudo pip3 install smbus2
```

### ROS2 프로젝트 빌드

1. **\~/IMU\_ROS2 디렉토리로 돌아갑니다**

```PowerShell
cd IMU_ROS2
colcon build --symlink-install
```

1. **작업 디렉토리\~/IMU\_ROS2를 환경 변수에 기록합니다**

```PowerShell
# ~/.bashrc 편집
sudo gedit ~/.bashrc

# 아래 명령을 끝에 작성
source ~/IMU_ROS2/install/setup.bash
```

컴파일 성공 후 다음 명령을 실행하여 imu\_ros2 패키지에 실행 파일이 있는지 확인합니다

`ros2 pkg executables imu_ros2`

### ROS2 노드 실행

```PowerShell
source install/setup.bash
ros2 run imu_ros2 imu_publisher
```

### IMU 데이터 출력

1. **새 터미널을 열고 imu 토픽을 확인합니다**

```PowerShell
ros2 topic list
```

2. **/imu/data 토픽 데이터를 출력합니다**

```PowerShell
ros2 topic echo /imu/data
```

3. **새 터미널을 열고 msg 토픽을 확인합니다**

```PowerShell
ros2 topic echo /imu/mag
```

### RViz2 시각화

1. **명령을 실행하여 rviz 시각화 인터페이스를 엽니다**

```PowerShell
ros2 launch imu_ros2 imu_visualization.launch.py
```

### 자주 발생하는 문제

1. 노드 시작 시 열기 실패가 발생하면 다음 명령을 시도하십시오

```PowerShell
# ~/IMU_ROS2 디렉터리에서 실행
source install/setup.bash

# 포트 번호 문제
sudo chmod 666 /dev/imu-serial
```





