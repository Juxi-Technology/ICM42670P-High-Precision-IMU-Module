# Cambiar la frecuencia de salida del módulo IMU

**En resumen:** **por serial puedes ajustarla entre 10 y 100 Hz; por I²C no — está fija en aproximadamente 115–118 Hz.** El ajuste se guarda en la flash y sobrevive al apagado.

---

## 1. Serial: cómo configurarla

### Formato de la trama

```
7E 23 07 60 <rate in Hz> 5F <checksum>
```

| Campo | Valor |
|-|-|
| Encabezado | `7E 23` |
| Longitud | **fija `0x07`** (7 bytes en total) |
| Función | **`0x60`** = ajustar la frecuencia de salida de datos |
| Parámetro 1 | frecuencia, **10–100 Hz** |
| Parámetro 2 | **fijo `0x5F`** |
| Checksum | suma desde `7E` hasta `5F`, byte bajo |

> ⚠️ **No omitas el `0x5F` del Parámetro 2.** Sin él, tanto la longitud como el checksum son incorrectos, y el módulo **no informa de ningún error ni devuelve ningún fallo: ignora la trama completa en silencio**, así que es fácil concluir, equivocadamente, que el módulo no puede cambiar la frecuencia.

### Tramas habituales

| Frecuencia | Trama completa |
|-|-|
| 10 Hz | `7E 23 07 60 0A 5F 71` |
| **20 Hz** | `7E 23 07 60 14 5F 7B` |
| 25 Hz | `7E 23 07 60 19 5F 80` |
| 50 Hz | `7E 23 07 60 32 5F 99` |
| 100 Hz | `7E 23 07 60 64 5F CB` |

### Cómo enviarla

- **Terminal serial**: 115200 8N1, envía directamente los bytes hexadecimales indicados arriba.
- **Librería oficial**: `set_report_rate(hz)` en `IMU_Serial_Library`.
- Espera aproximadamente 1 segundo a que el ajuste surta efecto.

---

## 2. Resultados medidos

| Ajuste | Frecuencia de llegada de tramas | **Frecuencia de salida efectiva** | Repetición consecutiva más larga |
|-|-|-|-|
| 20 Hz | 20.8 Hz | **20.7 Hz** | 1 (sin repetición) |
| 50 Hz | 52.9 Hz | **52.8 Hz** | 1 |
| 100 Hz | 105.6 Hz | **104.0 Hz** | 2 |

Dos observaciones:

1. **La frecuencia de salida efectiva ≈ la frecuencia de llegada**, lo que significa que la fusión interna del módulo realmente se ejecuta a la frecuencia configurada y que **a frecuencias bajas no reenvía la misma trama una y otra vez**.
2. El valor real está **3–8 % por encima del ajuste** (ajustas 20, obtienes 20.8; ajustas 100, obtienes 105.6). Es la tolerancia de reloj propia del módulo y es normal.

---

## 3. ¿Sobrevive el ajuste al apagado?

Ajusta 20 Hz → desconecta el Type-C durante 3 segundos → vuelve a conectarlo → mide de nuevo: **sigue en 20.7 Hz**.

**El ajuste reside en la flash, así que basta con configurarlo una vez** — no hace falta reenviarlo en cada encendido.

> Corolario: **los módulos nuevos salen con el valor de fábrica de 25 Hz**, así que configúralo una vez durante la primera instalación y confírmalo; después puedes olvidarte de ello.

---

## 4. I²C: no se puede cambiar

Se realizaron las tres comprobaciones:

| Comprobación | Resultado |
|-|-|
| Ajustar 20 Hz por serial y luego consultar el registro `0x16` por I²C | el cuaternión sigue cambiando a **115.4 Hz** (consultado a 115.8 Hz) → **sin cambios** |
| Consultar lo más rápido posible sin retardo (1779 Hz) y observar la longitud mediana de repetición | corresponde a **~111 Hz** → frecuencia fija |
| Escribir el registro `0x60 = 20` directamente por I²C | frecuencia **sin cambios**; `0x60` siempre se lee como `0` |

**Conclusión: ninguna interfaz puede cambiar la frecuencia de I²C; está fija en aproximadamente 115–118 Hz.** No es que se "limite a un máximo": es la frecuencia de salida de fusión fija del módulo.

---

## 5. Algo que debes saber: consultar demasiado rápido devuelve valores entrecortados

Consultando a 471 Hz mientras se cuenta si dos lecturas consecutivas son idénticas, se obtiene una distribución de longitudes de repetición de:

```
length 1: 333 times     ← read the middle of a register update
length 3: 114 times     ← normal
length 4: 182 times     ← normal
```

471 ÷ 4 ≈ 118 Hz, lo que coincide con la frecuencia de refresco. Las **333 lecturas de longitud 1 están entrecortadas**: son valores mitad viejos, mitad nuevos, leídos mientras el módulo estaba actualizando su bloque de registros de 16 bytes.

**El peligro es que un cuaternión entrecortado sigue siendo un cuaternión unitario válido** (dos poses adyacentes difieren solo unos 9 ms, así que la mezcla queda muy cerca), y una comprobación de norma no puede detectarlo.

👉 **No consultes mucho más rápido de 150 Hz.** 50–100 Hz es lo más estable, y ese es exactamente el rango del bucle de control de MicroDuck (50 Hz) y de su hilo de IMU (100 Hz).

---

## 6. Qué significa esto para MicroDuck

| | |
|-|-|
| **Ruta I²C** (módulo conectado al conector I²C del HAT) | **no hace falta ajustar ninguna frecuencia**; los ~115 Hz fijos ya son suficientes |
| Frecuencia de la ruta serial | solo afecta a la salida serial automática y no tiene relación con lo que devuelve el I²C |
| El "100 Hz de fábrica, confírmalo en un módulo nuevo" de la documentación | **solo importa a los usuarios de serial**; a los usuarios de I²C no les afecta |

Guía de integración completa: [Juxi-Technology/imu-displace-microduck](https://github.com/Juxi-Technology/imu-displace-microduck)
