# Série Jetson

## 1\. Conectar o dispositivo

Este tutorial usa como exemplo a placa Jetson orin nx.

Conecte o sensor de atitude IMU à porta USB do controlador por meio de um cabo type\-c.

![Jetson orin 串口通讯\.jpg](../../../../en/多主控通讯案例/串口通讯/Jetson系列/图片和附件/Jetson%20orin%20串口通讯.jpg)

## 2\. Verificar o estado do dispositivo

Verificar o id do dispositivo

```PowerShell
lsusb
```

Verificar o número do dispositivo

```PowerShell
ls -l /dev/ttyU*
```

![Screenshot from 2026\-02\-05 10\-18\-43\.png](../../../../en/多主控通讯案例/串口通讯/Jetson系列/图片和附件/Screenshot%20from%202026-02-05%2010-18-43.png)

Configurar o mapeamento de portas

```Bash
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

## 3\. Instalar a biblioteca de driver

**3\.1 Instalar as bibliotecas python necessárias para o código**

```PowerShell
sudo apt update
sudo apt install -y python3-serial
sudo apt install -y python3-smbus2
```

**3\.2 Transferir arquivos**

[IMU\_ROS2\.zip](/downloads/IMU_ROS2.zip)

Se você ainda não sabe usar o MobaXterm para transferir arquivos, consulte a seguinte página com o método detalhado de instalação e uso do MobaXterm: [Transferência remota de arquivos](https://juxitech.feishu.cn/wiki/KB0Jw2o6Wis9f0ksyeFceVmgnfd)

Use o software MobaXterm para arrastar os arquivos descompactados para o Jetson.

![截图\_20260203182313\.png](../../../../en/多主控通讯案例/串口通讯/Jetson系列/图片和附件/截图_20260203182313.png)

## 4\. Verificar os dados da imu

**Entre no diretório \~/IMU\_Library e execute o arquivo IMU\_Serial\_Library\.py**

```PowerShell
cd ~/IMU_ROS2/IMU_Library

# Executar o arquivo de impressão de dados do IMU
python3 -m IMU_Library.IMU_Serial_Library
```

![image\.png](../../../../en/多主控通讯案例/串口通讯/Jetson系列/图片和附件/image%201.png)

Atenção: os dados acima referem-se à leitura de dados de uma IMU de 10 eixos; a versão de 6 eixos não possui dados do magnetômetro (Magnetometer) nem do barômetro (Barometer), e a de 9 eixos não possui dados do barômetro (Barometer).

## **5\.Calibração da IMU**

**Entre no diretório \~/IMU\_Library e execute o arquivo imu\_calibration\_tool\.py**

```PowerShell
cd ~/IMU_Library

# Executar o arquivo de código de calibração do IMU --calibração de comunicação serial
# Executar todas as calibrações (global, magnetômetro, temperatura)
python3 -m IMU_Library.imu_calibration_tool --mode serial --port /dev/imu-serial

# Apenas calibração global
python3 -m IMU_Library.imu_calibration_tool --mode serial --port /dev/imu-serial --calibrate imu

# Apenas calibração do magnetômetro
python3 -m IMU_Library.imu_calibration_tool --mode serial --port /dev/imu-serial --calibrate mag

# Apenas calibração de temperatura
python3 -m IMU_Library.imu_calibration_tool --mode serial --port /dev/imu-serial --calibrate temp
```

![image\.png](../../../../en/多主控通讯案例/串口通讯/Jetson系列/图片和附件/image.png)

## 6\. Observações

Se for possível encontrar o ID do dispositivo, mas não o número do dispositivo, pode consultar o comando abaixo para instalar o driver ch34x

```PowerShell
sudo apt remove brltty
git clone https://github.com/clhchan/CH341SER.git
cd CH341SER
make -j6
sudo make install
sudo modprobe ch34x
```



