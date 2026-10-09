# Arduino

本次例程使用的是Arduino Nano開發版，一台windows電腦、杜邦線若干、IMU姿態傳感器、USB轉TTL模組。

[Arduino\.rar](/downloads/Arduino.rar)

## 1\.連接裝置

![高精度IMU姿态传感器\.png](../../../../en/多主控通讯案例/串口通讯/Arduino/图片和附件/高精度IMU姿态传感器.png)

![高精度IMU姿态传感器 \(1\)\.png](../../../../en/多主控通讯案例/串口通讯/Arduino/图片和附件/高精度IMU姿态传感器%20%281%29.png)

![v2\-5bfe8060e5e61480044f79ff6d5e27cd\_r\.jpg](../../../../en/多主控通讯案例/串口通讯/Arduino/图片和附件/v2-5bfe8060e5e61480044f79ff6d5e27cd_r.jpg)

## 2\.關鍵代碼解析

具體代碼請看資料中的源碼。

```C++
//解析環形緩衝中的數據，提取完整幀並更新緩存
​
//Process RX ring buffer, parse frames and update internal cache
​
void IMU_UART_Process(void)
{
    enum {
        RX_STATE_EXPECT_HEAD1 = 0,
        RX_STATE_EXPECT_HEAD2,
        RX_STATE_EXPECT_LENGTH,
        RX_STATE_EXPECT_FUNCTION,
        RX_STATE_COLLECT_DATA
    };

    static uint8_t  rx_state = RX_STATE_EXPECT_HEAD1;
    static uint8_t  frame_length = 0;
    static uint8_t  frame_function = 0;
    static uint8_t  frame_buffer[64]; /* 数据区 + 校验 / data section + checksum */
    static uint16_t frame_index = 0;

    uint8_t current_byte = 0;

    // 處理環形緩衝區中的所有數據
    while (_rxbuf_pop(&current_byte) == 0) {
        switch (rx_state) {
        case RX_STATE_EXPECT_HEAD1:
            // 尋找幀頭1
            if (current_byte == FRAME_HEAD1) {
                rx_state = RX_STATE_EXPECT_HEAD2;
            }
            // 否則保持在當前狀態
            break;

        case RX_STATE_EXPECT_HEAD2:
            // 尋找幀頭2
            if (current_byte == FRAME_HEAD2) {
                rx_state = RX_STATE_EXPECT_LENGTH;
            } else {
                // 幀頭不匹配，重新開始尋找
                rx_state = RX_STATE_EXPECT_HEAD1;
            }
            break;

        case RX_STATE_EXPECT_LENGTH:
            // 保存幀長度
            frame_length = current_byte;
            rx_state = RX_STATE_EXPECT_FUNCTION;
            break;

        case RX_STATE_EXPECT_FUNCTION:
            // 保存功能碼
            frame_function = current_byte;
            frame_index = 0;
            rx_state = RX_STATE_COLLECT_DATA;
            break;

        case RX_STATE_COLLECT_DATA: {
            // 計算數據長度（幀長度 - 幀頭2字節 - 長度1字節 - 功能碼1字節）
            uint16_t data_length = (frame_length >= 4) ? (uint16_t)(frame_length - 4) : 0;
            
            // 檢查數據長度是否有效
            if (data_length == 0 || data_length > sizeof(frame_buffer)) {
                rx_state = RX_STATE_EXPECT_HEAD1;
                break;
            }

            // 儲存當前字節
            frame_buffer[frame_index++] = current_byte;
            
            // 檢查是否收集完所有數據
            if (frame_index >= data_length) {
                // 計算校驗和
                uint8_t calculated_checksum = (uint8_t)(FRAME_HEAD1 + FRAME_HEAD2 + frame_length + frame_function);
                for (uint16_t i = 0; i < data_length - 1; ++i) {
                    calculated_checksum += frame_buffer[i];
                }

                // 驗證校驗和
                uint8_t received_checksum = frame_buffer[data_length - 1];
                if (calculated_checksum == received_checksum) {
                    // 校驗通過，解析數據
                    _parse_frame_data(frame_function, frame_buffer);
                }
                
                // 重置狀態，準備接收下一幀
                rx_state = RX_STATE_EXPECT_HEAD1;
            }
        } break;

        default:
            // 未知狀態，重置
            rx_state = RX_STATE_EXPECT_HEAD1;
            break;
        }
    }
}
​
​
/* ---------- 解析数据帧 / Parse one complete frame ---------- */
static void _parse_frame_data(uint8_t frame_function, const uint8_t *frame_data)
{
    switch (frame_function) {
        case IMU_FUNC_RAW_ACCEL: {
            // 定義常量比例因子
            const float ACCEL_RATIO = 16.0f / 32767.0f;
            const float DEG2RAD = 3.14159265358979323846f / 180.0f;
            const float GYRO_RATIO = (2000.0f / 32767.0f) * DEG2RAD;
            const float MAG_RATIO = 800.0f / 32767.0f;
            
            // 解析加速度數據
            s_ax = to_int16(&frame_data[0])  * ACCEL_RATIO;
            s_ay = to_int16(&frame_data[2])  * ACCEL_RATIO;
            s_az = to_int16(&frame_data[4])  * ACCEL_RATIO;

            // 解析陀螺儀數據
            s_gx = to_int16(&frame_data[6])  * GYRO_RATIO;
            s_gy = to_int16(&frame_data[8])  * GYRO_RATIO;
            s_gz = to_int16(&frame_data[10]) * GYRO_RATIO;

            // 解析磁力計數據
            s_mx = to_int16(&frame_data[12]) * MAG_RATIO;
            s_my = to_int16(&frame_data[14]) * MAG_RATIO;
            s_mz = to_int16(&frame_data[16]) * MAG_RATIO;
            break;
        }
        case IMU_FUNC_EULER:
            s_roll  = to_float(&frame_data[0]);
            s_pitch = to_float(&frame_data[4]);
            s_yaw   = to_float(&frame_data[8]);
            break;
        case IMU_FUNC_QUAT:
            s_q0 = to_float(&frame_data[0]);
            s_q1 = to_float(&frame_data[4]);
            s_q2 = to_float(&frame_data[8]);
            s_q3 = to_float(&frame_data[12]);
            break;
        case IMU_FUNC_BARO:
            s_height            = to_float(&frame_data[0]);
            s_temperature       = to_float(&frame_data[4]);
            s_pressure          = to_float(&frame_data[8]);
            s_pressure_contrast = to_float(&frame_data[12]);
            break;
        case IMU_FUNC_VERSION:
            s_version_high = frame_data[0];
            s_version_mid  = frame_data[1];
            s_version_low  = frame_data[2];
            break;
        case IMU_FUNC_RETURN_STATE:
            s_last_rx_function = frame_data[0];
            s_last_rx_state    = (int16_t)frame_data[1];
            break;
        default:
            // 未知幀類型，可添加錯誤處理
            break;
    }
}
```

IMU\_UART\_Process\(\): 讀取緩存的數據，並呼叫\_parse\_frame\_data解析符合通信協定的數據。

\_parse\_frame\_data\(\)：解析數據幀。

## 3\.讀取imu數據

程式下載進入Arduino後，打開串口助手（配置參數如下圖所示），可以看到一直列印IMU模組的數據，當我們改變IMU模組的姿態，數據會發生變化。

![截图\_20260226183106\.png](../../../../en/多主控通讯案例/串口通讯/Arduino/图片和附件/截图_20260226183106.png)

注意：以上為10軸IMU的數據讀取，6軸無磁力計（Magnetometer）與氣壓計（Barometer）數據，9軸無氣壓計（Barometer）數據。



