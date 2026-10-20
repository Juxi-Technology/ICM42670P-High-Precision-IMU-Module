# Serie RDK

## 1\.Conexión del dispositivo

Este tutorial toma como ejemplo la imagen de la versión？ de la placa RDK X5.

Conecte el sensor de actitud IMU a la interfaz I2C de la RDK X5 según se muestra en la figura siguiente.

![RDK IIC通讯\.jpg](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/RDK-Series/Images/rdk-iic-communication.jpg)

![RDK X5 针脚图\.jpg](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/RDK-Series/Images/rdk-x5-pinout.jpg)

## 2\.Consulta del estado del dispositivo

Consultar el dispositivo I2C

```PowerShell
python3 /app/40pin_samples/test_i2c.py
```

![image\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/RDK-Series/Images/image.png)

## 3\.Instalación de la biblioteca de controladores

3\.1**Instalar las bibliotecas de python necesarias para el código**

```PowerShell
sudo apt update
sudo apt install -y python3-serial
sudo apt install -y python3-smbus2
```

3\.2Transferir archivos

[IMU\_ROS2\.zip](/downloads/IMU_ROS2.zip)

Si aún no sabe cómo usar MobaXterm para transferir archivos, consulte la siguiente página web con el método detallado de instalación y uso de MobaXterm: [Transferencia remota de archivos](https://juxitech.feishu.cn/wiki/KB0Jw2o6Wis9f0ksyeFceVmgnfd)

Arrastre los archivos descomprimidos a la Raspberry Pi 5 mediante el software MobaXterm.

![截图\_20260203182313\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/RDK-Series/Images/screenshot-20260203182313.png)

## 4\.Consulta de los datos de la imu

**Entre en el directorio \~/IMU\_Library y ejecute el archivo IMU\_Serial\_Library\.py**

```PowerShell
cd ~/imu_ros1/src/IMU_ROS1/IMU_Library
# O
cd ~/imu_ros2/src/IMU_ROS2/IMU_Library

# Ejecutar el archivo de impresión de datos del IMU
python3 -m IMU_Library.IMU_I2C_Library
```

![截图\_20260203175633\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/RDK-Series/Images/screenshot-20260203175633.png)

Nota: lo anterior corresponde a la lectura de datos de una IMU de 10 ejes; la de 6 ejes no dispone de datos de magnetómetro (Magnetometer) ni de barómetro (Barometer), y la de 9 ejes no dispone de datos de barómetro (Barometer).

## **5\.Calibración de la IMU**

**Entre en el directorio \~/IMU\_Library y ejecute el archivo imu\_calibration\_tool\.py**

```PowerShell
cd ~/IMU_Library

# Ejecutar el archivo de código de calibración del IMU --calibración de comunicación I2C
# Ejecutar todas las calibraciones (completa, magnetómetro, temperatura)
python3 -m IMU_Library.imu_calibration_tool --mode i2c --port 0

# Solo calibración completa
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 0 --calibrate imu

# Solo calibración del magnetómetro
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 0 --calibrate mag

# Solo calibración de temperatura
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 0 --calibrate temp
```

![截图\_20260203174958\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/RDK-Series/Images/screenshot-20260203174958.png)

## 6\.Notas

Al usar la placa RDK X5, es necesario modificar el número del bus I2C según la situación real; la posición de la modificación se muestra en la figura siguiente. Normalmente es el bus número 0.

![截图\_20260203191332\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/RDK-Series/Images/screenshot-20260203191332.png)

![截图\_20260203191406\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/RDK-Series/Images/screenshot-20260203191406.png)



