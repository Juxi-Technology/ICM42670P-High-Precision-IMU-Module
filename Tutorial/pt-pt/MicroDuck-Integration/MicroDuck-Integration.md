# Utilizar o módulo IMU com o MicroDuck

Este módulo pode substituir a IMU do tronco do MicroDuck — a placa `imu_to_dxl` que circula no barramento dos servos — passando a utilizar I²C.

## Estado

| | |
|---|---|
| Cadeia de dados da IMU: amostragem, descodificação, slots de observação | **verificada em hardware real** |
| Integração no runtime do MicroDuck (`robotd`) | **planeada para a fase de integração** |

> **Âmbito**: o módulo I²C externo é uma solução transitória. O projeto final integrará a IMU no hardware do robô e no controlador principal; a cablagem, os eixos e a calibração desta página continuam válidos.

**Guia completo e código: [Juxi-Technology/imu-displace-microduck](https://github.com/Juxi-Technology/imu-displace-microduck)**

Esse repositório é a versão de referência desta página: a cablagem exata, o procedimento de calibração, a lista de aceitação e os valores medidos estão lá. Esta página é apenas a entrada.

## Cablagem

| | |
|---|---|
| Módulo | ICM-42670-P, escravo I²C **0x23** |
| Pinos | GND / 3V3 / SDA / SCL |
| Alimentação | **3V3 — não 5V**; a E/S do anfitrião é de 3,3 V |
| Barramento (HAT oficial) | `/dev/i2c-pihat` = `/dev/i2c-3`; `/dev/i2c-4` depois de mover R18/R19 para R16/R17 no J6 |
| Conflitos de endereço | 0x18 (áudio), 0x19/0x68 ou 0x6A (IMU integrada) e 0x29 (ToF) já estão nesse barramento — **0x23 não colide com nenhum** |

```bash
sudo apt install -y i2c-tools
sudo i2cdetect -y -r <número do barramento>        # esperado: 23
```

## Porque não é o ID 200 do Dynamixel

O ID 200 é um número de dispositivo no **barramento dos servos** — TTL meio-duplex de um só fio a 1 Mbps, Dynamixel Protocol V2. Este módulo fala **I²C**: dois fios, acesso a registos. Ligá-lo ao conector I²C do HAT não o transforma em ID 200; o anfitrião lê os dois barramentos em separado e funde-os numa única amostra de sensor.

## Verificação (apenas o módulo, sem servos)

```bash
cargo run -p duck-control --example imu_probe -- /dev/i2c-7 20
cargo run -p duck-control --example imu_to_observation -- /dev/i2c-7 20
```

| Esperado | |
|---|---|
| Taxa de amostragem | ~100 Hz, nenhuma falha de leitura |
| Segundo comando | nenhuma divergência em `obs[0..3]` (giroscópio), `obs[3..6]` (gravidade) e nos blocos das articulações |

Medido num Jetson Orin Nano com `/dev/i2c-7`: 99,4 Hz, 0,92 ms por amostra, nenhuma falha de leitura.

## Montagem de referência

Os eixos do módulo coincidem com os do tronco — **X para a frente / Y para a esquerda / Z para cima** — o que fisicamente significa **face dos componentes para cima, Type-C para trás**. Assim, a rotação de montagem é a **identidade**.

O referencial próprio do módulo, medido em três poses ortogonais: deitado com a face dos componentes para cima, a gravidade vale `[0, 0, -1]`; Type-C para cima, `[1, 0, 0]`; ao alto, com a face dos componentes para a direita, `[0, 1, 0]`.

---
## Próximos passos

- Integrar o módulo no runtime do `robotd`: caminho do barramento, origem da IMU e montagem configuráveis.
- Dar à IMU a sua própria thread de captura e um slot partilhado, para que a leitura I²C não ocupe o tick de controlo.
- Validar o robô completo com o barramento real de 15 servos e a política de marcha; o projeto final integrará a IMU no hardware do robô e no controlador principal.
