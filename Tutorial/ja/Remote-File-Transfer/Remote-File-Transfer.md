# ファイルリモート転送

# [ファイルリモート転送](https://juxitech.feishu.cn/docx/OAICdMDl9ozdDjx92uocVYrcnQq#OAICdMDl9ozdDjx92uocVYrcnQq)

[1. MobaXterm](https://juxitech.feishu.cn/docx/OAICdMDl9ozdDjx92uocVYrcnQq#doxcn6Xj5FnZdC8Xc7WirMMH1ob)

[2. MobaXtermのインストール](https://juxitech.feishu.cn/docx/OAICdMDl9ozdDjx92uocVYrcnQq#doxcnhziIgp0c1zlNjRYXoF8qQd)

[2\.1. MobaXtermのダウンロード](https://juxitech.feishu.cn/docx/OAICdMDl9ozdDjx92uocVYrcnQq#doxcnKFBDKQBtCsUo6OslblLvRd)

[2\.2. MobaXtermのインストール](https://juxitech.feishu.cn/docx/OAICdMDl9ozdDjx92uocVYrcnQq#doxcnShWWp90NBCbz0VWkpDMTjW)

[3. MobaXtermの使用](https://juxitech.feishu.cn/docx/OAICdMDl9ozdDjx92uocVYrcnQq#doxcnTFGoxRBZ8Eszi1NVvBXlGg)

[4. MobaXterm：SFTPリモート](https://juxitech.feishu.cn/docx/OAICdMDl9ozdDjx92uocVYrcnQq#doxcnQj3cuCUnWzEuT4GNupwpeh)



## 1. MobaXterm

MobaXtermは強力なリモートツールであり、SHH、VNC、FTPなどのリモートツールを統合しています。

## 2. MobaXtermのインストール

公式サイト：[https://mobaxterm\.mobatek\.net/](https://mobaxterm.mobatek.net/)

![SmbtbM68botXsAxZWxicm4BBngd\.png](../../en/Remote-File-Transfer/Images/SmbtbM68botXsAxZWxicm4BBngd.png)

### 2\.1. MobaXtermのダウンロード

無料版を選択してダウンロード：

![XVj7by50hoYIufxoZpScVMbonxc\.png](../../en/Remote-File-Transfer/Images/XVj7by50hoYIufxoZpScVMbonxc.png)

インストール版を選択してダウンロード：

![NOkXbQH3iojuCmxLzrFcQHUunOY\.png](../../en/Remote-File-Transfer/Images/NOkXbQH3iojuCmxLzrFcQHUunOY.png)

### 2\.2. MobaXtermのインストール

公式サイトからダウンロードした圧縮ファイルを解凍し、`MobaXterm_installer_24.4.msi`ファイルを開いてインストールします：

![OI4ebB4wzoFndSx1sfHcTBhWnUb\.png](../../en/Remote-File-Transfer/Images/OI4ebB4wzoFndSx1sfHcTBhWnUb.png)

契約に同意：

![IZw1bK0onoXkFWx6Jdtczg4knRb\.png](../../en/Remote-File-Transfer/Images/IZw1bK0onoXkFWx6Jdtczg4knRb.png)

ソフトのインストール場所を選択：デフォルトの場所を推奨

![JzAZbkyT2oPbrcxIkVycTzTsnuh\.png](../../en/Remote-File-Transfer/Images/JzAZbkyT2oPbrcxIkVycTzTsnuh.png)

本インストール：

![DrJ9b2PHYoVynaxyJKjc7PX6nKg\.png](../../en/Remote-File-Transfer/Images/DrJ9b2PHYoVynaxyJKjc7PX6nKg.png)

![Y7tnbO8mRoiSgjxPE1KcCvCBnYd\.png](../../en/Remote-File-Transfer/Images/Y7tnbO8mRoiSgjxPE1KcCvCBnYd.png)

インストール完了：

![LHFVbOnyQo99DaxphFocOT6nnnc\.png](../../en/Remote-File-Transfer/Images/LHFVbOnyQo99DaxphFocOT6nnnc.png)

## 3. MobaXtermの使用

デスクトップで`MobaXterm`アイコンを見つけて開きます：

![截图\_20250730102737\.png](../../en/Remote-File-Transfer/Images/screenshot-20250730102737.png)

## 4. MobaXterm：SSHリモート

`Session` → `SSH` を選択：リモートデバイスのIPとユーザー名を入力します

例：

Jetsonボードのデフォルト情報：

ユーザー名：juxi

パスワード：juxi

注意：MobaXtermでSSHリモートを使用すると、サイドバーで自動的にSFTPリモートログインが使用されます

![截图\_20250730112840\.png](../../en/Remote-File-Transfer/Images/screenshot-20250730112840.png)

![截图\_20250925095750\.png](../../en/Remote-File-Transfer/Images/screenshot-20250925095750.png)



