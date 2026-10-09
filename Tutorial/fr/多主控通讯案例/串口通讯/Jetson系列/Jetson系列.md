# Série Jetson

## 1\. Connexion des appareils

Ce tutoriel prend comme exemple la carte mère Jetson orin nx.

Branchez le capteur d'attitude IMU sur le port USB de l'unité de contrôle principal à l'aide d'un câble type\-c.

![Jetson orin 串口通讯\.jpg](../../../../en/多主控通讯案例/串口通讯/Jetson系列/图片和附件/Jetson%20orin%20串口通讯.jpg)

## 2\. Vérification de l'état de l'appareil

Vérifier l'id de l'appareil

```PowerShell
lsusb
```

Vérifier le numéro de l'appareil

```PowerShell
ls -l /dev/ttyU*
```

![Screenshot from 2026\-02\-05 10\-18\-43\.png](../../../../en/多主控通讯案例/串口通讯/Jetson系列/图片和附件/Screenshot%20from%202026-02-05%2010-18-43.png)

Configurer le mappage des ports

```Bash
# Pour éviter un changement de port après branchement/débranchement, veuillez configurer le mappage de ports
sudo gedit /etc/udev/rules.d/99-serial-imu.rules

# Si un message indique que la commande gedit est absente, la télécharger et l'installer d'abord
sudo apt install gedit

# Remplir le contenu du mappage
KERNEL=="ttyUSB*", ATTRS{idVendor}=="1a86", ATTRS{idProduct}=="7523", MODE:="0777", SYMLINK+="imu-serial"

# Description des paramètres :
`--mode`: 通信模式，可选值为`serial`(串口)或`i2c`
`--port`: 串口名(如`/dev/ttyUSB0`)或I2C端口号(如`7`)
`--rate`: 数据打印频率(Hz)，默认10Hz
`--debug`: 启用调试模式，显示详细信息

# Enregistrer et quitter, puis exécuter la commande pour appliquer la règle
sudo udevadm trigger
sudo service udev reload
sudo service udev restart

# Vérifier
ll /dev/imu-serial

# Exemple de sortie :
lrwxrwxrwx 1 root root 7 1月 22 10:00 /dev/imu-serial -> ttyUSB0
```

## 3\. Installation de la bibliothèque de pilotes

**3\.1 Installation des bibliothèques Python requises par le code**

```PowerShell
sudo apt update
sudo apt install -y python3-serial
sudo apt install -y python3-smbus2
```

**3\.2 Transfert des fichiers**

[IMU\_ROS2\.zip](/downloads/IMU_ROS2.zip)

Si vous ne savez pas encore transférer des fichiers avec MobaXterm, veuillez consulter la page suivante qui détaille l'installation et l'utilisation de MobaXterm : [Transfert de fichiers à distance](https://juxitech.feishu.cn/wiki/KB0Jw2o6Wis9f0ksyeFceVmgnfd)

À l'aide du logiciel MobaXterm, glissez les fichiers décompressés sur le Jetson.

![截图\_20260203182313\.png](../../../../en/多主控通讯案例/串口通讯/Jetson系列/图片和附件/截图_20260203182313.png)

## 4\. Consultation des données imu

**Entrez dans le répertoire \~/IMU\_Library et exécutez le fichier IMU\_Serial\_Library\.py**

```PowerShell
cd ~/IMU_ROS2/IMU_Library

# Exécuter le fichier d'affichage des données IMU
python3 -m IMU_Library.IMU_Serial_Library
```

![image\.png](../../../../en/多主控通讯案例/串口通讯/Jetson系列/图片和附件/image%201.png)

Remarque : ce qui précède correspond à la lecture des données d'un IMU 10 axes, les modèles 6 axes n'ont pas de données de magnétomètre (Magnetometer) ni de baromètre (Barometer), les modèles 9 axes n'ont pas de données de baromètre (Barometer).

## **5\. Calibration de l'IMU**

**Entrez dans le répertoire \~/IMU\_Library et exécutez le fichier imu\_calibration\_tool\.py**

```PowerShell
cd ~/IMU_Library

# Exécuter le fichier de calibration IMU --calibration de communication série
# Effectuer toutes les calibrations (globale, magnétomètre, température)
python3 -m IMU_Library.imu_calibration_tool --mode serial --port /dev/imu-serial

# Calibration globale uniquement
python3 -m IMU_Library.imu_calibration_tool --mode serial --port /dev/imu-serial --calibrate imu

# Calibration du magnétomètre uniquement
python3 -m IMU_Library.imu_calibration_tool --mode serial --port /dev/imu-serial --calibrate mag

# Calibration de température uniquement
python3 -m IMU_Library.imu_calibration_tool --mode serial --port /dev/imu-serial --calibrate temp
```

![image\.png](../../../../en/多主控通讯案例/串口通讯/Jetson系列/图片和附件/image.png)

## 6\. Remarques

Si l'ID de l'appareil est détecté mais que le numéro de l'appareil ne l'est pas, vous pouvez vous référer aux commandes ci-dessous pour installer le pilote ch34x

```PowerShell
sudo apt remove brltty
git clone https://github.com/clhchan/CH341SER.git
cd CH341SER
make -j6
sudo make install
sudo modprobe ch34x
```



