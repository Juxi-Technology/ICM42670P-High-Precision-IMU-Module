# Application ROS1

**Configuration système : ubuntu20\.04**

**Version ROS1 : noetic**

### Configuration de l'environnement ROS1

1. **Configurer la source d'installation ROS1**

```PowerShell
sudo sh -c '. /etc/lsb-release && echo "deb http://mirrors.tuna.tsinghua.edu.cn/ros/ubuntu/ `lsb_release -cs` main" > /etc/apt/sources.list.d/ros-latest.list'
```

2. **Configurer la clé**

```PowerShell
sudo apt-key adv --keyserver 'hkp://keyserver.ubuntu.com:80' --recv-key C1CF6E31E6BADE8868B172B4F42ED6FBAB17C654
```

```Plain Text
sudo apt update
```

3. **Installer ROS1 (téléchargement officiel)**

```PowerShell
sudo apt install ros-noetic-desktop-full
```

Accélération du téléchargement et de l'installation de ROS1 via un proxy

wget http://fishros\.com/install \-O fishros \&\& \. fishros

4. **Configurer les variables d'environnement**

```Plain Text
echo "source /opt/ros/noetic/setup.bash">> ~/.bashrc
```

```PowerShell
source ~/.bashrc
```

### Connexion de l'appareil à la machine virtuelle

1. **Vérifier l'appareil**

```PowerShell
ll /dev/ttyUSB*
```

2. **Créer le mappage de port**

```PowerShell
sudo gedit /etc/udev/rules.d/99-serial-imu.rules
```

3. **Remplir le contenu du fichier de mappage**

```PowerShell
KERNEL=="ttyUSB*", ATTRS{idVendor}=="1a86", ATTRS{idProduct}=="7523", MODE:="0777", SYMLINK+="imu-serial"
```

4. **Enregistrer et quitter, puis exécuter la commande pour activer la règle**

```PowerShell
sudo udevadm trigger
```

```Plain Text
sudo service udev reload
```

```Plain Text
sudo service udev restart
```

5. **Vérification**

```PowerShell
ll /dev/imu-serial
```

```Bash
sudo usermod -aG dialout ash
```

### Importer l'archive préparée

1. **Dans le répertoire de même niveau sur Feishu, il y a**[IMU\_ROS1\.zip](https://juxitech.feishu.cn/wiki/BcWGwW2yDiXex9k6qjTcleTvnPb)

2. **Après décompression, transférer vers la machine virtuelle via un logiciel de transfert de fichiers**

3. **Installer la bibliothèque IMU\_Library**

```PowerShell
cd IMU_ROS1
# Après avoir téléchargé et décompressé l'archive IMU_ROS1, se placer dans le répertoire IMU_Library et exécuter la commande suivante
cd IMU_Library

# Installer la bibliothèque et ses dépendances
pip install -e .

# ou installer avec setup.py
python setup.py install
```

### Installation des bibliothèques Python associées

```PowerShell
sudo pip3 install pyserial
sudo pip3 install smbus2
```

**En cas de problème de rendu, exécutez les commandes suivantes**

```PowerShell
sudo apt-get install ros-noetic-imu-filter-madgwick
sudo apt-get install ros-noetic-rviz-imu-plugin
```

### Compilation du projet ROS1

1. **Ouvrir un nouveau terminal dans le répertoire /home et créer un espace de travail ros1**

```PowerShell
mkdir imu_ros1
cd imu_ros1
mkdir src
cd src/
catkin_init_workspace
```

2. **Copier le dossier IMU\_ROS1 transféré vers le répertoire \~/imu\_ros1/src/**

```PowerShell
# Copier le dossier IMU_ROS1 dans le répertoire src nouvellement créé
cp -r ~/IMU_ROS1 ~/imu_ros1/src
cd ~/imu_ros1
catkin_make
```

3. **Écrire le répertoire de travail \~/imu\_ros1 dans les variables d'environnement**

```PowerShell
# Modifier ~/.bashrc
sudo gedit ~/.bashrc

# Ajouter la commande suivante à la fin
source ~/imu_ros1/devel/setup.bash

source ~/.bashrc
```

### Lancer le nœud ROS1

1. **Ouvrir un terminal et saisir roscore pour démarrer le nœud**

```PowerShell
# Démarrer roscore
roscore

# Ouvrir un nouveau terminal, configurer l'environnement, démarrer le nœud
source ~/imu_ros1/devel/setup.bash
```

2. **Ajouter la permission d'exécution au script Python (essentiel)**

Entrez dans le répertoire `scripts` où se trouve le script, puis exécutez la commande `chmod +x` pour attribuer la permission d'exécution (`+x`, soit add execute, ajouter la permission d'exécution) :

```PowerShell
# Se placer dans le répertoire contenant imu_driver.py (selon votre chemin réel)
cd ~/imu_ros1/src/IMU_ROS1/scripts/ 

# Accorder la permission d'exécution (une seule fois suffit, effet permanent)
chmod +x imu_driver.py
chmod +x mag_visualizer.py
```

Retournez dans le dossier imu\_ros1 et exécutez imu\_driver\.py

```Plain Text
cd ~/imu_ros1
```

```Plain Text
rosrun IMU_ROS1 imu_driver.py
```

### Impression des données IMU

1. **Ouvrir un nouveau terminal et consulter le topic imu**

```PowerShell
# Afficher tous les topics actuellement publiés
rostopic list
```

2. **Imprimer les données du topic**

```PowerShell
# Afficher les données brutes de l'IMU
rostopic echo /imu/data_raw

# Afficher les données du magnétomètre
rostopic echo /imu/mag
```

### Visualisation RViz

1. **Exécuter la commande pour lancer rviz\(\)**

```PowerShell
roslaunch IMU_ROS1 imu_display.launch
```

### Questions fréquentes

1. En cas d'échec d'ouverture lors du démarrage du nœud, veuillez essayer les commandes suivantes

```PowerShell
# Exécuter dans le répertoire ~/imu_ros1
source devel/setup.bash

# Problème de numéro de port
sudo chmod 666 /dev/imu-serial
```

2. Dans la visualisation RVIZ, les trois axes s'affichent très petits ; cochez à nouveau Enable axes

![截图\_20260203101944\.png](../../../en/ROS-Application-Cases/ROS1-Application/Images/screenshot-20260203101944.png)



