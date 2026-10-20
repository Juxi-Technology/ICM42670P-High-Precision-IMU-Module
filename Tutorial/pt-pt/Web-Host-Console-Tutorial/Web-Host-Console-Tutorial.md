# Consola web do anfitrião – Guia de utilização

Este guia explica como utilizar o **JX IMU Studio** no navegador para ligar, monitorizar e calibrar o módulo IMU de alta precisão da JuxiTech. A versão web não requer instalação: liga-se à porta série através da API Web Serial e pode ser publicada no GitHub Pages.

> A versão web só é compatível com Chrome / Edge de secretária. Os navegadores não acedem a I2C; os utilizadores de I2C devem continuar a usar o controlador do sistema ou as ferramentas de secretária. A interface pode alternar entre chinês e inglês; as capturas mostram a interface em inglês.

## 1. Abrir a página

Online:

<https://juxi-technology.github.io/ICM42670P-High-Precision-IMU-Module/>

Pré-visualização local (opcional, requer Python):

```bash
python -m http.server 5173 --directory <diretório web>
```

Depois abra <http://localhost:5173>. O Web Serial exige um contexto seguro (HTTPS ou localhost); abrir `index.html` através de `file://` pode desativar a porta série.

## 2. Requisitos

- **Chrome / Edge** de secretária (recomendado 89 ou superior)
- Controlador USB-série (CH340, CP210x, etc.)
- Dispositivo ligado, baud rate **115200**
- Firefox, Safari e navegadores móveis não suportam Web Serial
- Não é necessário instalar Python, Qt ou software cliente

## 3. Ligar o dispositivo

1. Abra a página; a origem está fixa em **Série**.
2. Clique em **Escolher dispositivo série…** e selecione a porta do IMU na janela do navegador (por exemplo `USB-SERIAL CH340`).
3. Clique em **Ligar**. O estado muda para **Ligado** e mostra a versão do firmware, os eixos detetados e a taxa de dados.
4. A consola deteta automaticamente hardware de 6 / 9 / 10 eixos e apresenta o algoritmo de fusão; os dispositivos de 10 eixos utilizam o algoritmo de 9 eixos.
5. Clique em **Desligar** no final. Se o dispositivo for removido, a página desliga-se automaticamente.

![Ligação e monitorização](../../en/Web-Host-Console-Tutorial/Images/01-overview.png)

> Na primeira utilização, o navegador pede autorização para aceder à porta série. Se a lista estiver vazia, instale primeiro o controlador USB-série.

## 4. Vista geral da interface

A barra superior contém porta série, algoritmo de fusão, declinação magnética, inversão de pitch, inversão da bússola e botão de ligação. Abaixo existem cinco separadores:

| Separador | Função |
|-----------|--------|
| Monitorização | Acelerómetro, giroscópio, magnetómetro, ângulos de Euler, quaternião, barómetro |
| Gráficos | Quatro grupos de curvas rolantes, pausa e limpeza |
| Atitude 3D | Cubo 3D, setas dos eixos, bússola, calibração de zero |
| Instrumentos | Cartão de bússola giratório e horizonte artificial |
| Calibração | Calibração de IMU, magnetómetro, temperatura e reposição |

O botão **EN / 中文** no canto superior direito alterna o idioma da interface.

## 5. Monitorização

Seis cartões mostram valores em tempo real:

- **Acelerómetro**: unidade g, ±16 g; na horizontal e em repouso, o eixo Z mostra cerca de +1 g.
- **Giroscópio**: unidade rad/s, ±2000 °/s; próximo de 0 em repouso.
- **Magnetómetro**: unidade μT, ±800 μT; o campo terrestre é cerca de 25–65 μT.
- **Ângulos de Euler**: Roll / Pitch / Yaw em graus; Yaw de 0 a 360°.
- **Quaternião**: W / X / Y / Z, norma unitária.
- **Barómetro**: altitude (m), temperatura (℃), pressão (hPa) e pressão de referência (hPa) em modelos de 10 eixos.

A barra colorida abaixo de cada valor mostra a proporção em relação ao fundo de escala.

## 6. Gráficos

- Alterne o grupo no topo: Acelerómetro (g) / Giroscópio (rad/s) / Magnetómetro (μT) / Ângulos de Euler (°).
- Cada grupo tem três curvas X/Y/Z ou Roll/Pitch/Yaw com cores fixas.
- Cada curva mantém as últimas **300 amostras**, a cerca de 100 Hz.
- **Pausar** congela o gráfico; **Limpar** reinicia os buffers. Mudar de grupo não apaga os restantes.
- A legenda mostra o valor mais recente de cada canal.

![Gráficos em tempo real](../../en/Web-Host-Console-Tutorial/Images/02-plots.png)

> O gráfico de ângulos de Euler mostra um salto vertical quando o Yaw passa de 360° para 0°; é um envolvimento de ângulo, não um erro de dados.

## 7. Atitude 3D

- O cubo gira em tempo real com Roll / Pitch / Yaw.
- **Arraste com o botão esquerdo** para rodar a vista e **use a roda** para zoom.
- Os eixos X / Y / Z são setas vermelha / verde / azul, sempre desenhadas sobre o cubo para maior legibilidade.
- A bússola à direita é um cartão giratório: marcações e N/E/S/W giram com o dispositivo, enquanto o indicador dourado no topo representa a proa.
- **Calibrar posição atual**: define a atitude atual como zero; afeta apenas a vista 3D e não é gravado no dispositivo.
- **Repor calibração**: remove o desvio de zero.

![Atitude 3D](../../en/Web-Host-Console-Tutorial/Images/03-attitude.png)

## 8. Instrumentos

- **Bússola**: o mostrador gira com o rumo e o indicador dourado permanece fixo no topo; o valor do rumo aparece acima e abaixo.
- **Horizonte artificial**: a linha céu/solo desloca-se com o pitch e gira com o roll. Horizonte acima do centro significa nariz para cima; abaixo, nariz para baixo.
- Se o N acompanhar o dispositivo em vez de apontar para o norte, ative **Compass invert**.
- Se nariz para cima aparecer como nariz para baixo, ative **Pitch flip** (Roll e Pitch são invertidos em conjunto).

![Instrumentos](../../en/Web-Host-Console-Tutorial/Images/04-instruments.png)

## 9. Calibração dos sensores

A página de calibração oferece quatro operações; o registo mostra o código de estado devolvido pelo dispositivo:

1. **Calibração IMU**: coloque o dispositivo plano e imóvel, clique e mantenha-o parado durante alguns segundos para corrigir o bias do acelerómetro e do giroscópio.
2. **Calibração do magnetómetro**: clique e rode lentamente o dispositivo em forma de 8 durante 10–30 segundos, cobrindo todas as orientações; mantenha-o longe de telemóveis, motores e objetos ferromagnéticos.
3. **Calibração de temperatura**: introduza a temperatura ambiente atual (−50 ℃ a 50 ℃) e clique em **Calibrar temperatura**.
4. **Repor calibração**: apaga todos os valores guardados na flash do dispositivo. Utilize com cuidado e calibre novamente depois.

Os botões ficam desativados durante a calibração e o estado mostra **A calibrar…**. No final, o registo mostra **Calibração concluída (estado 0)** ou o estado devolvido. Em caso de timeout, aparece um aviso; verifique a ligação e tente novamente.

![Calibração dos sensores](../../en/Web-Host-Console-Tutorial/Images/05-calibration.png)

## 10. Correções de direção

- **Declinação**: compensação de rumo em ±180°. Introduza um valor negativo se a bússola indicar a oeste do norte verdadeiro e positivo se a leste; no leste da China é cerca de −4° a −10°. Também corrige o ângulo de montagem.
- **Inversão de pitch**: inverte Roll e Pitch em conjunto, útil quando o sistema de coordenadas do dispositivo é oposto à convenção do software.
- **Inversão da bússola**: inverte apenas a rotação da bússola, sem afetar a atitude 3D nem os valores.

As três opções estão na barra de ligação e têm efeito imediato, sem necessidade de religar.

## 11. Resolução de problemas

**P1: Não aparece nenhum dispositivo em «Escolher dispositivo série…».**
Verifique o cabo USB e a alimentação, instale o controlador CH340/CP210x e tente outra porta ou cabo.

**P2: Ligado, mas sem dados.**
Confirme o baud rate 115200 e que a porta não está a ser usada por outro programa; desligue e volte a ligar o dispositivo.

**P3: O navegador indica que o Web Serial não é suportado.**
Utilize Chrome / Edge de secretária em HTTPS ou localhost. Firefox, Safari e navegadores móveis não são suportados.

**P4: O dispositivo é removido durante a utilização.**
A página volta ao estado desligado e mostra um aviso; volte a ligar o dispositivo.

**P5: O Yaw deriva lentamente.**
Um dispositivo de 6 eixos não tem referência magnética, pelo que a deriva do Yaw é normal. Para dispositivos de 9/10 eixos, faça primeiro a calibração IMU e do magnetómetro e afaste-se de interferências magnéticas.

**P6: A bússola tem um desvio fixo em relação ao norte.**
Ajuste a **Declinação**: negativa para oeste, positiva para leste. Se o sentido de rotação estiver invertido, ative **Compass invert**.

**P7: A vista 3D ou o instrumento mostra nariz para cima/baixo invertido.**
Ative **Pitch flip**; Roll e Pitch são invertidos em conjunto.

## 12. Dados e privacidade

A versão web é uma página puramente estática, sem servidor backend. Os dados série são processados e apresentados apenas no navegador e nunca são enviados para a rede. A página não carrega scripts de terceiros nem código de análise. Ao fechar a página, os dados são descartados.
