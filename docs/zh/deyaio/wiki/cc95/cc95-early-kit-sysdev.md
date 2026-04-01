# ConnectCore95 早期开发板开发指南
ConnectCore 95的开发板分为Early Available Kit和正式的开发板两种。早期的开发板专为需要提前体验Digi i.MX95核心板功能的部分用户提供，在正式开发套件发布之前，和早期验证版一起生产出来的部分ConnectCore95开发板。

正式的开发板采用SMARC接口的模块，可同时支持SMT和SMARC接口的核心板验证，而早期的开发板是SMT封装的模块。针对早期开发板，Digi在正式开发套件有少量硬件变动，请向Digi获取相关说明。

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

## 安装repo并配置好git

```
sudo apt install repo
git config --global user.name  “yourname”   请用你的英文名称替换yourname
git config --global user.email "you@email.com“  请用你的邮箱替换
```

## 用repo安装dey-aio工具集
dey-aio-manifest的main分支持包含不同版本的DEY支持，如果只需开发特定版本，也可以用Yocto代号指定。
注意正式开发板，可以直接使用scarthgap分支，

```
cd
mkdir dey-aio
cd dey-aio
repo init -u https://github.com/peyoot/dey-aio-manifest.git -b scarthgap 
repo sync
```

这样，dey-aio的工具集就安装好了，可以新建项目进行DEY系统开发。如果项目有需要，您也可以使用repo命令来在不同的manifest仓库间切换，以使用不同的特性支持。

但对于早期的CC95开发板，需要检出开发板硬件变动前的源，主要是meta-digi相关层的版本，可以用deyaio中对应的xml文件自动获取相关分支。
```
cd
mkdir deyaio-cc95ea   
cd deyaio-cc95ea
repo init -u https://github.com/peyoot/dey-aio-manifest.git -b scarthgap -m cc95-early-kit.xml   
repo sync
```

# DEY系统开发
---

关于科学上网：考虑到国内对github的访问并不顺畅，由于墙对境外IP的阻断方式是间歇式的断开TCP连接，在使用本工具集首次编译时需要科学上网。如果您从未实践过科学上网，可以在位于境外IP的任意云服务器上使用[peyoot/pvpn](https://www.github.com/peyoot/pvpn.git)的开源工具快速架设科学上网环境所需的vpn服务器（[文档](https://www.eccee.com/soft-platform/224.html)），然后在本地开发机器上使用相同的工具自动部署vpn客户端，从而实现编译时所需的科学上网环境。（注：上述的安装过程，不论是否需要科学上网，均可正常使用）

dey-aio的目录结构如下，：  
/  
├── aio                     不同dey版本所需的dey-aio工具和自定义layer  
│   ├── scarthgap       
│   ├── ..
|    ...  
├── dey5.0                     DEY 4.0工具集  
│   ├──docker-compose.yml      
│   ├── mkproject.sh       项目创建工具    
│   ├── publish.sh             发布工具
│   ├── sources              源码目录  
│   ├── workspace            项目目录   
| ...  
├── release                    发布文件夹 (可选发布到这里或服务器上)  
│   ├── dey5.0                     
│        ├── cc95  
│        ├── cc8x  
│        ├── ...  
│   └ …  
├── README.md  
└── README-cn.md

要进行项目开发，您需要进入项目所需的DEY版本,然后创建项目：