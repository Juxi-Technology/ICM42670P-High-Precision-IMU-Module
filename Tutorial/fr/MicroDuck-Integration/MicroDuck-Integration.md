# Utiliser le module IMU avec MicroDuck

Ce module peut remplacer l'IMU du tronc de MicroDuck — la carte `imu_to_dxl` qui voyage sur le bus des servos — par une liaison I²C.

## État

| | |
|---|---|
| Chaîne de données IMU : échantillonnage, décodage, slots d'observation | **vérifiée sur matériel réel** |
| Intégration au runtime MicroDuck (`robotd`) | **pas encore implémentée** |

**Guide complet et code : [Juxi-Technology/imu-displace-microduck](https://github.com/Juxi-Technology/imu-displace-microduck)**

C'est ce dépôt qui fait foi. Le câblage exact, la procédure de calibration, la liste de recette et les mesures s'y trouvent ; cette page n'est qu'une entrée.

## Câblage

| | |
|---|---|
| Module | ICM-42670-P, esclave I²C **0x23** |
| Broches | GND / 3V3 / SDA / SCL |
| Alimentation | **3V3 — pas 5V** ; les E/S de l'hôte sont en 3,3 V |
| Bus (HAT officiel) | `/dev/i2c-pihat` = `/dev/i2c-3` ; `/dev/i2c-4` après avoir déplacé R18/R19 vers R16/R17 sur J6 |
| Conflits d'adresses | 0x18 (audio), 0x19/0x68 ou 0x6A (IMU embarqué) et 0x29 (ToF) sont déjà sur ce bus — **0x23 n'entre en conflit avec aucune** |

```bash
sudo apt install -y i2c-tools
sudo i2cdetect -y -r <numéro de bus>        # attendu : 23
```

## Pourquoi ce n'est pas l'ID 200 de Dynamixel

L'ID 200 est un numéro d'appareil sur le **bus des servos** — TTL demi-duplex sur un fil, 1 Mbps, Dynamixel Protocol V2. Ce module parle **I²C** : deux fils, accès à des registres. Le brancher sur le connecteur I²C du HAT ne le transforme pas en ID 200 ; l'hôte lit les deux bus séparément puis les fusionne en un seul échantillon de capteur.

## Vérification (module seul, sans servos)

```bash
cargo run -p duck-control --example imu_probe -- /dev/i2c-7 20
cargo run -p duck-control --example imu_to_observation -- /dev/i2c-7 20
```

| Attendu | |
|---|---|
| Fréquence d'échantillonnage | ~100 Hz, aucune erreur de lecture |
| Deuxième commande | aucune incohérence dans `obs[0..3]` (gyro), `obs[3..6]` (gravité) ni les blocs d'articulations |

Mesuré sur un Jetson Orin Nano avec `/dev/i2c-7` : 99,4 Hz, 0,92 ms par échantillon, aucune erreur de lecture.

## Montage de référence

Les axes du module coïncident avec ceux du tronc — **X avant / Y gauche / Z haut** — soit physiquement **face composants vers le haut, Type-C vers l'arrière**. La rotation de montage est alors l'**identité**.

Le repère propre au module, mesuré sur trois poses orthogonales : à plat face composants en haut, la gravité vaut `[0, 0, -1]` ; Type-C en haut, `[1, 0, 0]` ; sur la tranche avec la face composants à droite, `[0, 1, 0]`.
