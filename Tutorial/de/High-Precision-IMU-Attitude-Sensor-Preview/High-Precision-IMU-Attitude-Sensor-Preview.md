# Vorschau auf die Verwendung des hochpräzisen IMU-Lagesensors

### Laden Sie das Archiv [IMU\_ROS1\.zip](https://juxitech.feishu.cn/wiki/BcWGwW2yDiXex9k6qjTcleTvnPb) oder [IMU\_ROS2\.zip](https://juxitech.feishu.cn/wiki/ZL8XwrPriifnASk41AhcoPj1nnb) herunter, und wechseln Sie nach dem Entpacken in \~/IMU\_Library

1. **Installation der für den Code erforderlichen Python-Bibliotheken**

```PowerShell
pip install pyserial
pip install smbus2
```

2. **Installation der Bibliothek IMU\_Library**

```PowerShell
# Bibliothek und ihre Abhängigkeiten installieren
pip install -e .

# oder mit setup.py installieren
python setup.py install
```

3. **Einrichten der Portzuordnung**

```PowerShell
# Um eine Portänderung nach dem Ein- und Ausstecken zu verhindern, bitte das Port-Mapping einstellen
sudo gedit /etc/udev/rules.d/99-serial-imu.rules

# Falls eine Meldung erscheint, dass der Befehl gedit nicht vorhanden ist, zuerst herunterladen und installieren
sudo apt install gedit

# Mapping-Inhalt ausfüllen
KERNEL=="ttyUSB*", ATTRS{idVendor}=="1a86", ATTRS{idProduct}=="7523", MODE:="0777", SYMLINK+="imu-serial"

# Parameterbeschreibung:
`--mode`: 通信模式，可选值为`serial`(串口)或`i2c`
`--port`: 串口名(如`/dev/ttyUSB0`)或I2C端口号(如`7`)
`--rate`: 数据打印频率(Hz)，默认10Hz
`--debug`: 启用调试模式，显示详细信息

# Speichern und beenden, dann Befehl ausführen, damit die Regel wirksam wird
sudo udevadm trigger
sudo service udev reload
sudo service udev restart

# Überprüfen
ll /dev/imu-serial

# Ausgabebeispiel:
lrwxrwxrwx 1 root root 7 1月 22 10:00 /dev/imu-serial -> ttyUSB0
```

### Serielle Kommunikation

1. **Wechseln Sie in das Verzeichnis \~/IMU\_Library/IMU\_Library und führen Sie die Datei IMU\_Serial\_Library\.py aus**

```PowerShell
cd ~/imu_ros1/src/IMU_ROS1/IMU_Library/IMU_Library 
# oder
cd ~/imu_ros2/src/IMU_ROS2/IMU_Library/IMU_Library

# IMU-Datenausgabedatei ausführen
python3 IMU_Serial_Library.py
```

### I2C-Kommunikation

1. **Wechseln Sie in das Verzeichnis \~/IMU\_Library/IMU\_Library und führen Sie die Datei IMU\_I2C\_Library\.py aus**

```PowerShell
cd ~/IMU_Library/IMU_Library

# IMU-Datenausgabedatei ausführen
python3 IMU_I2C_Library.py
```

### IMU-Kalibrierung

1. **Wechseln Sie in das Verzeichnis \~/IMU\_Library/IMU\_Library und führen Sie die Datei imu\_calibration\_tool\.py aus**

```PowerShell
cd ~/IMU_Library/IMU_Library

# IMU-Kalibrierungsdatei ausführen --Kalibrierung der seriellen Kommunikation
# Alle Kalibrierungen durchführen (Gesamt, Magnetometer, Temperatur)
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial

# Nur Gesamtkalibrierung
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial --calibrate imu

# Nur Magnetometer-Kalibrierung
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial --calibrate mag

# Nur Temperaturkalibrierung
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial --calibrate temp

# IMU-Kalibrierungsdatei ausführen --I2C-Kommunikationskalibrierung
# Alle Kalibrierungen durchführen (Gesamt, Magnetometer, Temperatur)
python3 imu_calibration_tool.py --mode i2c --port 1

# Nur Gesamtkalibrierung
python3 imu_calibration_tool.py --mode i2c --port 1 --calibrate imu

# Nur Magnetometer-Kalibrierung
python3 imu_calibration_tool.py --mode i2c --port 1 --calibrate mag

# Nur Temperaturkalibrierung
python3 imu_calibration_tool.py --mode i2c --port 1 --calibrate temp
```



