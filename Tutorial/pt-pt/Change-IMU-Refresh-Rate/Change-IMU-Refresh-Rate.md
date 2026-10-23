# Alterar a taxa de saída do módulo IMU

**Em resumo:** **através da série pode definir 10–100 Hz; através de I²C não pode — está fixa em cerca de 115–118 Hz.** A configuração é guardada na flash e mantém-se após desligar a alimentação.

---

## 1. Série: como definir

### Formato do frame

```
7E 23 07 60 <rate in Hz> 5F <checksum>
```

| Campo | Valor |
|-|-|
| Cabeçalho | `7E 23` |
| Comprimento | **fixo `0x07`** (7 bytes no total) |
| Função | **`0x60`** = definir taxa de saída de dados |
| Parâmetro 1 | taxa, **10–100 Hz** |
| Parâmetro 2 | **fixo `0x5F`** |
| Checksum | soma de `7E` até `5F`, byte de menor peso |

> ⚠️ **Não omita o `0x5F` do Parâmetro 2.** Sem ele, tanto o comprimento como o checksum ficam errados, e o módulo **não reporta erro nem devolve falha — ignora silenciosamente o frame inteiro**, pelo que é fácil concluir, erradamente, que o módulo não consegue alterar a taxa.

### Frames comuns

| Taxa | Frame completo |
|-|-|
| 10 Hz | `7E 23 07 60 0A 5F 71` |
| **20 Hz** | `7E 23 07 60 14 5F 7B` |
| 25 Hz | `7E 23 07 60 19 5F 80` |
| 50 Hz | `7E 23 07 60 32 5F 99` |
| 100 Hz | `7E 23 07 60 64 5F CB` |

### Como enviar

- **Terminal série**: 115200 8N1, envie diretamente os bytes hex acima.
- **Biblioteca oficial**: `set_report_rate(hz)` em `IMU_Serial_Library`.
- Aguarde cerca de 1 segundo para a configuração entrar em vigor.

---

## 2. Resultados medidos

| Configuração | Taxa de chegada dos frames | **Taxa de saída efetiva** | Maior repetição consecutiva |
|-|-|-|-|
| 20 Hz | 20.8 Hz | **20.7 Hz** | 1 (sem repetição) |
| 50 Hz | 52.9 Hz | **52.8 Hz** | 1 |
| 100 Hz | 105.6 Hz | **104.0 Hz** | 2 |

Duas observações:

1. **A taxa de saída efetiva ≈ a taxa de chegada**, o que significa que a fusão interna do módulo funciona realmente à taxa configurada, e **em taxas baixas não continua a reenviar o mesmo frame**.
2. O valor real fica **3–8% acima da configuração** (definir 20, obter 20.8; definir 100, obter 105.6). Trata-se da tolerância do próprio relógio do módulo e é normal.

---

## 3. A configuração mantém-se após desligar a alimentação?

Defina 20 Hz → desligue o Type-C durante 3 segundos → volte a ligá-lo → meça novamente: **continua 20.7 Hz**.

**A configuração reside na flash, por isso basta defini-la uma vez** — não é necessário reenviá-la a cada arranque.

> Corolário: **os módulos novos vêm com o valor de fábrica de 25 Hz**, por isso defina-a uma vez durante a primeira instalação e confirme-a; depois disso pode esquecer o assunto.

---

## 4. I²C: não é alterável

Foram feitos os três testes:

| Teste | Resultado |
|-|-|
| Definir 20 Hz via série e depois consultar o registo `0x16` via I²C | o quaternião continua a mudar a **115.4 Hz** (consultado a 115.8 Hz) → **inalterado** |
| Consultar o mais rápido possível, sem atraso (1779 Hz), e analisar o comprimento mediano das repetições | corresponde a **~111 Hz** → taxa fixa |
| Escrever diretamente o registo `0x60 = 20` via I²C | taxa **inalterada**; `0x60` lê sempre `0` |

**Conclusão: nenhuma interface consegue alterar a taxa de I²C; está fixa em cerca de 115–118 Hz.** Não é um "limite máximo imposto" — é a taxa de saída de fusão fixa do módulo.

---

## 5. Uma coisa que tem de saber: consultar demasiado depressa devolve valores truncados

Consultar a 471 Hz enquanto se conta se duas leituras consecutivas são iguais dá a seguinte distribuição de comprimentos de repetição:

```
length 1: 333 times     ← read the middle of a register update
length 3: 114 times     ← normal
length 4: 182 times     ← normal
```

471 ÷ 4 ≈ 118 Hz, o que corresponde à taxa de atualização. As **333 leituras de comprimento 1 estão truncadas** — são valores meio antigos, meio novos, lidos enquanto o módulo atualizava o seu bloco de registos de 16 bytes.

**O perigo é que um quaternião truncado continua a ser um quaternião unitário válido** (duas poses adjacentes diferem apenas cerca de 9 ms, pelo que a mistura fica muito próxima), e uma verificação da norma não o deteta.

👉 **Não consulte muito mais depressa do que 150 Hz.** 50–100 Hz é o mais estável, e é exatamente o intervalo do ciclo de controlo do MicroDuck (50 Hz) e da thread da IMU (100 Hz).

---

## 6. O que isto significa para o MicroDuck

| | |
|-|-|
| **Caminho I²C** (módulo ligado ao header I²C do HAT) | **não é necessário definir taxa**; os ~115 Hz fixos já são suficientes |
| Taxa do caminho série | afeta apenas a saída série automática e não tem relação com o que o I²C devolve |
| O "100 Hz de fábrica, confirme num módulo novo" da documentação | **só interessa aos utilizadores da série**; quem usa I²C não precisa de se preocupar |

Guia de integração completo: [Juxi-Technology/imu-displace-microduck](https://github.com/Juxi-Technology/imu-displace-microduck)
