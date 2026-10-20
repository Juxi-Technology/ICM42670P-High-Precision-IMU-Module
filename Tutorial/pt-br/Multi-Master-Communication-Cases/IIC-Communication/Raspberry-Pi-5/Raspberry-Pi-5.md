# Raspberry Pi 5

## 1\. Conectar o dispositivo

Este tutorial usa como exemplo a placa Raspberry Pi 5, com a imagem oficial de 64 bits.

Conecte o sensor de atitude IMU à interface I2C do Raspberry Pi 5 conforme mostrado na figura abaixo.

![树莓派5 IIC通讯\.jpg](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/raspberry-pi-5-iic-communication.jpg)

![image\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/image.png)

## 2\. Verificar o estado do dispositivo

Primeiro, instale o I2Ctool; digite no terminal:

```PowerShell
sudo apt-get update
sudo apt-get install -y i2c-tools
```

Verificar o dispositivo I2C

```PowerShell
sudo i2cdetect -y -r -a 1
```

![截图\_20260203181146\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/screenshot-20260203181146.png)

## 3\. Instalar a biblioteca de driver

3\.1**Instalar as bibliotecas python necessárias para o código**

```PowerShell
sudo apt update
sudo apt install -y python3-serial
sudo apt install -y python3-smbus2
```

3\.2 Transferir arquivos

[IMU\_ROS2\.zip](/downloads/IMU_ROS2.zip)

Se você ainda não sabe usar o MobaXterm para transferir arquivos, consulte a seguinte página com o método detalhado de instalação e uso do MobaXterm: [Transferência remota de arquivos](https://juxitech.feishu.cn/wiki/KB0Jw2o6Wis9f0ksyeFceVmgnfd)

Use o software MobaXterm para arrastar os arquivos descompactados para o Raspberry Pi 5.

![截图\_20260203182313\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/screenshot-20260203182313.png)

## 4\. Verificar os dados da imu

**Entre no diretório \~/IMU\_Library e execute o arquivo IMU\_Serial\_Library\.py**

```PowerShell
cd ~/imu_ros2/src/IMU_ROS1/IMU_Library

# Executar o arquivo de impressão de dados do IMU
python3 -m IMU_Library.IMU_I2C_Library
```

![截图\_20260203175633\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/screenshot-20260203175633.png)

Atenção: os dados acima referem-se à leitura de dados de uma IMU de 10 eixos; a versão de 6 eixos não possui dados do magnetômetro (Magnetometer) nem do barômetro (Barometer), e a de 9 eixos não possui dados do barômetro (Barometer).

## **5\.Calibração da IMU**

**Entre no diretório \~/IMU\_Library e execute o arquivo imu\_calibration\_tool\.py**

```PowerShell
cd ~/IMU_Library

# Executar o arquivo de código de calibração do IMU --calibração de comunicação I2C
# Executar todas as calibrações (global, magnetômetro, temperatura)
python3 -m IMU_Library.imu_calibration_tool --mode i2c --port 1

# Apenas calibração global
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 1 --calibrate imu

# Apenas calibração do magnetômetro
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 1 --calibrate mag

# Apenas calibração de temperatura
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 1 --calibrate temp
```

![截图\_20260203174958\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/screenshot-20260203174958.png)

## 6\. Observações

O Raspberry Pi 5 precisa ativar os pinos i2c previamente.

A operação de ativação é a seguinte:

Execute o comando no terminal

```PowerShell
sudo raspi-config
```

Selecione com as teclas de direção do teclado e, após selecionar, pressione a tecla Enter do teclado para entrar

![截图\_20260203181325\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/screenshot-20260203181325.png)

Selecione I2C e, após selecionar, pressione a tecla Enter do teclado para entrar,

![截图\_20260203181405\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/screenshot-20260203181405.png)

Após selecionar I2C, pressione a tecla Enter do teclado, use as teclas de direção para selecionar Yes e pressione a tecla Eneter para confirmar.

![截图\_20260203181427\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/screenshot-20260203181427.png)

Pressione a tecla Enter para confirmar

![截图\_20260203181447\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/screenshot-20260203181447.png)

Use as teclas de direção para selecionar Finish e depois pressione a tecla Enter para sair da configuração.

![截图\_20260203181510\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Raspberry-Pi-5/Images/screenshot-20260203181510.png)



