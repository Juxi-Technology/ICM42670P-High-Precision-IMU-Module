# Raspberry Pi 5

## 1\.Collegamento del dispositivo

Questo tutorial prende come esempio la scheda Raspberry Pi 5 e l'immagine ufficiale a 64 bit.

Collegare il sensore di assetto IMU all'interfaccia I2C della Raspberry Pi 5 come mostrato nella figura seguente.

![树莓派5 IIC通讯\.jpg](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/raspberry-pi-5-iic-communication.jpg)

![image\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/image.png)

## 2\.Visualizzazione dello stato del dispositivo

Per prima cosa installare I2Ctool; digitare nel terminale:

```PowerShell
sudo apt-get update
sudo apt-get install -y i2c-tools
```

Visualizzare il dispositivo I2C

```PowerShell
sudo i2cdetect -y -r -a 1
```

![截图\_20260203181146\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/screenshot-20260203181146.png)

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

![截图\_20260203182313\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/screenshot-20260203182313.png)

## 4\.Visualizzazione dei dati della imu

**Entrare nella directory \~/IMU\_Library ed eseguire il file IMU\_Serial\_Library\.py**

```PowerShell
cd ~/imu_ros2/src/IMU_ROS1/IMU_Library

# Eseguire il file di stampa dei dati dell'IMU
python3 -m IMU_Library.IMU_I2C_Library
```

![截图\_20260203175633\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/screenshot-20260203175633.png)

Nota: quanto sopra corrisponde alla lettura dei dati di una IMU a 10 assi; quella a 6 assi non dispone dei dati del magnetometro (Magnetometer) e del barometro (Barometer), mentre quella a 9 assi non dispone dei dati del barometro (Barometer).

## **5\.Calibrazione della IMU**

**Entrare nella directory \~/IMU\_Library ed eseguire il file imu\_calibration\_tool\.py**

```PowerShell
cd ~/IMU_Library

# Eseguire il file di codice di calibrazione dell'IMU --calibrazione della comunicazione I2C
# Eseguire tutte le calibrazioni (completa, magnetometro, temperatura)
python3 -m IMU_Library.imu_calibration_tool --mode i2c --port 1

# Solo calibrazione completa
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 1 --calibrate imu

# Solo calibrazione del magnetometro
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 1 --calibrate mag

# Solo calibrazione della temperatura
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 1 --calibrate temp
```

![截图\_20260203174958\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/screenshot-20260203174958.png)

## 6\.Note

La Raspberry Pi 5 richiede di abilitare in anticipo il pin i2c.

L'operazione di abilitazione è la seguente:

Eseguire il comando nel terminale

```PowerShell
sudo raspi-config
```

Selezionare con le frecce direzionali della tastiera e, una volta selezionato, premere il tasto Enter per entrare

![截图\_20260203181325\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/screenshot-20260203181325.png)

Selezionare I2C e, una volta selezionato, premere il tasto Enter per entrare,

![截图\_20260203181405\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/screenshot-20260203181405.png)

Dopo aver selezionato I2C, premere il tasto Enter, usare le frecce direzionali per selezionare Yes e premere di nuovo Eneter per confermare.

![截图\_20260203181427\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/screenshot-20260203181427.png)

Premere il tasto Enter per confermare

![截图\_20260203181447\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/screenshot-20260203181447.png)

Usare le frecce direzionali per selezionare Finish, quindi premere Enter per uscire dalla configurazione.

![截图\_20260203181510\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/screenshot-20260203181510.png)



