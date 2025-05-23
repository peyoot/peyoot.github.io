# DEY 系统镜像安装包
---

DEY是Digi Embedded Yocto， 基于Yocto开发的能运行在Digi的片上系统核心板或单板机上的linux镜像。它通常整合了自定义的程序和服务，可以通过SD卡或U盘，或是网络来刷入DEY镜像，实现所需的功能。

## 上电前的准备

用户需要下载或是编译出DEY系统镜像的安装包，并解压到FAT32格式的SD卡或U盘中。（windows下对于16G以上的存储设备会自动格式化为exFAT，这不适用于刷机）。建议用guiformat这个绿色的FAT32软件来格式化SD卡或U盘，如果你的U盘是16G及其以下的，也可以用windows自带的工具格式化。

请使用USB TYPE C数据线将电脑和开发板的Console接口连接好，并准备好套件内自带的5V电源，先不上电，备用。（注意开发板使用5V电源，超过5.7V供电即有可能损坏，因此请勿混淆电源）。用户电脑需要有一个终端程序，比如MobaXterm，连接上console口后，开发板会被电脑自动识别出一个串口，可以新建一个Serial的会话，选中该串口，并设置串口波特率为115200/8/n/1。

上电，并按任意键停留在U-Boot界面，U-Boot的参数image-name有一个默认值，如果您使用或编译的镜像不是默认安装包镜像，则需要指定它，比如我们使用SD卡和dey-image-lvgl镜像，则在Linux下刷系统镜像的过程如下

```
setenv image-name dey-image-lvgl
run install_linux_fw_sd
```
注意，如果是用U盘，则相关命令是：
```
usb start
setenv image-name dey-image-lvgl
run install_linux_fw_usb
```

U-Boot脚本会自动刷入相关的系统镜像，并重启进入系统

## 使用http-usb-camera 演示
如果您刷了这个demo，请先连上开发板ap，通常是ap-XXXX开头，默认密码在/etc/hostapd_wlan1.conf中定义

可以通过浏览器打开192.168.46.30这个IP地址来浏览摄像头的视频流