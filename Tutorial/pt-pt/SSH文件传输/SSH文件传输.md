# Transferência de ficheiros via SSH

## 1. Instalação do programa WInSCP

[Software de login remoto\.zip](/downloads/远程登录软件.zip)

Descarregue e descompacte, clique duas vezes para abrir o programa e iniciar a instalação, clique em Accept para aceitar o acordo e, em seguida, basta seguir as instruções de instalação.

![AQFlbRMSSob30QxDqIXcvEOqnRc\.png](../../en/SSH文件传输/图片和附件/AQFlbRMSSob30QxDqIXcvEOqnRc.png)

![N3Fybs4V2o0bWkx1tJQcelQXnYe\.png](../../en/SSH文件传输/图片和附件/N3Fybs4V2o0bWkx1tJQcelQXnYe.png)

![PtyqbBv8ToogzFxEV1oczfhwn5d\.png](../../en/SSH文件传输/图片和附件/PtyqbBv8ToogzFxEV1oczfhwn5d.png)

Clique em Finish para concluir a instalação.

![WMXGbsFL3oFjCrxYXLkcr7Asn0b\.png](../../en/SSH文件传输/图片和附件/WMXGbsFL3oFjCrxYXLkcr7Asn0b.png)

É possível ver que apareceu um ícone do WinSCP no ambiente de trabalho

![RBXsbYQo3oJISOxCoN2c0PyjnEc\.png](../../en/SSH文件传输/图片和附件/RBXsbYQo3oJISOxCoN2c0PyjnEc.png)

## 2. Transferência remota de ficheiros via SSH

Após abrir o software WinSCP, aparece o seguinte ecrã de início de sessão.

File protocol: selecione SFTP como protocolo de ficheiro, Host name: endereço IP, Port number: a predefinição 22 é suficiente, User name: nome de utilizador, Password: palavra-passe de início de sessão.

Depois de introduzir as informações corretas, pode clicar em Save para guardar as informações preenchidas, assim não será necessário voltar a introduzi-las no próximo início de sessão.

![Bv7zb5twaoIT4txrqxccW2Ydnog\.png](../../en/SSH文件传输/图片和附件/Bv7zb5twaoIT4txrqxccW2Ydnog.png)

Após clicar em Login e iniciar sessão com sucesso, será exibido o seguinte ecrã; à esquerda estão as pastas do computador Windows e à direita estão as pastas do nano.

![MtbUbV1XMo5SI2xQ1cycgk5SnAE\.png](../../en/SSH文件传输/图片和附件/MtbUbV1XMo5SI2xQ1cycgk5SnAE.png)

Existem três formas de operar a transferência de ficheiros; a primeira é arrastar diretamente o ficheiro da esquerda para a direita, ou da direita para a esquerda, e o sistema copiará automaticamente uma cópia do ficheiro para o transferir.

A segunda é selecionar o ficheiro com o rato e premir a tecla F5; então o ficheiro selecionado será copiado para o outro lado.

A terceira é selecionar o ficheiro e clicar com o botão direito do rato; se for para transferir do computador Windows para o nano, clique em upload,

![CruTbJihzo4jSXxKNw0c7vINnyb\.png](../../en/SSH文件传输/图片和附件/CruTbJihzo4jSXxKNw0c7vINnyb.png)

Aparecerá um aviso; pode optar por não voltar a mostrar e clicar em OK, e o ficheiro será transferido automaticamente.

![RF0nbHwrfoDytkxSS5ZcrBp1ndL\.png](../../en/SSH文件传输/图片和附件/RF0nbHwrfoDytkxSS5ZcrBp1ndL.png)

Se for para transferir ficheiros do nano para o computador Windows, clique com o botão direito do rato para selecionar o ficheiro e escolha Download

![QPHhbkshaoHzx7xUUdZcrpIynRd\.png](../../en/SSH文件传输/图片和附件/QPHhbkshaoHzx7xUUdZcrpIynRd.png)

Atenção: a transferência de ficheiros requer que o computador e a placa estejam na mesma rede local e que o Raspberry Pi tenha o serviço SSH ativado para poder ser realizada. Por vezes, quando ocorre falha na transferência de ficheiros, geralmente é porque a permissão do lado da placa é insuficiente; basta conceder a permissão máxima.

```Plain Text
chmod 777 目录名 
```



