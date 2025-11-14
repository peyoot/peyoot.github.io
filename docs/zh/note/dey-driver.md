# DEY AIO驱动开发示例

Linux源码树在~/deyaio-rtnodemo/dey5.0/workspace/ccmp25dvkrt/tmp/work/ccmp25_dvk-dey-linux/linux-dey/6.6/git
而内核自带的设备驱动目录是~/deyaio-rtnodemo/dey5.0/workspace/ccmp25dvkrt/tmp/work/ccmp25_dvk-dey-linux/linux-dey/6.6/git/drivers/，每个目录下有相应的Makefile和Kconfig。

## USB扩展串口的驱动集成

本文以CH343的驱动开发为例，其它的驱动可以参考实现。CH343可以支持系统内置的ACM驱动，默认该内核选项已经打开：
```
bitbake -c menuconfig virtual/kernel
配置路径：
Device Drivers → USB support → USB Modem (CDC ACM) support
确保 CONFIG_USB_ACM=y
```

如果需要用到流控功能，需要使用厂商驱动：https://github.com/WCHSoftGroup/ch343ser_linux


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
最安全的构建环境是devshell,在项目文件夹中执行
```
bitbake -c devshell virtual/kernel
```
此命令会解压内核源码，配置好所有环境变量（如ARCH和CROSS_COMPILE），并打开一个新的shell终端以便手动开发调试

# 配置内核，启用CH343驱动
make menuconfig
# 进入 Device Drivers → USB support → USB Serial Converter support
# 找到并选择 "CH343 USB to serial converter" 为 M (模块) 或 Y (内置)

# 或者直接修改 .config 文件
echo 'CONFIG_USB_SERIAL_CH343=m' >> .config

# 编译特定目录驱动模块
make drivers/usb/serial/

# 或者编译所有USB串口驱动
make M=drivers/usb/serial/
```
编译完成后，.ko 文件会生成在相应的位置。

4、生成内核补丁
由于是在git仓库中操作，生成补丁非常方便，但是由于执行手动的make，环境已经被污染，先要恢复一下，
首先备份一下改动：
```
cp drivers/usb/serial/Makefile ~/tempbk/
cp drivers/usb/serial/Kconfig ~/tempbk/
```
然后用exit退出devshell，执行清理：
```
bitbake -c cleansstate virtual/kernel
因为这会删除之前下载和编译的内核文件及源码，所以还需要再执行一次进入devshell并恢复原始的源码库：
 
```
bitbake -c devshell virtual/kernel
git reset --hard
```
# 修改并生成变更到配方

# 查看当前修改状态
git status
这里有一些untrack并没有影响，
git diff
此时变动为空，因为我们主要是要增加ch343相关的驱动，将备份的东西拷回来，再git diff一下，

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

将补丁文件（如 0001-add-ch343-usb-serial-driver.patch）和可能的内核配置文件（如 ch343-config.cfg，内容为 CONFIG_USB_SERIAL_CH343=m）放在你Yocto层的 meta-custom/recipes-kernel/linux/linux-dey/ 目录下

```
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

## 电阻屏的支持

电阻屏需要专用的驱动芯片，这个芯片内部集成了模拟开关、ADC、逻辑控制和驱动。对外一般是SPI接口和一个中断GPIO来连接处理器。
Linux内核的驱动也是与这些控制器芯片对接的，内核配置选项的路径如下，以ADS7843/TSC2046系列兼容芯片为例：

```
Device Drivers  --->
    Input device support  --->
        Touchscreens  --->
		<*> ADS7846/TSC2046/AD7873 and AD7843 based touchscreen 
```
硬件连接：

```
四线电阻屏引脚 → ADS7843引脚：
X+ → VIN1
Y+ → VIN2
X- → VIN3  
Y- → VIN4

ADS7843 → ARM处理器：
DOUT → SPI_MISO
DIN  → SPI_MOSI
CS   → SPI_CS
CLK  → SPI_CLK
PENIRQ → GPIO（任意可用GPIO，配置为中断）
```
SPI是一种总线，添加SPI接口时，我们可添加NSS就是硬件片选信号（NSS = Negative Slave Select），这是供主设备去控制选中外部SPI设备的，但如果你想连接多个SPI设备，可以使用任意GPIO作为额外的片选信号。

设备树示例:

```
&spi2 {
    pinctrl-names = "default", "sleep";
    pinctrl-0 = <&ccmp25_spi2_pins>;
    pinctrl-1 = <&ccmp25_spi2_sleep_pins>;
    status = "okay";
    
    /* USER CODE BEGIN spi2 */
    // 使用硬件NSS，不需要cs-gpios
	// cs-gpios = <&gpiob 1 GPIO_ACTIVE_LOW>; // 取消注释，并使用PB1作为片选
    
    touchscreen@0 {
        compatible = "ti,ads7846";  // 或 "xpt2046" 如果驱动支持
        reg = <0>;                  // 使用硬件NSS 或使用cs-gpios中的第一个片选，即PB1，都是（片选0）
        spi-max-frequency = <1000000>;
        interrupts = <&gpioc 13 IRQ_TYPE_EDGE_FALLING>;  // 假设使用PC13作为中断
        interrupt-parent = <&gpioc>;
        
        /* 触摸屏参数 */
        ti,x-min = /bits/ 16 <0>;
        ti,x-max = /bits/ 16 <4095>;
        ti,y-min = /bits/ 16 <0>;
        ti,y-max = /bits/ 16 <4095>;
        ti,pressure-min = /bits/ 16 <0>;
        ti,pressure-max = /bits/ 16 <255>;
        ti,x-plate-ohms = /bits/ 16 <400>;
    };
    /* USER CODE END spi2 */
};
```


## ov2740驱动调试

问题是如何发现的？

```
# 设备树compatible: "ovti,ov2740"
cat /sys/bus/i2c/devices/0-0036/of_node/compatible
# 输出: ovti,ov2740
# 但驱动只支持ACPI设备，不支持设备树！
modinfo ov2740 | grep alias
# 输出: alias: acpi*:INT3474:*
```
到linux源码树下查看，特别是从Makefile中看到Digi的6.6.48版本前后都没啥变化，共1229行（29211B）。
https://elixir.bootlin.com/linux/v6.6.48/source/drivers/media/i2c/ov2740.c
这个文件和ov5640.c的4012行（104293）相比差很多！可见较少人用。

查看源码发现：
```
ov5640.c里是：
static const struct of_device_id ov5640_dt_ids[] = {
	{ .compatible = "ovti,ov5640" },
	{ /* sentinel */ }
};

而ov2740.c里是：
static const struct acpi_device_id ov2740_acpi_ids[] = {
	{"INT3474"},
	{}
};


当前内核中的ov2740驱动只支持ACPI，而没有设备树（OF）支持。这意味着它无法通过设备树匹配设备，因此无法与设备树节点（compatible="ovti,ov2740"）绑定。
```

解决方案有两种：

* 修改现有的ov2740驱动，添加设备树支持（模仿ov5640驱动）。
* 从摄像头官方（OmniVision）获取最新的驱动源码，可能已经包含了设备树支持。
* 查看其它大厂的源码，看是否支持了设备树。

找其它官方,比如Intel的IPU6驱动：https://github.com/intel/ipu6-drivers/tree/master/drivers/media/i2c
并没有什么用，因为它没有of_device_id，即设备树支持。

看来除非直接找原厂要到最新的驱动源码，否则只能仿ov5640来改了。经过AI查询，发现Nvidia有。
https://developer.nvidia.com/embedded/jetson-linux 下载源码链接：
https://developer.nvidia.com/downloads/embedded/l4t/r36_release_v4.4/sources/public_sources.tbz2

