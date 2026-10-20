# Jetson-Serie

## 1\.Gerät anschließen

Dieses Tutorial verwendet das Mainboard Jetson Orin NX als Beispiel.

Verbinden Sie den IMU-Lagesensor wie in der folgenden Abbildung gezeigt mit der I2C-Schnittstelle des Jetson Orin NX.

![Jetson orin IIC通讯\.jpg](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Jetson-Series/Images/jetson-orin-iic-communication.jpg)

![image\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Jetson-Series/Images/image.png)

## 2\.Gerätestatus anzeigen

Installieren Sie zunächst I2Ctool, geben Sie im Terminal ein:

```PowerShell
sudo apt-get update
sudo apt-get install -y i2c-tools
```

I2C-Gerät anzeigen

```PowerShell
sudo i2cdetect -y -r -a 7
```

![Screenshot from 2026\-02\-05 11\-09\-35\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Jetson-Series/Images/Screenshot%20from%202026-02-05%2011-09-35.png)

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

![截图\_20260203182313\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Jetson-Series/Images/screenshot-20260203182313.png)

## 4\.IMU-Daten anzeigen

**Wechseln Sie in das Verzeichnis \~/IMU\_Library und führen Sie die Datei IMU\_Serial\_Library\.py aus**

```PowerShell
cd ~/imu_ros2/src/IMU_ROS2/IMU_Library

# IMU-Datenausgabedatei ausführen
python3 -m IMU_Library.IMU_I2C_Library
```

![Screenshot from 2026\-02\-05 11\-07\-24\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Jetson-Series/Images/Screenshot%20from%202026-02-05%2011-07-24.png)

Hinweis: Das Obige ist das Auslesen der Daten eines 10-Achsen-IMU. Die 6-Achsen-Version hat keine Daten des Magnetometers (Magnetometer) und des Barometers (Barometer), die 9-Achsen-Version hat keine Barometer-Daten (Barometer).

## **5\.IMU-Kalibrierung**

**Wechseln Sie in das Verzeichnis \~/IMU\_Library und führen Sie die Datei imu\_calibration\_tool\.py aus**

```PowerShell
cd ~/IMU_Library

# IMU-Kalibrierungsdatei ausführen --I2C-Kommunikationskalibrierung
# Alle Kalibrierungen durchführen (Gesamt, Magnetometer, Temperatur)
python3 -m IMU_Library.imu_calibration_tool --mode i2c --port 7

# Nur Gesamtkalibrierung
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 7 --calibrate imu

# Nur Magnetometer-Kalibrierung
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 7 --calibrate mag

# Nur Temperaturkalibrierung
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 7 --calibrate temp
```

![Screenshot from 2026\-02\-05 11\-08\-46\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Jetson-Series/Images/Screenshot%20from%202026-02-05%2011-08-46.png)

## 6\.Hinweise

Bei der Verwendung eines Mainboards der Orin-Serie müssen Sie die Nummer des I2C-Busses je nach tatsächlicher Situation anpassen, die Änderungsstelle ist in der folgenden Abbildung dargestellt. Normalerweise ist es Bus Nummer 7

![截图\_20260203191332\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Jetson-Series/Images/screenshot-20260203191332.png)

![截图\_20260203191406\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Jetson-Series/Images/screenshot-20260203191406.png)



