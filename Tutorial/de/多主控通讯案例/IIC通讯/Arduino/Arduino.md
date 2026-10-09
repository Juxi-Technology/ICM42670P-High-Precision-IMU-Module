# Arduino

Für dieses Beispiel werden ein Arduino Nano Entwicklungsboard, ein Windows-Computer, einige Dupont-Kabel und ein IMU-Lagesensor verwendet.

[Arduino\.rar](/downloads/Arduino.rar)

## 1\.Gerät anschließen

![高精度IMU姿态传感器 \(2\)\.png](../../../../en/多主控通讯案例/IIC通讯/Arduino/图片和附件/高精度IMU姿态传感器%20%282%29.png)

![v2\-5bfe8060e5e61480044f79ff6d5e27cd\_r\.jpg](../../../../en/多主控通讯案例/IIC通讯/Arduino/图片和附件/v2-5bfe8060e5e61480044f79ff6d5e27cd_r.jpg)

## 2\.Analyse des Schlüsselcodes

Den konkreten Code finden Sie im Quellcode der Materialien.

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
            // Verarbeitung von Gleitkommadaten
            for (uint8_t i = 0; i < out_size; i++) {
                out[i] = to_float(&buffer[i * 4]);
            }
        } else {
            // Verarbeitung von Ganzzahldaten und Anwendung des Skalierungsfaktors
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
    
    // Umrechnung in Grad
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

read\_sensor\_data\(\):Allgemeine Hilfsfunktion zum Auslesen der Sensordaten

IMU\_I2C\_ReadAccelerometer\(\):Auslesen der Beschleunigungsdaten (Einheit g)

IMU\_I2C\_ReadGyroscope\(\):Auslesen der Winkelgeschwindigkeit (Einheit rad/s)

IMU\_I2C\_ReadQuaternion\(\):Auslesen des Quaternions

IMU\_I2C\_ReadEuler\(\): Auslesen der Euler-Winkel (Bogenmaß)

IMU\_I2C\_ReadBarometer\(\):Auslesen der barometrischen Daten: Höhe, Temperatur, Luftdruck, Druckdifferenz

## 3\.Auslesen der IMU-Daten

Nachdem das Programm auf den Arduino heruntergeladen wurde, öffnen Sie den seriellen Assistenten (Konfigurationsparameter siehe Abbildung unten); Sie sehen, dass die Daten des IMU-Moduls kontinuierlich ausgegeben werden. Wenn wir die Lage des IMU-Moduls ändern, ändern sich auch die Daten.

![截图\_20260226194619\.png](../../../../en/多主控通讯案例/IIC通讯/Arduino/图片和附件/截图_20260226194619.png)

Hinweis: Das Obige ist das Auslesen der Daten eines 10-Achsen-IMU. Die 6-Achsen-Version hat keine Daten des Magnetometers (Magnetometer) und des Barometers (Barometer), die 9-Achsen-Version hat keine Barometer-Daten (Barometer).

