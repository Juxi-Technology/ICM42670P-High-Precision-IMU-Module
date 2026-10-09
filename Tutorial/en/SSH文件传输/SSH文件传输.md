# SSH File Transfer

## I. WinSCP Program Installation

[Remote login software\.zip](/downloads/远程登录软件.zip)

Download and extract it, double-click to open the program and start the installation, click Accept to accept the agreement, then just follow the prompts to install.

![AQFlbRMSSob30QxDqIXcvEOqnRc\.png](图片和附件/AQFlbRMSSob30QxDqIXcvEOqnRc.png)

![N3Fybs4V2o0bWkx1tJQcelQXnYe\.png](图片和附件/N3Fybs4V2o0bWkx1tJQcelQXnYe.png)

![PtyqbBv8ToogzFxEV1oczfhwn5d\.png](图片和附件/PtyqbBv8ToogzFxEV1oczfhwn5d.png)

Click Finish to complete the installation.

![WMXGbsFL3oFjCrxYXLkcr7Asn0b\.png](图片和附件/WMXGbsFL3oFjCrxYXLkcr7Asn0b.png)

You can see that an extra WinSCP icon has appeared on the desktop

![RBXsbYQo3oJISOxCoN2c0PyjnEc\.png](图片和附件/RBXsbYQo3oJISOxCoN2c0PyjnEc.png)

## II. SSH Remote File Transfer

After opening the WinSCP software, the following login interface appears.

File protocol: select SFTP for the file protocol; Host name: IP address; Port number: the default 22 is fine; User name: username; Password: login password.

After entering the correct information, you can click Save to save the information you filled in, so that you do not need to enter it again the next time you log in.

![Bv7zb5twaoIT4txrqxccW2Ydnog\.png](图片和附件/Bv7zb5twaoIT4txrqxccW2Ydnog.png)

After clicking Login and logging in successfully, the following interface will be displayed; the left side is the folder of the Windows computer, and the right side is the folder of the nano.

![MtbUbV1XMo5SI2xQ1cycgk5SnAE\.png](图片和附件/MtbUbV1XMo5SI2xQ1cycgk5SnAE.png)

There are three ways to transfer files. The first is to drag the file directly from the left side to the right side, or from the right side to the left side, and the system will automatically copy the file over.

The second is to select the file with the mouse and then press the F5 key, and the selected file will be copied to the other side.

The third is to select the file and right-click the mouse; if you are transferring from the Windows computer to the nano, click upload,

![CruTbJihzo4jSXxKNw0c7vINnyb\.png](图片和附件/CruTbJihzo4jSXxKNw0c7vINnyb.png)

A prompt will pop up; you can choose not to show it again, and click OK, then the file will be transferred automatically.

![RF0nbHwrfoDytkxSS5ZcrBp1ndL\.png](图片和附件/RF0nbHwrfoDytkxSS5ZcrBp1ndL.png)

If you are transferring files from the nano to the Windows computer, right-click to select the file and choose Download

![QPHhbkshaoHzx7xUUdZcrpIynRd\.png](图片和附件/QPHhbkshaoHzx7xUUdZcrpIynRd.png)

Note: File transfer requires the computer and the board to be under the same local area network, and the Raspberry Pi to have the SSH service enabled. Sometimes if file transfer fails, it is usually because the board does not have sufficient permissions; we just need to grant the highest permissions.

```Plain Text
chmod 777 目录名 
```



