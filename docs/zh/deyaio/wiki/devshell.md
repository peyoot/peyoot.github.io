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
保存后，如果我们想得到cfg配置片段，就要进入build目录
```
cd tmp/work/ccmp25_dvk-dey-linux/linux-dey/6.6/build
cp .config.old .config.orig
回到项目目录
bitbake -c diffconfig linux-dey

```
上面命令会在linux-dey/6.6下生成一个：fragment.cfg，包含了内核选项的变更，以便整合到linux的bbappend配方当中。
