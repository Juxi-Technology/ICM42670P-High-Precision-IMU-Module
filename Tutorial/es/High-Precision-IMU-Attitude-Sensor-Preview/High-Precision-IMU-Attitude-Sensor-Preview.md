# Vista previa del uso del sensor de actitud IMU de alta precisión

### Descargar el paquete comprimido [IMU\_ROS1\.zip](https://juxitech.feishu.cn/wiki/BcWGwW2yDiXex9k6qjTcleTvnPb) o [IMU\_ROS2\.zip](https://juxitech.feishu.cn/wiki/ZL8XwrPriifnASk41AhcoPj1nnb), tras descomprimirlo, entre en \~/IMU\_Library

1. **Instalar las bibliotecas de python necesarias para el código**

```PowerShell
pip install pyserial
pip install smbus2
```

2. **Instalar la biblioteca IMU\_Library**

```PowerShell
# Instalar la biblioteca y sus dependencias
pip install -e .

# O instalar usando setup.py
python setup.py install
```

3. **Configurar la asignación de puertos**

```PowerShell
# Para evitar que el puerto cambie tras conectarlo y desconectarlo, configure la asignación de puertos
sudo gedit /etc/udev/rules.d/99-serial-imu.rules

# Si aparece un mensaje de que no existe el comando gedit, instalarlo primero
sudo apt install gedit

# Rellenar el contenido de la asignación
KERNEL=="ttyUSB*", ATTRS{idVendor}=="1a86", ATTRS{idProduct}=="7523", MODE:="0777", SYMLINK+="imu-serial"

# Descripción de los parámetros:
`--mode`: 通信模式，可选值为`serial`(串口)或`i2c`
`--port`: 串口名(如`/dev/ttyUSB0`)或I2C端口号(如`7`)
`--rate`: 数据打印频率(Hz)，默认10Hz
`--debug`: 启用调试模式，显示详细信息

# Guardar y salir, ejecutar el comando para que las reglas surtan efecto
sudo udevadm trigger
sudo service udev reload
sudo service udev restart

# Verificar
ll /dev/imu-serial

# Ejemplo de salida:
lrwxrwxrwx 1 root root 7 1月 22 10:00 /dev/imu-serial -> ttyUSB0
```

### Comunicación por puerto serie

1. **Entre en el directorio \~/IMU\_Library/IMU\_Library y ejecute el archivo IMU\_Serial\_Library\.py**

```PowerShell
cd ~/imu_ros1/src/IMU_ROS1/IMU_Library/IMU_Library 
# O
cd ~/imu_ros2/src/IMU_ROS2/IMU_Library/IMU_Library

# Ejecutar el archivo de impresión de datos del IMU
python3 IMU_Serial_Library.py
```

### Comunicación I2C

1. **Entre en el directorio \~/IMU\_Library/IMU\_Library y ejecute el archivo IMU\_I2C\_Library\.py**

```PowerShell
cd ~/IMU_Library/IMU_Library

# Ejecutar el archivo de impresión de datos del IMU
python3 IMU_I2C_Library.py
```

### Calibración de la IMU

1. **Entre en el directorio \~/IMU\_Library/IMU\_Library y ejecute el archivo imu\_calibration\_tool\.py**

```PowerShell
cd ~/IMU_Library/IMU_Library

# Ejecutar el archivo de código de calibración del IMU --calibración de comunicación por puerto serie
# Ejecutar todas las calibraciones (completa, magnetómetro, temperatura)
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial

# Solo calibración completa
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial --calibrate imu

# Solo calibración del magnetómetro
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial --calibrate mag

# Solo calibración de temperatura
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial --calibrate temp

# Ejecutar el archivo de código de calibración del IMU --calibración de comunicación I2C
# Ejecutar todas las calibraciones (completa, magnetómetro, temperatura)
python3 imu_calibration_tool.py --mode i2c --port 1

# Solo calibración completa
python3 imu_calibration_tool.py --mode i2c --port 1 --calibrate imu

# Solo calibración del magnetómetro
python3 imu_calibration_tool.py --mode i2c --port 1 --calibrate mag

# Solo calibración de temperatura
python3 imu_calibration_tool.py --mode i2c --port 1 --calibrate temp
```



