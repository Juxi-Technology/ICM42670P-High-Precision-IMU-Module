# Anteprima dell'uso del sensore di assetto IMU ad alta precisione

### Scaricare il pacchetto compresso [IMU\_ROS1\.zip](https://juxitech.feishu.cn/wiki/BcWGwW2yDiXex9k6qjTcleTvnPb) o [IMU\_ROS2\.zip](https://juxitech.feishu.cn/wiki/ZL8XwrPriifnASk41AhcoPj1nnb), dopo la decompressione entrare in \~/IMU\_Library

1. **Installare le librerie python necessarie per il codice**

```PowerShell
pip install pyserial
pip install smbus2
```

2. **Installare la libreria IMU\_Library**

```PowerShell
# Installare la libreria e le sue dipendenze
pip install -e .

# Oppure installare usando setup.py
python setup.py install
```

3. **Impostare la mappatura delle porte**

```PowerShell
# Per evitare che la porta cambi dopo il collegamento e lo scollegamento, impostare la mappatura delle porte
sudo gedit /etc/udev/rules.d/99-serial-imu.rules

# Se compare un messaggio che indica l'assenza del comando gedit, installarlo prima
sudo apt install gedit

# Compilare il contenuto della mappatura
KERNEL=="ttyUSB*", ATTRS{idVendor}=="1a86", ATTRS{idProduct}=="7523", MODE:="0777", SYMLINK+="imu-serial"

# Descrizione dei parametri:
`--mode`: 通信模式，可选值为`serial`(串口)或`i2c`
`--port`: 串口名(如`/dev/ttyUSB0`)或I2C端口号(如`7`)
`--rate`: 数据打印频率(Hz)，默认10Hz
`--debug`: 启用调试模式，显示详细信息

# Salvare e uscire, eseguire il comando per rendere effettive le regole
sudo udevadm trigger
sudo service udev reload
sudo service udev restart

# Verificare
ll /dev/imu-serial

# Esempio di output:
lrwxrwxrwx 1 root root 7 1月 22 10:00 /dev/imu-serial -> ttyUSB0
```

### Comunicazione seriale

1. **Entrare nella directory \~/IMU\_Library/IMU\_Library ed eseguire il file IMU\_Serial\_Library\.py**

```PowerShell
cd ~/imu_ros1/src/IMU_ROS1/IMU_Library/IMU_Library 
# Oppure
cd ~/imu_ros2/src/IMU_ROS2/IMU_Library/IMU_Library

# Eseguire il file di stampa dei dati dell'IMU
python3 IMU_Serial_Library.py
```

### Comunicazione I2C

1. **Entrare nella directory \~/IMU\_Library/IMU\_Library ed eseguire il file IMU\_I2C\_Library\.py**

```PowerShell
cd ~/IMU_Library/IMU_Library

# Eseguire il file di stampa dei dati dell'IMU
python3 IMU_I2C_Library.py
```

### Calibrazione della IMU

1. **Entrare nella directory \~/IMU\_Library/IMU\_Library ed eseguire il file imu\_calibration\_tool\.py**

```PowerShell
cd ~/IMU_Library/IMU_Library

# Eseguire il file di codice di calibrazione dell'IMU --calibrazione della comunicazione seriale
# Eseguire tutte le calibrazioni (completa, magnetometro, temperatura)
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial

# Solo calibrazione completa
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial --calibrate imu

# Solo calibrazione del magnetometro
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial --calibrate mag

# Solo calibrazione della temperatura
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial --calibrate temp

# Eseguire il file di codice di calibrazione dell'IMU --calibrazione della comunicazione I2C
# Eseguire tutte le calibrazioni (completa, magnetometro, temperatura)
python3 imu_calibration_tool.py --mode i2c --port 1

# Solo calibrazione completa
python3 imu_calibration_tool.py --mode i2c --port 1 --calibrate imu

# Solo calibrazione del magnetometro
python3 imu_calibration_tool.py --mode i2c --port 1 --calibrate mag

# Solo calibrazione della temperatura
python3 imu_calibration_tool.py --mode i2c --port 1 --calibrate temp
```



