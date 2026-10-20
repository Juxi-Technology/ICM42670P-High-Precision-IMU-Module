# RDK-Serie

## 1\.Gerät anschließen

Dieses Tutorial verwendet das Mainboard RDK X5 mit dem Image der Version ? als Beispiel.

Verbinden Sie den IMU-Lagesensor wie in der folgenden Abbildung gezeigt mit der I2C-Schnittstelle des RDK X5.

![RDK IIC通讯\.jpg](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/RDK-Series/Images/rdk-iic-communication.jpg)

![RDK X5 针脚图\.jpg](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/RDK-Series/Images/rdk-x5-pinout.jpg)

## 2\.Gerätestatus anzeigen

I2C-Gerät anzeigen

```PowerShell
python3 /app/40pin_samples/test_i2c.py
```

![image\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/RDK-Series/Images/image.png)

## 3\.Treiberbibliothek installieren

3\.1**Installation der für den Code erforderlichen Python-Bibliotheken**

```PowerShell
sudo apt update
sudo apt install -y python3-serial
sudo apt install -y python3-smbus2
```

3\.2Übertragen der Dateien

[IMU\_ROS2\.zip](/downloads/IMU_ROS2.zip)

Wenn Sie noch nicht wissen, wie Sie mit MobaXterm Dateien übertragen, sehen Sie sich bitte die folgende Webseite mit der ausführlichen Installation und Bedienung von MobaXterm an: [Datei-Fernübertragung](https://juxitech.feishu.cn/wiki/KB0Jw2o6Wis9f0ksyeFceVmgnfd)

Ziehen Sie die entpackten Dateien mit der MobaXterm-Software auf den Raspberry Pi 5.

![截图\_20260203182313\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/RDK-Series/Images/screenshot-20260203182313.png)

## 4\.IMU-Daten anzeigen

**Wechseln Sie in das Verzeichnis \~/IMU\_Library und führen Sie die Datei IMU\_Serial\_Library\.py aus**

```PowerShell
cd ~/imu_ros1/src/IMU_ROS1/IMU_Library
# oder
cd ~/imu_ros2/src/IMU_ROS2/IMU_Library

# IMU-Datenausgabedatei ausführen
python3 -m IMU_Library.IMU_I2C_Library
```

![截图\_20260203175633\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/RDK-Series/Images/screenshot-20260203175633.png)

Hinweis: Das Obige ist das Auslesen der Daten eines 10-Achsen-IMU. Die 6-Achsen-Version hat keine Daten des Magnetometers (Magnetometer) und des Barometers (Barometer), die 9-Achsen-Version hat keine Barometer-Daten (Barometer).

## **5\.IMU-Kalibrierung**

**Wechseln Sie in das Verzeichnis \~/IMU\_Library und führen Sie die Datei imu\_calibration\_tool\.py aus**

```PowerShell
cd ~/IMU_Library

# IMU-Kalibrierungsdatei ausführen --I2C-Kommunikationskalibrierung
# Alle Kalibrierungen durchführen (Gesamt, Magnetometer, Temperatur)
python3 -m IMU_Library.imu_calibration_tool --mode i2c --port 0

# Nur Gesamtkalibrierung
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 0 --calibrate imu

# Nur Magnetometer-Kalibrierung
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 0 --calibrate mag

# Nur Temperaturkalibrierung
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 0 --calibrate temp
```

![截图\_20260203174958\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/RDK-Series/Images/screenshot-20260203174958.png)

## 6\.Hinweise

Bei der Verwendung des Mainboards RDK X5 müssen Sie die Nummer des I2C-Busses je nach tatsächlicher Situation anpassen, die Änderungsstelle ist in der folgenden Abbildung dargestellt. Normalerweise ist es Bus Nummer 0.

![截图\_20260203191332\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/RDK-Series/Images/screenshot-20260203191332.png)

![截图\_20260203191406\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/RDK-Series/Images/screenshot-20260203191406.png)



