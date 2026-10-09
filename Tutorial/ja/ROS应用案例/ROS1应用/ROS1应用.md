# ROS1アプリケーション

**システム構成：ubuntu20\.04**

**ROS1****バージョン：noetic**

### ROS1環境設定

1. **ROS1****インストールソースを設定します**

```PowerShell
sudo sh -c '. /etc/lsb-release && echo "deb http://mirrors.tuna.tsinghua.edu.cn/ros/ubuntu/ `lsb_release -cs` main" > /etc/apt/sources.list.d/ros-latest.list'
```

2. **Keyを設定します**

```PowerShell
sudo apt-key adv --keyserver 'hkp://keyserver.ubuntu.com:80' --recv-key C1CF6E31E6BADE8868B172B4F42ED6FBAB17C654
```

```Plain Text
sudo apt update
```

3. **ROS1をインストールします（公式ダウンロード）**

```PowerShell
sudo apt install ros-noetic-desktop-full
```

プロキシでROS1のダウンロードとインストールを高速化

wget http://fishros\.com/install \-O fishros \&\& \. fishros

4. **環境変数を設定します**

```Plain Text
echo "source /opt/ros/noetic/setup.bash">> ~/.bashrc
```

```PowerShell
source ~/.bashrc
```

### デバイスの仮想マシンへの接続

1. **デバイスを確認します**

```PowerShell
ll /dev/ttyUSB*
```

2. **ポートマッピングを設定します**

```PowerShell
sudo gedit /etc/udev/rules.d/99-serial-imu.rules
```

3. **マッピングファイルの内容を記入します**

```PowerShell
KERNEL=="ttyUSB*", ATTRS{idVendor}=="1a86", ATTRS{idProduct}=="7523", MODE:="0777", SYMLINK+="imu-serial"
```

4. **保存して終了し、コマンドを実行してルールを反映します**

```PowerShell
sudo udevadm trigger
```

```Plain Text
sudo service udev reload
```

```Plain Text
sudo service udev restart
```

5. **確認します**

```PowerShell
ll /dev/imu-serial
```

```Bash
sudo usermod -aG dialout ash
```

### 用意した圧縮ファイルのインポート

1. **Feishuの同じ階層ディレクトリに**[IMU\_ROS1\.zip](https://juxitech.feishu.cn/wiki/BcWGwW2yDiXex9k6qjTcleTvnPb)があります

2. **解凍後、****ファイル転送ソフトで仮想マシンに転送します**

3. **IMU\_Libraryライブラリのインストール**

```PowerShell
cd IMU_ROS1
# IMU_ROS1 圧縮ファイルをダウンロード・解凍後、IMU_Library ディレクトリに移動し、以下のコマンドを実行
cd IMU_Library

# ライブラリとその依存関係をインストール
pip install -e .

# または setup.py でインストール
python setup.py install
```

### Python関連ライブラリのインストール

```PowerShell
sudo pip3 install pyserial
sudo pip3 install smbus2
```

**レンダリングに問題が発生した場合は、以下のコマンドを実行します**

```PowerShell
sudo apt-get install ros-noetic-imu-filter-madgwick
sudo apt-get install ros-noetic-rviz-imu-plugin
```

### ROS1プロジェクトのビルド

1. **/homeディレクトリで新しいターミナルを開き、ros1ワークスペースを新規作成します**

```PowerShell
mkdir imu_ros1
cd imu_ros1
mkdir src
cd src/
catkin_init_workspace
```

2. **転送されたIMU\_ROS1フォルダを\~/imu\_ros1/src/ディレクトリにコピーします**

```PowerShell
# IMU_ROS1 フォルダを新規作成した src ディレクトリにコピー
cp -r ~/IMU_ROS1 ~/imu_ros1/src
cd ~/imu_ros1
catkin_make
```

3. **作業ディレクトリ\~/imu\_ros1を環境変数に書き込みます**

```PowerShell
# ~/.bashrc を編集
sudo gedit ~/.bashrc

# 以下のコマンドを末尾に記述
source ~/imu_ros1/devel/setup.bash

source ~/.bashrc
```

### ROS1ノードの起動

1. **ターミナルを開き、roscoreを入力してノードを起動します**

```PowerShell
# roscore を起動
roscore

# 新しいターミナルを開き、環境を設定して、ノードを起動
source ~/imu_ros1/devel/setup.bash
```

2. **Pythonスクリプトに実行権限を付与します（重要）**

スクリプトのある `scripts` ディレクトリに入り、`chmod +x` コマンドを実行して実行権限を付与します（`+x` は add execute、実行権限を追加する意味です）：

```PowerShell
# imu_driver.py のあるディレクトリに移動（実際のパスに合わせて）
cd ~/imu_ros1/src/IMU_ROS1/scripts/ 

# 実行権限を付与（1 回のみ実行すれば永続的に有効）
chmod +x imu_driver.py
chmod +x mag_visualizer.py
```

imu\_ros1フォルダに戻り、imu\_driver\.pyを実行します

```Plain Text
cd ~/imu_ros1
```

```Plain Text
rosrun IMU_ROS1 imu_driver.py
```

### IMUデータ出力

1. **新しいターミナルを開き、imuトピックを確認します**

```PowerShell
# 現在配信されているすべてのトピックを表示
rostopic list
```

2. **トピックデータを出力します**

```PowerShell
# IMU の生データを出力
rostopic echo /imu/data_raw

# 磁力計データを出力
rostopic echo /imu/mag
```

### RViz可視化

1. **コマンドを実行してrviz****\(\)を起動します**

```PowerShell
roslaunch IMU_ROS1 imu_display.launch
```

### よくある問題

1. ノードの起動時にオープン失敗が発生した場合は、以下のコマンドを試してください

```PowerShell
# ~/imu_ros1 ディレクトリで実行
source devel/setup.bash

# ポート番号の問題
sudo chmod 666 /dev/imu-serial
```

2. RVIZ可視化で三軸の表示が小さい場合は、Enable axes を再度チェックしてください

![截图\_20260203101944\.png](../../../en/ROS应用案例/ROS1应用/图片和附件/截图_20260203101944.png)



