# Alterando a Taxa de Saída do Módulo IMU

**Resumindo:** **pela serial você pode definir 10–100 Hz; pelo I²C não — ela é fixa em aproximadamente 115–118 Hz.** A configuração fica armazenada na flash e sobrevive ao desligamento.

---

## 1. Serial: como definir

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
| Checksum | soma de `7E` até `5F`, byte menos significativo |

> ⚠️ **Não omita o `0x5F` do Parâmetro 2.** Sem ele, tanto o comprimento quanto o checksum ficam errados, e o módulo **não reporta erro nem retorna falha — ele simplesmente ignora o frame inteiro em silêncio**, então é fácil concluir, de forma equivocada, que o módulo não consegue mudar a taxa.

### Frames comuns

| Taxa | Frame completo |
|-|-|
| 10 Hz | `7E 23 07 60 0A 5F 71` |
| **20 Hz** | `7E 23 07 60 14 5F 7B` |
| 25 Hz | `7E 23 07 60 19 5F 80` |
| 50 Hz | `7E 23 07 60 32 5F 99` |
| 100 Hz | `7E 23 07 60 64 5F CB` |

### Como enviar

- **Terminal serial**: 115200 8N1, envie os bytes hexadecimais acima diretamente.
- **Biblioteca oficial**: `set_report_rate(hz)` em `IMU_Serial_Library`.
- Aguarde cerca de 1 segundo para a configuração entrar em vigor.

---

## 2. Resultados medidos

| Configuração | Taxa de chegada dos frames | **Taxa de saída efetiva** | Maior sequência de repetições consecutivas |
|-|-|-|-|
| 20 Hz | 20.8 Hz | **20.7 Hz** | 1 (sem repetição) |
| 50 Hz | 52.9 Hz | **52.8 Hz** | 1 |
| 100 Hz | 105.6 Hz | **104.0 Hz** | 2 |

Duas observações:

1. **A taxa de saída efetiva ≈ a taxa de chegada**, o que significa que a fusão interna do módulo realmente roda na taxa configurada e que **em taxas baixas ele não fica reenviando o mesmo frame**.
2. O valor real fica **3–8% acima** do configurado (define 20, obtém 20.8; define 100, obtém 105.6). Essa é a tolerância de clock do próprio módulo e é normal.

---

## 3. A configuração sobrevive ao desligamento?

Defina 20 Hz → desconecte o Type-C por 3 segundos → conecte novamente → meça de novo: **ainda 20.7 Hz**.

**A configuração fica na flash, então defini-la uma vez já basta** — não é preciso reenviá-la a cada inicialização.

> Corolário: **os módulos novos saem de fábrica com o padrão de 25 Hz**, então defina uma vez durante a primeira instalação e confirme; depois disso você pode esquecer.

---

## 4. I²C: não é alterável

As três verificações foram executadas:

| Verificação | Resultado |
|-|-|
| Definir 20 Hz pela serial e depois ler o registrador `0x16` pelo I²C | o quaternion continua mudando a **115.4 Hz** (lido a 115.8 Hz) → **sem alteração** |
| Ler o mais rápido possível, sem atraso (1779 Hz), e observar o comprimento mediano das repetições | corresponde a **~111 Hz** → taxa fixa |
| Gravar o registrador `0x60 = 20` diretamente pelo I²C | taxa **sem alteração**; `0x60` sempre é lido de volta como `0` |

**Conclusão: nenhuma interface consegue alterar a taxa do I²C; ela é fixa em aproximadamente 115–118 Hz.** Não é que ela seja "limitada a um máximo" — é a taxa de saída de fusão fixa do módulo.

---

## 5. Uma coisa que você precisa saber: polling rápido demais retorna valores truncados

Fazer polling a 471 Hz enquanto se conta se duas leituras consecutivas são idênticas resulta na seguinte distribuição de comprimentos de repetição:

```
length 1: 333 times     ← read the middle of a register update
length 3: 114 times     ← normal
length 4: 182 times     ← normal
```

471 ÷ 4 ≈ 118 Hz, o que corresponde à taxa de atualização. As **333 leituras de comprimento 1 estão truncadas** — valores meio antigos, meio novos, lidos enquanto o módulo atualizava seu bloco de registradores de 16 bytes.

**O perigo é que um quaternion truncado ainda é um quaternion unitário válido** (duas poses adjacentes diferem em apenas cerca de 9 ms, então a mistura fica muito próxima), e uma verificação de norma não consegue detectar isso.

👉 **Não faça polling muito mais rápido que 150 Hz.** 50–100 Hz é o mais estável, e essa é exatamente a faixa do loop de controle do MicroDuck (50 Hz) e da thread de IMU (100 Hz).

---

## 6. O que isso significa para o MicroDuck

| | |
|-|-|
| **Caminho I²C** (módulo ligado ao conector I²C do HAT) | **nenhuma configuração de taxa é necessária**; os ~115 Hz fixos já são suficientes |
| Taxa do caminho serial | afeta apenas a saída serial automática e não tem relação com o que o I²C retorna |
| O item da documentação "100 Hz de fábrica, confirme em um módulo novo" | **só importa para usuários de serial**; usuários de I²C não precisam se preocupar |

Guia completo de integração: [Juxi-Technology/imu-displace-microduck](https://github.com/Juxi-Technology/imu-displace-microduck)
