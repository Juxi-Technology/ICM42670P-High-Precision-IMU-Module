# Série RDK

## 1\.Connexion des appareils

Ce tutoriel prend comme exemple l'image de la version ? de la carte mère RDK X5.

Connectez le capteur d'attitude IMU à l'interface I2C du RDK X5 comme indiqué dans la figure ci-dessous.

![RDK IIC通讯\.jpg](../../../../en/多主控通讯案例/IIC通讯/RDK系列/图片和附件/RDK%20IIC通讯.jpg)

![RDK X5 针脚图\.jpg](../../../../en/多主控通讯案例/IIC通讯/RDK系列/图片和附件/RDK%20X5%20针脚图.jpg)

## 2\.Vérification de l'état de l'appareil

Vérifier les appareils I2C

```PowerShell
python3 /app/40pin_samples/test_i2c.py
```

![image\.png](../../../../en/多主控通讯案例/IIC通讯/RDK系列/图片和附件/image.png)

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

![截图\_20260203182313\.png](../../../../en/多主控通讯案例/IIC通讯/RDK系列/图片和附件/截图_20260203182313.png)

## 4\.Consultation des données IMU

**Entrez dans le répertoire \~/IMU\_Library, exécutez le fichier IMU\_Serial\_Library\.py**

```PowerShell
cd ~/imu_ros1/src/IMU_ROS1/IMU_Library
# ou
cd ~/imu_ros2/src/IMU_ROS2/IMU_Library

# Exécuter le fichier d'affichage des données IMU
python3 -m IMU_Library.IMU_I2C_Library
```

![截图\_20260203175633\.png](../../../../en/多主控通讯案例/IIC通讯/RDK系列/图片和附件/截图_20260203175633.png)

Remarque : ce qui précède correspond à la lecture des données d'un IMU 10 axes ; le 6 axes n'a pas de données de magnétomètre (Magnetometer) ni de baromètre (Barometer), le 9 axes n'a pas de données de baromètre (Barometer).

## **5\.Calibrage de l'IMU**

**Entrez dans le répertoire \~/IMU\_Library, exécutez le fichier imu\_calibration\_tool\.py**

```PowerShell
cd ~/IMU_Library

# Exécuter le fichier de calibration IMU --calibration de communication I2C
# Effectuer toutes les calibrations (globale, magnétomètre, température)
python3 -m IMU_Library.imu_calibration_tool --mode i2c --port 0

# Calibration globale uniquement
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 0 --calibrate imu

# Calibration du magnétomètre uniquement
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 0 --calibrate mag

# Calibration de température uniquement
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 0 --calibrate temp
```

![截图\_20260203174958\.png](../../../../en/多主控通讯案例/IIC通讯/RDK系列/图片和附件/截图_20260203174958.png)

## 6\.Points d'attention

Lors de l'utilisation de la carte mère RDK X5, il est nécessaire de modifier le numéro du bus I2C en fonction de la situation réelle ; l'emplacement à modifier est indiqué dans la figure ci-dessous. Il s'agit généralement du bus numéro 0.

![截图\_20260203191332\.png](../../../../en/多主控通讯案例/IIC通讯/RDK系列/图片和附件/截图_20260203191332.png)

![截图\_20260203191406\.png](../../../../en/多主控通讯案例/IIC通讯/RDK系列/图片和附件/截图_20260203191406.png)



