# ConnectCore 93开发套件测试
本文将引导您设置 ConnectCore 93 开发套件，通过HDMI显示器或LVDS液晶屏开发套件来展示UI界面，并通过ConnectCore云服务来演示来远程监控和管理您的设备。更多资料请参考[官方文档](https://docs.digi.com/resources/documentation/digidocs/embedded/dey/5.0/cc93/yocto-gs_index.html)

## 套件和软体准备
您需要一套Digi Connectcore 93（以下简称CC93）开发套件，内含一块CC93开发板和5V电源，USB线缆，以及一根WiFi天线。此外还带有Digi云连接的二维码卡片。开发板可以用Digi ConnectCore APP激活一年的免费云服务支持。

您还需要一台用于应用开发和系统定制的 64 位 Linux 机器，建议配备四核处理器，16G以上内存，以及500G以上的硬盘空间，并安装好Ubuntu 22.04。

您可以从Digi的[官方固件库](https://ftp1.digi.com/support/digiembeddedyocto/5.0/r3/images/ccimx93-dvk/)下载CC93的不同镜像，或是下载peyoot的[无线web摄像头视频流演示固件](https://gitee.com/peyoot/dey-cc93-images/raw/release-assets/cc93rtsp_dey5.0r2_lvgl_installer.zip)
```
wget https://gitee.com/peyoot/dey-cc93-images/raw/release-assets/cc93rtsp_dey5.0r2_lvgl_installer.zip
```

请准备好一张格式化为FAT32的uSD卡或U盘，并提前下载要刷入的固件，并解压到SD卡或U盘上。开发板的接口示意图如下，Digi CC93开发板上的Console接口是通过USB转UART芯片暴露到开发板上的Type C接口（位于音频接口边上），你至少需要通过一根USB数据线将电脑的USB接口连接上Console口。建议按图示的顺序连接，其中，第5步可以选择使用的介质，比如使用U盘，则是将带有固件的U盘插入到USB Host接口上，使用UUU工具来刷固件时，则需连接开发板的USB OTG接口。

![Digi ConnectCore 93开发板接口示意图](/pic/cc93-dvk-gs.jpg)

使用Linux机器连接开发板，需要Linux电脑能正确识别板载的USB转UART的Console接口，一般还需要下载安装一下[USB转串口驱动脚本驱动](https://github.com/digi-embedded/meta-digi/tree/scarthgap/scripts/install_usb_driver.sh)。
```
#用wget下载并安装
wget https://gitee.com/peyoot/dey-cc93-images/raw/release-assets/install_usb_driver.sh

chmod +x install_usb_driver.sh
sudo ./install_usb_driver.sh

Installing Cypress USB driver.
Rule "/etc/udev/rules.d/90-cyusb.rules" doesn't exist, creating a new one.
File "/etc/modprobe.d/blacklist.conf" exists, checking if the rule is already there.
Rule for cytherm not found. Adding cytherm to the blacklist.
Please plug/unplug your usb device to be recognized.
```
