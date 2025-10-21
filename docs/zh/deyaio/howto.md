## 如何使用DEY AIO项目定制固件
DEY AIO项目使用Digi原生的DEY编译方式配合meta-custom的配方来实现自定义固件的一键式编译。在dey-aio-manifest项目中有一些xml文件指定使用不同的meta-custom分支来实现不同的固件功能。在创建DEY AIO项目开发环境时，我们可以指定相应的manifest仓库（检出对应的xml）来为目标预编译镜像设置好相应的开发环境，也可以在使用DEY AIO过程中，切换到不同的manifest仓库以编译相应的功能集镜像。

以编译不带demo的实时Linux固件为例，新建一个DEY AIO项目目录，并取一个容易记住的名字，然后使用rt-nodemo这个manifest仓库：
```
mkdir -p ~/deyaio-rt-nodemo
cd ~/deyaio-rt-nodemo
repo init https://github.com/peyoot/dey-aio-manifest.git -b main -m rt-nodemo.xml
```
这样默认检出的meta-custom分支就是scarthgap-rt-nodemo，相应的dey-image-qt镜像配方已经适配并移除Connectcore demo例程和云服务等软件包，并且内核实时也默认开启，直接编译出支持实时特性的Linux固件。

## 如何查询当前DEY AIO项目所用的manifest仓库
可以在deyaio项目中，用不同的manifest仓库来实现编译出不同的镜像。
要查询当前项目的dey-aio-manifest所用的分支或版本，可以用命令：
```
cd .repo/manifests
git remote show origin
```
上面的命令中输出后，在Local branch configured for 'git pull：'这行后面记录有当时repo init所用的分支，也就是当前的所用manifest的分支，比如这个输出：
```
$ git remote show origin
* remote origin
  Fetch URL: https://github.com/peyoot/dey-aio-manifest.git
  Push  URL: https://github.com/peyoot/dey-aio-manifest.git
  HEAD branch: main
  Remote branches:
    kirkstone tracked
    main      tracked
    scarthgap tracked
  Local branch configured for 'git pull':
    default merges with remote main

```
其中，default merges with remote main, 表示本地拉取远程库的main分支。

此外，还可以查看当初 repo init 使用的是哪个XML文件，用命令：
```
cat .repo/manifest.xml
```
得到的输出：
```
...
<manifest>
  <include name="ccmp25plc.xml" />
</manifest>
```
这个repo指定的是ccmp25plc.xml，所以结合起来，当初repo init初始化manifest仓库所用的命令就是：
```
repo init https://github.com/peyoot/dey-aio-manifest.git -b main -m ccmp25plc.xml
```
## 如何在不同的manifest仓库间切换
在了解了DEY AIO当前所用的manifest仓库之后，可以根据需要切换不同的分支或xml文件。通常，我们关注的是切换不同的xml文件来实现不同的镜像功能合集。
repo init 拉取的 manifest 仓库会被克隆到 .repo/manifests 中：
```
cd .repo/manifests
#先更新manifest仓库,当然也可以在原deyaio目录里repo sync是一样的
git fetch origin
git checkout main  # 假设 manifest 文件在 main 分支，根据实际情况调整分支名
git pull
#使用 repo init 的 -m 参数重新初始化，比如指定 rtsp.xml
ls rtsp.xml #检查所需的xml
cd ../..
repo init -m rtsp.xml
如果 rtsp.xml 不在默认分支的根目录，你需要确保分支和路径正确，用-b指定分支
repo init -b some-branch -m rtsp.xml
repo sync
```

## 如何生成锁定版本的manifest文件

使用下面命令生成一个新的manifest文件，并用提交的hash值作为revision版本，然后切换到这个manifest仓库：
```
repo manifest -o .repo/manifests/my_frozen_ccmp25plc.xml -r --suppress-upstream-revision --suppress-dest-branch
repo init -b scarthgap -m my_frozen_ccmp25plc.xml
```
值得注意的是，这只是layer对应的git版本锁定，而里面的配方用到的git源不一定是锁定版本的，如果需要，就要记录相关的配方中用到的源的git版本harsh，然后在配方中把AUTOREV改为固定hash版本。

## 如何只修改内核设备树并编译更新
当我们需要修改linux内核所用的设备树时，参考meta-custom的ccmp25plc分支，在配方中引入变更。如果我们需要临时性的更改，则可以用devshell来编译出dtb文件，并在内核中替换并测试
```
bitbake -c devshell linux-dey
修改后，用
```
make clean dtbs
make dtbs
```
生成的设备树在：
tmp/work/ccmp25_dvk-dey-linux/linux-dey/6.6/build/arch/arm64/boot/dts/digi/下，拷贝后可以在uboot下单独更新该设备树：
```
usb start
updatefile linux_a usb 0:1 ccmp25-plc.dtb ccmp25-plc.dtb
```
或者，也可在linux中重载/mnt/linux分区为可读写，然后替换设备树
```
mount -o remount,rw /mnt/linux 
cp ccmp25-plc.dtb /mnt/linux/ccmp25-plc.dtb
```

## 如何只修改uboot并编译更新
有时我们需要修改uboot的源码或设备树，可以参考meta-custom的ccmp25plc分支为例，在配方中引入变更。
可以先清理缓存：
```
bitbake -c cleansstate u-boot-dey
bitbake -c cleansstate fip-stm32mp
bitbake -c cleansstate tf-a-stm32mp
bitbake -c cleanall u-boot-dey
```

如果我们需要临时性的更改，可在当前项目的源码中变更后，用：
```
bitbake -C compile u-boot-dey
bitbake tf-a-stm32mp
bitbake fip-stm32mp
```
这样会在tmp/deploy/images/ccmp25-dvk中生成两个文件：
```
tf-a-ccmp25-dvk-emmc.stm32 (这个一般和uboot无关，无需更新)
fip-ccmp25-dvk-optee.bin (这个镜像包含U-Boot和相关的设备树变更)
```
只需要更新fip镜像到板子上：
```
update fip-a tftp fip-ccmp25-dvk-optee.bin
或用u盘等
usb start
update fip-a usb 0:1 fip-ccmp25-dvk-optee.bin
```

## 为何DISTRO_FEATURES变量不能放在meta-custom当中？
DISTRO_FEATURES 是定义整个发行版（distro）特性的变量，它在 Yocto 的构建系统中属于 全局配置变量。
这类变量通常在 conf/distro/*.conf 或 local.conf 中设置，而不是在配方（recipe）或 .bbappend 文件中。DISTRO_FEATURES 的作用是在构建系统初始化阶段决定哪些功能被启用，比如 systemd、x11、bluetooth 等。在 .bbappend 中修改 DISTRO_FEATURES 太晚了，构建系统在解析配方之前就已经决定了哪些特性被启用。

## append操作符追加内容是，需要空格么？
在 Yocto 5.0 中，使用 :append 操作符时，在追加的内容前加一个空格仍然是必须的。这是因为 :append 操作本身不会自动添加空格分隔符，如果你不加空格，追加的内容会直接拼接在原有值的末尾，导致语法错误或功能无法生效。虽然有时原变量末尾已经有空格，但增加空格显然更能确保拼接后有正确的分隔