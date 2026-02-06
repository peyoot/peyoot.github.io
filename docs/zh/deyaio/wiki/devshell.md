# devshell简介
在Yocto的编译过程中，有时我们只需要编译特定的设备树或内核模块，而不是整个linux构件，这时可以进入devshell来快速开发迭代。devshell是一个设置好yocto开发环境的终端，用户可以手动修改内核模块或设备树源码，通过make命令快速获得更改后的部件。

# devshell之内核选项开关和模块编译
进入yocto的开发环境后，执行
```
bitbake -c devshell linux-dey
```
上面命令会打开一个devshell，并停在linux内核源码目录下，等待用户执行命令，此时，build目录为空，内核编译所需的.config文件还不存在。
内核配置在：tmp/work/ccmp25_dvk-dey-linux/linux-dey/6.6/git/arch/arm64/configs$
以ccmp25为例，bitbake镜像时会在tmp/work/ccmp25_dvk-dey-linux/linux-dey/6.6这个目录生成对应机器的defconfig，以此在build目录下生成.config。
但devshell打开后，还没有生成内核配置.config，此时如果要用对应的机器配置，可以执行
```
make ccmp2_defconfig  这会应用默认的板级配置ccmp2_defconfig
make menuconfig    打开图型化内核选项配置菜单
```
保存后，可以直接bitbake linux-dey，继而编译出更改内核选项的固件。如果不放心，可以在build内的.config里查询相关的配置项，不过任何修改在bitbake -c cleansstate linux-dey之后就会被清空。

如果我们想得到cfg配置片段，就要进入build目录
```
cd tmp/work/ccmp25_dvk-dey-linux/linux-dey/6.6/build
cp .config.old .config.orig
回到项目目录
bitbake -c diffconfig linux-dey

```
上面命令会在linux-dey/6.6下生成一个：fragment.cfg，包含了内核选项的变更，以便整合到linux的bbappend配方当中。

但有时我们只是临时测试，也可以在devshell里临时打开某个开关，比如：
```
bitbake -c devshell linux-dey     # 进 shell
make ccmp2_defconfig
# 在linux的build目录执行：
echo 'CONFIG_TOUCHSCREEN_ADS7846_DEBUG=y' >> .config
make Image.gz -j4
# 编译时间较长，会生成Image.gzin

```
我们需要重命名为相应平台对应的名称，比如Image.gz-ccmp25-dvk.bin，再把旧内核重命名备份，用新的替代。


# 修改编译驱动程序 

## 准备内核驱动编译环境
```
make modules_prepare
先构建一次完整的内核模块
make -j$(nproc) modules
```
## 修改和编译特定目录驱动模块
make drivers/usb/serial/ modules

```
编译完成后，.ko 文件会生成在build目录相应的位置。
加载测试：
```
insmod /usr/lib/modules/$(uname -r)/kernel/drivers/input/touchscreen/ads7846.ko
```