# Console web do host – Guia de uso

Este guia explica como usar o **JX IMU Studio** no navegador para conectar, monitorar e calibrar o módulo IMU de alta precisão da JuxiTech. A versão web não requer instalação: conecta-se à porta serial pela API Web Serial e pode ser publicada no GitHub Pages.

> A versão web só é compatível com Chrome / Edge para desktop. Navegadores não acessam I2C; usuários de I2C devem continuar usando o driver do sistema ou as ferramentas desktop. A interface pode alternar entre chinês e inglês; as capturas mostram a interface em inglês.

## 1. Abrir a página

Online:

<https://juxi-technology.github.io/ICM42670P-High-Precision-IMU-Module/>

Pré-visualização local (opcional, requer Python):

```bash
python -m http.server 5173 --directory <diretório web>
```

Depois abra <http://localhost:5173>. O Web Serial exige um contexto seguro (HTTPS ou localhost); abrir `index.html` via `file://` pode desativar a porta serial.

## 2. Requisitos

- **Chrome / Edge** para desktop (recomendado 89 ou superior)
- Driver USB-serial (CH340, CP210x etc.)
- Dispositivo ligado, baud rate **115200**
- Firefox, Safari e navegadores móveis não suportam Web Serial
- Não é necessário instalar Python, Qt ou software cliente

## 3. Conectar o dispositivo

1. Abra a página; a fonte é fixa em **Serial**.
2. Clique em **Escolher dispositivo serial…** e selecione a porta do IMU na janela do navegador (por exemplo `USB-SERIAL CH340`).
3. Clique em **Conectar**. O estado muda para **Conectado** e mostra a versão do firmware, os eixos detectados e a taxa de dados.
4. A console detecta automaticamente hardware de 6 / 9 / 10 eixos e exibe o algoritmo de fusão; dispositivos de 10 eixos usam o algoritmo de 9 eixos.
5. Clique em **Desconectar** ao terminar. Se o dispositivo for removido, a página desconecta automaticamente.

![Conexão e monitoramento](../../en/Web-Host-Console-Tutorial/Images/01-overview.png)

> No primeiro uso, o navegador solicita permissão para acessar a porta serial. Se a lista estiver vazia, instale primeiro o driver USB-serial.

## 4. Visão geral da interface

A barra superior contém porta serial, algoritmo de fusão, declinação magnética, inversão de pitch, inversão da bússola e botão de conexão. Abaixo há cinco abas:

| Aba | Função |
|-----|--------|
| Monitoramento | Acelerômetro, giroscópio, magnetômetro, ângulos de Euler, quaternion, barômetro |
| Gráficos | Quatro grupos de curvas rolantes, pausa e limpeza |
| Atitude 3D | Cubo 3D, setas dos eixos, bússola, calibração de zero |
| Instrumentos | Cartão de bússola giratório e horizonte artificial |
| Calibração | Calibração de IMU, magnetômetro, temperatura e redefinição |

O botão **EN / 中文** no canto superior direito alterna o idioma da interface.

## 5. Monitoramento

Seis cartões mostram valores em tempo real:

- **Acelerômetro**: unidade g, ±16 g; na horizontal e em repouso, o eixo Z mostra cerca de +1 g.
- **Giroscópio**: unidade rad/s, ±2000 °/s; próximo de 0 em repouso.
- **Magnetômetro**: unidade μT, ±800 μT; o campo terrestre é cerca de 25–65 μT.
- **Ângulos de Euler**: Roll / Pitch / Yaw em graus; Yaw de 0 a 360°.
- **Quaternion**: W / X / Y / Z, norma unitária.
- **Barômetro**: altitude (m), temperatura (℃), pressão (hPa) e pressão de referência (hPa) em modelos de 10 eixos.

A barra colorida abaixo de cada valor mostra a proporção em relação ao fundo de escala.

## 6. Gráficos

- Alterne o grupo no topo: Acelerômetro (g) / Giroscópio (rad/s) / Magnetômetro (μT) / Ângulos de Euler (°).
- Cada grupo tem três curvas X/Y/Z ou Roll/Pitch/Yaw com cores fixas.
- Cada curva mantém as últimas **300 amostras**, a cerca de 100 Hz.
- **Pausar** congela o gráfico; **Limpar** reinicia os buffers. Trocar de grupo não apaga os outros.
- A legenda mostra o valor mais recente de cada canal.

![Gráficos em tempo real](../../en/Web-Host-Console-Tutorial/Images/02-plots.png)

> O gráfico de ângulos de Euler mostra um salto vertical quando o Yaw passa de 360° para 0°; é um envolvimento de ângulo, não um erro de dados.

## 7. Atitude 3D

- O cubo gira em tempo real com Roll / Pitch / Yaw.
- **Arraste com o botão esquerdo** para girar a vista e **use a roda** para zoom.
- Os eixos X / Y / Z são setas vermelha / verde / azul, sempre desenhadas sobre o cubo para maior legibilidade.
- A bússola à direita é um cartão giratório: marcações e N/E/S/W giram com o dispositivo, enquanto o indicador dourado no topo representa a proa.
- **Calibrar posição atual**: define a atitude atual como zero; afeta apenas a visualização 3D e não é gravado no dispositivo.
- **Redefinir calibração**: remove o deslocamento de zero.

![Atitude 3D](../../en/Web-Host-Console-Tutorial/Images/03-attitude.png)

## 8. Instrumentos

- **Bússola**: o mostrador gira com o rumo e o indicador dourado permanece fixo no topo; o valor do rumo aparece acima e abaixo.
- **Horizonte artificial**: a linha céu/solo se desloca com o pitch e gira com o roll. Horizonte acima do centro significa nariz para cima; abaixo, nariz para baixo.
- Se o N acompanhar o dispositivo em vez de apontar para o norte, ative **Compass invert**.
- Se nariz para cima aparecer como nariz para baixo, ative **Pitch flip** (Roll e Pitch são invertidos juntos).

![Instrumentos](../../en/Web-Host-Console-Tutorial/Images/04-instruments.png)

## 9. Calibração dos sensores

A página de calibração oferece quatro operações; o log mostra o código de status retornado pelo dispositivo:

1. **Calibração IMU**: coloque o dispositivo plano e imóvel, clique e mantenha-o parado por alguns segundos para corrigir o bias do acelerômetro e do giroscópio.
2. **Calibração do magnetômetro**: clique e gire lentamente o dispositivo em forma de 8 por 10–30 segundos, cobrindo todas as orientações; mantenha longe de celulares, motores e objetos ferromagnéticos.
3. **Calibração de temperatura**: informe a temperatura ambiente atual (−50 ℃ a 50 ℃) e clique em **Calibrar temperatura**.
4. **Redefinir calibração**: apaga todos os valores salvos na flash do dispositivo. Use com cuidado e calibre novamente depois.

Os botões ficam desabilitados durante a calibração e o status mostra **Calibrando…**. Ao terminar, o log mostra **Calibração concluída (status 0)** ou o status retornado. Em caso de timeout, aparece um aviso; verifique a conexão e tente novamente.

![Calibração dos sensores](../../en/Web-Host-Console-Tutorial/Images/05-calibration.png)

## 10. Correções de direção

- **Declinação**: compensação de rumo em ±180°. Use valor negativo se a bússola indicar a oeste do norte verdadeiro e positivo se a leste; no leste da China é cerca de −4° a −10°. Também corrige o ângulo de montagem.
- **Inversão de pitch**: inverte Roll e Pitch juntos, útil quando o sistema de coordenadas do dispositivo é oposto à convenção do software.
- **Inversão da bússola**: inverte apenas a rotação da bússola, sem afetar a atitude 3D nem os valores.

As três opções ficam na barra de conexão e têm efeito imediato, sem reconectar.

## 11. Solução de problemas

**P1: Nenhum dispositivo em «Escolher dispositivo serial…».**
Verifique o cabo USB e a alimentação, instale o driver CH340/CP210x e tente outra porta ou cabo.

**P2: Conectado, mas sem dados.**
Confirme o baud rate 115200 e que a porta não está sendo usada por outro programa; desconecte e reconecte o dispositivo.

**P3: O navegador informa que Web Serial não é compatível.**
Use Chrome / Edge para desktop em HTTPS ou localhost. Firefox, Safari e navegadores móveis não são compatíveis.

**P4: O dispositivo é removido durante o uso.**
A página volta ao estado desconectado e mostra um aviso; reconecte o dispositivo.

**P5: O Yaw deriva lentamente.**
Um dispositivo de 6 eixos não tem referência magnética, então a deriva do Yaw é normal. Para dispositivos de 9/10 eixos, faça primeiro a calibração IMU e do magnetômetro e afaste-se de interferências magnéticas.

**P6: A bússola tem um desvio fixo em relação ao norte.**
Ajuste a **Declinação**: negativa para oeste, positiva para leste. Se o sentido de rotação estiver invertido, ative **Compass invert**.

**P7: A visualização 3D ou o instrumento mostra nariz para cima/baixo invertido.**
Ative **Pitch flip**; Roll e Pitch são invertidos juntos.

## 12. Dados e privacidade

A versão web é uma página puramente estática, sem servidor backend. Os dados seriais são processados e exibidos apenas no navegador e nunca são enviados à rede. A página não carrega scripts de terceiros nem código de análise. Ao fechar a página, os dados são descartados.
