# 定制工控板的设备树
当使用SmartIOMux来给基于ConnectCore 片上系核心模块设计产品时，会自动生成相关的设备树。虽然可以参考开发板使用相关的验证过的接口芯片和显示屏，但更多的时候，用户需要在这个设备树上进行微调，以便使用自己的接口芯片或是显示屏，这时就要对工控板的设备树进行相应的调整，以便新的设备树能符合设计要求。最常见的是使用低成本的Realtek网口PHY芯片，使用不同的UART作为接口，对USB电路进行精简，以及使用自己的LCD触控屏。

## 修改设备树源文件
有几种方式可以实现对设备树的修改，包括修改板子的设备树和使用overlay设备树来覆盖。下面以板级设备树的修改为例。通常，我们要可在git库中新建一个项目，专门用来替代原有设备树，本文以ConnectCore MP25的PLC开发板为例，它的设备树托管在[peyoot/ccmp25_dt](https://github.com/peyoot/ccmp25_dt)分支中。

设备树的修改和调试会经常涉及源码的变更，因为为工控板的设备树定义不同的分支，以适应不断变化的要求。您可以fork设备树，然后根据项目创建分支，一个比较合理的分支命名方式是<yocto版本>-<板卡名>-<版本号(可选)>。比如scarthgap-ccmp25plc或scarthgap-ccmp25plc-v1。

Linux加载的设备树位于于内核linux分区，而设备树的源码则位于linux源码树中的arch/arm64/boot/dts/digi/下，源码对应在编译目录下是位于：
tmp/work/ccmp25_dvk-dey-linux/linux-dey/6.6/git，如果不使用默认的ccmp25-dvk.dts，需要在Makefile中添加要编译的设备树名，比如ccmp25-plc.dts，它要编译出ccmp25-plc.dtb设备树文件。

## 编译改动的设备树
通常可以在devshell或是直接用bitbake的方式来编译设备树，建议用devshell来快速迭代开发，

### devshell

进入devshell的方式如下，此时会来到
```
bitbake -c devshell linux-dey
此时devshell会出现，并停在linux源码树的根目录
先生成内核配置文件
make ccmp2_defconfig  
```
设备树就位于arch/arm64/boot/dts/digi/，在devshell下，通常只有ccmp25-dvk.dts板级设备树，而我们需要的自定义板卡的设备树在bitbake时会自动编译，在devshell中则需手动添加，并添加到arch/arm64/boot/dts/digi/Makefile以便可以手动编译，我们可以在拉取设备树源码，确保源码已经应用了变更并复制到相应的目录下，如果要临时测试，可以用链接文件，以ccmp25-plc.dts为例
```
另开一个终端
mkdir -p ~/github
cd ~/github
git https://github.com/peyoot/ccmp25_dt.git
git checkout scarthgap-ccmp25plc
回到devshell中
cd arch/arm64/boot/dts/digi/
ln -s ~/github/ccmp25_dt/ccmp25-plc.dts
ls
确保相关板级设备树存在
然后修改Makefile,在“ccmp25-dtbs :=          ccmp25-dvk.dtb \”之后插入新行，添加“ccmp25-plc.dtb \”
nano Makefile
```
# SPDX-License-Identifier: GPL-2.0-only

ccmp25-dtbs :=          ccmp25-dvk.dtb \
                        ccmp25-plc.dtb \
                        ccmp25-dvk_e55rb-i-mw346-c-mipi-dsi.dtbo \
...
```
接下来就可以在devshell里直接编译，注意，你要回到devshell的根目录，
```
cd ../../../..
make dtbs
```
编译结果在tmp/work/ccmp25_dvk-dey-linux/linux-dey/6.6/build下，通常我们可以另开终端用ls查询，
将其拷贝出来，可以用updatefile单独刷到linux分区，或直接重载linux分区为可写方式，并拷贝进去。
Uboot下默认加载fdt_file定义的板级设备树文件，因此我们可以设置uboot中的fdt_file来测试这个新编译的设备树
```
usb start
updatefile linux_a usb 0:1 ccmp25-plc.dtb ccmp25-plc.dtb
setenv fdt_file ccmp25-plc.dtb  设置启动加载的设备树名
saveenv
reset
```
或者，也可在linux中重载/mnt/linux分区为可读写，然后替换设备树
进入linux后
```
mount -o remount,rw /mnt/linux 
cp ccmp25-plc.dtb /mnt/linux/ccmp25-plc.dtb
sync
reboot
```
### 自定义overlays的编译
上面的方法可以编译自定义板卡的设备树，如果自定义板卡之外，还要再自定义overlays，devshell的方式编译就需要进一步修改Makefile，这是因为在设备树的Makefile中，<合成产物>-dtbs的定义会编译出<合成产物>.dtb，原有Makefile的合成产物是ccmp25.dtb，它指的基本设备树是第一个文件，即ccmp25-dvk.dtb，如果我们有自定义板卡，基本设备树改为我们的名称，就要另起一个合成产物的名称。比如：
```
# SPDX-License-Identifier: GPL-2.0-only
ccmp25-dtbs :=          ccmp25-dvk.dtb \
                        ccmp25-dvk_e55rb-i-mw346-c-mipi-dsi.dtbo \
                        ccmp25-dvk_g101evn010-lvds.dtbo \
                        ccmp25-dvk_ov5640-mipi-csi.dtbo \
                        ccmp25-dvk_mikroe-accel2-click.dtbo \
                        ccmp25-dvk_mikroe-gyro-click.dtbo \
                        ccmp25-dvk_mikroe-i2c-to-spi-click.dtbo \
                        ccmp25-dvk_mikroe-mcp2518fd-click.dtbo \
                        ccmp25-dvk_n25q256a-spi-nor-flash.dtbo \
                        ccmp25-dvk_nhd-3-5-640480ef-msxp-mipi-dsi.dtbo \
                        ccmp25-dvk_usb-3-0-typec.dtbo \
                        ccmp25_bt.dtbo \
                        ccmp25_wifi.dtbo

# --- 检查自定义的overlay 对ccmp25-company.dtb这个base的label引用是否正确 ---
ccmp25-company-check-dtbs :=  ccmp25-company.dtb \
                            ccmp25-company_hdmi.dtbo \
                            ccmp25-company_dualdisplay.dtbo \
                            ccmp25-company_ads7846.dtbo

dtb-$(CONFIG_ARCH_STM32) += \
        ccmp25.dtb \
        ccmp25-company-check.dtb \
        ccmp25-mfg-functional.dtb \
        ccmp25-mfg-functional-wb.dtb
```

### 直接bitbake

这种方式需要先bitbake -c cleanall <镜像名>，
然后再bitbake -C compile linux-dey  
相关的设备树也会编译出来，再bitbake <镜像名> 来打包镜像，最终的镜像的linux中带有相关的设备树，不过首次开机启动后，仍要更改fdt_file参数，以便加载自定义的设备树。

## 修改optee的设备树
optee的设备树定义了哪些接口需要通过可信固件来操作的安全模式，如果发现一些GPIO引脚被内核占用，很有可能是在optee的设备树时定义了该引脚为安全模式。比如在OP- TEE里PH4和PZ2被配置为安全的GPIOS:

https://github.com/digi-embedded/optee_os/blob/4.0.0/stm/maint/core/arch/arm/dts/ccmp25-dvk-rif.dtsi#L487

https://github.com/digi-embedded/optee_os/blob/4.0.0/stm/maint/core/arch/arm/dts/ccmp25-dvk-rif.dtsi#L559

下面介绍如何用bbappend来修改这类optee的设备树：

### 找到optee的源码树
通常，以CCMP25为例，通常它位于：tmp/work/ccmp25_dvk-dey-linux/optee-os-stm32mp/4.0.0-stm32mp-r1/git下，到这个目录后，我们可以直接修改源码，在未提交更改时，用
```
git diff --relative core/arch/arm/dts/ccmp25-dvk-rif.dtsi core/arch/arm/dts/ccmp25-dvk.dts > 0001-ccmp25-dvk-adjust-dts-configuration.patch
```
来生成patch文件。
在meta-custom中，创建optee的bbaapend和patch文件目录：
```
mkdir -p recipes-security/optee/optee-os-stm32mp/files
cp 0001-ccmp25-dvk-adjust-dts-configuration.patch recipes-security/optee/optee-os-stm32mp/files/
nano recipes-security/optee/optee-os-stm32mp_4.0.0.bbappend
```
下面是参考的bbappend文件内容：
```
# ~/your-meta-custom/recipes-security/optee/optee-os-stm32mp_4.0.0.bbappend
FILESEXTRAPATHS:prepend := "${THISDIR}/${PN}:"
SRC_URI += "file://0001-ccmp25-dvk-adjust-dts-configuration.patch"
```
然后可以触发重新编译
```
bitbake optee-os-stm32mp -c clean
bitbake optee-os-stm32mp
```
重新编译 tf-a-stm32mp 以生成包含最新 OP-TEE 修改的 FIP 镜像
```
# 清理 tf-a-stm32mp 的旧构建（确保重新打包 FIP）
bitbake tf-a-stm32mp -c clean

# 重新编译 tf-a-stm32mp（会自动触发 optee-os-stm32mp 的重新编译）
bitbake tf-a-stm32mp

# 检查生成的 FIP 镜像路径
ls tmp/deploy/images/ccmp25-dvk/fip-ccmp25-dvk-optee-emmc.bin
```