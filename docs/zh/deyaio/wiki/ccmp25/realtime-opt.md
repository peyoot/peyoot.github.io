# 实时性优化
包括内核优化和软件服务优化
## 内核优化
无用的内核，像虚拟化支持等

## 软件服务优化
注意，不可以在local.conf中用变量名，而应该在bbappend中去用，比如在packagegroup-dey-network.bb中定义有：
```
CELLULAR_PKGS = " modemmanager ppp "
```
那么如果在local.conf中操作，就是对这两个包的移除，而不能用变量名，如果用bbapend或是image的配方，是可以用
```
CELLULAR_PKGS= ""
CCCS_PKGS = ""
CC_DEMO_PACKAGE = ""
```
#### Distro Feature优化
Distro Feature内置特性不容易从安装包配置中，比如移除蜂窝网，在local.conf中使用
```
RDEPENDS:packagegroup-dey-network:remove = " ppp modemmanager "
```
或是把包添加到IMAGE_INSTALL:remove
```
IMAGE_INSTALL:remove = " ppp modemmanager "
```
都没有效果，这时就要查Distro Feature了
##### 移除ModemManager
```
robin@dev-all-in-one-ubuntu:~/deyaio-viena/dey5.0/workspace/ccmp25-viena$ bitbake -e packagegroup-dey-network | grep ^DISTRO_FEATURES
DISTRO_FEATURES="acl alsa bluetooth debuginfod ext2 ipv4 ipv6 pcmcia usbgadget usbhost wifi xattr   pci    vfat seccomp opengl  multiarch  vulkan rt opengl pam  vulkan  opencl  cellular gstreamer pam efi optee systemd usrmerge pulseaudio gobject-introspection-data ldconfig"
DISTRO_FEATURES_BACKFILL="pulseaudio sysvinit gobject-introspection-data ldconfig"
DISTRO_FEATURES_BACKFILL_CONSIDERED=" sysvinit"
DISTRO_FEATURES_DEFAULT="acl alsa bluetooth debuginfod ext2 ipv4 ipv6 pcmcia usbgadget usbhost wifi xattr nfs zeroconf pci 3g nfc x11 vfat seccomp"
DISTRO_FEATURES_FILTER_NATIVE="api-documentation debuginfod opengl wayland"
DISTRO_FEATURES_FILTER_NATIVESDK="api-documentation debuginfod opengl wayland"
DISTRO_FEATURES_NATIVE="acl x11 ipv6 xattr"
DISTRO_FEATURES_NATIVESDK="x11"

```
其中看到Default里有cellular 3g ，因此可以用DISTRO_FEATURES:remove移除
```
DISTRO_FEATURES:remove = "  cellular 3g  "

检查是否仍有/usr/sbin/ModemManager
```
#### 禁用wifi，BT,音视频
禁用这些可以提升实时性，但根据硬件需要可以有所选择保留
```
DISTRO_FEATURES:remove = " pulseaudio alsa bluetooth wifi gstreamer "
```