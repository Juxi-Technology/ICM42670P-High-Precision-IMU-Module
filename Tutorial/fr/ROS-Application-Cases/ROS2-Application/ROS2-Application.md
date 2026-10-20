# Application ROS2

**Configuration système : ubuntu22\.04**

**Version ROS2 : humble**

### Configuration de l'environnement ROS2

1. **Mettre à jour la source de téléchargement**

```PowerShell
sudo apt update
```

2. **Saisir la commande de téléchargement de ros2**

```PowerShell
wget http://fishros.com/install -O fishros && . fishros
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
sudo service udev reload
sudo service udev restart
```

5. **Vérification**

```PowerShell
ll /dev/imu-serial
```

### Importer l'archive préparée

1. **Dans le répertoire de même niveau sur Feishu, il y a**[IMU\_ROS2\.zip](https://juxitech.feishu.cn/wiki/ZL8XwrPriifnASk41AhcoPj1nnb)

2. **Transférer vers la machine virtuelle via un logiciel de transfert de fichiers**

3. **Installer la bibliothèque IMU\_Library**

```PowerShell
# Après avoir téléchargé et décompressé l'archive IMU_ROS2, se placer dans le répertoire IMU_Library et exécuter setup.py
cd IMU_ROS2/IMU_Library

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

### Compilation du projet ROS2

1. **Revenir au répertoire \~/IMU\_ROS2**

```PowerShell
cd IMU_ROS2
colcon build --symlink-install
```

1. **Écrire le répertoire de travail \~/IMU\_ROS2 dans les variables d'environnement**

```PowerShell
# Modifier ~/.bashrc
sudo gedit ~/.bashrc

# Ajouter la commande suivante à la fin
source ~/IMU_ROS2/install/setup.bash
```

Après une compilation réussie, exécutez la commande suivante pour vérifier si des fichiers exécutables existent dans le package imu\_ros2

`ros2 pkg executables imu_ros2`

### Lancer le nœud ROS2

```PowerShell
source install/setup.bash
ros2 run imu_ros2 imu_publisher
```

### Impression des données IMU

1. **Ouvrir un nouveau terminal et consulter le topic imu**

```PowerShell
ros2 topic list
```

2. **Imprimer les données du topic /imu/data**

```PowerShell
ros2 topic echo /imu/data
```

3. **Ouvrir un nouveau terminal et consulter le topic msg**

```PowerShell
ros2 topic echo /imu/mag
```

### Visualisation RViz2

1. **Exécuter la commande pour ouvrir l'interface de visualisation rviz**

```PowerShell
ros2 launch imu_ros2 imu_visualization.launch.py
```

### Questions fréquentes

1. En cas d'échec d'ouverture lors du démarrage du nœud, veuillez essayer les commandes suivantes

```PowerShell
# Exécuter dans le répertoire ~/IMU_ROS2
source install/setup.bash

# Problème de numéro de port
sudo chmod 666 /dev/imu-serial
```





