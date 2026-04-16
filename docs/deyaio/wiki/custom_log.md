## 定制开机Logo

开机Logo主要分为两个部分，一个是Uboot阶段，以及Uboot控制权交给Linux内核期间Logo，另一部分是内核已经可以独立渲染Logo的阶段。Linux内核接管Logo展示的配方在recipes-core/psplash/psplash_%25.bbappend ，只需调整这个配方对应目录的图片recipes-core/psplash/files
/logo.png即可。

## UBoot启动Logo图片定制

Uboot的配方位于：meta-digi/blob/scarthgap/meta-digi-arm/recipes-bsp/u-boot/

其中，logo图片可放在配方目录下，以CCMP25为例，将其放置在meta-custom/recipes-bsp/u-boot/u-boot-dey/ccmp25-dvk/logo.bmp

图片格式是否可以用其它的，待试。

根据U-Boot版本号，如果没有则相应创建一个bbappend，以ccmp25为例，即/meta-custom/recipes-bsp/u-boot/u-boot-dey_2023.10.bbappend , 添加以下内容：

```
FILESEXTRAPATHS:prepend := "${THISDIR}:${THISDIR}/${BP}:"

SRCBRANCH = "v2023.10/maint"
SRCREV = "${AUTOREV}"
SRC_URI = "${UBOOT_GIT_URI};branch=${SRCBRANCH}"

# Skip building boot and install scripts
BUILD_UBOOT_SCRIPTS = "false"
UBOOT_ENV = ""

SRC_URI:append:ccmp25 = " \
    file://logo.bmp \
"

do_compile:prepend:ccimx93() {
    # Replace DIGI logo with a barcode image
    cp ${WORKDIR}/logo.bmp ${S}/tools/logos/digi.bmp
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