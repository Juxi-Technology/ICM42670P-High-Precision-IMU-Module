# ROS1-Anwendung

**Systemkonfiguration: ubuntu20\.04**

**ROS1-Version: noetic**

### ROS1-Umgebungskonfiguration

1. **ROS1-Installationsquelle festlegen**

```PowerShell
sudo sh -c '. /etc/lsb-release && echo "deb http://mirrors.tuna.tsinghua.edu.cn/ros/ubuntu/ `lsb_release -cs` main" > /etc/apt/sources.list.d/ros-latest.list'
```

2. **Key festlegen**

```PowerShell
sudo apt-key adv --keyserver 'hkp://keyserver.ubuntu.com:80' --recv-key C1CF6E31E6BADE8868B172B4F42ED6FBAB17C654
```

```Plain Text
sudo apt update
```

3. **Installation von ROS1 (offizieller Download)**

```PowerShell
sudo apt install ros-noetic-desktop-full
```

Beschleunigter Download und Installation von ROS1 über einen Proxy

wget http://fishros\.com/install \-O fishros \&\& \. fishros

4. **Umgebungsvariablen konfigurieren**

```Plain Text
echo "source /opt/ros/noetic/setup.bash">> ~/.bashrc
```

```PowerShell
source ~/.bashrc
```

### Verbindung des Geräts mit der virtuellen Maschine

1. **Gerät anzeigen**

```PowerShell
ll /dev/ttyUSB*
```

2. **Portzuordnung erstellen**

```PowerShell
sudo gedit /etc/udev/rules.d/99-serial-imu.rules
```

3. **Inhalt der Zuordnungsdatei ausfüllen**

```PowerShell
KERNEL=="ttyUSB*", ATTRS{idVendor}=="1a86", ATTRS{idProduct}=="7523", MODE:="0777", SYMLINK+="imu-serial"
```

4. **Speichern und beenden, Befehl ausführen, damit die Regel wirksam wird**

```PowerShell
sudo udevadm trigger
```

```Plain Text
sudo service udev reload
```

```Plain Text
sudo service udev restart
```

5. **Überprüfung**

```PowerShell
ll /dev/imu-serial
```

```Bash
sudo usermod -aG dialout ash
```

### Importieren des vorbereiteten Archivs

1. **Im gleichen Verzeichnis in Feishu liegt**[IMU\_ROS1\.zip](https://juxitech.feishu.cn/wiki/BcWGwW2yDiXex9k6qjTcleTvnPb)

2. **Nach dem Entpacken mit einer Dateiübertragungssoftware in die virtuelle Maschine übertragen**

3. **IMU\_Library-Bibliothek installieren**

```PowerShell
cd IMU_ROS1
# Nach dem Herunterladen und Entpacken des IMU_ROS1-Archivs in das Verzeichnis IMU_Library wechseln und folgenden Befehl ausführen
cd IMU_Library

# Bibliothek und ihre Abhängigkeiten installieren
pip install -e .

# oder mit setup.py installieren
python setup.py install
```

### Installation der zugehörigen python-Bibliotheken

```PowerShell
sudo pip3 install pyserial
sudo pip3 install smbus2
```

**Wenn Probleme bei der Darstellung auftreten, führen Sie die folgenden Befehle aus**

```PowerShell
sudo apt-get install ros-noetic-imu-filter-madgwick
sudo apt-get install ros-noetic-rviz-imu-plugin
```

### ROS1-Projekt erstellen

1. **Im Verzeichnis /home ein neues Terminal öffnen und einen neuen ros1-Workspace erstellen**

```PowerShell
mkdir imu_ros1
cd imu_ros1
mkdir src
cd src/
catkin_init_workspace
```

2. **Den übertragenen Ordner IMU\_ROS1 in das Verzeichnis \~/imu\_ros1/src/ kopieren**

```PowerShell
# Den Ordner IMU_ROS1 in das neu erstellte Verzeichnis src kopieren
cp -r ~/IMU_ROS1 ~/imu_ros1/src
cd ~/imu_ros1
catkin_make
```

3. **Das Arbeitsverzeichnis \~/imu\_ros1 in die Umgebungsvariablen eintragen**

```PowerShell
# ~/.bashrc bearbeiten
sudo gedit ~/.bashrc

# Den folgenden Befehl am Ende einfügen
source ~/imu_ros1/devel/setup.bash

source ~/.bashrc
```

### ROS1-Node starten

1. **Ein Terminal öffnen, roscore eingeben, um die Node zu starten**

```PowerShell
# roscore starten
roscore

# Neues Terminal öffnen, Umgebung einrichten, Node starten
source ~/imu_ros1/devel/setup.bash
```

2. **Dem Python-Skript Ausführungsrechte hinzufügen (entscheidend)**

Wechseln Sie in das Verzeichnis `scripts`, in dem sich das Skript befindet, und führen Sie den Befehl `chmod +x` aus, um Ausführungsrechte zu vergeben (`+x` steht für add execute, also das Hinzufügen von Ausführungsrechten):

```PowerShell
# In das Verzeichnis wechseln, in dem sich imu_driver.py befindet (gemäß Ihrem tatsächlichen Pfad)
cd ~/imu_ros1/src/IMU_ROS1/scripts/ 

# Ausführbare Berechtigung vergeben (nur einmal nötig, dauerhaft wirksam)
chmod +x imu_driver.py
chmod +x mag_visualizer.py
```

Zum Ordner imu\_ros1 zurückkehren und imu\_driver\.py ausführen

```Plain Text
cd ~/imu_ros1
```

```Plain Text
rosrun IMU_ROS1 imu_driver.py
```

### IMU-Datenausgabe

1. **Ein neues Terminal öffnen und das imu-Topic anzeigen**

```PowerShell
# Alle aktuell veröffentlichten Topics anzeigen
rostopic list
```

2. **Topic-Daten ausgeben**

```PowerShell
# IMU-Rohdaten ausgeben
rostopic echo /imu/data_raw

# Magnetometerdaten ausgeben
rostopic echo /imu/mag
```

### RViz-Visualisierung

1. **Befehl zum Starten von rviz ausführen \(\)**

```PowerShell
roslaunch IMU_ROS1 imu_display.launch
```

### Häufige Fragen

1. Wenn beim Starten der Node ein Öffnungsfehler auftritt, versuchen Sie die folgenden Befehle

```PowerShell
# Im Verzeichnis ~/imu_ros1 ausführen
source devel/setup.bash

# Portnummer-Problem
sudo chmod 666 /dev/imu-serial
```

2. In der RVIZ-Visualisierung sind die drei Achsen sehr klein dargestellt; aktivieren Sie Enable axes erneut

![截图\_20260203101944\.png](../../../en/ROS-Application-Cases/ROS1-Application/Images/screenshot-20260203101944.png)



