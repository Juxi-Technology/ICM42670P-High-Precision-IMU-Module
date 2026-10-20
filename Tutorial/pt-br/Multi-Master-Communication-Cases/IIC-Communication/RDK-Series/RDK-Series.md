# Série RDK

## 1\. Conectar o dispositivo

Este tutorial usa como exemplo a imagem da versão ？ da placa RDK X5.

Conecte o sensor de atitude IMU à interface I2C do RDK X5 conforme mostrado na figura abaixo.

![RDK IIC通讯\.jpg](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/RDK-Series/Images/rdk-iic-communication.jpg)

![RDK X5 针脚图\.jpg](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/RDK-Series/Images/rdk-x5-pinout.jpg)

## 2\. Verificar o estado do dispositivo

Verificar o dispositivo I2C

```PowerShell
python3 /app/40pin_samples/test_i2c.py
```

![image\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/RDK-Series/Images/image.png)

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

![截图\_20260203182313\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/RDK-Series/Images/screenshot-20260203182313.png)

## 4\. Verificar os dados da imu

**Entre no diretório \~/IMU\_Library e execute o arquivo IMU\_Serial\_Library\.py**

```PowerShell
cd ~/imu_ros1/src/IMU_ROS1/IMU_Library
# ou
cd ~/imu_ros2/src/IMU_ROS2/IMU_Library

# Executar o arquivo de impressão de dados do IMU
python3 -m IMU_Library.IMU_I2C_Library
```

![截图\_20260203175633\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/RDK-Series/Images/screenshot-20260203175633.png)

Atenção: os dados acima referem-se à leitura de dados de uma IMU de 10 eixos; a versão de 6 eixos não possui dados do magnetômetro (Magnetometer) nem do barômetro (Barometer), e a de 9 eixos não possui dados do barômetro (Barometer).

## **5\.Calibração da IMU**

**Entre no diretório \~/IMU\_Library e execute o arquivo imu\_calibration\_tool\.py**

```PowerShell
cd ~/IMU_Library

# Executar o arquivo de código de calibração do IMU --calibração de comunicação I2C
# Executar todas as calibrações (global, magnetômetro, temperatura)
python3 -m IMU_Library.imu_calibration_tool --mode i2c --port 0

# Apenas calibração global
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 0 --calibrate imu

# Apenas calibração do magnetômetro
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 0 --calibrate mag

# Apenas calibração de temperatura
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 0 --calibrate temp
```

![截图\_20260203174958\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/RDK-Series/Images/screenshot-20260203174958.png)

## 6\. Observações

Ao usar a placa RDK X5, é necessário modificar o número do barramento I2C de acordo com a situação real; o local da modificação é mostrado na figura abaixo. Normalmente é o barramento 0.

![截图\_20260203191332\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/RDK-Series/Images/screenshot-20260203191332.png)

![截图\_20260203191406\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/RDK-Series/Images/screenshot-20260203191406.png)



