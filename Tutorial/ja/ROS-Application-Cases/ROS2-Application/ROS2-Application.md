# ROS2アプリケーション

**システム構成：ubuntu22\.04**

**ROS2バージョン：humble**

### ROS2環境設定

1. **ダウンロードソースを更新します**

```PowerShell
sudo apt update
```

2. **ros2のダウンロードコマンドを入力します**

```PowerShell
wget http://fishros.com/install -O fishros && . fishros
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
sudo service udev reload
sudo service udev restart
```

5. **確認します**

```PowerShell
ll /dev/imu-serial
```

### 用意した圧縮ファイルのインポート

1. **Feishuの同じ階層ディレクトリに**[IMU\_ROS2\.zip](https://juxitech.feishu.cn/wiki/ZL8XwrPriifnASk41AhcoPj1nnb)があります

2. **ファイル転送ソフトで仮想マシンに転送します**

3. **IMU\_Libraryライブラリのインストール**

```PowerShell
# IMU_ROS2 圧縮ファイルをダウンロード・解凍後、IMU_Library ディレクトリに移動し、setup.py を実行
cd IMU_ROS2/IMU_Library

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

### ROS2プロジェクトのビルド

1. **\~/IMU\_ROS2ディレクトリに戻ります**

```PowerShell
cd IMU_ROS2
colcon build --symlink-install
```

1. **作業ディレクトリ\~/IMU\_ROS2を環境変数に書き込みます**

```PowerShell
# ~/.bashrc を編集
sudo gedit ~/.bashrc

# 以下のコマンドを末尾に記述
source ~/IMU_ROS2/install/setup.bash
```

コンパイル成功後、以下のコマンドを実行してimu\_ros2パッケージ下に実行可能ファイルがあるか確認します

`ros2 pkg executables imu_ros2`

### ROS2ノードの起動

```PowerShell
source install/setup.bash
ros2 run imu_ros2 imu_publisher
```

### IMUデータ出力

1. **新しいターミナルを開き、imuトピックを確認します**

```PowerShell
ros2 topic list
```

2. **/imu/dataトピックのデータを出力します**

```PowerShell
ros2 topic echo /imu/data
```

3. **新しいターミナルを開き、msgトピックを確認します**

```PowerShell
ros2 topic echo /imu/mag
```

### RViz2可視化

1. **コマンドを実行し、rviz可視化インターフェースを開きます**

```PowerShell
ros2 launch imu_ros2 imu_visualization.launch.py
```

### よくある問題

1. ノードの起動時にオープン失敗が発生した場合は、以下のコマンドを試してください

```PowerShell
# ~/IMU_ROS2 ディレクトリで実行
source install/setup.bash

# ポート番号の問題
sudo chmod 666 /dev/imu-serial
```





