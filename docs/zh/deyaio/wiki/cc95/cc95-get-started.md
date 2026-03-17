本文为ConnetCore 95的早期开发套件的上手指南，官方文档见：
https://docs.digi.com/resources/documentation/digidocs/embedded/dey/5.0/cc95/yocto-gs_index.html

本文档为删减版，如需更详细的内容，请访问上述官方文档

ConnectCore 95开发套件为ConnectCore95核心板的功能开发验证板。ConnectCore 95是基于i.MX95的工业级核心模组，除了硬件上集成了LPDDR5,eMMC，电源管理和Wifi6E等功能外，还额外附送Digi特有的强大的安全功能和免费云服务平台。

作为入门快速上手指南，本篇章将带领你从开发套件开箱开始，手动更新一个固件并运行它自带的云服务演示程序，帮你熟悉和掌握Digi ConnectCore 95提供的基本功能和服务。

一、开箱
请确认您的 ConnectCore 95 开发套件包含以下组件：
  * ConnectCore 95 开发板
  * 12V 电源
  * USB Type C电缆
  * WiFi天线

您需要一台Linux机器作为系统固件和应用程序开发的电脑主机，建议使用Ubuntu 22.04LTS，至少4GB以上内存和300G以上硬盘空间。

二、硬件连接和设置
如果只是用windows刷固件，则不需要这一步，但如果是用Linux机器作为系统和应用程序开发主机，需要安装USB转串口芯片的驱动，以便主机能识别开发板的console接口。
下载[USB 转串口驱动](https://github.com/digi-embedded/meta-digi/tree/scarthgap/scripts/install_usb_driver.sh)的脚本，然后运行：
```
chmod +x install_usb_driver.sh
sudo ./install_usb_driver.sh

Installing Cypress USB driver.
Rule "/etc/udev/rules.d/90-cyusb.rules" doesn't exist, creating a new one.
File "/etc/modprobe.d/blacklist.conf" exists, checking if the rule is already there.
Rule for cytherm not found. Adding cytherm to the blacklist.
Please plug/unplug your usb device to be recognized.
```
硬件连接示意图如下：
![ConnectCore 95开发板](cc95-dvk.png)
1、把 USB Type-C 线连接到主板上的 USB CONSOLE 接口，如果还没做的话，连接到你的主机电脑。
2、将 Wi-Fi 天线连接到 SMA 天线连接器。
3、把以太网线连接到以太网口。
4、可选：将一根未附带的 HDMI 线连接到 HDMI 接口，再连接到兼容 HDMI 的显示器。
5、确保启动微动开关（SW3）设置为从 eMMC 启动：
![ConnectCore 95启动选项](cc95-boot-sw.png)
6、将 12V/4A 电源连接到电源桶连接器。

三、更新固件
有三种方法更新固件，可以用SD卡，U盘或是type C接口实现固件更新。