# Console hôte Web – Guide d'utilisation

Ce guide explique comment utiliser **JX IMU Studio** dans un navigateur pour connecter, surveiller et calibrer le module IMU haute précision JuxiTech. La version Web ne nécessite aucune installation : elle se connecte au port série via l'API Web Serial et peut être déployée sur GitHub Pages.

> La version Web n'est prise en charge que par Chrome / Edge sur ordinateur. Les navigateurs ne peuvent pas accéder à l'I2C ; les utilisateurs I2C doivent continuer à utiliser le pilote système ou les outils de bureau. L'interface peut basculer entre le chinois et l'anglais ; les captures ci-dessous utilisent l'interface anglaise.

## 1. Ouvrir la page

En ligne :

<https://juxi-technology.github.io/ICM42670P-High-Precision-IMU-Module/>

Aperçu local (facultatif, Python requis) :

```bash
python -m http.server 5173 --directory <répertoire web>
```

Ouvrez ensuite <http://localhost:5173>. Web Serial exige un contexte sécurisé (HTTPS ou localhost) ; ouvrir `index.html` via `file://` peut désactiver le port série.

## 2. Prérequis

- **Chrome / Edge** sur ordinateur (version 89 ou ultérieure recommandée)
- Pilote USB-série (CH340, CP210x, etc.)
- Appareil alimenté, débit **115200**
- Firefox, Safari et les navigateurs mobiles ne prennent pas en charge Web Serial
- Aucune installation de Python, Qt ou logiciel client

## 3. Connecter l'appareil

1. Ouvrez la page ; la source est fixée à **Série**.
2. Cliquez sur **Choisir un appareil série…** et sélectionnez le port de l'IMU dans la boîte de dialogue (par exemple `USB-SERIAL CH340`).
3. Cliquez sur **Connecter**. L'état passe à **Connecté** et affiche la version du firmware, les axes détectés et le débit de données.
4. La console détecte automatiquement les appareils 6 / 9 / 10 axes et affiche l'algorithme de fusion ; les appareils 10 axes utilisent l'algorithme 9 axes.
5. Cliquez sur **Déconnecter** pour terminer. Si l'appareil est débranché, la page se déconnecte automatiquement.

![Connexion et surveillance](../../en/Web-Host-Console-Tutorial/Images/01-overview.png)

> Lors de la première utilisation, le navigateur demande l'autorisation d'accéder au port série. Si la liste est vide, installez d'abord le pilote USB-série.

## 4. Présentation de l'interface

La barre supérieure contient le port série, l'algorithme de fusion, la déclinaison magnétique, l'inversion du tangage, l'inversion de la boussole et le bouton de connexion. En dessous se trouvent cinq onglets :

| Onglet | Fonction |
|--------|----------|
| Surveillance | Accéléromètre, gyroscope, magnétomètre, angles d'Euler, quaternion, baromètre |
| Courbes | Quatre groupes de courbes défilantes, pause et effacement |
| Attitude 3D | Cube 3D, flèches des axes, boussole, calibration du zéro |
| Instruments | Carte de boussole rotative et horizon artificiel |
| Calibration | Calibration IMU, magnétomètre, température et réinitialisation |

Le bouton **EN / 中文** en haut à droite change la langue de l'interface.

## 5. Surveillance

Six cartes affichent les valeurs en temps réel :

- **Accéléromètre** : unité g, ±16 g ; environ +1 g sur Z à l'horizontale au repos.
- **Gyroscope** : unité rad/s, ±2000 °/s ; proche de 0 au repos.
- **Magnétomètre** : unité μT, ±800 μT ; champ terrestre d'environ 25–65 μT.
- **Angles d'Euler** : Roll / Pitch / Yaw en degrés ; Yaw de 0 à 360°.
- **Quaternion** : W / X / Y / Z, norme unitaire.
- **Baromètre** : altitude (m), température (℃), pression (hPa) et pression de référence (hPa) sur les modèles 10 axes.

La barre colorée sous chaque valeur indique le rapport à la pleine échelle.

## 6. Courbes

- Changez de groupe en haut : Accéléromètre (g) / Gyroscope (rad/s) / Magnétomètre (μT) / Angles d'Euler (°).
- Chaque groupe contient trois courbes X/Y/Z ou Roll/Pitch/Yaw aux couleurs fixes.
- Chaque courbe conserve les **300 derniers échantillons**, à environ 100 Hz.
- **Pause** fige le graphique ; **Effacer** réinitialise les tampons. Changer de groupe n'efface pas les autres groupes.
- La légende affiche la dernière valeur de chaque voie.

![Courbes en temps réel](../../en/Web-Host-Console-Tutorial/Images/02-plots.png)

> La courbe d'angle d'Euler présente un saut vertical lorsque Yaw passe de 360° à 0° : il s'agit d'un repliement d'angle, pas d'une erreur de données.

## 7. Attitude 3D

- Le cube tourne en temps réel avec Roll / Pitch / Yaw.
- **Glissez avec le bouton gauche** pour tourner la vue, **molette** pour zoomer.
- Les axes X / Y / Z sont des flèches rouge / verte / bleue, toujours dessinées au-dessus du cube pour rester lisibles.
- La boussole de droite est une carte rotative : les graduations et N/E/S/W tournent avec l'appareil, tandis que le repère doré en haut indique le cap.
- **Calibrer la position actuelle** : définit l'attitude actuelle comme zéro ; cela n'affecte que la vue 3D et n'est pas écrit dans l'appareil.
- **Réinitialiser la calibration** : efface le décalage du zéro.

![Attitude 3D](../../en/Web-Host-Console-Tutorial/Images/03-attitude.png)

## 8. Instruments

- **Boussole** : le cadran tourne avec le cap, le repère doré reste fixe en haut ; la valeur du cap est affichée au-dessus et en dessous.
- **Horizon artificiel** : la limite ciel/sol se déplace avec le tangage et tourne avec le roulis. Un horizon au-dessus du centre signifie nez vers le haut, en dessous nez vers le bas.
- Si le N suit l'appareil au lieu d'indiquer le nord, activez **Compass invert**.
- Si le nez vers le haut est affiché vers le bas, activez **Pitch flip** (Roll et Pitch sont tous deux inversés).

![Instruments](../../en/Web-Host-Console-Tutorial/Images/04-instruments.png)

## 9. Calibration des capteurs

La page de calibration propose quatre opérations ; le journal affiche le code d'état renvoyé par l'appareil :

1. **Calibration IMU** : posez l'appareil à plat et immobile, cliquez puis restez immobile quelques secondes pour corriger les biais de l'accéléromètre et du gyroscope.
2. **Calibration du magnétomètre** : cliquez puis faites tourner lentement l'appareil en huit pendant 10 à 30 secondes, en couvrant toutes les orientations ; éloignez téléphones, moteurs et objets ferromagnétiques.
3. **Calibration de température** : saisissez la température ambiante actuelle (−50 ℃ à 50 ℃) et cliquez sur **Calibrer la température**.
4. **Réinitialiser la calibration** : efface toutes les valeurs de calibration stockées dans la mémoire flash. À utiliser avec prudence et recalibrer ensuite.

Les boutons sont désactivés pendant la calibration et l'état affiche **Calibration en cours…**. À la fin, le journal affiche **Calibration terminée (état 0)** ou le code renvoyé. En cas de délai dépassé, un avertissement s'affiche ; vérifiez la connexion et réessayez.

![Calibration des capteurs](../../en/Web-Host-Console-Tutorial/Images/05-calibration.png)

## 10. Corrections de direction

- **Déclinaison** : compensation du cap sur ±180°. Entrez une valeur négative si la boussole indique l'ouest du nord vrai, positive si elle indique l'est ; en Chine de l'Est, environ −4° à −10°. Elle peut aussi corriger l'angle de montage.
- **Inversion du tangage** : inverse Roll et Pitch ensemble, utile si le repère de l'appareil est opposé à la convention logicielle.
- **Inversion de la boussole** : inverse uniquement la rotation de la boussole, sans affecter l'attitude 3D ni les valeurs.

Les trois options se trouvent dans la barre de connexion et s'appliquent immédiatement, sans reconnexion.

## 11. Dépannage

**Q1 : Aucun appareil dans « Choisir un appareil série… ».**
Vérifiez le câble USB et l'alimentation, installez le pilote CH340/CP210x et essayez un autre port ou câble.

**Q2 : Connecté mais aucune donnée.**
Vérifiez le débit 115200 et que le port n'est pas utilisé par un autre logiciel ; débranchez puis rebranchez l'appareil.

**Q3 : Le navigateur indique que Web Serial n'est pas pris en charge.**
Utilisez Chrome / Edge sur ordinateur via HTTPS ou localhost. Firefox, Safari et les navigateurs mobiles ne sont pas pris en charge.

**Q4 : L'appareil est débranché pendant la connexion.**
La page revient à l'état déconnecté et affiche un message ; rebranchez puis reconnectez.

**Q5 : Le Yaw dérive lentement.**
Un appareil 6 axes n'a pas de référence magnétique, la dérive du Yaw est normale. Pour les appareils 9/10 axes, effectuez d'abord la calibration IMU et du magnétomètre et éloignez les sources magnétiques.

**Q6 : La boussole présente un décalage fixe par rapport au nord.**
Ajustez la **Déclinaison** : négative vers l'ouest, positive vers l'est. Si le sens de rotation est inversé, activez **Compass invert**.

**Q7 : La vue 3D ou l'instrument inverse nez haut/bas.**
Activez **Pitch flip** ; Roll et Pitch sont tous deux inversés.

## 12. Données et confidentialité

La version Web est une page purement statique sans serveur backend. Les données série sont analysées et affichées uniquement dans votre navigateur et ne sont jamais envoyées sur le réseau. La page ne charge aucun script tiers ni code d'analyse. La fermeture de la page efface les données.
