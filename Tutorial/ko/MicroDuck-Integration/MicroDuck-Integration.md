# IMU 모듈을 MicroDuck에 사용하기

이 모듈은 MicroDuck의 몸통 IMU — 서보 버스에 올라가 있는 `imu_to_dxl` 보드 — 를 I²C로 연결한 이 모듈로 대체할 수 있습니다.

## 상태

| | |
|---|---|
| IMU 데이터 경로: 샘플링, 디코딩, 관측 슬롯 | **실제 하드웨어에서 검증 완료** |
| MicroDuck 런타임(`robotd`) 연결 | **아직 구현되지 않음** |

**전체 가이드와 코드: [Juxi-Technology/imu-displace-microduck](https://github.com/Juxi-Technology/imu-displace-microduck)**

그 저장소가 이 문서의 정본입니다. 정확한 배선, 캘리브레이션 절차, 인수 체크리스트, 실측값이 모두 그쪽에 있습니다. 이 페이지는 입구일 뿐입니다.

## 배선

| | |
|---|---|
| 모듈 | ICM-42670-P, I²C 슬레이브 **0x23** |
| 핀 | GND / 3V3 / SDA / SCL |
| 전원 | **3V3. 5V 사용 금지** (호스트 I/O는 3.3 V) |
| 버스(공식 HAT) | `/dev/i2c-pihat` = `/dev/i2c-3`; J6의 R18/R19를 R16/R17로 옮기면 `/dev/i2c-4` |
| 주소 충돌 | 같은 버스에 0x18(오디오), 0x19/0x68 또는 0x6A(온보드 IMU), 0x29(ToF)가 이미 있지만 **0x23은 어느 것과도 충돌하지 않습니다** |

```bash
sudo apt install -y i2c-tools
sudo i2cdetect -y -r <버스 번호>        # 23이 보여야 합니다
```

## Dynamixel ID 200이 될 수 없는 이유

ID 200은 **서보 버스**의 장치 번호입니다(단선 하프 듀플렉스 TTL, 1 Mbps, Dynamixel Protocol V2). 이 모듈은 **I²C**(2선, 레지스터 읽기/쓰기)를 사용합니다. HAT의 I²C 헤더에 연결해도 ID 200이 되지 않습니다. 호스트는 두 버스를 따로 읽어 하나의 센서 샘플로 합칩니다.

## 검증 (모듈만, 서보 불필요)

```bash
cargo run -p duck-control --example imu_probe -- /dev/i2c-7 20
cargo run -p duck-control --example imu_to_observation -- /dev/i2c-7 20
```

| 기대값 | |
|---|---|
| 샘플레이트 | 약 100 Hz, 읽기 실패 0회 |
| 두 번째 명령 | `obs[0..3]`(자이로), `obs[3..6]`(중력), 관절 블록 **불일치 0** |

Jetson Orin Nano + `/dev/i2c-7` 실측: 99.4 Hz, 샘플당 0.92 ms, 읽기 실패 0회.

## 기준 장착 방식

모듈의 세 축을 몸통 축과 일치시킵니다 — **X 전방 / Y 좌측 / Z 상방** — 물리적으로는 **부품면을 위로, Type-C를 뒤쪽으로** 둡니다. 이때 mount 회전은 **단위 쿼터니언**입니다.

모듈 자체 좌표계(직교하는 세 자세로 실측): 부품면을 위로 하고 평평하게 두면 중력이 `[0, 0, -1]`, Type-C를 위로 하면 `[1, 0, 0]`, 부품면을 오른쪽으로 하고 세우면 `[0, 1, 0]`.
