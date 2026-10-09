# Serie Jetson

## 1\.Collegamento del dispositivo

Questo tutorial prende come esempio la scheda Jetson Orin NX.

Collegare il sensore di assetto IMU all'interfaccia I2C della Jetson Orin NX come mostrato nella figura seguente.

![Jetson orin IIC通讯\.jpg](../../../../en/多主控通讯案例/IIC通讯/Jetson系列/图片和附件/Jetson%20orin%20IIC通讯.jpg)

![image\.png](../../../../en/多主控通讯案例/IIC通讯/Jetson系列/图片和附件/image.png)

## 2\.Visualizzazione dello stato del dispositivo

Per prima cosa installare I2Ctool; digitare nel terminale:

```PowerShell
sudo apt-get update
sudo apt-get install -y i2c-tools
```

Visualizzare il dispositivo I2C

```PowerShell
sudo i2cdetect -y -r -a 7
```

![Screenshot from 2026\-02\-05 11\-09\-35\.png](../../../../en/多主控通讯案例/IIC通讯/Jetson系列/图片和附件/Screenshot%20from%202026-02-05%2011-09-35.png)

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

![截图\_20260203182313\.png](../../../../en/多主控通讯案例/IIC通讯/Jetson系列/图片和附件/截图_20260203182313.png)

## 4\.Visualizzazione dei dati della imu

**Entrare nella directory \~/IMU\_Library ed eseguire il file IMU\_Serial\_Library\.py**

```PowerShell
cd ~/imu_ros2/src/IMU_ROS2/IMU_Library

# Eseguire il file di stampa dei dati dell'IMU
python3 -m IMU_Library.IMU_I2C_Library
```

![Screenshot from 2026\-02\-05 11\-07\-24\.png](../../../../en/多主控通讯案例/IIC通讯/Jetson系列/图片和附件/Screenshot%20from%202026-02-05%2011-07-24.png)

Nota: quanto sopra corrisponde alla lettura dei dati di una IMU a 10 assi; quella a 6 assi non dispone dei dati del magnetometro (Magnetometer) e del barometro (Barometer), mentre quella a 9 assi non dispone dei dati del barometro (Barometer).

## **5\.Calibrazione della IMU**

**Entrare nella directory \~/IMU\_Library ed eseguire il file imu\_calibration\_tool\.py**

```PowerShell
cd ~/IMU_Library

# Eseguire il file di codice di calibrazione dell'IMU --calibrazione della comunicazione I2C
# Eseguire tutte le calibrazioni (completa, magnetometro, temperatura)
python3 -m IMU_Library.imu_calibration_tool --mode i2c --port 7

# Solo calibrazione completa
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 7 --calibrate imu

# Solo calibrazione del magnetometro
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 7 --calibrate mag

# Solo calibrazione della temperatura
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 7 --calibrate temp
```

![Screenshot from 2026\-02\-05 11\-08\-46\.png](../../../../en/多主控通讯案例/IIC通讯/Jetson系列/图片和附件/Screenshot%20from%202026-02-05%2011-08-46.png)

## 6\.Note

Quando si utilizza la scheda della serie orin, è necessario modificare il numero del bus I2C in base alla situazione effettiva; la posizione della modifica è mostrata nella figura seguente. Di norma è il bus numero 7.

![截图\_20260203191332\.png](../../../../en/多主控通讯案例/IIC通讯/Jetson系列/图片和附件/截图_20260203191332.png)

![截图\_20260203191406\.png](../../../../en/多主控通讯案例/IIC通讯/Jetson系列/图片和附件/截图_20260203191406.png)



