# Applicazione ROS1

**Configurazione del sistema: ubuntu20\.04**

**Versione di ROS1: noetic**

### Configurazione dell'ambiente ROS1

1. **Impostare la fonte di installazione di ROS1**

```PowerShell
sudo sh -c '. /etc/lsb-release && echo "deb http://mirrors.tuna.tsinghua.edu.cn/ros/ubuntu/ `lsb_release -cs` main" > /etc/apt/sources.list.d/ros-latest.list'
```

2. **Impostare la Key**

```PowerShell
sudo apt-key adv --keyserver 'hkp://keyserver.ubuntu.com:80' --recv-key C1CF6E31E6BADE8868B172B4F42ED6FBAB17C654
```

```Plain Text
sudo apt update
```

3. **Installare ROS1 (download ufficiale)**

```PowerShell
sudo apt install ros-noetic-desktop-full
```

Download e installazione accelerati di ROS1 tramite proxy

wget http://fishros\.com/install \-O fishros \&\& \. fishros

4. **Configurare le variabili d'ambiente**

```Plain Text
echo "source /opt/ros/noetic/setup.bash">> ~/.bashrc
```

```PowerShell
source ~/.bashrc
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
```

```Plain Text
sudo service udev reload
```

```Plain Text
sudo service udev restart
```

5. **Verifica**

```PowerShell
ll /dev/imu-serial
```

```Bash
sudo usermod -aG dialout ash
```

### Importare il pacchetto compresso preparato

1. **Nella directory di pari livello di Feishu si trova**[IMU\_ROS1\.zip](https://juxitech.feishu.cn/wiki/BcWGwW2yDiXex9k6qjTcleTvnPb)

2. **Dopo la decompressione, trasferirlo nella macchina virtuale tramite il software di trasferimento file**

3. **Installare la libreria IMU\_Library**

```PowerShell
cd IMU_ROS1
# Dopo aver scaricato e scompattato il file compresso IMU_ROS1, entrare nella directory IMU_Library ed eseguire i seguenti comandi
cd IMU_Library

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

**Se si verificano problemi di rendering, eseguire i seguenti comandi**

```PowerShell
sudo apt-get install ros-noetic-imu-filter-madgwick
sudo apt-get install ros-noetic-rviz-imu-plugin
```

### Compilare il progetto ROS1

1. **Aprire un nuovo terminale nella directory /home e creare un nuovo workspace ros1**

```PowerShell
mkdir imu_ros1
cd imu_ros1
mkdir src
cd src/
catkin_init_workspace
```

2. **Copiare la cartella IMU\_ROS1 trasferita nella directory \~/imu\_ros1/src/**

```PowerShell
# Copiare la cartella IMU_ROS1 nella directory src appena creata
cp -r ~/IMU_ROS1 ~/imu_ros1/src
cd ~/imu_ros1
catkin_make
```

3. **Scrivere la directory di lavoro \~/imu\_ros1 nelle variabili d'ambiente**

```PowerShell
# Modificare ~/.bashrc
sudo gedit ~/.bashrc

# Aggiungere il seguente comando alla fine
source ~/imu_ros1/devel/setup.bash

source ~/.bashrc
```

### Avviare il nodo ROS1

1. **Aprire un terminale e digitare roscore per avviare il nodo**

```PowerShell
# Avviare roscore
roscore

# Aprire un nuovo terminale, impostare l'ambiente e avviare il nodo
source ~/imu_ros1/devel/setup.bash
```

2. **Aggiungere i permessi di esecuzione allo script Python (fondamentale)**

Entrare nella directory `scripts` in cui si trova lo script ed eseguire il comando `chmod +x` per concedere i permessi di esecuzione (`+x`, ovvero add execute, aggiungere il permesso di esecuzione):

```PowerShell
# Entrare nella directory in cui si trova imu_driver.py (in base al tuo percorso reale)
cd ~/imu_ros1/src/IMU_ROS1/scripts/ 

# Concedere il permesso di esecuzione (è sufficiente eseguirlo una volta, con effetto permanente)
chmod +x imu_driver.py
chmod +x mag_visualizer.py
```

Tornare nella cartella imu\_ros1 ed eseguire imu\_driver\.py

```Plain Text
cd ~/imu_ros1
```

```Plain Text
rosrun IMU_ROS1 imu_driver.py
```

### Stampa dei dati della IMU

1. **Aprire un nuovo terminale e visualizzare il topic della imu**

```PowerShell
# Visualizzare tutti i topic pubblicati attualmente
rostopic list
```

2. **Stampare i dati del topic**

```PowerShell
# Stampare i dati grezzi dell'IMU
rostopic echo /imu/data_raw

# Stampare i dati del magnetometro
rostopic echo /imu/mag
```

### Visualizzazione in RViz

1. **Eseguire il comando per avviare rviz\(\)**

```PowerShell
roslaunch IMU_ROS1 imu_display.launch
```

### Domande frequenti

1. Se all'avvio del nodo si verifica un errore di apertura, provare i seguenti comandi

```PowerShell
# Eseguire nella directory ~/imu_ros1
source devel/setup.bash

# Problema del numero di porta
sudo chmod 666 /dev/imu-serial
```

2. Nella visualizzazione RVIZ i tre assi risultano molto piccoli; selezionare di nuovo Enable axes

![截图\_20260203101944\.png](../../../en/ROS-Application-Cases/ROS1-Application/Images/screenshot-20260203101944.png)



