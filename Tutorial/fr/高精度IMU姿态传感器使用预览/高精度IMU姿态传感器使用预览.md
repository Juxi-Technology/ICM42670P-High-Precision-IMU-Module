# Aperçu de l'utilisation du capteur d'attitude IMU haute précision

### Téléchargez l'archive [IMU\_ROS1\.zip](https://juxitech.feishu.cn/wiki/BcWGwW2yDiXex9k6qjTcleTvnPb) ou [IMU\_ROS2\.zip](https://juxitech.feishu.cn/wiki/ZL8XwrPriifnASk41AhcoPj1nnb), décompressez-la puis entrez dans \~/IMU\_Library

1. **Installer les bibliothèques python requises par le code**

```PowerShell
pip install pyserial
pip install smbus2
```

2. **Installer la bibliothèque IMU\_Library**

```PowerShell
# Installer la bibliothèque et ses dépendances
pip install -e .

# ou installer avec setup.py
python setup.py install
```

3. **Configurer le mappage de port**

```PowerShell
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

### Communication série

1. **Entrez dans le répertoire \~/IMU\_Library/IMU\_Library et exécutez le fichier IMU\_Serial\_Library\.py**

```PowerShell
cd ~/imu_ros1/src/IMU_ROS1/IMU_Library/IMU_Library 
# ou
cd ~/imu_ros2/src/IMU_ROS2/IMU_Library/IMU_Library

# Exécuter le fichier d'affichage des données IMU
python3 IMU_Serial_Library.py
```

### Communication I2C

1. **Entrez dans le répertoire \~/IMU\_Library/IMU\_Library et exécutez le fichier IMU\_I2C\_Library\.py**

```PowerShell
cd ~/IMU_Library/IMU_Library

# Exécuter le fichier d'affichage des données IMU
python3 IMU_I2C_Library.py
```

### Calibration de l'IMU

1. **Entrez dans le répertoire \~/IMU\_Library/IMU\_Library et exécutez le fichier imu\_calibration\_tool\.py**

```PowerShell
cd ~/IMU_Library/IMU_Library

# Exécuter le fichier de calibration IMU --calibration de communication série
# Effectuer toutes les calibrations (globale, magnétomètre, température)
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial

# Calibration globale uniquement
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial --calibrate imu

# Calibration du magnétomètre uniquement
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial --calibrate mag

# Calibration de température uniquement
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial --calibrate temp

# Exécuter le fichier de calibration IMU --calibration de communication I2C
# Effectuer toutes les calibrations (globale, magnétomètre, température)
python3 imu_calibration_tool.py --mode i2c --port 1

# Calibration globale uniquement
python3 imu_calibration_tool.py --mode i2c --port 1 --calibrate imu

# Calibration du magnétomètre uniquement
python3 imu_calibration_tool.py --mode i2c --port 1 --calibrate mag

# Calibration de température uniquement
python3 imu_calibration_tool.py --mode i2c --port 1 --calibrate temp
```



