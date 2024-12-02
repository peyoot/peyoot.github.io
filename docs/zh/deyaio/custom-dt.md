# 定制工控板的设备树
当使用SmartIOMux来给基于ConnectCore 片上系核心模块设计产品时，会自动生成相关的设备树。虽然可以参考开发板使用相关的验证过的接口芯片和显示屏，但更多的时候，用户需要在这个设备树上进行微调，以便使用自己的接口芯片或是显示屏，这时就要对工控板的设备树进行相应的调整，以便新的设备树能符合设计要求。最常见的是对USB电路进行精简，以及使用自己的LCD触控屏。

## 修改设备树源文件
有几种方式可以实现对设备树的修改，包括修改板子的设备树和使用overlay设备树来覆盖。下面以板级设备树的修改为例。通常，我们要可在git库中新建一个项目，专门用来替代原有设备树，本文以ConnectCore MP25的PLC开发板为例，它的设备树托管在[peyoot/ccmp25_dt](https://github.com/peyoot/ccmp25_dt)中。

设备树的修改和调试会经常涉及源码的变更，因为为工控板的设备树定义不同的分支，以适应不断变化的要求。比如在DEY4.0中使用Beta版BSP时，由于这个版本的只支持双网口，它的设备树源码相比最新的BSP中的pinctrl定义有一些不同，因此定义一个专门的dualeth-s分支来代表。不同的分支在不同的版本的dey中编译，使得一定时期内的工作可以有效保存。

Linux加载的设备树位于于内核linux分区，而设备树的源码则位于linux源码树中的arch/arm64/boot/dts/digi/下，如果不使用默认的ccmp25-dvk.dts，需要在Makefile中添加要编译的设备树名，比如这里用了ccmp25-plc.dts，它要编译出ccmp25-plc.dtb设备树文件。

## 编译改动的设备树
通常可以在devshell或是直接用bitbake的方式来编译设备树，

### devshell

进入devshell的方式如下，此时会来到
bitbake -c devshell linux-dey

确保源码已经应用了变更并复制到相应的目录下，直接make dtbs

### 直接bitbake
这种方式需要先bitbake -c cleanall <镜像名>，
然后再bitbake -C compile linux-dey  
相关的设备树也会编译出来，再bitbake <镜像名> 来打包镜像，最终的镜像的linux中带有相关的设备树，不过首次开机启动后，仍要更改fdt_file参数，以便加载自定义的设备树。

