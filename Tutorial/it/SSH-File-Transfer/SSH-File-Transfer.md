# Trasferimento di file tramite SSH

## 1. Installazione del programma WInSCP

[Software di accesso remoto\.zip](/downloads/远程登录软件.zip)

Scaricare e decomprimere, fare doppio clic per aprire il programma e iniziare l'installazione, fare clic su Accept per accettare il contratto, quindi seguire le indicazioni per installare.

![AQFlbRMSSob30QxDqIXcvEOqnRc\.png](../../en/SSH-File-Transfer/Images/AQFlbRMSSob30QxDqIXcvEOqnRc.png)

![N3Fybs4V2o0bWkx1tJQcelQXnYe\.png](../../en/SSH-File-Transfer/Images/N3Fybs4V2o0bWkx1tJQcelQXnYe.png)

![PtyqbBv8ToogzFxEV1oczfhwn5d\.png](../../en/SSH-File-Transfer/Images/PtyqbBv8ToogzFxEV1oczfhwn5d.png)

Fare clic su Finish per completare l'installazione.

![WMXGbsFL3oFjCrxYXLkcr7Asn0b\.png](../../en/SSH-File-Transfer/Images/WMXGbsFL3oFjCrxYXLkcr7Asn0b.png)

Si può notare che sul desktop è comparsa un'icona di WinSCP

![RBXsbYQo3oJISOxCoN2c0PyjnEc\.png](../../en/SSH-File-Transfer/Images/RBXsbYQo3oJISOxCoN2c0PyjnEc.png)

## 2. Trasferimento remoto di file tramite SSH

Dopo aver aperto il software WinSCP compare la seguente schermata di accesso.

File protocol: selezionare SFTP come protocollo di file; Host name: indirizzo IP; Port number: il valore predefinito 22 è sufficiente; User name: nome utente; Password: password di accesso.

Dopo aver inserito i dati corretti si può fare clic su Save per salvare le informazioni inserite, così da non doverle reinserire al prossimo accesso.

![Bv7zb5twaoIT4txrqxccW2Ydnog\.png](../../en/SSH-File-Transfer/Images/Bv7zb5twaoIT4txrqxccW2Ydnog.png)

Dopo aver fatto clic su Login e aver effettuato l'accesso correttamente, verrà mostrata la seguente schermata: a sinistra la cartella del computer Windows, a destra la cartella del nano.

![MtbUbV1XMo5SI2xQ1cycgk5SnAE\.png](../../en/SSH-File-Transfer/Images/MtbUbV1XMo5SI2xQ1cycgk5SnAE.png)

Il trasferimento di file prevede tre modalità operative: la prima consiste nel trascinare direttamente il file da sinistra a destra, oppure da destra a sinistra, e il sistema copierà automaticamente una copia del file trasferendola.

La seconda consiste nel selezionare il file con il mouse e premere una volta il tasto F5; il file selezionato verrà copiato sull'altro lato.

La terza consiste nel selezionare il file e fare clic con il tasto destro del mouse; se si trasferisce dal computer Windows al nano, fare clic su upload,

![CruTbJihzo4jSXxKNw0c7vINnyb\.png](../../en/SSH-File-Transfer/Images/CruTbJihzo4jSXxKNw0c7vINnyb.png)

Comparirà un avviso; si può scegliere di non mostrarlo più e fare clic su OK, così il file verrà trasferito automaticamente.

![RF0nbHwrfoDytkxSS5ZcrBp1ndL\.png](../../en/SSH-File-Transfer/Images/RF0nbHwrfoDytkxSS5ZcrBp1ndL.png)

Se si trasferisce un file dal nano al computer Windows, fare clic con il tasto destro selezionando il file e scegliere Download

![QPHhbkshaoHzx7xUUdZcrpIynRd\.png](../../en/SSH-File-Transfer/Images/QPHhbkshaoHzx7xUUdZcrpIynRd.png)

Nota: il trasferimento di file richiede che il computer e la scheda siano nella stessa rete locale e che la Raspberry Pi abbia il servizio SSH abilitato. Talvolta, se il trasferimento di file non riesce, di norma è perché i permessi della scheda non sono sufficienti; è sufficiente concedere i permessi più elevati.

```Plain Text
chmod 777 目录名 
```



