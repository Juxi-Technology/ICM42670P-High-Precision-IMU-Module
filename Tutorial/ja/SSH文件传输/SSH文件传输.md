# SSHファイル転送

## 1. WInSCPプログラムのインストール

[リモートログインソフト\.zip](/downloads/远程登录软件.zip)

ダウンロードして解凍し、ダブルクリックでプログラムを開いてインストールを開始し、Acceptをクリックして契約に同意し、あとはプロンプトに従ってインストールするだけです。

![AQFlbRMSSob30QxDqIXcvEOqnRc\.png](../../en/SSH文件传输/图片和附件/AQFlbRMSSob30QxDqIXcvEOqnRc.png)

![N3Fybs4V2o0bWkx1tJQcelQXnYe\.png](../../en/SSH文件传输/图片和附件/N3Fybs4V2o0bWkx1tJQcelQXnYe.png)

![PtyqbBv8ToogzFxEV1oczfhwn5d\.png](../../en/SSH文件传输/图片和附件/PtyqbBv8ToogzFxEV1oczfhwn5d.png)

Finishをクリックしてインストールを完了します。

![WMXGbsFL3oFjCrxYXLkcr7Asn0b\.png](../../en/SSH文件传输/图片和附件/WMXGbsFL3oFjCrxYXLkcr7Asn0b.png)

デスクトップにWinSCPのアイコンが1つ増えているのが確認できます

![RBXsbYQo3oJISOxCoN2c0PyjnEc\.png](../../en/SSH文件传输/图片和附件/RBXsbYQo3oJISOxCoN2c0PyjnEc.png)

## 2. SSHリモートファイル転送

WinSCPソフトを開くと、以下のログイン画面が表示されます。

File protocol：ファイルプロトコルはSFTPを選択、Host name：IPアドレス、Port number：デフォルトの22で問題ありません、User name：ユーザー名、Password：ログインパスワード。

正しい情報を入力した後、Saveをクリックして入力した情報を保存でき、次回ログイン時に再入力する必要がありません。

![Bv7zb5twaoIT4txrqxccW2Ydnog\.png](../../en/SSH文件传输/图片和附件/Bv7zb5twaoIT4txrqxccW2Ydnog.png)

Loginをクリックしてログインに成功すると、以下の画面が表示されます。左側はwinパソコンのフォルダ、右側はnanoのフォルダです。

![MtbUbV1XMo5SI2xQ1cycgk5SnAE\.png](../../en/SSH文件传输/图片和附件/MtbUbV1XMo5SI2xQ1cycgk5SnAE.png)

ファイル転送には3つの操作方法があります。1つ目は、ファイルを左側から右側へ、または右側から左側へ直接ドラッグする方法で、システムが自動的にファイルをコピーして転送します。

2つ目は、マウスでファイルを選択し、F5キーを押すと、選択されたファイルがもう一方にコピーされます。

3つ目は、ファイルを選択してマウスを右クリックし、winパソコンからnanoに転送する場合はuploadをクリックします、

![CruTbJihzo4jSXxKNw0c7vINnyb\.png](../../en/SSH文件传输/图片和附件/CruTbJihzo4jSXxKNw0c7vINnyb.png)

プロンプトが表示されるので、今後表示しないを選択し、OKをクリックすると、ファイルが自動的に転送されます。

![RF0nbHwrfoDytkxSS5ZcrBp1ndL\.png](../../en/SSH文件传输/图片和附件/RF0nbHwrfoDytkxSS5ZcrBp1ndL.png)

nanoからwinパソコンにファイルを転送する場合は、マウスを右クリックしてファイルを選択し、Downloadを選択します

![QPHhbkshaoHzx7xUUdZcrpIynRd\.png](../../en/SSH文件传输/图片和附件/QPHhbkshaoHzx7xUUdZcrpIynRd.png)

注意：ファイル転送には、パソコンとボードが同じローカルエリアネットワーク上にあり、Raspberry PiのSSHサービスが有効になっている必要があります。ファイル転送が失敗する場合は、通常ボード側の権限が不足しているため、最高権限を付与するだけで解決します。

```Plain Text
chmod 777 目录名 
```



