# Transferência de arquivos via SSH

## 1. Instalação do programa WInSCP

[Software de login remoto\.zip](/downloads/远程登录软件.zip)

Baixe e descompacte, clique duas vezes para abrir o programa e iniciar a instalação, clique em Accept para aceitar o acordo e, em seguida, basta seguir as instruções de instalação.

![AQFlbRMSSob30QxDqIXcvEOqnRc\.png](../../en/SSH文件传输/图片和附件/AQFlbRMSSob30QxDqIXcvEOqnRc.png)

![N3Fybs4V2o0bWkx1tJQcelQXnYe\.png](../../en/SSH文件传输/图片和附件/N3Fybs4V2o0bWkx1tJQcelQXnYe.png)

![PtyqbBv8ToogzFxEV1oczfhwn5d\.png](../../en/SSH文件传输/图片和附件/PtyqbBv8ToogzFxEV1oczfhwn5d.png)

Clique em Finish para concluir a instalação.

![WMXGbsFL3oFjCrxYXLkcr7Asn0b\.png](../../en/SSH文件传输/图片和附件/WMXGbsFL3oFjCrxYXLkcr7Asn0b.png)

É possível ver que apareceu um ícone do WinSCP na área de trabalho

![RBXsbYQo3oJISOxCoN2c0PyjnEc\.png](../../en/SSH文件传输/图片和附件/RBXsbYQo3oJISOxCoN2c0PyjnEc.png)

## 2. Transferência remota de arquivos via SSH

Após abrir o software WinSCP, aparece a seguinte tela de login.

File protocol: selecione SFTP como protocolo de arquivo, Host name: endereço IP, Port number: o padrão 22 já basta, User name: nome de usuário, Password: senha de login.

Depois de inserir as informações corretas, você pode clicar em Save para salvar as informações preenchidas, assim não será necessário digitá-las novamente no próximo login.

![Bv7zb5twaoIT4txrqxccW2Ydnog\.png](../../en/SSH文件传输/图片和附件/Bv7zb5twaoIT4txrqxccW2Ydnog.png)

Após clicar em Login e fazer o login com sucesso, será exibida a seguinte tela; à esquerda estão as pastas do computador Windows e à direita estão as pastas do nano.

![MtbUbV1XMo5SI2xQ1cycgk5SnAE\.png](../../en/SSH文件传输/图片和附件/MtbUbV1XMo5SI2xQ1cycgk5SnAE.png)

Existem três formas de operar a transferência de arquivos; a primeira é arrastar diretamente o arquivo da esquerda para a direita, ou da direita para a esquerda, e o sistema copiará automaticamente uma cópia do arquivo para transferi-lo.

A segunda é selecionar o arquivo com o mouse e pressionar a tecla F5; então o arquivo selecionado será copiado para o outro lado.

A terceira é selecionar o arquivo e clicar com o botão direito do mouse; se for para transferir do computador Windows para o nano, clique em upload,

![CruTbJihzo4jSXxKNw0c7vINnyb\.png](../../en/SSH文件传输/图片和附件/CruTbJihzo4jSXxKNw0c7vINnyb.png)

Aparecerá um aviso; você pode optar por não exibir novamente e clicar em OK, e o arquivo será transferido automaticamente.

![RF0nbHwrfoDytkxSS5ZcrBp1ndL\.png](../../en/SSH文件传输/图片和附件/RF0nbHwrfoDytkxSS5ZcrBp1ndL.png)

Se for para transferir arquivos do nano para o computador Windows, clique com o botão direito do mouse para selecionar o arquivo e escolha Download

![QPHhbkshaoHzx7xUUdZcrpIynRd\.png](../../en/SSH文件传输/图片和附件/QPHhbkshaoHzx7xUUdZcrpIynRd.png)

Atenção: a transferência de arquivos requer que o computador e a placa estejam na mesma rede local e que o Raspberry Pi tenha o serviço SSH ativado para poder ser realizada. Às vezes, quando ocorre falha na transferência de arquivos, geralmente é porque a permissão do lado da placa é insuficiente; basta conceder a permissão máxima.

```Plain Text
chmod 777 目录名 
```



