# Applicazione ROS2

**Configurazione del sistema: ubuntu22\.04**

**Versione di ROS2: humble**

### Configurazione dell'ambiente ROS2

1. **Aggiornare la fonte di download**

```PowerShell
sudo apt update
```

2. **Digitare il comando di download di ros2**

```PowerShell
wget http://fishros.com/install -O fishros && . fishros
```

### Collegamento del dispositivo alla macchina virtuale

1. **Visualizzare il dispositivo**

```PowerShell
ll /dev/ttyUSB*
```

2. **Creare la mappatura delle porte**

```PowerShell
sudo gedit /etc/udev/rules.d/99-serial-imu.rules
```

3. **Compilare il contenuto del file di mappatura**

```PowerShell
KERNEL=="ttyUSB*", ATTRS{idVendor}=="1a86", ATTRS{idProduct}=="7523", MODE:="0777", SYMLINK+="imu-serial"
```

4. **Salvare e uscire; eseguire il comando per rendere effettiva la regola**

```PowerShell
sudo udevadm trigger
sudo service udev reload
sudo service udev restart
```

5. **Verifica**

```PowerShell
ll /dev/imu-serial
```

### Importare il pacchetto compresso preparato

1. **Nella directory di pari livello di Feishu si trova**[IMU\_ROS2\.zip](https://juxitech.feishu.cn/wiki/ZL8XwrPriifnASk41AhcoPj1nnb)

2. **Trasferirlo nella macchina virtuale tramite il software di trasferimento file**

3. **Installare la libreria IMU\_Library**

```PowerShell
# Dopo aver scaricato e scompattato il file compresso IMU_ROS2, entrare nella directory IMU_Library ed eseguire setup.py
cd IMU_ROS2/IMU_Library

# Installare la libreria e le sue dipendenze
pip install -e .

# Oppure installare usando setup.py
python setup.py install
```

### Installazione delle librerie relative a python

```PowerShell
sudo pip3 install pyserial
sudo pip3 install smbus2
```

### Compilare il progetto ROS2

1. **Tornare nella directory \~/IMU\_ROS2**

```PowerShell
cd IMU_ROS2
colcon build --symlink-install
```

1. **Scrivere la directory di lavoro \~/IMU\_ROS2 nelle variabili d'ambiente**

```PowerShell
# Modificare ~/.bashrc
sudo gedit ~/.bashrc

# Aggiungere il seguente comando alla fine
source ~/IMU_ROS2/install/setup.bash
```

Dopo la compilazione riuscita, eseguire il seguente comando per verificare se nel pacchetto imu\_ros2 sono presenti file eseguibili

`ros2 pkg executables imu_ros2`

### Avviare il nodo ROS2

```PowerShell
source install/setup.bash
ros2 run imu_ros2 imu_publisher
```

### Stampa dei dati della IMU

1. **Aprire un nuovo terminale e visualizzare il topic della imu**

```PowerShell
ros2 topic list
```

2. **Stampare i dati del topic /imu/data**

```PowerShell
ros2 topic echo /imu/data
```

3. **Aprire un nuovo terminale e visualizzare il topic msg**

```PowerShell
ros2 topic echo /imu/mag
```

### Visualizzazione in RViz2

1. **Eseguire il comando per aprire l'interfaccia di visualizzazione di rviz**

```PowerShell
ros2 launch imu_ros2 imu_visualization.launch.py
```

### Domande frequenti

1. Se all'avvio del nodo si verifica un errore di apertura, provare i seguenti comandi

```PowerShell
# Eseguire nella directory ~/IMU_ROS2
source install/setup.bash

# Problema del numero di porta
sudo chmod 666 /dev/imu-serial
```





