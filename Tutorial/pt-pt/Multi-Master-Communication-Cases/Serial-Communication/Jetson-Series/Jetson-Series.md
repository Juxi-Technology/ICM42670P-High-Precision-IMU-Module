# Série Jetson

## 1\. Ligar o dispositivo

Este tutorial usa como exemplo a placa Jetson orin nx.

Ligue o sensor de atitude IMU à porta USB do controlador através de um cabo type\-c.

![Jetson orin 串口通讯\.jpg](../../../../en/Multi-Master-Communication-Cases/Serial-Communication/Jetson-Series/Images/jetson-orin-serial-communication.jpg)

## 2\. Verificar o estado do dispositivo

Verificar o id do dispositivo

```PowerShell
lsusb
```

Verificar o número do dispositivo

```PowerShell
ls -l /dev/ttyU*
```

![Screenshot from 2026\-02\-05 10\-18\-43\.png](../../../../en/Multi-Master-Communication-Cases/Serial-Communication/Jetson-Series/Images/Screenshot%20from%202026-02-05%2010-18-43.png)

Configurar o mapeamento de portas

```Bash
# Para evitar que a porta mude após ligar/desligar, defina o mapeamento de porta
sudo gedit /etc/udev/rules.d/99-serial-imu.rules

# Se aparecer algo sobre o comando gedit não encontrado, descarregue e instale primeiro
sudo apt install gedit

# Preencher o conteúdo do mapeamento
KERNEL=="ttyUSB*", ATTRS{idVendor}=="1a86", ATTRS{idProduct}=="7523", MODE:="0777", SYMLINK+="imu-serial"

# Descrição dos parâmetros:
`--mode`: 通信模式，可选值为`serial`(串口)或`i2c`
`--port`: 串口名(如`/dev/ttyUSB0`)或I2C端口号(如`7`)
`--rate`: 数据打印频率(Hz)，默认10Hz
`--debug`: 启用调试模式，显示详细信息

# Guarde e saia, execute o comando para a regra ter efeito
sudo udevadm trigger
sudo service udev reload
sudo service udev restart

# Verificação
ll /dev/imu-serial

# Exemplo de saída:
lrwxrwxrwx 1 root root 7 1月 22 10:00 /dev/imu-serial -> ttyUSB0
```

## 3\. Instalar a biblioteca do controlador

**3\.1 Instalar as bibliotecas python necessárias para o código**

```PowerShell
sudo apt update
sudo apt install -y python3-serial
sudo apt install -y python3-smbus2
```

**3\.2 Transferir ficheiros**

[IMU\_ROS2\.zip](/downloads/IMU_ROS2.zip)

Se ainda não sabe utilizar o MobaXterm para transferir ficheiros, consulte a seguinte página com o método detalhado de instalação e utilização do MobaXterm: [Transferência remota de ficheiros](https://juxitech.feishu.cn/wiki/KB0Jw2o6Wis9f0ksyeFceVmgnfd)

Use o software MobaXterm para arrastar os ficheiros descompactados para o Jetson.

![截图\_20260203182313\.png](../../../../en/Multi-Master-Communication-Cases/Serial-Communication/Jetson-Series/Images/screenshot-20260203182313.png)

## 4\. Verificar os dados da imu

**Entre no diretório \~/IMU\_Library e execute o ficheiro IMU\_Serial\_Library\.py**

```PowerShell
cd ~/IMU_ROS2/IMU_Library

# Executar o ficheiro de impressão de dados do IMU
python3 -m IMU_Library.IMU_Serial_Library
```

![image\.png](../../../../en/Multi-Master-Communication-Cases/Serial-Communication/Jetson-Series/Images/image%201.png)

Atenção: os dados acima referem-se à leitura de dados de uma IMU de 10 eixos; a versão de 6 eixos não tem dados do magnetómetro (Magnetometer) nem do barómetro (Barometer), e a de 9 eixos não tem dados do barómetro (Barometer).

## **5\.Calibração da IMU**

**Entre no diretório \~/IMU\_Library e execute o ficheiro imu\_calibration\_tool\.py**

```PowerShell
cd ~/IMU_Library

# Executar o ficheiro de código de calibração do IMU --calibração de comunicação série
# Executar todas as calibrações (global, magnetómetro, temperatura)
python3 -m IMU_Library.imu_calibration_tool --mode serial --port /dev/imu-serial

# Apenas calibração global
python3 -m IMU_Library.imu_calibration_tool --mode serial --port /dev/imu-serial --calibrate imu

# Apenas calibração do magnetómetro
python3 -m IMU_Library.imu_calibration_tool --mode serial --port /dev/imu-serial --calibrate mag

# Apenas calibração de temperatura
python3 -m IMU_Library.imu_calibration_tool --mode serial --port /dev/imu-serial --calibrate temp
```

![image\.png](../../../../en/Multi-Master-Communication-Cases/Serial-Communication/Jetson-Series/Images/image.png)

## 6\. Observações

Se for possível encontrar o ID do dispositivo, mas não o número do dispositivo, pode consultar o comando abaixo para instalar o controlador ch34x

```PowerShell
sudo apt remove brltty
git clone https://github.com/clhchan/CH341SER.git
cd CH341SER
make -j6
sudo make install
sudo modprobe ch34x
```



