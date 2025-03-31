# meta-custom是什么
这是一个 yocto 层，可以启用许多自定义配方。DEYAIO使用meta-custom来编译各种功能丰富的固件镜像。通过将验证过的功能集作为一个meta-custom分支，使用dey-aio-manifest对应的xml文件，能够一键编译出dey的功能固件。

# 分支
在dey-aio-manifest中，通过在xml文件中指定meta-custom的不同分支，来编译不同的功能固件。

master分支将常见的配方整合起来，并移除为特定板卡指定的配方。而dev则尽可能也涵盖不同的板卡配方，因为不同板卡的区别主要在内核设备树上，因此dev分支中，默认的板卡设备树仍为Digi开发板ccmp25-dvk，而特定板卡如ccmp25plc，其默认加载的内核设备树将变为ccmp25-plc.dtb。

# 配方
不同的配方集合在meta-custom中以不同分支的方式组合起来。您也可以参考单独的配方以实现特定的功能。根据DEY的版本，meta-custom也对应有相关的主分支，而功能集通常体现在主分支后缀中，以scarthgap-ccmp25plc为例，它表示实现基于ccmp25的PLC参考板的DEY 5.0(scarthgap)固件。

本章节仅包含少量的配方说明，更多配方用途，请参考分支说明。

## recipes-mine

### homeaddons
此配方提供将文件安装到用户主目录的参考。它可以是文本文件或预编译的用户应用程序。

### base-files
此配方提供了一个参考，以使用您自己的 .profile 和 .bashrc 覆盖原始基本文件

### dummy-service
dummy-service配方提供了运行您自己的 systemd 服务的参考


## recipes-core
仅特定分支有此目录来提供特定的镜像配方

### images
该目录下提供一系列自定义的目标镜像配方

## recipes-VPN

### pvpn 和 openvpndns
这些配方为目标镜像添加了 pvpn 支持。

将以下行添加到 local.conf：
IMAGE_INSTALL:append = “ gawk unzip pvpn openvpn openvpndns stunnel”

注意：您还需要修改内核选项：

Enable Device Drivers → Network device support → Universal TUN/TAP device driver support


## recipes-qt

ROS2需要QT5的支持，它需要一个自定义的配置放在 /etc/profile.d/qt5.sh。根据其内容用户可以免运行环境配置脚本直接运行ros2命令。
要启用ros2支持，请在dey-aio-manifest中检出kirkstone-ros分支。

