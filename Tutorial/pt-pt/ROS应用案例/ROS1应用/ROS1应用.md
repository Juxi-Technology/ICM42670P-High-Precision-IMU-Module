# Aplicação ROS1

**Configuração do sistema: ubuntu20\.04**

**ROS1****Versão: noetic**

### Configuração do ambiente ROS1

1. **Definir a fonte de instalação do ROS1**

```PowerShell
sudo sh -c '. /etc/lsb-release && echo "deb http://mirrors.tuna.tsinghua.edu.cn/ros/ubuntu/ `lsb_release -cs` main" > /etc/apt/sources.list.d/ros-latest.list'
```

2. **Definir a Key**

```PowerShell
sudo apt-key adv --keyserver 'hkp://keyserver.ubuntu.com:80' --recv-key C1CF6E31E6BADE8868B172B4F42ED6FBAB17C654
```

```Plain Text
sudo apt update
```

3. **Instalar o ROS1 (descarregamento oficial)**

```PowerShell
sudo apt install ros-noetic-desktop-full
```

Descarregamento acelerado por proxy para instalar o ROS1

wget http://fishros\.com/install \-O fishros \&\& \. fishros

4. **Configurar as variáveis de ambiente**

```Plain Text
echo "source /opt/ros/noetic/setup.bash">> ~/.bashrc
```

```PowerShell
source ~/.bashrc
```

### Ligar o dispositivo à máquina virtual

1. **Verificar o dispositivo**

```PowerShell
ll /dev/ttyUSB*
```

2. **Criar o mapeamento de portas**

```PowerShell
sudo gedit /etc/udev/rules.d/99-serial-imu.rules
```

3. **Preencher o conteúdo do ficheiro de mapeamento**

```PowerShell
KERNEL=="ttyUSB*", ATTRS{idVendor}=="1a86", ATTRS{idProduct}=="7523", MODE:="0777", SYMLINK+="imu-serial"
```

4. **Guardar, sair e executar o comando para que a regra entre em vigor**

```PowerShell
sudo udevadm trigger
```

```Plain Text
sudo service udev reload
```

```Plain Text
sudo service udev restart
```

5. **Verificação**

```PowerShell
ll /dev/imu-serial
```

```Bash
sudo usermod -aG dialout ash
```

### Importar o pacote compactado preparado

1. **No diretório de mesmo nível do Feishu há o**[IMU\_ROS1\.zip](https://juxitech.feishu.cn/wiki/BcWGwW2yDiXex9k6qjTcleTvnPb)

2. **Após descompactar, transferir para a máquina virtual através de um software de transferência de ficheiros**

3. **Instalar a biblioteca IMU\_Library**

```PowerShell
cd IMU_ROS1
# Depois de descarregar e descompactar o ficheiro compactado IMU_ROS1, entre no diretório IMU_Library e execute os comandos abaixo
cd IMU_Library

# Instalar a biblioteca e as suas dependências
pip install -e .

# ou instalar usando o setup.py
python setup.py install
```

### Instalação das bibliotecas relacionadas ao python

```PowerShell
sudo pip3 install pyserial
sudo pip3 install smbus2
```

**Se houver problemas de renderização, execute os seguintes comandos**

```PowerShell
sudo apt-get install ros-noetic-imu-filter-madgwick
sudo apt-get install ros-noetic-rviz-imu-plugin
```

### Compilar o projeto ROS1

1. **Abra um novo terminal no diretório /home e crie um novo espaço de trabalho ros1**

```PowerShell
mkdir imu_ros1
cd imu_ros1
mkdir src
cd src/
catkin_init_workspace
```

2. **Copie a pasta IMU\_ROS1 transferida para o diretório \~/imu\_ros1/src/**

```PowerShell
# Copiar a pasta IMU_ROS1 para o diretório src recém-criado
cp -r ~/IMU_ROS1 ~/imu_ros1/src
cd ~/imu_ros1
catkin_make
```

3. **Escrever o diretório de trabalho \~/imu\_ros1 nas variáveis de ambiente**

```PowerShell
# Editar ~/.bashrc
sudo gedit ~/.bashrc

# Escrever o comando abaixo no final
source ~/imu_ros1/devel/setup.bash

source ~/.bashrc
```

### Iniciar o nó ROS1

1. **Abra o terminal e digite roscore para iniciar o nó**

```PowerShell
# Iniciar o roscore
roscore

# Abrir um novo terminal, configurar o ambiente e iniciar o nó
source ~/imu_ros1/devel/setup.bash
```

2. **Conceder permissão de execução ao script Python (essencial)**

Entre no diretório `scripts` onde está o script e execute o comando `chmod +x` para conceder permissão de execução (`+x` ou seja add execute, adicionar permissão de execução):

```PowerShell
# Entrar no diretório onde está o imu_driver.py (conforme o seu caminho real)
cd ~/imu_ros1/src/IMU_ROS1/scripts/ 

# Conceder permissão de execução (basta executar 1 vez, com efeito permanente)
chmod +x imu_driver.py
chmod +x mag_visualizer.py
```

Volte para a pasta imu\_ros1 e execute o imu\_driver\.py

```Plain Text
cd ~/imu_ros1
```

```Plain Text
rosrun IMU_ROS1 imu_driver.py
```

### Impressão dos dados da IMU

1. **Abra um novo terminal e verifique o tópico imu**

```PowerShell
# Ver todos os tópicos publicados atualmente
rostopic list
```

2. **Imprimir os dados do tópico**

```PowerShell
# Imprimir os dados brutos do IMU
rostopic echo /imu/data_raw

# Imprimir os dados do magnetómetro
rostopic echo /imu/mag
```

### Visualização no RViz

1. **Executar o comando para iniciar o rviz\(\)**

```PowerShell
roslaunch IMU_ROS1 imu_display.launch
```

### Perguntas frequentes

1. Se ocorrer falha ao abrir ao iniciar o nó, tente os seguintes comandos

```PowerShell
# Executar no diretório ~/imu_ros1
source devel/setup.bash

# Problema do número da porta
sudo chmod 666 /dev/imu-serial
```

2. Se os três eixos aparecerem muito pequenos na visualização do RVIZ, marque novamente Enable axes

![截图\_20260203101944\.png](../../../en/ROS应用案例/ROS1应用/图片和附件/截图_20260203101944.png)



