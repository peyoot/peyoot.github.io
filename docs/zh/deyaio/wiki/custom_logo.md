## 定制开机Logo

开机Logo主要分为两个部分，一个是Uboot阶段，以及Uboot控制权交给Linux内核期间Logo，另一部分是内核已经可以独立渲染Logo的阶段。Linux内核接管Logo展示的配方在recipes-core/psplash/psplash_%25.bbappend ，只需调整这个配方对应目录的图片recipes-core/psplash/files
/logo.png即可。

## UBoot启动Logo图片定制

Uboot的原始配方位于：meta-digi/blob/scarthgap/meta-digi-arm/recipes-bsp/u-boot/ ，不同平台有不同版本。

其中，logo图片可放在配方目录下，以CCMP25为例，将其放置在meta-custom/recipes-bsp/u-boot/ccmp25-dvk/logo350x175.bmp

如果图片格式不是bmp，先行转换一下。注意转成8位深度的让尺寸不超过60k。最好根据所用屏幕分辨率的比例来做这个图片，只看比例，也不用太大，会自动延展，只要不影响清淅度，少占些内存更好些。比如1024x600的屏幕分辨率，相当于480×281。事实上为了减少尺寸，宽离最好在400以下。
一个简单的方式是先用tinypng转png文件，再用格式转换工具，这样能最小化logo。

根据U-Boot版本号，如果没有则相应创建一个bbappend，以ccmp25为例，即/meta-custom/recipes-bsp/u-boot/u-boot-dey_2023.10.bbappend , 添加以下内容：

```
FILESEXTRAPATHS:prepend := "${THISDIR}:${THISDIR}:"

SRC_URI:append:ccmp25 = " \
    file://logo350x175.bmp \
"

do_compile:prepend:ccmp25() {
    # Replace DIGI logo with a barcode image
    cp ${WORKDIR}/logo350x175.bmp ${S}/tools/logos/digi.bmp
}
```

## 编译
需要清理和重新编译的内容包括uboot和fip-stm32mp固件，因为uboot是打包在fip固修的当中的。

```
bitbake -c cleansstate u-boot-dey
bitbake -c cleanall u-boot-dey
bitbake -c cleansstate fip-stm32mp
bitbake -c cleanall fip-stm32mp
bitbake u-boot-dey
bitbake fip-stm32mp
```