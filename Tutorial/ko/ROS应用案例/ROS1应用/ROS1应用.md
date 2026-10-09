# ROS1 애플리케이션

**시스템 구성：ubuntu20\.04**

**ROS1****버전：noetic**

### ROS1 환경 설정

1. **ROS1****설치 소스를 설정합니다**

```PowerShell
sudo sh -c '. /etc/lsb-release && echo "deb http://mirrors.tuna.tsinghua.edu.cn/ros/ubuntu/ `lsb_release -cs` main" > /etc/apt/sources.list.d/ros-latest.list'
```

2. **Key를 설정합니다**

```PowerShell
sudo apt-key adv --keyserver 'hkp://keyserver.ubuntu.com:80' --recv-key C1CF6E31E6BADE8868B172B4F42ED6FBAB17C654
```

```Plain Text
sudo apt update
```

3. **ROS1을 설치합니다(공식 다운로드)**

```PowerShell
sudo apt install ros-noetic-desktop-full
```

프록시로 ROS1 다운로드 및 설치 가속

wget http://fishros\.com/install \-O fishros \&\& \. fishros

4. **환경 변수를 설정합니다**

```Plain Text
echo "source /opt/ros/noetic/setup.bash">> ~/.bashrc
```

```PowerShell
source ~/.bashrc
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
```

```Plain Text
sudo service udev reload
```

```Plain Text
sudo service udev restart
```

5. **확인합니다**

```PowerShell
ll /dev/imu-serial
```

```Bash
sudo usermod -aG dialout ash
```

### 준비한 압축 파일 가져오기

1. **Feishu 동일 레벨 디렉토리에**[IMU\_ROS1\.zip](https://juxitech.feishu.cn/wiki/BcWGwW2yDiXex9k6qjTcleTvnPb)가 있습니다

2. **압축을 푼 후****파일 전송 소프트웨어로 가상 머신에 전송합니다**

3. **IMU\_Library 라이브러리 설치**

```PowerShell
cd IMU_ROS1
# IMU_ROS1 압축 파일을 다운로드·압축 해제한 후, IMU_Library 디렉터리로 이동하여 아래 명령을 실행
cd IMU_Library

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

**렌더링에 문제가 발생하면 다음 명령을 실행하십시오**

```PowerShell
sudo apt-get install ros-noetic-imu-filter-madgwick
sudo apt-get install ros-noetic-rviz-imu-plugin
```

### ROS1 프로젝트 빌드

1. **/home 디렉토리에서 새 터미널을 열고 ros1 작업 공간을 새로 만듭니다**

```PowerShell
mkdir imu_ros1
cd imu_ros1
mkdir src
cd src/
catkin_init_workspace
```

2. **전송된 IMU\_ROS1 폴더를 \~/imu\_ros1/src/ 디렉토리에 복사합니다**

```PowerShell
# IMU_ROS1 폴더를 새로 만든 src 디렉터리에 복사
cp -r ~/IMU_ROS1 ~/imu_ros1/src
cd ~/imu_ros1
catkin_make
```

3. **작업 디렉토리\~/imu\_ros1을 환경 변수에 기록합니다**

```PowerShell
# ~/.bashrc 편집
sudo gedit ~/.bashrc

# 아래 명령을 끝에 작성
source ~/imu_ros1/devel/setup.bash

source ~/.bashrc
```

### ROS1 노드 실행

1. **터미널을 열고 roscore를 입력하여 노드를 실행합니다**

```PowerShell
# roscore 시작
roscore

# 새 터미널을 열고, 환경을 설정한 뒤, 노드를 시작
source ~/imu_ros1/devel/setup.bash
```

2. **Python 스크립트에 실행 권한을 부여합니다(중요)**

스크립트가 있는 `scripts` 디렉토리로 들어가 `chmod +x` 명령을 실행하여 실행 권한을 부여합니다(`+x` 는 add execute, 실행 권한을 추가한다는 의미입니다)：

```PowerShell
# imu_driver.py가 있는 디렉터리로 이동 (실제 경로에 맞게)
cd ~/imu_ros1/src/IMU_ROS1/scripts/ 

# 실행 권한 부여 (1회만 실행하면 영구 적용)
chmod +x imu_driver.py
chmod +x mag_visualizer.py
```

imu\_ros1 폴더로 돌아가 imu\_driver\.py를 실행합니다

```Plain Text
cd ~/imu_ros1
```

```Plain Text
rosrun IMU_ROS1 imu_driver.py
```

### IMU 데이터 출력

1. **새 터미널을 열고 imu 토픽을 확인합니다**

```PowerShell
# 현재 발행된 모든 토픽 확인
rostopic list
```

2. **토픽 데이터를 출력합니다**

```PowerShell
# IMU 원시 데이터 출력
rostopic echo /imu/data_raw

# 자력계 데이터 출력
rostopic echo /imu/mag
```

### RViz 시각화

1. **명령을 실행하여 rviz****\(\)를 시작합니다**

```PowerShell
roslaunch IMU_ROS1 imu_display.launch
```

### 자주 발생하는 문제

1. 노드 시작 시 열기 실패가 발생하면 다음 명령을 시도하십시오

```PowerShell
# ~/imu_ros1 디렉터리에서 실행
source devel/setup.bash

# 포트 번호 문제
sudo chmod 666 /dev/imu-serial
```

2. RVIZ 시각화에서 3축 표시가 작으면 Enable axes 를 다시 체크하십시오

![截图\_20260203101944\.png](../../../en/ROS应用案例/ROS1应用/图片和附件/截图_20260203101944.png)



