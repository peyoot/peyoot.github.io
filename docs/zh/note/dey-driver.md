# DEY AIO驱动开发示例
本文以CH343的驱动开发为例，其它的驱动可以参考实现。CH343可以支持系统内置的ACM驱动，默认该内核选项已经打开：
```
bitbake -c menuconfig virtual/kernel
配置路径：
Device Drivers → USB support → USB Modem (CDC ACM) support
确保 CONFIG_USB_ACM=y
```

如果需要用到流控功能，需要使用厂商驱动：https://github.com/WCHSoftGroup/ch343ser_linux

Linux源码树在~/deyaio-rtnodemo/dey5.0/workspace/ccmp25dvkrt/tmp/work/ccmp25_dvk-dey-linux/linux-dey/6.6/git
而内核自带的设备驱动目录是~/deyaio-rtnodemo/dey5.0/workspace/ccmp25dvkrt/tmp/work/ccmp25_dvk-dey-linux/linux-dey/6.6/git/drivers/，每个目录下有相应的Makefile和Kconfig。
最后在~/deyaio-rtnodemo/dey5.0/workspace/ccmp25dvkrt/tmp/work/ccmp25_dvk-dey-linux/linux-dey/6.6/git/drivers/usb/serial/下有Makefile和Kconfig,以及不同USB转串口芯片厂家的驱动源码。

为了生成可以直接用于配方的补丁，我们应该将CH343的驱动源码（ch343.c和ch343.h）放在drivers/usb/serial/目录下，并修改该目录下的Kconfig和Makefile，以添加CH343的配置和编译选项。

1、拉取驱动源码并放置到驱动目录：

首先，从github临时拉取这些源码，比如：
```
cd ~/mygit/github/
git clone https://github.com/WCHSoftGroup/ch343ser_linux.git
```
然后在内核驱动目录下操作
```
# 进入内核源码的USB串口驱动目录
cd ~/deyaio-rtnodemo/dey5.0/workspace/ccmp25dvkrt/tmp/work/ccmp25_dvk-dey-linux/linux-dey/6.6/git/drivers/usb/serial/

# 将CH343驱动文件复制到这里
cp ~/mygit/github/ch343ser_linux/ch343.c .
cp ~/mygit/github/ch343ser_linux/ch343.h .
```
2、修改Makefile和内核配置

1）修改 Makefile：
在 drivers/usb/serial/Makefile 中，找到其他USB串口驱动的位置（如 ch341.o 附近），添加：
```
obj-$(CONFIG_USB_SERIAL_CH343)		+= ch343.o
```
2）修改 Kconfig：
在 drivers/usb/serial/Kconfig 中，找到合适位置添加：
```
config USB_SERIAL_CH343
	tristate "CH343 USB to serial converter"
	help
	  Say Y here if you want to use a CH343 USB to serial converter.

	  This driver allows you to use CH343 based USB to serial converters.

	  To compile this driver as a module, choose M here: the module will be called ch343.
```
3、编译驱动
现在你可以用DEY的构建环境来编译驱动：
```
# 进入内核构建目录
cd ~/deyaio-rtnodemo/dey5.0/workspace/ccmp25dvkrt/tmp/work/ccmp25_dvk-dey-linux/linux-dey/6.6/build/

# 配置内核，启用CH343驱动
make menuconfig
# 进入 Device Drivers → USB support → USB Serial Converter support
# 找到并选择 "CH343 USB to serial converter" 为 M (模块) 或 Y (内置)

# 或者直接修改 .config 文件
echo 'CONFIG_USB_SERIAL_CH343=m' >> .config

# 编译驱动模块
make drivers/usb/serial/ch343.ko

# 或者编译所有USB串口驱动
make M=drivers/usb/serial/
```
编译完成后，.ko 文件会生成在相应的位置。

4、生成内核补丁
由于是在git仓库中操作，生成补丁非常方便：

```
# 回到内核源码根目录
cd ~/deyaio-rtnodemo/dey5.0/workspace/ccmp25dvkrt/tmp/work/ccmp25_dvk-dey-linux/linux-dey/6.6/git/

# 查看当前修改状态
git status
git diff

# 添加新文件到git
git add drivers/usb/serial/ch343.c drivers/usb/serial/ch343.h
git add drivers/usb/serial/Makefile drivers/usb/serial/Kconfig

# 提交更改
git commit -m "Add CH343 USB to serial driver"

# 生成补丁文件
git format-patch -1 --stdout > 0001-add-ch343-usb-serial-driver.patch

```
5、验证补丁内容

生成的补丁文件应该包含：

新增的 ch343.c 和 ch343.h 文件
对 Makefile 的修改（添加 ch343.o 编译条目）
对 Kconfig 的修改（添加配置选项）

如果要进一步验证，可以：
```
cd some-clean-kernel-source 
git apply /path/to/0001-add-ch343-usb-serial-driver.patch
# 验证是否能正常应用
```
6、集成到Yocto配方

将生成的补丁文件放到你的Yocto层中：

```
# 在你的Yocto层中
mkdir -p meta-custom/recipes-kernel/linux/linux-dey/
cp 0001-add-ch343-usb-serial-driver.patch meta-custom/recipes-kernel/linux/linux-dey/
```
创建或修改 linux-dey_%.bbappend 文件

```
FILESEXTRAPATHS_prepend := "${THISDIR}/${PN}:"

SRC_URI += " \
    file://ch343-config.cfg \
    file://0001-add-ch343-usb-serial-driver.patch \
"
```
