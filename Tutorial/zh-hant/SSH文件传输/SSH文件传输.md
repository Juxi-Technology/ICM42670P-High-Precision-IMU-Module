# SSH檔案傳輸

## 一、WInSCP程式安裝

[遠程登錄軟件\.zip](/downloads/远程登录软件.zip)

下載並解壓，雙擊打開程式並且開始安裝，點擊Accept接受協定，然後跟着提示安裝就好。

![AQFlbRMSSob30QxDqIXcvEOqnRc\.png](../../en/SSH文件传输/图片和附件/AQFlbRMSSob30QxDqIXcvEOqnRc.png)

![N3Fybs4V2o0bWkx1tJQcelQXnYe\.png](../../en/SSH文件传输/图片和附件/N3Fybs4V2o0bWkx1tJQcelQXnYe.png)

![PtyqbBv8ToogzFxEV1oczfhwn5d\.png](../../en/SSH文件传输/图片和附件/PtyqbBv8ToogzFxEV1oczfhwn5d.png)

點擊Finish完成安裝。

![WMXGbsFL3oFjCrxYXLkcr7Asn0b\.png](../../en/SSH文件传输/图片和附件/WMXGbsFL3oFjCrxYXLkcr7Asn0b.png)

可以看到桌面多了一個WinSCP的圖示

![RBXsbYQo3oJISOxCoN2c0PyjnEc\.png](../../en/SSH文件传输/图片和附件/RBXsbYQo3oJISOxCoN2c0PyjnEc.png)

## 二、SSH遠程傳檔案

打開WinSCP軟件後出現以下登錄介面。

File protocol：檔案協定選擇SFTP，Host name：IP地址，Port number：預設22就可以，User name：使用者名，Password：登錄密碼。

輸入正確的資訊後可以點擊Save保存一下填寫的資訊，下次登錄的時候不用重複輸入。

![Bv7zb5twaoIT4txrqxccW2Ydnog\.png](../../en/SSH文件传输/图片和附件/Bv7zb5twaoIT4txrqxccW2Ydnog.png)

點擊Login登錄成功後會顯示以下介面，左邊的是win電腦的資料夾，右邊的是nano的資料夾。

![MtbUbV1XMo5SI2xQ1cycgk5SnAE\.png](../../en/SSH文件传输/图片和附件/MtbUbV1XMo5SI2xQ1cycgk5SnAE.png)

檔案傳輸有三種操作方式，第一種是直接把檔案從左邊拉到右邊，或者從右邊拉到左邊，系統會自動複製一份檔案傳輸過去。

第二種是滑鼠選中檔案，然後按一下F5鍵，則被選中的檔案會複製一份到另一邊。

第三種是選中檔案點擊滑鼠右鍵，如果是從win電腦傳到nano則點擊upload，

![CruTbJihzo4jSXxKNw0c7vINnyb\.png](../../en/SSH文件传输/图片和附件/CruTbJihzo4jSXxKNw0c7vINnyb.png)

會彈出一個提示，可以選擇不再提示，並且點擊OK，則檔案自動傳輸過去。

![RF0nbHwrfoDytkxSS5ZcrBp1ndL\.png](../../en/SSH文件传输/图片和附件/RF0nbHwrfoDytkxSS5ZcrBp1ndL.png)

如果從nano傳檔案到win電腦上，則按滑鼠右鍵選中檔案，選擇Download

![QPHhbkshaoHzx7xUUdZcrpIynRd\.png](../../en/SSH文件传输/图片和附件/QPHhbkshaoHzx7xUUdZcrpIynRd.png)

注意：檔案傳輸需要電腦和主板在同一個區域網絡下，並且樹莓派已開啟SSH服務才可以進行。有時若遇見傳輸檔案失敗一般是主板這邊的權限不夠，我們只需要給予最高權限。

```Plain Text
chmod 777 目录名 
```



