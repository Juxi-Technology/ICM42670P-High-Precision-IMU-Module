# Modification de la fréquence de sortie du module IMU

**En bref :** **en série, vous pouvez régler de 10 à 100 Hz ; en I²C, non — elle est fixée à environ 115–118 Hz.** Le réglage est stocké en flash et survit à la mise hors tension.

---

## 1. Série : comment le régler

### Format de trame

```
7E 23 07 60 <rate in Hz> 5F <checksum>
```

| Champ | Valeur |
|-|-|
| En-tête | `7E 23` |
| Longueur | **fixe `0x07`** (7 bytes au total) |
| Fonction | **`0x60`** = définir la fréquence de sortie des données |
| Paramètre 1 | fréquence, **10–100 Hz** |
| Paramètre 2 | **fixe `0x5F`** |
| Somme de contrôle | somme de `7E` à `5F`, octet de poids faible |

> ⚠️ **N'omettez pas le `0x5F` du paramètre 2.** Sans lui, la longueur et la somme de contrôle sont toutes deux fausses, et le module **ne signale aucune erreur et ne renvoie aucun échec — il ignore silencieusement la trame entière**, ce qui amène facilement à conclure, à tort, que le module ne peut pas changer de fréquence.

### Trames courantes

| Fréquence | Trame complète |
|-|-|
| 10 Hz | `7E 23 07 60 0A 5F 71` |
| **20 Hz** | `7E 23 07 60 14 5F 7B` |
| 25 Hz | `7E 23 07 60 19 5F 80` |
| 50 Hz | `7E 23 07 60 32 5F 99` |
| 100 Hz | `7E 23 07 60 64 5F CB` |

### Comment l'envoyer

- **Terminal série** : 115200 8N1, envoyez directement les octets hexadécimaux ci-dessus.
- **Bibliothèque officielle** : `set_report_rate(hz)` dans `IMU_Serial_Library`.
- Attendez environ 1 seconde que le réglage prenne effet.

---

## 2. Résultats mesurés

| Réglage | Fréquence d'arrivée des trames | **Fréquence de sortie effective** | Plus longue répétition consécutive |
|-|-|-|-|
| 20 Hz | 20.8 Hz | **20.7 Hz** | 1 (aucune répétition) |
| 50 Hz | 52.9 Hz | **52.8 Hz** | 1 |
| 100 Hz | 105.6 Hz | **104.0 Hz** | 2 |

Deux observations :

1. **La fréquence de sortie effective ≈ la fréquence d'arrivée**, ce qui signifie que la fusion interne du module tourne réellement à la fréquence configurée, et **qu'aux basses fréquences il ne renvoie pas en boucle la même trame**.
2. La valeur réelle est **3–8 % au-dessus du réglage** (réglé sur 20, obtenu 20.8 ; réglé sur 100, obtenu 105.6). C'est la tolérance d'horloge propre au module, et c'est normal.

---

## 3. Le réglage survit-il à la mise hors tension ?

Réglez-le sur 20 Hz → débranchez le Type-C pendant 3 secondes → rebranchez-le → mesurez à nouveau : **toujours 20.7 Hz**.

**Le réglage vit en flash, donc le définir une seule fois suffit** — il est inutile de le renvoyer à chaque mise sous tension.

> Corollaire : **les modules neufs sortent à la valeur d'usine de 25 Hz**, donc réglez-la une fois lors de la première installation et vérifiez-la ; ensuite vous pouvez l'oublier.

---

## 4. I²C : non modifiable

Les trois vérifications ont été effectuées :

| Vérification | Résultat |
|-|-|
| Régler 20 Hz en série, puis interroger le registre `0x16` en I²C | le quaternion change toujours à **115.4 Hz** (interrogé à 115.8 Hz) → **inchangé** |
| Interroger aussi vite que possible sans délai (1779 Hz) et examiner la longueur médiane des répétitions | correspond à **~111 Hz** → fréquence fixe |
| Écrire directement le registre `0x60 = 20` en I²C | fréquence **inchangée** ; `0x60` renvoie toujours `0` |

**Conclusion : aucune interface ne peut modifier la fréquence I²C ; elle est fixée à environ 115–118 Hz.** Il ne s'agit pas d'un « bridage à un maximum » — c'est la fréquence de sortie de fusion fixe du module.

---

## 5. Une chose à absolument savoir : une interrogation trop rapide renvoie des valeurs déchirées

Interroger à 471 Hz en comptant si deux lectures consécutives sont identiques donne la distribution suivante des longueurs de répétition :

```
length 1: 333 times     ← read the middle of a register update
length 3: 114 times     ← normal
length 4: 182 times     ← normal
```

471 ÷ 4 ≈ 118 Hz, ce qui correspond à la fréquence de rafraîchissement. Les **333 lectures de longueur 1 sont déchirées** — des valeurs à moitié anciennes et à moitié nouvelles, lues pendant que le module mettait à jour son bloc de registres de 16 bytes.

**Le danger est qu'un quaternion déchiré reste un quaternion unitaire valide** (deux poses adjacentes ne diffèrent que d'environ 9 ms, donc le mélange est très proche), et un contrôle de norme ne peut pas le détecter.

👉 **N'interrogez pas à une fréquence très supérieure à 150 Hz.** 50–100 Hz est le plus stable, et c'est exactement la plage de la boucle de contrôle de MicroDuck (50 Hz) et de son thread IMU (100 Hz).

---

## 6. Ce que cela implique pour MicroDuck

| | |
|-|-|
| **Voie I²C** (module câblé sur le connecteur I²C du HAT) | **aucun réglage de fréquence nécessaire** ; le ~115 Hz fixe suffit déjà |
| Fréquence de la voie série | n'affecte que la sortie série automatique, et n'a aucun rapport avec ce que renvoie l'I²C |
| Le « 100 Hz en sortie d'usine, à vérifier sur un module neuf » de la documentation | **ne concerne que les utilisateurs du série** ; les utilisateurs de l'I²C n'ont pas à s'en soucier |

Guide d'intégration complet : [Juxi-Technology/imu-displace-microduck](https://github.com/Juxi-Technology/imu-displace-microduck)
