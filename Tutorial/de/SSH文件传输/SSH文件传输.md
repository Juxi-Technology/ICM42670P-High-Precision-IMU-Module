# SSH-Dateiübertragung

## 1. Installation des WInSCP-Programms

[Remote-Login-Software\.zip](/downloads/远程登录软件.zip)

Laden Sie das Programm herunter und entpacken Sie es, doppelklicken Sie, um das Programm zu öffnen, und beginnen Sie mit der Installation; klicken Sie auf Accept, um die Vereinbarung zu akzeptieren, und folgen Sie dann einfach den Anweisungen zur Installation.

![AQFlbRMSSob30QxDqIXcvEOqnRc\.png](../../en/SSH文件传输/图片和附件/AQFlbRMSSob30QxDqIXcvEOqnRc.png)

![N3Fybs4V2o0bWkx1tJQcelQXnYe\.png](../../en/SSH文件传输/图片和附件/N3Fybs4V2o0bWkx1tJQcelQXnYe.png)

![PtyqbBv8ToogzFxEV1oczfhwn5d\.png](../../en/SSH文件传输/图片和附件/PtyqbBv8ToogzFxEV1oczfhwn5d.png)

Klicken Sie auf Finish, um die Installation abzuschließen.

![WMXGbsFL3oFjCrxYXLkcr7Asn0b\.png](../../en/SSH文件传输/图片和附件/WMXGbsFL3oFjCrxYXLkcr7Asn0b.png)

Sie können sehen, dass auf dem Desktop ein WinSCP-Symbol hinzugekommen ist.

![RBXsbYQo3oJISOxCoN2c0PyjnEc\.png](../../en/SSH文件传输/图片和附件/RBXsbYQo3oJISOxCoN2c0PyjnEc.png)

## 2. Dateiübertragung per SSH-Fernzugriff

Nach dem Öffnen der WinSCP-Software erscheint die folgende Anmeldeoberfläche.

File protocol: Wählen Sie als Dateiprotokoll SFTP, Host name: die IP-Adresse, Port number: die Standardeinstellung 22 ist in Ordnung, User name: der Benutzername, Password: das Anmeldepasswort.

Nach Eingabe der korrekten Informationen können Sie auf Save klicken, um die eingegebenen Informationen zu speichern; bei der nächsten Anmeldung müssen Sie sie nicht erneut eingeben.

![Bv7zb5twaoIT4txrqxccW2Ydnog\.png](../../en/SSH文件传输/图片和附件/Bv7zb5twaoIT4txrqxccW2Ydnog.png)

Nach einer erfolgreichen Anmeldung durch Klicken auf Login wird die folgende Oberfläche angezeigt; links befindet sich der Ordner des Windows-Computers, rechts der Ordner des Nano.

![MtbUbV1XMo5SI2xQ1cycgk5SnAE\.png](../../en/SSH文件传输/图片和附件/MtbUbV1XMo5SI2xQ1cycgk5SnAE.png)

Für die Dateiübertragung gibt es drei Vorgehensweisen. Die erste besteht darin, die Datei direkt von links nach rechts oder von rechts nach links zu ziehen; das System kopiert automatisch eine Datei und überträgt sie hinüber.

Die zweite besteht darin, die Datei mit der Maus auszuwählen und dann die Taste F5 zu drücken; die ausgewählte Datei wird dann auf die andere Seite kopiert.

Die dritte besteht darin, die Datei auszuwählen und mit der rechten Maustaste anzuklicken; wenn Sie vom Windows-Computer zum Nano übertragen, klicken Sie auf upload,

![CruTbJihzo4jSXxKNw0c7vINnyb\.png](../../en/SSH文件传输/图片和附件/CruTbJihzo4jSXxKNw0c7vINnyb.png)

Es erscheint ein Hinweis; Sie können auswählen, nicht mehr darauf hingewiesen zu werden, und auf OK klicken, dann wird die Datei automatisch übertragen.

![RF0nbHwrfoDytkxSS5ZcrBp1ndL\.png](../../en/SSH文件传输/图片和附件/RF0nbHwrfoDytkxSS5ZcrBp1ndL.png)

Wenn Sie eine Datei vom Nano auf den Windows-Computer übertragen möchten, klicken Sie die Datei mit der rechten Maustaste an und wählen Sie Download

![QPHhbkshaoHzx7xUUdZcrpIynRd\.png](../../en/SSH文件传输/图片和附件/QPHhbkshaoHzx7xUUdZcrpIynRd.png)

Hinweis: Die Dateiübertragung erfordert, dass sich der Computer und das Mainboard im selben lokalen Netzwerk befinden und dass der SSH-Dienst auf dem Raspberry Pi aktiviert ist. Wenn gelegentlich eine Dateiübertragung fehlschlägt, liegt das in der Regel daran, dass die Berechtigungen auf der Seite des Mainboards nicht ausreichen; wir müssen dann lediglich die höchsten Berechtigungen vergeben.

```Plain Text
chmod 777 目录名 
```



