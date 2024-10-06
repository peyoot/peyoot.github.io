# Mono Getting Started
Mono is an open-source, cross-platform implementation of Microsoft’s .NET Framework. It allows developers to build and run .NET applications on non-Windows platforms, such as Linux, macOS, and various other operating systems. 
::: warning
Currently only very limit Mono support was tested and it was only verified with DEY4.0  kirkstone. Other version may of DEY may work but you need to modify dey-aio-manifest repo and try by your own effort.
:::
## Preparation  
Ubuntu 22.04 as example
```
sudo apt install gawk wget file git diffstat file unzip texinfo gcc build-essential chrpath socat cpio python3 python3-pip python3-pexpect xz-utils debianutils iputils-ping python3-git python3-jinja2 libegl1-mesa-dev libsdl1.2-dev pylint xterm python3-subunit mesa-common-dev zstd liblz4-tool
sudo apt install python-is-python3
```
If you haven't install repo and config git 
```
sudo apt install repo
git config --global user.name yourname
git config --global user.email you@email.com
```

## Install deyaio with mono support
If you have install deyaio and now you need mono support version. It's suggested that you install to another folder like deyaio-mono
```bash
cd
mkdir deyaio-mono
cd deyaio-mono
repo init -u https://github.com/peyoot/dey-aio-manifest.git -b mono
repo sync
```

## Create a mono related project
cd dey4.0/workspace
mkdir my93mono
cd my93mono
source ../../mkproject.sh -p ccimx93-dvk

## configure and build a mono support image
Edit conf/local.conf and add packages you need. For example, use following in local.conf:
```
GLIBC_GENERATE_LOCALES = "en_GB.UTF-8 en_US.UTF-8"
IMAGE_LINGUAS = "zh-cn"
LOCALE_UTF8_ONLY="1"

IMAGE_INSTALL:append = " glibc-utils localedef tmux homeaddons"

```
Now compile image
```
bitbake core-image-mono
```

## Publish and pack installer
```
cd ../..
./publish
```
Follow the prompts and select correct items. 
For image type, you still need to choose 6 to manually input the image name. For example: core-image-mono

You can choose to copy compile outputs to release directory and pack it into installer or publish to TFTP/NFS server.

