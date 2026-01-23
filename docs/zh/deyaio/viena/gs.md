# 安装
---
为了正确安装和使用dey-aio，您需要安装yocto开发环境所需的依赖包，如果您要使用docker进行开发，则还需要安装docker和docker-compose。
强烈建议您使用一台Linux服务器来安装deyaio开发环境。由于编译自定义的Linux镜像，特别是第一次编译耗时较长，尽量避免使用笔记本或日常工作的电脑来安装DEY开发环境。使用服务器来安装开发环境，在开发时通过日常工作所用的电脑 SSH远程登陆的方式来进行配置和编译，结合tmux工具让编译在SSH Session退出或关闭的情况下不中断编译过程，从而获得更好的系统编译开发体验。
下面安装过程以Ubuntu 22.04为例，同样也适用于Ubuntu 20.04，请使用普通用户来执行这些命令。

由于国内github访问经常被间歇式阻断，而编译过程中需要流畅的github访问，建议使用PVPN自行搭建科学上网的环境，以确保编译不受GFW防火墙的干扰。

## 安装必要的依赖包
```
sudo apt update
sudo apt install gawk wget bison file flex git diffstat unzip texinfo gcc build-essential chrpath socat cpio python3 python3-pip python3-pexpect xz-utils debianutils iputils-ping python3-git python3-jinja2 libegl1-mesa-dev libsdl1.2-dev libncurses-dev pylint xterm python3-subunit mesa-common-dev zstd liblz4-tool tmux
sudo apt install python-is-python3
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
mkdir deyaio-viena
cd deyaio-viena
repo init -u https://github.com/peyoot/dey-aio-manifest.git -b scarthgap -m viena.xml 
repo sync
```

这样，dey-aio的工具集就安装好了，可以新建项目进行DEY系统开发。

## 编译系统镜像前的准备

dey-aio工具集在安装时就已经自动拉取DEY源码到sources，您可以在workspace中创建项目，直接编译。本项目对下载目录和sstate缓存做了一些优化处理，它们都存放于父级目录下的project\_shared，以方便不同项目使用。

1、创建项目

```text-plain
cd workspace
mkdir ccmp25-viena
source ../../mkproject.sh -l
source ../../mkproject.sh -p ccmp25-dvk
```
阅读DEY的开源声明，空格键翻页，最后输入y确认。

创建好项目后，根据需要更改QT支持选项，修改conf/bblayers.conf中的QT版本，默认是QT6，如果是要QT5，请改为QT5。

在conf/local.conf中设置实时选项，添加或移除包，
实时开启：

如果需要对镜像做裁减和增加不同包，可以用：
IMAGE_INSTALL:append = " 包名" 和 IMAGE_INSTALL:remove = " 包名" 来实现。
大而全的配置可以用下面这个，然后再裁减：
```
DISTRO_FEATURES:append = " rt opengl pam  hwlatdetect"

DISTRO_FEATURES:remove = " wayland x11"

# IMAGE_FEATURES:append = " ssh-server-openssh"
# 设置默认的Qt平台（针对STM32MP25优化）
QT_QPA_DEFAULT_PLATFORM = "eglfs"

# STM32特定的eglfs配置
QT_QPA_EGLFS_INTEGRATION = "eglfs_kms"
#QT_QPA_EGLFS_KMS_CONFIG = "/etc/qt5/eglfs_kms_config.json"

GLIBC_GENERATE_LOCALES = "zh_CN.UTF-8 en_GB.UTF-8 en_US.UTF-8"
IMAGE_LINGUAS = "zh-cn"
LOCALE_UTF8_ONLY="1"

IMAGE_INSTALL:append = " perf glibc-utils localedef tmux homeaddons"

IMAGE_INSTALL:append = " \
    touch-calibration \
    qtbase \
    qtbase-plugins \
    qtdeclarative \
    qtquickcontrols2 \
    qtquickcontrols2-qmlplugins \
    qtgraphicaleffects \
    qt5everywheredemo \
    qtdeclarative-qmlplugins \
    qtquickcontrols-qmlplugins \
    qtquickcontrols2-qmlplugins \
    qtquick3d qt3d qtcharts qtmultimedia qtsvg \
    qtserialport qtsensors qtwebsockets qtvirtualkeyboard \
    qtremoteobjects \
    libxkbcommon \
    libdrm \
    libegl \
    libgles2 \
    tslib tslib-calibrate tslib-tests evtest \
    iproute2 numactl i2c-tools perl opkg \
    mesa \
"
```

## 镜像优化
未完待续
