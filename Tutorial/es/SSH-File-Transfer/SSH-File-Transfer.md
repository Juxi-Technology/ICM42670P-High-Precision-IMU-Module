# Transferencia de archivos por SSH

## 1. Instalación del programa WInSCP

[Software de inicio de sesión remoto\.zip](/downloads/远程登录软件.zip)

Descárguelo y descomprímalo, haga doble clic para abrir el programa y comenzar la instalación, haga clic en Accept para aceptar el acuerdo y, a continuación, siga las indicaciones para instalarlo.

![AQFlbRMSSob30QxDqIXcvEOqnRc\.png](../../en/SSH-File-Transfer/Images/AQFlbRMSSob30QxDqIXcvEOqnRc.png)

![N3Fybs4V2o0bWkx1tJQcelQXnYe\.png](../../en/SSH-File-Transfer/Images/N3Fybs4V2o0bWkx1tJQcelQXnYe.png)

![PtyqbBv8ToogzFxEV1oczfhwn5d\.png](../../en/SSH-File-Transfer/Images/PtyqbBv8ToogzFxEV1oczfhwn5d.png)

Haga clic en Finish para completar la instalación.

![WMXGbsFL3oFjCrxYXLkcr7Asn0b\.png](../../en/SSH-File-Transfer/Images/WMXGbsFL3oFjCrxYXLkcr7Asn0b.png)

Podrá ver que en el escritorio aparece un icono de WinSCP

![RBXsbYQo3oJISOxCoN2c0PyjnEc\.png](../../en/SSH-File-Transfer/Images/RBXsbYQo3oJISOxCoN2c0PyjnEc.png)

## 2. Transferencia remota de archivos por SSH

Tras abrir el software WinSCP aparece la siguiente interfaz de inicio de sesión.

File protocol: seleccione SFTP como protocolo de archivos; Host name: dirección IP; Port number: el valor predeterminado 22 es suficiente; User name: nombre de usuario; Password: contraseña de inicio de sesión.

Tras introducir la información correcta, puede hacer clic en Save para guardar los datos introducidos y no tener que volver a introducirlos en el próximo inicio de sesión.

![Bv7zb5twaoIT4txrqxccW2Ydnog\.png](../../en/SSH-File-Transfer/Images/Bv7zb5twaoIT4txrqxccW2Ydnog.png)

Tras hacer clic en Login y completar el inicio de sesión correctamente, se mostrará la siguiente interfaz: a la izquierda está la carpeta del ordenador con Windows y a la derecha la carpeta del nano.

![MtbUbV1XMo5SI2xQ1cycgk5SnAE\.png](../../en/SSH-File-Transfer/Images/MtbUbV1XMo5SI2xQ1cycgk5SnAE.png)

La transferencia de archivos admite tres formas de operación: la primera consiste en arrastrar directamente el archivo de la izquierda a la derecha, o de la derecha a la izquierda, y el sistema copiará automáticamente una copia del archivo para transferirlo.

La segunda consiste en seleccionar el archivo con el ratón y pulsar una vez la tecla F5; el archivo seleccionado se copiará al otro lado.

La tercera consiste en seleccionar el archivo y hacer clic con el botón derecho del ratón; si se transfiere del ordenador con Windows al nano, haga clic en upload,

![CruTbJihzo4jSXxKNw0c7vINnyb\.png](../../en/SSH-File-Transfer/Images/CruTbJihzo4jSXxKNw0c7vINnyb.png)

Aparecerá un aviso; puede seleccionar no volver a mostrarlo y hacer clic en OK, y el archivo se transferirá automáticamente.

![RF0nbHwrfoDytkxSS5ZcrBp1ndL\.png](../../en/SSH-File-Transfer/Images/RF0nbHwrfoDytkxSS5ZcrBp1ndL.png)

Si se transfiere un archivo del nano al ordenador con Windows, haga clic con el botón derecho para seleccionar el archivo y elija Download

![QPHhbkshaoHzx7xUUdZcrpIynRd\.png](../../en/SSH-File-Transfer/Images/QPHhbkshaoHzx7xUUdZcrpIynRd.png)

Nota: la transferencia de archivos requiere que el ordenador y la placa estén en la misma red de área local y que la Raspberry Pi tenga habilitado el servicio SSH. En ocasiones, si falla la transferencia de archivos suele deberse a que los permisos de la placa son insuficientes; bastará con conceder los permisos más altos.

```Plain Text
chmod 777 目录名 
```



