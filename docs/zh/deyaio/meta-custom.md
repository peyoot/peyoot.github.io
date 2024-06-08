# meta-custom是什么
这是一个 yocto 层，可以启用许多自定义食谱。DEYAIO使用元自定义来编译各种功能丰富的固件镜像。

# 配方

## recipes-mine

### homeaddons
此配方提供将文件安装到用户主目录的参考。它可以是文本文件或预编译的用户应用程序。

### base-files
此配方提供了一个参考，以使用您自己的 .profile 和 .bashrc 覆盖原始基本文件

### dummy-service
dummy-service配方提供了运行您自己的 systemd 服务的参考


## recipes-core
### images
该目录下提供一系列自定义的目标镜像配方

## recipes-VPN

### pvpn 和 openvpndns
这些配方为目标镜像添加了 pvpn 支持。

将以下行添加到 local.conf：
IMAGE_INSTALL:append = “ gawk unzip pvpn openvpn openvpndns stunnel”

注意：您还需要修改内核选项：

Enable Device Drivers → Network device support → Universal TUN/TAP device driver support


##recipes-qt

ROS2需要QT5的支持，它需要一个自定义的配置放在 /etc/profile.d/qt5.sh。根据其内容用户可以免运行环境配置脚本直接运行ros2命令。
要启用ros2支持，请在dey-aio-manifest中检出kirkstone-ros分支。

