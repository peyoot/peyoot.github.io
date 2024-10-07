# Mono镜像快速上手
Mono 是一个开源的跨平台的.NET框架实现。Mono镜像指的内置.NET运行库，可以运行.NET的程序的Linux镜像。

::: warning
mono是dotnet在Linux目前只测试了基本的mono支持，并且仅使用 DEY4.0 kirkstone 进行了验证。其他版本的 DEY 可能有效，但您需要修改 dey-aio-manifest 存储库指向正确版本并自己尝试。
:::
## 安装前的准备
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

## 安装带mono支持的deyaio
如果您已经安装了 deyaio，现在您需要mono支持版本。建议您安装到另一个文件夹，例如 deyaio-mono 

```
cd
mkdir deyaio-mono
cd deyaio-mono
repo init -u https://github.com/peyoot/dey-aio-manifest.git -b mono
repo sync
```

## 创建带mono支持的dey项目
cd dey4.0/workspace
mkdir my93mono
cd my93mono
source ../../mkproject.sh -p ccimx93-dvk

## 编译并生成镜像
编辑conf/local.conf 并添加您所需的软件包，以下仅供参考:
```
GLIBC_GENERATE_LOCALES = "zh_CN.UTF-8 en_GB.UTF-8 en_US.UTF-8"
IMAGE_LINGUAS = "zh-cn"
LOCALE_UTF8_ONLY="1"

IMAGE_INSTALL:append = " glibc-utils localedef tmux homeaddons"

```
现在可以编译带mono支持的镜像了
```
bitbake core-image-mono
或
bitbake dey-image-mono
```

## 发布并打包
```
cd ../..
./publish
```
按照提示操作并选择正确的项目。
对于镜像类型，您仍然需要选择输入自定义的镜像名称，如果是用core-image-mono直接回车即可，或手动输入镜像名

您可以选择将编译后的输出拷贝到发布文件夹并将其打包成卡刷包或发布到 TFTP/NFS 路径或服务器上。

