# 安装
---

为了正确安装和使用dey-aio，您需要安装yocto开发环境所需的依赖包，如果您要使用docker进行开发，则还需要安装docker和docker-compose。
强烈建议您使用一台Linux服务器来安装deyaio开发环境。由于编译自定义的Linux镜像，特别是第一次编译耗时较长，尽量避免使用笔记本或日常工作的电脑来安装DEY开发环境。使用服务器来安装开发环境，在开发时通过日常工作所用的电脑 SSH远程登陆的方式来进行配置和编译，结合tmux工具让编译在SSH Session退出或关闭的情况下不中断编译过程，从而获得更好的系统编译开发体验。
下面安装过程以Ubuntu 22.04为例，同样也适用于Ubuntu 20.04，请使用普通用户来执行这些命令。

由于国内github访问经常被间歇式阻断，而编译过程中需要流畅的github访问，建议使用PVPN自行搭建科学上网的环境，以确保编译不受GFW防火墙的干扰。

## 安装必要的依赖包
```
sudo apt update
sudo apt install gawk wget file git diffstat file unzip texinfo gcc build-essential chrpath socat cpio python3 python3-pip python3-pexpect xz-utils debianutils iputils-ping python3-git python3-jinja2 libegl1-mesa-dev libsdl1.2-dev pylint xterm python3-subunit mesa-common-dev zstd liblz4-tool tmux
sudo apt install python-is-python3
```


## 安装repo并配置好git

```
sudo apt install repo
git config --global user.name  “yourname”   请用你的英文名称替换yourname
git config --global user.email "you@email.com“  请用你的邮箱替换
```

## 安装docker和docker-compose

如果您打算用一套deyaio工具集来开发不同版本的DEY固件，可以用docker的方式在同一个主机上支持不同的DEY版本。新用户可以略过docker安装这一部分，直接进入下一个环节来安装dey-aio工具集。

```text-plain
sudo apt install docker.io docker-compose  
sudo gpasswd -a $USER docker     #将登陆用户加入到docker用户组中
newgrp docker     #更新用户组
reboot 请先重启一下电脑
docker ps    #测试docker命令是否可以使用sudo正常使用
docker network create pvpn --subnet 172.100.100.0/24    #创建配合科学上网使用自定义网络
```

## 用repo安装dey-aio工具集
dey-aio-manifest的main分支持包含不同版本的DEY支持，如果只需开发特定版本，也可以用Yocto代号指定

```
cd
mkdir dey-aio
cd dey-aio
repo init -u https://github.com/peyoot/dey-aio-manifest.git -b main 
repo sync
```

这样，dey-aio的工具集就安装好了，可以新建项目进行DEY系统开发。如果项目有需要，您也可以使用repo命令来在不同的manifest仓库间切换，以使用不同的特性支持。

您也可以在安装DEY时就指定好功能特性支持。比如开发基于ccmp25的PLC系列DEY 5.0镜像，参考如下：
```
cd
mkdir deyaio-ccmp25plc   
cd deyaio-ccmp25plc
repo init -u https://github.com/peyoot/dey-aio-manifest.git -b scarthgap -m ccmp25plc.xml   
repo sync
```
 

# DEY系统开发
---

关于科学上网：考虑到国内对github的访问并不顺畅，由于墙对境外IP的阻断方式是间歇式的断开TCP连接，在使用本工具集首次编译时需要科学上网。如果您从未实践过科学上网，可以在位于境外IP的任意云服务器上使用[peyoot/pvpn](https://www.github.com/peyoot/pvpn.git)的开源工具快速架设科学上网环境所需的vpn服务器（[文档](https://www.eccee.com/soft-platform/224.html)），然后在本地开发机器上使用相同的工具自动部署vpn客户端，从而实现编译时所需的科学上网环境。（注：上述的安装过程，不论是否需要科学上网，均可正常使用）

dey-aio的目录结构如下，：  
/  
├── aio                     不同dey版本所需的dey-aio工具和自定义layer  
│   ├── scarthgap       
│   ├── kirkstone
|    ...  
├── dey5.0                     DEY 4.0工具集  
│   ├──docker-compose.yml      
│   ├── mkproject.sh       项目创建工具    
│   ├── publish.sh             发布工具
│   ├── sources              源码目录  
│   ├── workspace            项目目录   
├── dey4.0  
│   ├──docker-compose.yml      
│   ├── mkproject.sh       项目创建工具    
│   ├── publish.sh             发布工具
│   ├── sources              源码目录  
│   ├── workspace            项目目录   
| ...  
├── release                    发布文件夹 (可选发布到这里或服务器上)  
│   ├── dey5.0                     
│        ├── cc6ul  
│        ├── ccmp15  
│        ├── cc8mn  
│        ├── cc8mm  
│        ├── cc8x  
│        ├── ...  
│   ├── dey4.0                     
│        ├── ...  
│   └ …  
├── README.md  
└── README-cn.md

要进行项目开发，您需要进入项目所需的DEY版本，然后创建项目。您可以使用docker-compose的方式来创建项目，也可以直接使用官方原生的方法来创建项目。两种方式可共用workspace作为项目目录。

第一次使用，一般建议直接用官方原生的办法来创建项目并编译系统镜像。

## 使用docker-compose的开发方式

docker-compose可以快速创建一个与主机隔离的dey的开发环境容器，要创建一个新的docker容器来进行开发，可以用：docker-compose run dey<版本号>，这里的版本号可以是3.2或4.0，容器默认使用peyoot/dey作为DEY的镜像，您也可以修改docker-compose.yml，使用官方的digidotcom/dey镜像。  
例：`docker-compose run dey4.0`  
这样就可以自动开启容器，并提示您创建项目还是使用原有项目继续开发，如下图所示：  
<pre>
 +------------------------------------------------------------------------------------+
 |                                                                                    |
 |                                                                                    |
 |                   Welcome to Digi Embedded Yocto Docker container                  |
 |                                                                                    |
 |  This Docker image is a ready to use system based on Digi Embedded Yocto (DEY) to  |
 |  build custom images for the Digi platforms. DEY is an open source and freely      |
 |  available Yocto Project (TM) based embedded Linux distribution.                   |
 |                                                                                    |
 |                                                                                    |
 +------------------------------------------------------------------------------------+
 Do you wish to create a new platform project [Y/N]?
</pre>
 
输入Y会让您从所支持的开发板中选择当前项目所使用的som或单板机，然后就可以开始编译生成镜像了。  
`bitbake dey-image-qt`  
  
如果输入N，则不创建新项目，用户可以到原有的项目中继续从事开发。

您可以使用exit退出 docker环境，并用docker-compose down来关闭容器。更多用法请参考[dey-aio项目](https://github.com/peyoot/dey-aio.git)。

## 使用官方原生的Digi Embedded Yocto开发方式

dey-aio工具集在安装时就已经自动拉取DEY源码到sources，您可以在workspace中创建项目，直接编译。开发方式和官方并没有区别，只是我们把DEY安装在当前目录下，我们需要进入workspace创建新项目的名称，然后和官方一样，用mkproject.sh来创建项目。本项目对下载目录和sstate缓存做了一些优化处理，它们都存放于父级目录下的project\_shared，以方便不同项目使用。以创建cc93项目和ccmp25项目为例：

```text-plain
#ConnectCore 93可参考如下：
cd workspace
mkdir cc93
cd cc93
source ../../mkproject.sh -l
source ../../mkproject.sh -p ccimx93-dvk

bitbake dey-image-qt

#ConnectCore MP2系列核心模块或其它模块类似，请选择对应的平台来source项目，并编译目标镜像：
cd workspace
mkdir ccmp25
source ../../mkproject.sh -l
source ../../mkproject.sh -p ccmp25-dvk
bitbake tf-a-stm32mp
bitbake fip-stm32mp
bitbake core-image-base
```

# 关于meta-custom
---
meta-custom作为一个Yocto的示例layer，用于用户将自定义的程序或配置文件，自启动服务或脚本，驱动程序等文件编译到系统镜像中。用户可以根据项目需要自行更改源码和维护自己的版本库。
为了更方便编排ros，把meta-custom单独作为一个git库，从dey4.0 kirkstone最新版开始，meta-custom不在是dey-aio的一部分

# 发布工具
编译结束后，您可以到对应的DEY版本目录下，使用publish.sh来将编译结果发布到release目录下，并打包成卡刷包，也可以选择发布到TFTP或NFS路径上，方便快速开发测试。

```text-plain
./publish.sh
按提示选择并发布相关的镜像
```