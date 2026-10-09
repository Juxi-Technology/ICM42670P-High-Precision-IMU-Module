# Aplicación ROS1

**Configuración del sistema: ubuntu20\.04**

**Versión de ROS1: noetic**

### Configuración del entorno ROS1

1. **Configurar la fuente de instalación de ROS1**

```PowerShell
sudo sh -c '. /etc/lsb-release && echo "deb http://mirrors.tuna.tsinghua.edu.cn/ros/ubuntu/ `lsb_release -cs` main" > /etc/apt/sources.list.d/ros-latest.list'
```

2. **Configurar la Key**

```PowerShell
sudo apt-key adv --keyserver 'hkp://keyserver.ubuntu.com:80' --recv-key C1CF6E31E6BADE8868B172B4F42ED6FBAB17C654
```

```Plain Text
sudo apt update
```

3. **Instalar ROS1 (descarga oficial)**

```PowerShell
sudo apt install ros-noetic-desktop-full
```

Descargar e instalar ROS1 con aceleración por proxy

wget http://fishros\.com/install \-O fishros \&\& \. fishros

4. **Configurar las variables de entorno**

```Plain Text
echo "source /opt/ros/noetic/setup.bash">> ~/.bashrc
```

```PowerShell
source ~/.bashrc
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
```

```Plain Text
sudo service udev reload
```

```Plain Text
sudo service udev restart
```

5. **Verificar**

```PowerShell
ll /dev/imu-serial
```

```Bash
sudo usermod -aG dialout ash
```

### Importar el paquete comprimido preparado

1. **En el directorio del mismo nivel de Feishu se encuentra**[IMU\_ROS1\.zip](https://juxitech.feishu.cn/wiki/BcWGwW2yDiXex9k6qjTcleTvnPb)

2. **Tras descomprimirlo, transfiéralo a la máquina virtual mediante el software de transferencia de archivos**

3. **Instalar la biblioteca IMU\_Library**

```PowerShell
cd IMU_ROS1
# Tras descargar y descomprimir el archivo comprimido IMU_ROS1, entrar en el directorio IMU_Library y ejecutar los siguientes comandos
cd IMU_Library

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

**Si aparecen problemas de renderizado, ejecute los siguientes comandos**

```PowerShell
sudo apt-get install ros-noetic-imu-filter-madgwick
sudo apt-get install ros-noetic-rviz-imu-plugin
```

### Compilar el proyecto ROS1

1. **Abrir un nuevo terminal en el directorio /home y crear un nuevo espacio de trabajo de ros1**

```PowerShell
mkdir imu_ros1
cd imu_ros1
mkdir src
cd src/
catkin_init_workspace
```

2. **Copiar la carpeta IMU\_ROS1 transferida al directorio \~/imu\_ros1/src/**

```PowerShell
# Copiar la carpeta IMU_ROS1 en el directorio src recién creado
cp -r ~/IMU_ROS1 ~/imu_ros1/src
cd ~/imu_ros1
catkin_make
```

3. **Escribir el directorio de trabajo \~/imu\_ros1 en las variables de entorno**

```PowerShell
# Editar ~/.bashrc
sudo gedit ~/.bashrc

# Añadir el siguiente comando al final
source ~/imu_ros1/devel/setup.bash

source ~/.bashrc
```

### Iniciar el nodo ROS1

1. **Abrir un terminal e introducir roscore para iniciar el nodo**

```PowerShell
# Iniciar roscore
roscore

# Abrir una nueva terminal, configurar el entorno e iniciar el nodo
source ~/imu_ros1/devel/setup.bash
```

2. **Añadir permisos de ejecución al script de Python (clave)**

Entre en el directorio `scripts` donde se encuentra el script y ejecute el comando `chmod +x` para conceder permisos de ejecución (`+x`, es decir, add execute, añadir permiso de ejecución):

```PowerShell
# Entrar en el directorio donde se encuentra imu_driver.py (según tu ruta real)
cd ~/imu_ros1/src/IMU_ROS1/scripts/ 

# Otorgar permiso de ejecución (solo es necesario ejecutarlo una vez, con efecto permanente)
chmod +x imu_driver.py
chmod +x mag_visualizer.py
```

Vuelva a la carpeta imu\_ros1 y ejecute imu\_driver\.py

```Plain Text
cd ~/imu_ros1
```

```Plain Text
rosrun IMU_ROS1 imu_driver.py
```

### Impresión de datos de la IMU

1. **Abrir un nuevo terminal y consultar el topic de la imu**

```PowerShell
# Ver todos los temas publicados actualmente
rostopic list
```

2. **Imprimir los datos del topic**

```PowerShell
# Imprimir los datos sin procesar del IMU
rostopic echo /imu/data_raw

# Imprimir los datos del magnetómetro
rostopic echo /imu/mag
```

### Visualización en RViz

1. **Ejecutar el comando para iniciar rviz\(\)**

```PowerShell
roslaunch IMU_ROS1 imu_display.launch
```

### Preguntas frecuentes

1. Si al iniciar el nodo aparece un fallo de apertura, pruebe las siguientes instrucciones

```PowerShell
# Ejecutar en el directorio ~/imu_ros1
source devel/setup.bash

# Problema del número de puerto
sudo chmod 666 /dev/imu-serial
```

2. En la visualización de RVIZ los tres ejes se muestran muy pequeños; vuelva a marcar Enable axes

![截图\_20260203101944\.png](../../../en/ROS应用案例/ROS1应用/图片和附件/截图_20260203101944.png)



