# Changing the IMU Module's Output Rate

**Bottom line:** **over serial you can set 10–100 Hz; over I²C you cannot — it is fixed at roughly 115–118 Hz.** The setting is stored in flash and survives power-off.

---

## 1. Serial: how to set it

### Frame format

```
7E 23 07 60 <rate in Hz> 5F <checksum>
```

| Field | Value |
|-|-|
| Header | `7E 23` |
| Length | **fixed `0x07`** (7 bytes total) |
| Function | **`0x60`** = set data output rate |
| Parameter 1 | rate, **10–100 Hz** |
| Parameter 2 | **fixed `0x5F`** |
| Checksum | sum from `7E` through `5F`, low byte |

> ⚠️ **Do not omit Parameter 2's `0x5F`.** Without it the length and the checksum are both wrong, and the module **reports no error and returns no failure — it quietly ignores the whole frame**, so it is easy to conclude, wrongly, that the module cannot change rate.

### Common frames

| Rate | Full frame |
|-|-|
| 10 Hz | `7E 23 07 60 0A 5F 71` |
| **20 Hz** | `7E 23 07 60 14 5F 7B` |
| 25 Hz | `7E 23 07 60 19 5F 80` |
| 50 Hz | `7E 23 07 60 32 5F 99` |
| 100 Hz | `7E 23 07 60 64 5F CB` |

### How to send it

- **Serial terminal**: 115200 8N1, send the hex bytes above directly.
- **Official library**: `set_report_rate(hz)` in `IMU_Serial_Library`.
- Wait about 1 second for the setting to take effect.

---

## 2. Measured results

| Setting | Frame arrival rate | **Effective output rate** | Longest consecutive repeat |
|-|-|-|-|
| 20 Hz | 20.8 Hz | **20.7 Hz** | 1 (no repeat) |
| 50 Hz | 52.9 Hz | **52.8 Hz** | 1 |
| 100 Hz | 105.6 Hz | **104.0 Hz** | 2 |

Two observations:

1. **The effective output rate ≈ the arrival rate**, which means the module's internal fusion really runs at the configured rate, and **at low rates it does not keep resending the same frame**.
2. The actual value runs **3–8% above the setting** (set 20, get 20.8; set 100, get 105.6). That is the module's own clock tolerance and is normal.

---

## 3. Does the setting survive power-off?

Set it to 20 Hz → unplug Type-C for 3 seconds → plug it back in → measure again: **still 20.7 Hz**.

**The setting lives in flash, so setting it once is enough** — there is no need to resend it on every power-up.

> Corollary: **new modules ship at the factory default of 25 Hz**, so set it once during first installation and confirm it; after that you can forget about it.

---

## 4. I²C: not changeable

All three checks were run:

| Check | Result |
|-|-|
| Set 20 Hz over serial, then poll register `0x16` over I²C | the quaternion still changes at **115.4 Hz** (polled at 115.8 Hz) → **unchanged** |
| Poll as fast as possible with no delay (1779 Hz) and look at the median repeat length | corresponds to **~111 Hz** → fixed rate |
| Write register `0x60 = 20` directly over I²C | rate **unchanged**; `0x60` always reads back `0` |

**Conclusion: no interface can change the I²C rate; it is fixed at roughly 115–118 Hz.** It is not "throttled down to a maximum" — it is the module's fixed fusion output rate.

---

## 5. One thing you must know: polling too fast returns torn values

Polling at 471 Hz while counting whether two consecutive reads are identical gives a repeat-length distribution of:

```
length 1: 333 times     ← read the middle of a register update
length 3: 114 times     ← normal
length 4: 182 times     ← normal
```

471 ÷ 4 ≈ 118 Hz, which matches the refresh rate. The **333 length-1 reads are torn** — half-old, half-new values read while the module was updating its 16-byte register block.

**The danger is that a torn quaternion is still a valid unit quaternion** (two adjacent poses differ by only about 9 ms, so the blend is very close), and a norm check cannot catch it.

👉 **Do not poll much faster than 150 Hz.** 50–100 Hz is the most stable, and that is exactly the range of MicroDuck's control loop (50 Hz) and IMU thread (100 Hz).

---

## 6. What this means for MicroDuck

| | |
|-|-|
| **I²C path** (module wired to the HAT's I²C header) | **no rate setting needed**; the fixed ~115 Hz is already enough |
| Serial path rate | affects only automatic serial output, and is unrelated to what I²C returns |
| The docs' "100 Hz from the factory, confirm it on a new module" | **only matters to serial users**; I²C users need not care |

Full integration guide: [Juxi-Technology/imu-displace-microduck](https://github.com/Juxi-Technology/imu-displace-microduck)
