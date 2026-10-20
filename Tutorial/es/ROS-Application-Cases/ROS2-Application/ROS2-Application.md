# Aplicación ROS2

**Configuración del sistema: ubuntu22\.04**

**Versión de ROS2: humble**

### Configuración del entorno ROS2

1. **Actualizar la fuente de descarga**

```PowerShell
sudo apt update
```

2. **Introducir el comando de descarga de ros2**

```PowerShell
wget http://fishros.com/install -O fishros && . fishros
```

### Conexión del dispositivo a la máquina virtual

1. **Consultar el dispositivo**

```PowerShell
ll /dev/ttyUSB*
```

2. **Establecer la asignación de puertos**

```PowerShell
sudo gedit /etc/udev/rules.d/99-serial-imu.rules
```

3. **Rellenar el contenido del archivo de asignación**

```PowerShell
KERNEL=="ttyUSB*", ATTRS{idVendor}=="1a86", ATTRS{idProduct}=="7523", MODE:="0777", SYMLINK+="imu-serial"
```

4. **Guardar y salir; ejecutar el comando para que la regla surta efecto**

```PowerShell
sudo udevadm trigger
sudo service udev reload
sudo service udev restart
```

5. **Verificar**

```PowerShell
ll /dev/imu-serial
```

### Importar el paquete comprimido preparado

1. **En el directorio del mismo nivel de Feishu se encuentra**[IMU\_ROS2\.zip](https://juxitech.feishu.cn/wiki/ZL8XwrPriifnASk41AhcoPj1nnb)

2. **Transferirlo a la máquina virtual mediante el software de transferencia de archivos**

3. **Instalar la biblioteca IMU\_Library**

```PowerShell
# Tras descargar y descomprimir el archivo comprimido IMU_ROS2, entrar en el directorio IMU_Library y ejecutar setup.py
cd IMU_ROS2/IMU_Library

# Instalar la biblioteca y sus dependencias
pip install -e .

# O instalar usando setup.py
python setup.py install
```

### Instalación de bibliotecas relacionadas con python

```PowerShell
sudo pip3 install pyserial
sudo pip3 install smbus2
```

### Compilar el proyecto ROS2

1. **Volver al directorio \~/IMU\_ROS2**

```PowerShell
cd IMU_ROS2
colcon build --symlink-install
```

1. **Escribir el directorio de trabajo \~/IMU\_ROS2 en las variables de entorno**

```PowerShell
# Editar ~/.bashrc
sudo gedit ~/.bashrc

# Añadir el siguiente comando al final
source ~/IMU_ROS2/install/setup.bash
```

Tras compilar correctamente, ejecute el siguiente comando para comprobar si hay archivos ejecutables en el paquete imu\_ros2

`ros2 pkg executables imu_ros2`

### Iniciar el nodo ROS2

```PowerShell
source install/setup.bash
ros2 run imu_ros2 imu_publisher
```

### Impresión de datos de la IMU

1. **Abrir un nuevo terminal y consultar el topic de la imu**

```PowerShell
ros2 topic list
```

2. **Imprimir los datos del topic /imu/data**

```PowerShell
ros2 topic echo /imu/data
```

3. **Abrir un nuevo terminal y consultar el topic msg**

```PowerShell
ros2 topic echo /imu/mag
```

### Visualización en RViz2

1. **Ejecutar el comando para abrir la interfaz de visualización de rviz**

```PowerShell
ros2 launch imu_ros2 imu_visualization.launch.py
```

### Preguntas frecuentes

1. Si al iniciar el nodo aparece un fallo de apertura, pruebe las siguientes instrucciones

```PowerShell
# Ejecutar en el directorio ~/IMU_ROS2
source install/setup.bash

# Problema del número de puerto
sudo chmod 666 /dev/imu-serial
```





