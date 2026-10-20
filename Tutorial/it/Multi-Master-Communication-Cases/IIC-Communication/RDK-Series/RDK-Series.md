# Serie RDK

## 1\.Collegamento del dispositivo

Questo tutorial prende come esempio l'immagine della versione？ della scheda RDK X5.

Collegare il sensore di assetto IMU all'interfaccia I2C della RDK X5 come mostrato nella figura seguente.

![RDK IIC通讯\.jpg](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/RDK-Series/Images/rdk-iic-communication.jpg)

![RDK X5 针脚图\.jpg](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/RDK-Series/Images/rdk-x5-pinout.jpg)

## 2\.Visualizzazione dello stato del dispositivo

Visualizzare il dispositivo I2C

```PowerShell
python3 /app/40pin_samples/test_i2c.py
```

![image\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/RDK-Series/Images/image.png)

## 3\.Installazione della libreria di driver

3\.1**Installare le librerie python necessarie per il codice**

```PowerShell
sudo apt update
sudo apt install -y python3-serial
sudo apt install -y python3-smbus2
```

3\.2Trasferire i file

[IMU\_ROS2\.zip](/downloads/IMU_ROS2.zip)

Se non si sa ancora come usare MobaXterm per trasferire file, consultare la seguente pagina web con il metodo dettagliato di installazione e utilizzo di MobaXterm: [Trasferimento remoto di file](https://juxitech.feishu.cn/wiki/KB0Jw2o6Wis9f0ksyeFceVmgnfd)

Trascinare i file decompressi sulla Raspberry Pi 5 tramite il software MobaXterm.

![截图\_20260203182313\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/RDK-Series/Images/screenshot-20260203182313.png)

## 4\.Visualizzazione dei dati della imu

**Entrare nella directory \~/IMU\_Library ed eseguire il file IMU\_Serial\_Library\.py**

```PowerShell
cd ~/imu_ros1/src/IMU_ROS1/IMU_Library
# Oppure
cd ~/imu_ros2/src/IMU_ROS2/IMU_Library

# Eseguire il file di stampa dei dati dell'IMU
python3 -m IMU_Library.IMU_I2C_Library
```

![截图\_20260203175633\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/RDK-Series/Images/screenshot-20260203175633.png)

Nota: quanto sopra corrisponde alla lettura dei dati di una IMU a 10 assi; quella a 6 assi non dispone dei dati del magnetometro (Magnetometer) e del barometro (Barometer), mentre quella a 9 assi non dispone dei dati del barometro (Barometer).

## **5\.Calibrazione della IMU**

**Entrare nella directory \~/IMU\_Library ed eseguire il file imu\_calibration\_tool\.py**

```PowerShell
cd ~/IMU_Library

# Eseguire il file di codice di calibrazione dell'IMU --calibrazione della comunicazione I2C
# Eseguire tutte le calibrazioni (completa, magnetometro, temperatura)
python3 -m IMU_Library.imu_calibration_tool --mode i2c --port 0

# Solo calibrazione completa
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 0 --calibrate imu

# Solo calibrazione del magnetometro
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 0 --calibrate mag

# Solo calibrazione della temperatura
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 0 --calibrate temp
```

![截图\_20260203174958\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/RDK-Series/Images/screenshot-20260203174958.png)

## 6\.Note

Quando si utilizza la scheda RDK X5, è necessario modificare il numero del bus I2C in base alla situazione effettiva; la posizione della modifica è mostrata nella figura seguente. Di norma è il bus numero 0.

![截图\_20260203191332\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/RDK-Series/Images/screenshot-20260203191332.png)

![截图\_20260203191406\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/RDK-Series/Images/screenshot-20260203191406.png)



