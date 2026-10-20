# Série Jetson

## 1\. Ligar o dispositivo

Este tutorial usa como exemplo a placa Jetson Orin NX.

Ligue o sensor de atitude IMU à interface I2C do Jetson Orin NX como mostrado na figura abaixo.

![Jetson orin IIC通讯\.jpg](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Jetson-Series/Images/jetson-orin-iic-communication.jpg)

![image\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Jetson-Series/Images/image.png)

## 2\. Verificar o estado do dispositivo

Primeiro, instale o I2Ctool; introduza no terminal:

```PowerShell
sudo apt-get update
sudo apt-get install -y i2c-tools
```

Verificar o dispositivo I2C

```PowerShell
sudo i2cdetect -y -r -a 7
```

![Screenshot from 2026\-02\-05 11\-09\-35\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Jetson-Series/Images/Screenshot%20from%202026-02-05%2011-09-35.png)

## 3\. Instalar a biblioteca do controlador

3\.1**Instalar as bibliotecas python necessárias para o código**

```PowerShell
sudo apt update
sudo apt install -y python3-serial
sudo apt install -y python3-smbus2
```

3\.2 Transferir ficheiros

[IMU\_ROS2\.zip](/downloads/IMU_ROS2.zip)

Se ainda não sabe utilizar o MobaXterm para transferir ficheiros, consulte a seguinte página com o método detalhado de instalação e utilização do MobaXterm: [Transferência remota de ficheiros](https://juxitech.feishu.cn/wiki/KB0Jw2o6Wis9f0ksyeFceVmgnfd)

Use o software MobaXterm para arrastar os ficheiros descompactados para o Raspberry Pi 5.

![截图\_20260203182313\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Jetson-Series/Images/screenshot-20260203182313.png)

## 4\. Verificar os dados da imu

**Entre no diretório \~/IMU\_Library e execute o ficheiro IMU\_Serial\_Library\.py**

```PowerShell
cd ~/imu_ros2/src/IMU_ROS2/IMU_Library

# Executar o ficheiro de impressão de dados do IMU
python3 -m IMU_Library.IMU_I2C_Library
```

![Screenshot from 2026\-02\-05 11\-07\-24\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Jetson-Series/Images/Screenshot%20from%202026-02-05%2011-07-24.png)

Atenção: os dados acima referem-se à leitura de dados de uma IMU de 10 eixos; a versão de 6 eixos não tem dados do magnetómetro (Magnetometer) nem do barómetro (Barometer), e a de 9 eixos não tem dados do barómetro (Barometer).

## **5\.Calibração da IMU**

**Entre no diretório \~/IMU\_Library e execute o ficheiro imu\_calibration\_tool\.py**

```PowerShell
cd ~/IMU_Library

# Executar o ficheiro de código de calibração do IMU --calibração de comunicação I2C
# Executar todas as calibrações (global, magnetómetro, temperatura)
python3 -m IMU_Library.imu_calibration_tool --mode i2c --port 7

# Apenas calibração global
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 7 --calibrate imu

# Apenas calibração do magnetómetro
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 7 --calibrate mag

# Apenas calibração de temperatura
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 7 --calibrate temp
```

![Screenshot from 2026\-02\-05 11\-08\-46\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Jetson-Series/Images/Screenshot%20from%202026-02-05%2011-08-46.png)

## 6\. Observações

Ao utilizar placas da série orin, é necessário modificar o número do barramento I2C de acordo com a situação real; o local da modificação é mostrado na figura abaixo. Normalmente é o barramento 7

![截图\_20260203191332\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Jetson-Series/Images/screenshot-20260203191332.png)

![截图\_20260203191406\.png](../../../../en/Multi-Master-Communication-Cases/IIC-Communication/Jetson-Series/Images/screenshot-20260203191406.png)



