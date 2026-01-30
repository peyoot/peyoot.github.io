## 如何恢复CCMP25开发板的U-Boot
有时，我们误在CCMP25上误刷了用户板卡的Uboot，当用户板卡的U-Boot有和开发板不一样的电源或硬件定义时，原有的CCMP25开发板功能可能就不能用了，这时我们需要恢得开发板默认的UBoot。

如果我们用于更新固件的接口代码或引脚定义同开发板一样，我们仍可以用相关的接口进行升级固件。当所有可用的升级固件接口都有变更时，则需要用USB调试模式来恢复。

1. 为USB调试模式准备固件
以DEY 5.0r3为例，到官方FTP下载下面这些固件：https://ftp1.digi.com/support/digiembeddedyocto/5.0/r3/images/ccmp25-dvk/wayland/
* USB启动所需的TF-A固件：tf-a-ccmp25-dvk-usb.stm32  
* 可以跑在DDR的FIP固件：fip-ccmp25-dvk-ddr-optee-emmc.bin
* 重新刷入所需的FIP二进制固件：fip-ccmp25-dvk-optee-emmc.bin

2. 安装所需工具软件
在主机电脑上安装 dfu-util 软件：
```
sudo apt-get install dfu-util
```
3. 分别用USB数据线连接主机电脑到USB恢复接口，以及console口

4. 设置成usb启动
拨盘开关的2为on,其余三个是off

5. 上电后，主机电脑运行：
```
dfu-util -a 0 -D tf-a-ccmp25-dvk-optee-usb.stm32
dfu-util -a 0 -e
sleep 1
dfu-util -a 0 -D fip-ccmp25-dvk-ddr-optee-emmc.bin
dfu-util -a 0 -e
sleep 1
dfu-util -a 1 -D fip-ccmp25-dvk-optee-emmc.bin
dfu-util -a 0 -e
```
最后一个指令加载uboot到内存后，就可以重新烧对的固件。
一个好的办法是插上带卡刷固件的U盘或SD卡，插在开发板上，上面最后一个指令执行时，按任意键停在uboot，然后执行卡刷命令

## 如何使用CCMP25开发板测试目标板卡的镜像或设备树片段

有一点要记住，如果要使用Digi官方开发板来测试用户自定义板卡的固件，别用卡刷的方式把U-Boot也升级了。如果不慎刷了不对的uboot，先按上面办法恢复。
在自定义板卡的卡刷包中，删除tf-a和fip固件，然后用官方的fip和tf-a固件来替代原来自定义板卡的卡刷包，就可以用开发板运行目标板的卡刷包卡刷程序了