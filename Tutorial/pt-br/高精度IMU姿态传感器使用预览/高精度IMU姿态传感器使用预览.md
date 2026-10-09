# Pré-visualização do uso do sensor de atitude IMU de alta precisão

### Baixe o pacote compactado [IMU\_ROS1\.zip](https://juxitech.feishu.cn/wiki/BcWGwW2yDiXex9k6qjTcleTvnPb) ou [IMU\_ROS2\.zip](https://juxitech.feishu.cn/wiki/ZL8XwrPriifnASk41AhcoPj1nnb), após descompactar entre em \~/IMU\_Library

1. **Instalar as bibliotecas python necessárias para o código**

```PowerShell
pip install pyserial
pip install smbus2
```

2. **Instalar a biblioteca IMU\_Library**

```PowerShell
# Instalar a biblioteca e suas dependências
pip install -e .

# ou instalar usando o setup.py
python setup.py install
```

3. **Configurar o mapeamento de portas**

```PowerShell
# Para evitar que a porta mude após conectar/desconectar, defina o mapeamento de porta
sudo gedit /etc/udev/rules.d/99-serial-imu.rules

# Se aparecer algo sobre o comando gedit não encontrado, baixe e instale primeiro
sudo apt install gedit

# Preencher o conteúdo do mapeamento
KERNEL=="ttyUSB*", ATTRS{idVendor}=="1a86", ATTRS{idProduct}=="7523", MODE:="0777", SYMLINK+="imu-serial"

# Descrição dos parâmetros:
`--mode`: 通信模式，可选值为`serial`(串口)或`i2c`
`--port`: 串口名(如`/dev/ttyUSB0`)或I2C端口号(如`7`)
`--rate`: 数据打印频率(Hz)，默认10Hz
`--debug`: 启用调试模式，显示详细信息

# Salve e saia, execute o comando para a regra entrar em vigor
sudo udevadm trigger
sudo service udev reload
sudo service udev restart

# Verificação
ll /dev/imu-serial

# Exemplo de saída:
lrwxrwxrwx 1 root root 7 1月 22 10:00 /dev/imu-serial -> ttyUSB0
```

### Comunicação por porta serial

1. **Entre no diretório \~/IMU\_Library/IMU\_Library e execute o arquivo IMU\_Serial\_Library\.py**

```PowerShell
cd ~/imu_ros1/src/IMU_ROS1/IMU_Library/IMU_Library 
# ou
cd ~/imu_ros2/src/IMU_ROS2/IMU_Library/IMU_Library

# Executar o arquivo de impressão de dados do IMU
python3 IMU_Serial_Library.py
```

### Comunicação I2C

1. **Entre no diretório \~/IMU\_Library/IMU\_Library e execute o arquivo IMU\_I2C\_Library\.py**

```PowerShell
cd ~/IMU_Library/IMU_Library

# Executar o arquivo de impressão de dados do IMU
python3 IMU_I2C_Library.py
```

### Calibração da imu

1. **Entre no diretório \~/IMU\_Library/IMU\_Library e execute o arquivo imu\_calibration\_tool\.py**

```PowerShell
cd ~/IMU_Library/IMU_Library

# Executar o arquivo de código de calibração do IMU --calibração de comunicação serial
# Executar todas as calibrações (global, magnetômetro, temperatura)
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial

# Apenas calibração global
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial --calibrate imu

# Apenas calibração do magnetômetro
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial --calibrate mag

# Apenas calibração de temperatura
python3 imu_calibration_tool.py --mode serial --port /dev/imu-serial --calibrate temp

# Executar o arquivo de código de calibração do IMU --calibração de comunicação I2C
# Executar todas as calibrações (global, magnetômetro, temperatura)
python3 imu_calibration_tool.py --mode i2c --port 1

# Apenas calibração global
python3 imu_calibration_tool.py --mode i2c --port 1 --calibrate imu

# Apenas calibração do magnetômetro
python3 imu_calibration_tool.py --mode i2c --port 1 --calibrate mag

# Apenas calibração de temperatura
python3 imu_calibration_tool.py --mode i2c --port 1 --calibrate temp
```



