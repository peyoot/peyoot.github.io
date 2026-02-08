# rtnodemo不带Digi演示程序的实时镜像编译指南
默认地，Digi官方的不同镜像带有对应UI框架的例程，这些例程包括自启动程序和云服务连接，对于实时Linux系统来说是一种负担。
本文将指导您完成剥离Digi例程的镜像开发。

::: warning
本文以QT5实时镜像为例，仅简单展示如何在系统镜像中剔除Digi原有例程，不涉及系统镜像的深度裁减。

:::
## DEY AIO开发环境准备
同标准的deyaio一样，如果从没有安装过依赖包，请先安装，以下以Ubuntu 22.04为例：
```
sudo apt install gawk wget file git diffstat file unzip texinfo gcc build-essential chrpath socat cpio python3 python3-pip python3-pexpect xz-utils debianutils iputils-ping python3-git python3-jinja2 libegl1-mesa-dev libsdl1.2-dev pylint xterm python3-subunit mesa-common-dev zstd liblz4-tool
sudo apt install python-is-python3
```
安装repo工具并配置git
```
sudo apt install repo
git config --global user.name yourname
git config --global user.email you@email.com
```

## 安装deyaio并搭建去除例程的QT5环境
如果您已经安装了 deyaio，现在您需要rtnodemo分支版本。建议您安装到另一个文件夹，例如 deyaio-rtnodemo。
仅管同一个开发环境您可以编译不同的项目，但通常为了避免混淆，建议在deyaio目录创建之时就定义好其目标镜像。 

```
cd
mkdir deyaio-rtnodemo
cd deyaio-rtnodemo
repo init -u https://github.com/peyoot/dey-aio-manifest.git -b scarthgap -m rt-nodemo.xml 
repo sync
```

## 创建dey项目
cd dey5.0/workspace
mkdir ccmp25-qt5rtnodemo
cd ccmp25-qt5rtnodemo
source ../../mkproject.sh -p ccmp25-dvk

## 编译并生成镜像
编辑conf/bblayers.conf，将原来的qt6改为qt5，以实现qt5的支持。
编辑conf/local.conf 并添加您所需的软件包，以下仅供参考:
```
GLIBC_GENERATE_LOCALES = "zh_CN.UTF-8 en_GB.UTF-8 en_US.UTF-8"
IMAGE_LINGUAS = "zh-cn"
LOCALE_UTF8_ONLY="1"

IMAGE_INSTALL:append = " glibc-utils localedef tmux homeaddons"

```
现在可以编译带rtnodemo支持的镜像了
```
bitbake core-image-base
或
bitbake dey-image-base
```

## 发布并打包
```
cd ../..
./publish
```
按照提示操作并选择正确的项目。
对于镜像类型，您仍然需要选择输入自定义的镜像名称，如果是用core-image-base直接回车即可，或手动输入镜像名

您可以选择将编译后的输出拷贝到发布文件夹并将其打包成卡刷包或发布到 TFTP/NFS 路径或服务器上。

