# Arduino

This example uses an Arduino Nano development board, a Windows computer, several jumper wires, and the IMU attitude sensor.

[Arduino\.rar](/downloads/Arduino.rar)

## 1\. Connect the Device

![高精度IMU姿态传感器 \(2\)\.png](图片和附件/高精度IMU姿态传感器%20%282%29.png)

![v2\-5bfe8060e5e61480044f79ff6d5e27cd\_r\.jpg](图片和附件/v2-5bfe8060e5e61480044f79ff6d5e27cd_r.jpg)

## 2\. Key Code Analysis

For the specific code, please refer to the source code in the materials.

```C++
/**
 * @brief 通用读取传感器数据的辅助函数
 *        Generic helper function to read sensor data
 */
static int read_sensor_data(uint8_t reg, uint8_t *buffer, uint16_t length, float out[], uint8_t out_size, float scale_factor, bool is_float)
{
    if (read_register(reg, buffer, length) != 0) {
        return -1;
    }
    
    if (out != NULL) {
        if (is_float) {
            // Process float data
            for (uint8_t i = 0; i < out_size; i++) {
                out[i] = to_float(&buffer[i * 4]);
            }
        } else {
            // Process integer data and apply the scale factor
            for (uint8_t i = 0; i < out_size; i++) {
                out[i] = to_int16(&buffer[i * 2]) * scale_factor;
            }
        }
    }
    return 0;
}

/**
 * @brief 读取加速度数据（单位 g）
 *        Read acceleration in g.
 */
int IMU_I2C_ReadAccelerometer(float out[3])
{
    uint8_t register_data[6];
    return read_sensor_data(IMU_FUNC_RAW_ACCEL, register_data, 6, out, 3, ACCEL_SCALE_FACTOR, false);
}

/**
 * @brief 读取角速度（单位 rad/s）
 *        Read angular velocity in rad/s.
 */
int IMU_I2C_ReadGyroscope(float out[3])
{
    uint8_t register_data[6];
    return read_sensor_data(IMU_FUNC_RAW_GYRO, register_data, 6, out, 3, GYRO_SCALE_FACTOR, false);
}

/**
 * @brief 读取磁场强度（单位 uT）
 *        Read magnetic field strength in micro tesla.
 */
int IMU_I2C_ReadMagnetometer(float out[3])
{
    uint8_t register_data[6];
    return read_sensor_data(IMU_FUNC_RAW_MAG, register_data, 6, out, 3, MAG_SCALE_FACTOR, false);
}

/**
 * @brief 读取四元数
 *        Read quaternion (w, x, y, z).
 */
int IMU_I2C_ReadQuaternion(float out[4])
{
    uint8_t register_data[16];
    return read_sensor_data(IMU_FUNC_QUAT, register_data, 16, out, 4, 1.0f, true);
}

/**
 * @brief 读取欧拉角（弧度）
 *        Read Euler angles (rad).
 */
int IMU_I2C_ReadEuler(float out[3])
{
    uint8_t register_data[12];
    int result = read_sensor_data(IMU_FUNC_EULER, register_data, 12, out, 3, 1.0f, true);
    
    // Convert to degrees
    if (result == 0 && out != NULL) {
        out[0] *= RAD2DEG;
        out[1] *= RAD2DEG;
        out[2] *= RAD2DEG;
    }
    
    return result;
}
/**
 * @brief 读取气压相关数据：高度、温度、气压、气压差
 *        Read barometric data: height, temperature, pressure, delta.
 */
int IMU_I2C_ReadBarometer(float out[4])
{
    uint8_t register_data[16];
    if (read_register(IMU_FUNC_BARO, register_data, 16) != 0) {
        return -1;
    }
    if (out != NULL) {
        out[0] = to_float(&register_data[0]);
        out[1] = to_float(&register_data[4]);
        out[2] = to_float(&register_data[8]);
        out[3] = to_float(&register_data[12]);
    }
    return 0;
}

```

read\_sensor\_data\(\): generic helper function to read sensor data

IMU\_I2C\_ReadAccelerometer\(\): read acceleration data (in g)

IMU\_I2C\_ReadGyroscope\(\): read angular velocity (in rad/s)

IMU\_I2C\_ReadQuaternion\(\): read quaternion

IMU\_I2C\_ReadEuler\(\): read Euler angles (rad)

IMU\_I2C\_ReadBarometer\(\): read barometer-related data: height, temperature, pressure, pressure difference

## 3\. Read imu Data

After the program is downloaded to the Arduino, open the serial assistant (configuration parameters as shown in the figure below), and you can see that the IMU module data is printed continuously. When we change the attitude of the IMU module, the data will change.

![截图\_20260226194619\.png](图片和附件/截图_20260226194619.png)

Note: The above is the data reading for a 10-axis IMU. The 6-axis has no magnetometer (Magnetometer) or barometer (Barometer) data, and the 9-axis has no barometer (Barometer) data.

