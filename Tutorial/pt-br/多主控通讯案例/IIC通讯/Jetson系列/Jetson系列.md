# Série Jetson

## 1\. Conectar o dispositivo

Este tutorial usa como exemplo a placa Jetson Orin NX.

Conecte o sensor de atitude IMU à interface I2C do Jetson Orin NX conforme mostrado na figura abaixo.

![Jetson orin IIC通讯\.jpg](../../../../en/多主控通讯案例/IIC通讯/Jetson系列/图片和附件/Jetson%20orin%20IIC通讯.jpg)

![image\.png](../../../../en/多主控通讯案例/IIC通讯/Jetson系列/图片和附件/image.png)

## 2\. Verificar o estado do dispositivo

Primeiro, instale o I2Ctool; digite no terminal:

```PowerShell
sudo apt-get update
sudo apt-get install -y i2c-tools
```

Verificar o dispositivo I2C

```PowerShell
sudo i2cdetect -y -r -a 7
```

![Screenshot from 2026\-02\-05 11\-09\-35\.png](../../../../en/多主控通讯案例/IIC通讯/Jetson系列/图片和附件/Screenshot%20from%202026-02-05%2011-09-35.png)

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

![截图\_20260203182313\.png](../../../../en/多主控通讯案例/IIC通讯/Jetson系列/图片和附件/截图_20260203182313.png)

## 4\. Verificar os dados da imu

**Entre no diretório \~/IMU\_Library e execute o arquivo IMU\_Serial\_Library\.py**

```PowerShell
cd ~/imu_ros2/src/IMU_ROS2/IMU_Library

# Executar o arquivo de impressão de dados do IMU
python3 -m IMU_Library.IMU_I2C_Library
```

![Screenshot from 2026\-02\-05 11\-07\-24\.png](../../../../en/多主控通讯案例/IIC通讯/Jetson系列/图片和附件/Screenshot%20from%202026-02-05%2011-07-24.png)

Atenção: os dados acima referem-se à leitura de dados de uma IMU de 10 eixos; a versão de 6 eixos não possui dados do magnetômetro (Magnetometer) nem do barômetro (Barometer), e a de 9 eixos não possui dados do barômetro (Barometer).

## **5\.Calibração da IMU**

**Entre no diretório \~/IMU\_Library e execute o arquivo imu\_calibration\_tool\.py**

```PowerShell
cd ~/IMU_Library

# Executar o arquivo de código de calibração do IMU --calibração de comunicação I2C
# Executar todas as calibrações (global, magnetômetro, temperatura)
python3 -m IMU_Library.imu_calibration_tool --mode i2c --port 7

# Apenas calibração global
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 7 --calibrate imu

# Apenas calibração do magnetômetro
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 7 --calibrate mag

# Apenas calibração de temperatura
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 7 --calibrate temp
```

![Screenshot from 2026\-02\-05 11\-08\-46\.png](../../../../en/多主控通讯案例/IIC通讯/Jetson系列/图片和附件/Screenshot%20from%202026-02-05%2011-08-46.png)

## 6\. Observações

Ao usar placas da série orin, é necessário modificar o número do barramento I2C de acordo com a situação real; o local da modificação é mostrado na figura abaixo. Normalmente é o barramento 7

![截图\_20260203191332\.png](../../../../en/多主控通讯案例/IIC通讯/Jetson系列/图片和附件/截图_20260203191332.png)

![截图\_20260203191406\.png](../../../../en/多主控通讯案例/IIC通讯/Jetson系列/图片和附件/截图_20260203191406.png)



