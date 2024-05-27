# ROS2 Getting Started

::: warning
Currently only ROS2 Humble support were tested and it was only verified with DEY4.0  kirkstone. Other version may of DEY may work but you need to modify dey-aio-manifest repo and try by your own effort.
:::
## Preparation  
Ubuntu 22.04 as example
```
sudo apt install gawk wget file git diffstat file unzip texinfo gcc build-essential chrpath socat cpio python3 python3-pip python3-pexpect xz-utils debianutils iputils-ping python3-git python3-jinja2 libegl1-mesa libsdl1.2-dev pylint xterm python3-subunit mesa-common-dev zstd liblz4-tool
sudo apt install python-is-python3
```
If you haven't install repo and config git 
```
sudo apt install repo
git config --global user.name yourname
git config --global user.email you@email.com
```

## Install deyaio with ros support
If you have install deyaio and now you need ros support version. It's suggested that you install to another folder like deyaio-ros
```bash
cd
mkdir deyaio-ros
cd deyaio-ros
repo init -u https://github.com/peyoot/dey-aio-manifest.git -b ros
repo sync
```

## Create a ros related project
cd dey4.0/workspace
mkdir my93ros
cd my93ros
source ../../mkproject.sh -p ccimx93-dvk

## configure and build a ros support image
Edit conf/local.conf and add packages you need. For example, use following in local.conf:
```
IMAGE_INSTALL:append = " qt5-demo-extrafiles cinematicexperience-rhi cinematicexperience-rhi-tools turtlesim glibc-utils localedef tmux"

or

IMAGE_INSTALL:append = " packagegroup-imx-ml packagegroup-core-buildessential python3-colcon-common-extensions python3-lark-parser python3-pip python3-vcstool cmake ament-cmake ament-cmake-ros libtinyxml2"
```
Now compile image
```
bitbake dey-image-qtros
```

## Publish and pack installer
```
cd ../..
./publish
```
Follow the prompts and select correct items. For image type, you still need to choose dey-imag-qt as ros image (dey-image-qtros) is based on qt image.
when prompt ask if it's a ros project, input "yes".

You can choose to move out compiled output to release folder and pack it into installer or publish to TFTP/NFS path.

