# **Digi ConnectCore 无线远程视频监控系统**
无线远程视频监控系统是一套通过WiFi来传输视频流的完整解决方案。该系统由基于Digi Connectcore系列核心模组的单板机和摄像头组成。ConnectCore系列片上系统核心模块集成有高性能的WiFi6模块，系统镜像集成了http和rtsp服务，能够支持多端通过浏览器访问摄像头的高清视频流，在工业和医疗等场景有广泛的应用。

本演示镜像由DEYAIO工具实现系统镜像和软件工具的编译，可以运行在Digi ConnectCore系列开发板。本系统固件在ConnectCore MP25等核心板充分验证。

## 简介

无线视频监控系统基于Digi ConnectCore MP25 开发板，展示其作为**高性能工业级物联网web无线网关**的核心能力，包括：
- **WiFi6 AP/STA/Wifi Direct 功能**：通过核心板上集成的无线模块快速构建本地网络热点，支持多端接入，或是由WiFi Direct构建稳定的收发端链路
- **实时视频流传输**：USB/MIPI 摄像头即插即用自动检测与低延迟编码
- **多种本地视频接口**： 支持LVDS，HDMI等本地视频接口，实现和Web视频流同步显示
- **嵌入式Web 服务器**：无需外部服务器实现设备直连控制
- **工业级可靠性**：复杂环境下的稳定数据传输能力

## **功能特性**
### 1. 自主组网能力
- ConnectCore MP25 集成有WiFi 6E模块，支持AP热点或WiFi Direct访问
- 支持wifi6 和WPA3 企业级加密，信道自动选择，确保传输安全性
- 三频段自动切换（2.4GHz/5GHz），抗干扰能力强
### 2. 实时视频监控系统
- 支持USB3.0 接口接入UVC 兼容摄像头（支持1080P@60fps）
- 支持MIPI接口连接MIPI摄像头
- 基于GStreamer 框架的H.264 硬件编码加速
- 本地视频流和远程Web 访问同时展示
- 浏览器无插件播放
- 实测端到端延迟可150ms以内（现场网络环境）

## **使用方法**

本演示程序实现自动侦测摄像头，自动按优先级别设置最佳的分辨率，一般无需用户手动操作。

用户可以使用预编译好的固件镜像，或是自行编译固件，编译方法见后面章节。刷好集成有演示程序的dey-image-lvgl固件后，连接USB摄像头，开机上电，进入系统后，演示程序会识别出所连接的摄像头，并在板子上开启Wifi热点，SSID: digi-ap-mac，密码: digiconnectcore

连上热点后，在浏览器打开板子的IP地址：http://192.168.46.30，即可看到视频流

如需更改分辨率或帧率，请打开脚本文件/usr/bin/http_camera_demo.sh，在可配置参数中修改WIDTH_PRIORITY和FRAMERATE，并重启服务或重新启动

#### 调试
不同的摄像头厂家，所支持的格式不尽相同，在调试时，可以停止服务，改用手动的命令方式运行程序 

先停止服务
```
systemctl stop mjpg_streamer
```
手动指定分辨率等：

```
mjpg_streamer -i "input_uvc.so -d /dev/video2 -r 800x800 -f 15" -o "output_http.so -p 80 -w /srv/mjpg_streamer/www"
```
如果需要在支持web访问的同时，将视频流也一并输出到本地显示屏，可以用

```
mjpg_streamer -i "input_uvc.so -d /dev/video2 -r 800x800 -f 15" -o "output_viewer.so -i0 -w800 -h800 -f15" -o "output_http.so -p 80 -w /srv/mjpg_streamer/www"

```
## **编译带demo程序的镜像**
可通过deyaio来直接编译完整功能镜像卡刷包，完整执行步骤如下：

```
cd 
mkdir deyaio-rtsp
repo init -u https://github.com/peyoot/dey-aio-manifest.git -b main -m rtsp.xml
repo sync
cd dey5.0
mkdir ccmp25rtsp
cd ccmp25rtsp
source ../../mkproject.sh -p ccmp25-dvk
```
在conf/local.conf中添加这一行:
```
IMAGE_INSTALL:append = " mjpg-streamer-service"
```
直接编译固件:
```
bitbake tf-a-stm32mp
bitbake fip-stm32mp
bitbake dey-image-lvgl
```
编译完成后，进入dey5.0目录，发布镜像包
cd ~/deyaio-rtsp/dey5.0
./publish
注意选择镜像为dey-image-lvgl，其它直接按回成，相关镜像和打包好的卡刷包在~/deyaio-rtsp/dey5.0/releash/ccmp25rtsp目录下。


## **更多功能**

MIPI摄像头支持 （开发中...)