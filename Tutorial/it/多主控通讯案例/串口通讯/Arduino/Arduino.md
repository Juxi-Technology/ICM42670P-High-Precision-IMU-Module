# Arduino

In questo esempio si utilizza una scheda di sviluppo Arduino Nano, un computer Windows, alcuni cavi Dupont, un sensore di assetto IMU e un modulo USB a TTL.

[Arduino\.rar](/downloads/Arduino.rar)

## 1\.Collegamento del dispositivo

![高精度IMU姿态传感器\.png](../../../../en/多主控通讯案例/串口通讯/Arduino/图片和附件/高精度IMU姿态传感器.png)

![高精度IMU姿态传感器 \(1\)\.png](../../../../en/多主控通讯案例/串口通讯/Arduino/图片和附件/高精度IMU姿态传感器%20%281%29.png)

![v2\-5bfe8060e5e61480044f79ff6d5e27cd\_r\.jpg](../../../../en/多主控通讯案例/串口通讯/Arduino/图片和附件/v2-5bfe8060e5e61480044f79ff6d5e27cd_r.jpg)

## 2\.Analisi del codice chiave

Per il codice specifico fare riferimento al codice sorgente nei materiali.

```C++
//Analizzare i dati nel buffer circolare, estrarre le trame complete e aggiornare la cache
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

    // Elaborare tutti i dati nel buffer circolare
    while (_rxbuf_pop(&current_byte) == 0) {
        switch (rx_state) {
        case RX_STATE_EXPECT_HEAD1:
            // Cercare l'intestazione di trama 1
            if (current_byte == FRAME_HEAD1) {
                rx_state = RX_STATE_EXPECT_HEAD2;
            }
            // Altrimenti rimanere nello stato corrente
            break;

        case RX_STATE_EXPECT_HEAD2:
            // Cercare l'intestazione di trama 2
            if (current_byte == FRAME_HEAD2) {
                rx_state = RX_STATE_EXPECT_LENGTH;
            } else {
                // L'intestazione non corrisponde, ricominciare la ricerca
                rx_state = RX_STATE_EXPECT_HEAD1;
            }
            break;

        case RX_STATE_EXPECT_LENGTH:
            // Salvare la lunghezza della trama
            frame_length = current_byte;
            rx_state = RX_STATE_EXPECT_FUNCTION;
            break;

        case RX_STATE_EXPECT_FUNCTION:
            // Salvare il codice funzione
            frame_function = current_byte;
            frame_index = 0;
            rx_state = RX_STATE_COLLECT_DATA;
            break;

        case RX_STATE_COLLECT_DATA: {
            // Calcolare la lunghezza dei dati (lunghezza trama - intestazione 2 byte - lunghezza 1 byte - codice funzione 1 byte)
            uint16_t data_length = (frame_length >= 4) ? (uint16_t)(frame_length - 4) : 0;
            
            // Verificare se la lunghezza dei dati è valida
            if (data_length == 0 || data_length > sizeof(frame_buffer)) {
                rx_state = RX_STATE_EXPECT_HEAD1;
                break;
            }

            // Memorizzare il byte corrente
            frame_buffer[frame_index++] = current_byte;
            
            // Verificare se tutti i dati sono stati raccolti
            if (frame_index >= data_length) {
                // Calcolare il checksum
                uint8_t calculated_checksum = (uint8_t)(FRAME_HEAD1 + FRAME_HEAD2 + frame_length + frame_function);
                for (uint16_t i = 0; i < data_length - 1; ++i) {
                    calculated_checksum += frame_buffer[i];
                }

                // Verificare il checksum
                uint8_t received_checksum = frame_buffer[data_length - 1];
                if (calculated_checksum == received_checksum) {
                    // Verifica superata, analizzare i dati
                    _parse_frame_data(frame_function, frame_buffer);
                }
                
                // Reimpostare lo stato, prepararsi a ricevere la trama successiva
                rx_state = RX_STATE_EXPECT_HEAD1;
            }
        } break;

        default:
            // Stato sconosciuto, reimpostare
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
            // Definire i fattori di scala costanti
            const float ACCEL_RATIO = 16.0f / 32767.0f;
            const float DEG2RAD = 3.14159265358979323846f / 180.0f;
            const float GYRO_RATIO = (2000.0f / 32767.0f) * DEG2RAD;
            const float MAG_RATIO = 800.0f / 32767.0f;
            
            // Analizzare i dati di accelerazione
            s_ax = to_int16(&frame_data[0])  * ACCEL_RATIO;
            s_ay = to_int16(&frame_data[2])  * ACCEL_RATIO;
            s_az = to_int16(&frame_data[4])  * ACCEL_RATIO;

            // Analizzare i dati del giroscopio
            s_gx = to_int16(&frame_data[6])  * GYRO_RATIO;
            s_gy = to_int16(&frame_data[8])  * GYRO_RATIO;
            s_gz = to_int16(&frame_data[10]) * GYRO_RATIO;

            // Analizzare i dati del magnetometro
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
            // Tipo di trama sconosciuto, è possibile aggiungere la gestione degli errori
            break;
    }
}
```

IMU\_UART\_Process\(\): legge i dati dalla cache e chiama \_parse\_frame\_data per analizzare i dati conformi al protocollo di comunicazione.

\_parse\_frame\_data\(\): analizza la trama di dati.

## 3\.Lettura dei dati della imu

Dopo aver scaricato il programma nell'Arduino, aprire l'assistente di porta seriale (con i parametri di configurazione mostrati nella figura seguente); si potrà notare che i dati del modulo IMU vengono stampati continuamente e, quando cambiamo l'assetto del modulo IMU, i dati cambiano.

![截图\_20260226183106\.png](../../../../en/多主控通讯案例/串口通讯/Arduino/图片和附件/截图_20260226183106.png)

Nota: quanto sopra corrisponde alla lettura dei dati di una IMU a 10 assi; quella a 6 assi non dispone dei dati del magnetometro (Magnetometer) e del barometro (Barometer), mentre quella a 9 assi non dispone dei dati del barometro (Barometer).



