# ROS2-Anwendung

**Systemkonfiguration: ubuntu22\.04**

**ROS2-Version: humble**

### ROS2-Umgebungskonfiguration

1. **Download-Quelle aktualisieren**

```PowerShell
sudo apt update
```

2. **ros2-Download-Befehl eingeben**

```PowerShell
wget http://fishros.com/install -O fishros && . fishros
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
sudo service udev reload
sudo service udev restart
```

5. **Überprüfung**

```PowerShell
ll /dev/imu-serial
```

### Importieren des vorbereiteten Archivs

1. **Im gleichen Verzeichnis in Feishu liegt**[IMU\_ROS2\.zip](https://juxitech.feishu.cn/wiki/ZL8XwrPriifnASk41AhcoPj1nnb)

2. **Mit einer Dateiübertragungssoftware in die virtuelle Maschine übertragen**

3. **IMU\_Library-Bibliothek installieren**

```PowerShell
# Nach dem Herunterladen und Entpacken des IMU_ROS2-Archivs in das Verzeichnis IMU_Library wechseln und setup.py ausführen
cd IMU_ROS2/IMU_Library

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

### ROS2-Projekt erstellen

1. **Zum Verzeichnis \~/IMU\_ROS2 zurückkehren**

```PowerShell
cd IMU_ROS2
colcon build --symlink-install
```

1. **Das Arbeitsverzeichnis \~/IMU\_ROS2 in die Umgebungsvariablen eintragen**

```PowerShell
# ~/.bashrc bearbeiten
sudo gedit ~/.bashrc

# Den folgenden Befehl am Ende einfügen
source ~/IMU_ROS2/install/setup.bash
```

Führen Sie nach erfolgreicher Kompilierung den folgenden Befehl aus, um zu prüfen, ob das Funktionspaket imu\_ros2 ausführbare Dateien enthält

`ros2 pkg executables imu_ros2`

### ROS2-Node starten

```PowerShell
source install/setup.bash
ros2 run imu_ros2 imu_publisher
```

### IMU-Datenausgabe

1. **Ein neues Terminal öffnen und das imu-Topic anzeigen**

```PowerShell
ros2 topic list
```

2. **Daten des Topics /imu/data ausgeben**

```PowerShell
ros2 topic echo /imu/data
```

3. **Ein neues Terminal öffnen und das msg-Topic anzeigen**

```PowerShell
ros2 topic echo /imu/mag
```

### RViz2-Visualisierung

1. **Befehl ausführen, um die rviz-Visualisierungsoberfläche zu öffnen**

```PowerShell
ros2 launch imu_ros2 imu_visualization.launch.py
```

### Häufige Fragen

1. Wenn beim Starten der Node ein Öffnungsfehler auftritt, versuchen Sie die folgenden Befehle

```PowerShell
# Im Verzeichnis ~/IMU_ROS2 ausführen
source install/setup.bash

# Portnummer-Problem
sudo chmod 666 /dev/imu-serial
```





