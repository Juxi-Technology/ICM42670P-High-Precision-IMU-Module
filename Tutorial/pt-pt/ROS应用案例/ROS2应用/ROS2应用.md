# Aplicação ROS2

**Configuração do sistema: ubuntu22\.04**

**Versão do ROS2: humble**

### Configuração do ambiente ROS2

1. **Atualizar a fonte de descarregamento**

```PowerShell
sudo apt update
```

2. **Introduzir o comando de descarregamento do ros2**

```PowerShell
wget http://fishros.com/install -O fishros && . fishros
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
sudo service udev reload
sudo service udev restart
```

5. **Verificação**

```PowerShell
ll /dev/imu-serial
```

### Importar o pacote compactado preparado

1. **No diretório de mesmo nível do Feishu há o**[IMU\_ROS2\.zip](https://juxitech.feishu.cn/wiki/ZL8XwrPriifnASk41AhcoPj1nnb)

2. **Transferir para a máquina virtual através de um software de transferência de ficheiros**

3. **Instalar a biblioteca IMU\_Library**

```PowerShell
# Depois de descarregar e descompactar o ficheiro compactado IMU_ROS2, entre no diretório IMU_Library e execute o setup.py
cd IMU_ROS2/IMU_Library

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

### Compilar o projeto ROS2

1. **Voltar ao diretório \~/IMU\_ROS2**

```PowerShell
cd IMU_ROS2
colcon build --symlink-install
```

1. **Escrever o diretório de trabalho \~/IMU\_ROS2 nas variáveis de ambiente**

```PowerShell
# Editar ~/.bashrc
sudo gedit ~/.bashrc

# Escrever o comando abaixo no final
source ~/IMU_ROS2/install/setup.bash
```

Após a compilação bem-sucedida, execute o seguinte comando para verificar se existem ficheiros executáveis no pacote de funcionalidades imu\_ros2

`ros2 pkg executables imu_ros2`

### Iniciar o nó ROS2

```PowerShell
source install/setup.bash
ros2 run imu_ros2 imu_publisher
```

### Impressão dos dados da IMU

1. **Abra um novo terminal e verifique o tópico imu**

```PowerShell
ros2 topic list
```

2. **Imprimir os dados do tópico /imu/data**

```PowerShell
ros2 topic echo /imu/data
```

3. **Abra um novo terminal e verifique o tópico msg**

```PowerShell
ros2 topic echo /imu/mag
```

### Visualização no RViz2

1. **Execute o comando para abrir a interface de visualização do rviz**

```PowerShell
ros2 launch imu_ros2 imu_visualization.launch.py
```

### Perguntas frequentes

1. Se ocorrer falha ao abrir ao iniciar o nó, tente os seguintes comandos

```PowerShell
# Executar no diretório ~/IMU_ROS2
source install/setup.bash

# Problema do número da porta
sudo chmod 666 /dev/imu-serial
```





