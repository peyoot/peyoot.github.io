# DEY开发 -- 基于ConnectCore的摄像头无线视频流演示固件
通过WiFi来传输视频流是一种越来越常见的应用，可用于工业，安防，医疗等不同领域。ConnectCore系列高性能的ARM核心板，集成有WiFi6无线模块，片上集成有USB或MIPI摄像头支持和硬件Codec能力，能够满足不同国家和区域的认证要求。本文旨在帮助用户快速搭建基于ConnectCore的开发环境，以便编译出带有摄像头视频流无线传输演示软件的嵌入式Linux固件，并支持用户在此基础上进一步开展应用程序的开发和调试。

DEY是完全开源和可定制的嵌入式Linux系统，它可以运行在基于Digi的ConnectCore系列片上系统模块上。一般嵌入式系统的开发包括Linux系统开发定制和应用程序开发两个方面。应用程序开发比较简单，用户可直接下载Digi官方的SDK安装到Linux支持上，配合对应的IDE即可开始程序开发和调试。请参考{https://docs.digi.com/resources/documentation/digidocs/embedded/dey/5.0/ccmp25/develop-applications_c.html|应用程序开发官方文档}

本文将详细介绍如何搭建DEY的系统开发环境，并在此基础上编译出各种固件和SDK,帮助用户熟悉基于Yocto系统固件的开发过程。

## 安装DEY AIO开发环境
DEY AIO是在DEY官方开发环境基础上，增加了自定义的meta-cusom层和一些脚本工具，帮助用户一键编译带有自定义软件包和自定义板卡接口支持的工具链，方便用户自定义软件包和应用程序，服务等的集成。针对摄像头无线视频流演示固件，新建DEY AIO开发环境时，请检出rtsp.xml作为manifest仓库。以下是完整的命令过程：

### 安装必要的依赖包
```
sudo apt update
sudo apt install gawk wget file git diffstat file unzip texinfo gcc build-essential chrpath socat cpio python3 python3-pip python3-pexpect xz-utils debianutils iputils-ping python3-git python3-jinja2 libegl1-mesa-dev libsdl1.2-dev pylint xterm python3-subunit mesa-common-dev zstd liblz4-tool tmux
sudo apt install python-is-python3
```
### 安装repo并配置好git
```
sudo apt install repo
git config --global user.name  “yourname”   请用你的英文名称替换yourname
git config --global user.email "you@email.com“  请用你的邮箱替换

```
### 用repo安装dey-aio工具集
```
cd
mkdir deyaio-rtsp
cd deyaio-rtsp
repo init -u https://github.com/peyoot/dey-aio-manifest.git -b scarthgap -m rtsp.xml 
repo sync
```
上面命令将会拉取DEY 5.0(代号scarthgap)的源码和流媒体服务应用所需的自定义meta-custom层源码，以便用户可以新建项目编译出目标固件。

### 新建项目并编译固件
一般，我们需要在dey5.0/workspace/下创建新项目目录，比如ccmp25rtsp，然后source创建项目所需的环境变量脚本，就可以直接编译了，完整过程如下：
```
mkdir -p ~/deyaio-rtsp/dey5.0/workspace/ccmp25rtsp
cd ~/deyaio-rtsp/dey5.0/workspace/ccmp25rtsp
source ../../mkproject.sh -p ccmp25-dvk
空格或下拉链阅读license相关内容，最后输入yes接受，就可以执行编译命令了：
bitbake dey-image-lvgl
```
Yocto的整个编译过程会根据不同layer的配方，拉取包括Linux和其它各种应用程序包的源码，并按配方进行编译。为了顺畅访问外网，一般需要科学上网环境。根据开发平台硬件性能和网速，一般会执行数个小时到一天不等。因此建议用户在服务器上或是在台式机上进行，以防止断电或关闭电脑等影响编译持续进行。

编译结束后，在tmp目录下有所有编译的中间件和结果，其中系统固件在tmp/deploy/images/ccmp25-dvk/下。可以利用DEYAIO的脚本将目标镜像相关的文件打包发布到release目录下。

### 打包发布到release目录
发布脚本文件在dey5.0/publish.sh，如果是首次执行，最好是在第一个步骤时输入yes执行一下软件包检查和安装，以便所有功能所需的软件包都安装上。
```
#首次运行时检查一下系统是否已经安装有必要软件包
$ ./publish.sh
check and install some prerequisite packages? [no] yes
```
后续如果再运行该发布脚本，就无需上述操作，直接回车即可。后续的一些交互问答，大多只需回车使用默认的选项即可，只有在镜像类型处，要选择dey-image-lvgl，因为我们上面编译的就是这个镜像类型。
```
#注意镜像类型要和我们bitbake编译的一致，以便拷贝正确的镜像文件
Please choose the  image type you're about to publish
1. core-image-base
2. dey-image-webkit
3. dey-image-qt
4. dey-image-crank
5. dey-image-lvgl
6. manually input an image name
which kind of image you're going to publish [1] 5
```
其它选项大多直接回车，最后编译的文件会拷贝到dey5.0/release目录下，并同时会把镜像文件打包成一个压缩的安装包，可供TF卡或U盘进行固件升级。


## 将固件刷入到开发板中
演示程序集成在上述编译的嵌入式Linux固件中，可以使用TF卡，U盘，网络或是usb线缆进行固件更新。以SD卡或U盘为例，相关的步骤如下：

    <style>
        .tab-content {
            display: none;
            padding: 10px;
            border: 1px solid #ddd;
        }

        .tab-content:target {
            display: block;
        }
    </style>

<h2>TF卡刷固件</h2>
<div id="sdcard" class="tab-content">
    <pre>setenv image-name dey-image-lvgl 
    run install_linux_fw_sd
    </pre>
</div>

<h2>U盘刷固件</h2>
<div id="udisk" class="tab-content">
    <pre>usb start
     setenv image-name dey-image-lvgl
     run install_linux_fw_usb
     </pre>
</div>
