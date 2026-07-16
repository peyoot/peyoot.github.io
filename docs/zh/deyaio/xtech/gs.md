# 安装
---
为了正确安装和使用dey-aio，您需要安装yocto开发环境所需的依赖包，强烈建议您使用一台Linux服务器来安装deyaio开发环境。由于编译自定义的Linux镜像，特别是第一次编译耗时较长，尽量避免使用笔记本或日常工作的电脑来安装DEY开发环境。使用服务器来安装开发环境，在开发时通过日常工作所用的电脑 SSH远程登陆的方式来进行配置和编译，结合tmux工具让编译在SSH Session退出或关闭的情况下不中断编译过程，从而获得更好的系统编译开发体验。
下面安装过程以Ubuntu 22.04为例，同样也适用于Ubuntu 20.04，请使用普通用户来执行这些命令。

由于国内github访问经常被间歇式阻断，而编译过程中需要流畅的github访问，建议使用PVPN自行搭建科学上网的环境，以确保编译不受GFW防火墙的干扰。

## 安装必要的依赖包
```
sudo apt update
sudo apt install gawk wget bison file flex git diffstat unzip texinfo gcc build-essential chrpath socat cpio python3 python3-pip python3-pexpect xz-utils debianutils iputils-ping python3-git python3-jinja2 libegl1-mesa-dev libsdl1.2-dev libncurses-dev pylint xterm python3-subunit mesa-common-dev zstd liblz4-tool tmux
sudo apt install python-is-python3
```
使用ubuntu server最小化安装时，一般还需要设置一个locale，桌面版可略过。

```
#安装中文字符集
sudo apt install language-pack-zh-hans

#修改/etc/locale.gen
sudo nano /etc/locale.gen
确保下面这两行没被注释
en_US.UTF-8 UTF-8
zh_CN.UTF-8 UTF-8
然后：sudo locale-gen

#立即生效
sudo update-locale LANG=en_US.UTF-8

最好重启一下

```

## Ubuntu 24.04额外配置
Ubuntu 24.04 引入的一项新安全限制：默认禁止非特权用户创建 user namespace（除非有 AppArmor 配置文件放行），而 BitBake 需要用到 user namespace 来做一些沙箱隔离操作
```
echo 'kernel.apparmor_restrict_unprivileged_userns=0' | sudo tee /etc/sysctl.d/99-disable-userns-restriction.conf
sudo sysctl --system
```

## 安装repo并配置好git

```
sudo apt install repo
git config --global user.name  “yourname”   请用你的英文名称替换yourname
git config --global user.email "you@email.com“  请用你的邮箱替换
```
## 用repo安装dey-aio工具集
dey-aio-manifest的main分支持包含不同版本的DEY支持，如果只需开发特定版本，也可以用Yocto代号指定

```
cd
mkdir deyaio-xtech
cd deyaio-xtech
repo init -u https://github.com/peyoot/dey-aio-manifest.git -b scarthgap -m xtech.xml 
repo sync
```

这样，dey-aio的工具集就安装好了，可以新建项目进行DEY系统开发。建议关闭终端，重开一个终端来开发dey镜像。


## 编译系统镜像前的准备

dey-aio工具集在安装时就已经自动拉取DEY源码到sources，您可以在workspace中创建项目，直接编译。本项目对下载目录和sstate缓存做了一些优化处理，它们都存放于父级目录下的project\_shared，以方便不同项目共享使用。

1、科学上网准备

编译时会从github和其它上游开源社区拉取包括linux源码树在内的代码。由于国内对github等海外网站的访问是间歇式的，如果没有科学上网环境，容易出现编译出错。因此建议首次编译时使用科学上网代理或VPN。如果没有，海外云服务器自建vpn可参考：https://peyoot.github.io/pvpn/get-started.html

2、创建项目

```text-plain
cd workspace
mkdir ccmp25-xtech
source ../../mkproject.sh -l
source ../../mkproject.sh -p ccmp25-dvk
```
阅读DEY的开源声明，空格键翻页，最后输入y确认。

然后到conf/local.conf中，修改它的内容为meta-custom下homeaddons配方里提供的.local.conf中的内容（此步骤非必须，旨在精简镜像），如果不介意保留原有的默认开板板镜像的例程，也可不用编辑这个文件，同样可以编译成功。

在conf/local.conf中可进行各种对系统镜像的裁剪增删，包括设置实时选项，添加或移除包和预配置服务等。


3、编译

```
bitbake core-image-base
```

编译结束后，DEY默认已经会在tmp/deploy/image/<平台>下生成zip安装包，您也可以直接使用这个卡刷包。

4、刷入镜像

使用U盘或SD卡，格式化为FAT32（切记），将安装包完整解压到盘或卡上，不要有任何目录，插入到板卡中，然后上电时按任意键停留在uboot上，执行刷机脚本，以U盘刷机为例：
```
setenv image-name core-image-base 
run install_linux_fw_usb 
```
刷机完成后，会自动进入系统

5、优化设备树

当您 完成一次完整编译，并获得安装镜像，编译环境可以用来做进一步开发，包括linux系统镜像的进一步定制，以及设备树的修改和完善等。

使用官方的设备树或是基础设备树，虽然可以进入系统，但部分接口的设备树尚未适配，此时接口功能无法使用，可以对设备树进行修改优化和调试。
通常以官方设备树为模板，并参考smartIOmux设计文件，来进行不同接口的设备树替换。建议以接口节点逐项更改和测试。

具体编译方法见：https://peyoot.github.io/zh/deyaio/custom-dt.html


