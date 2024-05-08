# ROS2镜像快速上手

::: warning
目前只测试了 ROS2 Humble支持，并且仅使用 DEY4.0 kirkstone 进行了验证。其他版本的 DEY 可能有效，但您需要修改 dey-aio-manifest 存储库指向正确版本并自己尝试。
:::
## 安装前的准备
同标准的deyaio一样，如果从没有安装过依赖包，请先安装，以下以Ubuntu 22.04为例：
```
sudo apt install gawk wget file git diffstat file unzip texinfo gcc build-essential chrpath socat cpio python3 python3-pip python3-pexpect xz-utils debianutils iputils-ping python3-git python3-jinja2 libegl1-mesa libsdl1.2-dev pylint xterm python3-subunit mesa-common-dev zstd liblz4-tool
sudo apt install python-is-python3
```
安装repo工具并配置git
```
sudo apt install repo
git config --global user.name yourname
git config --global user.email you@email.com
```

## 安装带ros支持的deyaio
如果您已经安装了 deyaio，现在您需要 ros 支持版本。建议您安装到另一个文件夹，例如 deyaio-ros 

```
cd
mkdir deyaio-ros
cd deyaio-ros
repo init -u https://github.com/peyoot/dey-aio-manifest.git -b ros
repo sync
```

## 创建带ros支持的dey项目
cd dey4.0/workspace
mkdir my93ros
cd my93ros
source ../../mkproject.sh -p ccimx93-dvk

## 编译并生成镜像
编辑conf/local.conf 并添加您所需的软件包，以下仅供参考:
```
IMAGE_INSTALL:append = " packagegroup-imx-ml packagegroup-core-buildessential python3-colcon-common-extensions python3-lark-parser python3-pip python3-vcstool cmake ament-cmake ament-cmake-ros libtinyxml2"
```
现在可以编译带ros支持的镜像了
```
bitbake dey-image-qtros
```

## 发布并打包
```
cd ../..
./publish
```
按照提示操作并选择正确的项目。对于镜像类型，您仍然需要选择 dey-imag-qt，因为 ros 镜像 （dey-image-qtros） 是基于 qt 镜像的。
当提示询问它是否是 ROS 项目时，输入“yes”。

您可以选择将编译后的输出移出到发布文件夹并将其打包到安装程序中或发布到 TFTP/NFS 路径。

