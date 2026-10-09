# Série RDK

## 1\. Ligar o dispositivo

Este tutorial usa como exemplo a imagem da versão ？ da placa RDK X5.

Ligue o sensor de atitude IMU à interface I2C do RDK X5 como mostrado na figura abaixo.

![RDK IIC通讯\.jpg](../../../../en/多主控通讯案例/IIC通讯/RDK系列/图片和附件/RDK%20IIC通讯.jpg)

![RDK X5 针脚图\.jpg](../../../../en/多主控通讯案例/IIC通讯/RDK系列/图片和附件/RDK%20X5%20针脚图.jpg)

## 2\. Verificar o estado do dispositivo

Verificar o dispositivo I2C

```PowerShell
python3 /app/40pin_samples/test_i2c.py
```

![image\.png](../../../../en/多主控通讯案例/IIC通讯/RDK系列/图片和附件/image.png)

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

![截图\_20260203182313\.png](../../../../en/多主控通讯案例/IIC通讯/RDK系列/图片和附件/截图_20260203182313.png)

## 4\. Verificar os dados da imu

**Entre no diretório \~/IMU\_Library e execute o ficheiro IMU\_Serial\_Library\.py**

```PowerShell
cd ~/imu_ros1/src/IMU_ROS1/IMU_Library
# ou
cd ~/imu_ros2/src/IMU_ROS2/IMU_Library

# Executar o ficheiro de impressão de dados do IMU
python3 -m IMU_Library.IMU_I2C_Library
```

![截图\_20260203175633\.png](../../../../en/多主控通讯案例/IIC通讯/RDK系列/图片和附件/截图_20260203175633.png)

Atenção: os dados acima referem-se à leitura de dados de uma IMU de 10 eixos; a versão de 6 eixos não tem dados do magnetómetro (Magnetometer) nem do barómetro (Barometer), e a de 9 eixos não tem dados do barómetro (Barometer).

## **5\.Calibração da IMU**

**Entre no diretório \~/IMU\_Library e execute o ficheiro imu\_calibration\_tool\.py**

```PowerShell
cd ~/IMU_Library

# Executar o ficheiro de código de calibração do IMU --calibração de comunicação I2C
# Executar todas as calibrações (global, magnetómetro, temperatura)
python3 -m IMU_Library.imu_calibration_tool --mode i2c --port 0

# Apenas calibração global
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 0 --calibrate imu

# Apenas calibração do magnetómetro
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 0 --calibrate mag

# Apenas calibração de temperatura
python3-m IMU_Library.imu_calibration_tool --mode i2c --port 0 --calibrate temp
```

![截图\_20260203174958\.png](../../../../en/多主控通讯案例/IIC通讯/RDK系列/图片和附件/截图_20260203174958.png)

## 6\. Observações

Ao utilizar a placa RDK X5, é necessário modificar o número do barramento I2C de acordo com a situação real; o local da modificação é mostrado na figura abaixo. Normalmente é o barramento 0.

![截图\_20260203191332\.png](../../../../en/多主控通讯案例/IIC通讯/RDK系列/图片和附件/截图_20260203191332.png)

![截图\_20260203191406\.png](../../../../en/多主控通讯案例/IIC通讯/RDK系列/图片和附件/截图_20260203191406.png)



