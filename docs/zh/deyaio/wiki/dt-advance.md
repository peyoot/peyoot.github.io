# 设备树定制进阶
当我们使用不同的以太网PHY，或是使用了不同的电源DCDC芯片时，或是对电路进行大幅精简，有时需要对设备树进行调整，以适应这些改动。本章节以CCMP25 PLC参考设计为例，来讲解设备树定制的进阶。

## uboot下设备树的编译
uboot也支持设备树，它和linux中所用的设备树并不完全相同，通常会更简洁，有时也们同样也需要修改uboot下的设备树，同样地，最好的办法是基于原有开发板的设备树进行微调。在ccmp25-plc项目dey4.0-r7版本中，uboot设备树更改涉及到的源码位于ccmp25_dt中的dualeth-s分支的uboot和uboot-dts目录下，修改完成后，我们首先需要把源码拷到编译项目下，仅用链接文件是不够的。


uboot的源码和编译目录在tmp/work/ccmp25_dvk-dey-linux/u-boot-dey/2022.10-r0/目录下的git和build两个子目录下。通常我们要用开发板的uboot文件名ccmp25-dvk.dts，但我们的源码文件名是ccmp25-plc.dts，因此只要拷贝覆盖，Makefile是不必要改的。

在DEY项目中，用下面的方式检查源码文件和日期，不同版本对应路径名略有区别：
```
ls -la tmp/work/ccmp25_dvk-dey-linux/u-boot-dey/2022.10-r0/git/configs/cc*
ls -la tmp/work/ccmp25_dvk-dey-linux/u-boot-dey/2022.10-r0/git/arch/arm/dts/cc*
```

对于CCMP系列带安全功能支持的核心板来说，UBoot和设备树是被打包在FIP镜像中，事实上，如果深究uboot的配方，会发现deploy阶段，是把设备树和不带设备树的uboot拷到deploy-u-boot-dey/uboot目录下。所以，这编译出这两个文件才是启动的关键文件，编译后应该检查这两个文件的日期以便确定已经用最新的源码编译，而不是cache的文件。
```
tmp/work/ccmp25_dvk-dey-linux/u-boot-dey/2022.10-r0/deploy-u-boot-dey/u-boot-ccmp25-dvk.dtb  
tmp/work/ccmp25_dvk-dey-linux/u-boot-dey/2022.10-r0/deploy-u-boot-dey/u-boot-nodtb.bin
```

如果我们把ccmp25_dt拉取到~/git/ccmp25_dt下，切换到dualeth-s分支后，根据之前提供的源码路径，可以用下面方式覆盖：
```
cp ~/git/ccmp25_dt/uboot/configs/ccmp25-dvk_defconfig tmp/work/ccmp25_dvk-dey-linux/u-boot-dey/2022.10-r0/git/configs/ccmp25-dvk_defconfig
cp ~/git/ccmp25_dt/uboot-dts/ccmp25-dvk-u-boot.dtsi tmp/work/ccmp25_dvk-dey-linux/u-boot-dey/2022.10-r0/git/arch/arm/dts/ccmp25-dvk-u-boot.dtsi
cp ~/git/ccmp25_dt/uboot-dts/ccmp25-plc.dts tmp/work/ccmp25_dvk-dey-linux/u-boot-dey/2022.10-r0/git/arch/arm/dts/ccmp25-dvk.dts
```
如果编译过镜像，事实上已经编译过uboot，单独编译uboot可用：
```
bitbake u-boot-dey
```
编译后的结果位于：tmp/work/ccmp25_dvk-dey-linux/u-boot-dey/2022.10-r0/build/ccmp25-dvk_defconfig/arch/arm/dts

如果我们要手动修改了uboot源码，可以用bitbake -c devshell u-boot-dey来调出devshell，在里面修改。对于覆盖源码修改后，可以直接操作本地修改后的编译命令：
```
bitbake -C compile u-boot-dey
```
注意这里的大写-C，表示使用本地的变更，如果不用这个参数，事实上uboot会根据配方从源码中拉取，这样本地的变更就没法用上。

如果需要更改和编译不同的启动脚本或卡刷脚本，也是一样的办法。
编译完，用exit退出devshell。

注意，编译出的uboot并不会自动打包到启动镜像中，要生成带有uboot的启动镜像，应该用tf-a-stm32mp配方，为了防止sstate缓存生效而不是用新编译的uboot，最好是先清除一下：
```
bitbake -c cleansstate tf-a-stm32mp
bitbake -c cleansstate core-image-base
bitbake -c cleanall tf-a-stm32mp
bitbake -c cleanall core-image-base
```
然后再
```
bitbake tf-a-stm32mp
bitbake core-image-base
```
## 使用配方自动拉取自定义设备树
我们可以在meta-custom的指定分支上放置相关设备树的配方，通过deyaio-manifest项目指定的xml来拉取包括自定义设备树在内的deyaio工具链，以ccmp25-plc项目为例，它在meta-custom的kirkstone-ccmp25plc上
```
mkdir ~/deyaio-ccmp25plc
cd ~/deyaio-ccmp25plc
repo init -u https://github.com/peyoot/dey-aio-manifest.git -b kirkstone -m ccmp25plc.xml
cd dey4.0/workspace/
mkdir ccmp25plc
cd ccmp25plc
source ../../mkproject.sh -p ccmp25-dvk
nano conf/local.conf
加上 KERNEL_DEVICETREE += "ccmp25-plc.dtb"
然后就可以编译了 bitbake core-image-base
```


