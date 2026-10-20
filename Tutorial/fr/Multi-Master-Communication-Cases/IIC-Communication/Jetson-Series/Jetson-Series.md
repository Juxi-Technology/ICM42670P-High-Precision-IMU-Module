# Série Jetson

## 1\.Connexion des appareils

Ce tutoriel prend comme exemple la carte mère Jetson Orin NX.

Connectez le capteur d'attitude IMU à l'interface I2C du Jetson Orin NX comme indiqué dans la figure ci-dessous.

![Jetson orin IIC通讯\.jpg](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Jetson-Series/Images/jetson-orin-iic-communication.jpg)

![image\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Jetson-Series/Images/image.png)

## 2\.Vérification de l'état de l'appareil

Installez d'abord I2Ctool, saisissez dans le terminal :

```PowerShell
sudo apt-get update
sudo apt-get install -y i2c-tools
```

Vérifier les appareils I2C

```PowerShell
sudo i2cdetect -y -r -a 7
```

![Screenshot from 2026\-02\-05 11\-09\-35\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Jetson-Series/Images/Screenshot%20from%202026-02-05%2011-09-35.png)

## 3\.Installation de la bibliothèque de pilotes

3\.1**Installation des bibliothèques python nécessaires au code**

```PowerShell
sudo apt update
sudo apt install -y python3-serial
sudo apt install -y python3-smbus2
```

3\.2Transfert de fichiers

[IMU\_ROS2\.zip](/downloads/IMU_ROS2.zip)

Si vous ne savez pas encore utiliser MobaXterm pour transférer des fichiers, veuillez consulter la page web suivante pour l'installation détaillée et la méthode d'utilisation de MobaXterm : [Transfert de fichiers à distance](https://juxitech.feishu.cn/wiki/KB0Jw2o6Wis9f0ksyeFceVmgnfd)

À l'aide du logiciel MobaXterm, glissez les fichiers décompressés vers la Raspberry Pi 5.

![截图\_20260203182313\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Jetson-Series/Images/screenshot-20260203182313.png)

## 4\.Consultation des données IMU

**Entrez dans le répertoire \~/IMU\_Library, exécutez le fichier IMU\_Serial\_Library\.py**

```PowerShell
cd ~/imu_ros2/src/IMU_ROS2/IMU_Library

# Exécuter le fichier d'affichage des données IMU
python3 -m IMU_Library.IMU_I2C_Library
```

![Screenshot from 2026\-02\-05 11\-07\-24\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Jetson-Series/Images/Screenshot%20from%202026-02-05%2011-07-24.png)

Remarque : ce qui précède correspond à la lecture des données d'un IMU 10 axes ; le 6 axes n'a pas de données de magnétomètre (Magnetometer) ni de baromètre (Barometer), le 9 axes n'a pas de données de baromètre (Barometer).

## **5\.Calibrage de l'IMU**

**Entrez dans le répertoire \~/IMU\_Library, exécutez le fichier imu\_calibration\_tool\.py**

```PowerShell
cd ~/IMU_Library

# Exécuter le fichier de calibration IMU --calibration de communication I2C
# Effectuer toutes les calibrations (globale, magnétomètre, température)
python3 -m IMU_Library.imu_calibration_tool --mode i2c --port 7

# Calibration globale uniquement
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 7 --calibrate imu

# Calibration du magnétomètre uniquement
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 7 --calibrate mag

# Calibration de température uniquement
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 7 --calibrate temp
```

![Screenshot from 2026\-02\-05 11\-08\-46\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Jetson-Series/Images/Screenshot%20from%202026-02-05%2011-08-46.png)

## 6\.Points d'attention

Lors de l'utilisation d'une carte mère de la série orin, il est nécessaire de modifier le numéro du bus I2C en fonction de la situation réelle ; l'emplacement à modifier est indiqué dans la figure ci-dessous. Il s'agit généralement du bus numéro 7

![截图\_20260203191332\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Jetson-Series/Images/screenshot-20260203191332.png)

![截图\_20260203191406\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Jetson-Series/Images/screenshot-20260203191406.png)



