# CCMP25双屏显示研究
## 从Linux显示子系统说起
背景知识： Linux的DRM（Direct Rendering Manager，直接渲染管理器）和KMS（Kernel Mode Setting，内核模式设置） 是Linux内核中用于管理图形显示的核心子系统。
DRM负责管理现代显卡的硬件加速图形渲染，提供统一的接口让用户空间程序（如X11、Wayland、应用程序）安全、高效地访问GPU功能。KMS是DRM的一个子模块，专门控制显示输出的基本设置，例如分辨率、刷新率、多显示器配置等。
设备树（Device Tree） 描述硬件连接，DRM/KMS驱动据此初始化显示控制器，实现屏幕驱动。

在 DRM/KMS 框架中，显示流水线是KMS模块的核心，它通过一系列硬件抽象对象来模拟现代显示控制器的工作流程。这个流水线定义了从内存中的图像数据（帧缓冲区）到物理显示器上像素的完整路径。即：
FrameBuffer -> Plane -> CRTC -> Encoder -> Connector -> 物理显示器

一个FrameBuffer是一块在内存（或显存）中分配好的缓冲区，里面存储了即将显示的一帧图像的像素数据，它与硬件无关，通常对应一个单独的图像图层。复杂的桌面合成器（如Wayland/Weston）会为每个窗口或界面元素创建各自的FrameBuffer。

## QT程序后端
eglfs​是Qt的嵌入式平台插件，全称是 "EGL Full Screen"。它是专门为嵌入式 Linux 系统设计的显示后端，特点是：
  * 无窗口系统：直接在 framebuffer 上全屏渲染
  * 低延迟：绕过了 X11/Wayland 等窗口管理器
  * 轻量级：专为嵌入式设备优化
  * GPU 加速：通过 EGL/OpenGL ES 利用 GPU 硬件加速
```
Qt应用程序
    ↓
Qt Quick / QWidgets
    ↓
OpenGL / OpenGL ES
    ↓
EGL (Embedded-System Graphics Library)
    ↓
GPU驱动 (Vivante, Mali, Adreno等)
    ↓
显示系统 (DRM/KMS 或 framebuffer)
    ↓
物理显示器
```
eglfs有两种主要后端，eglfs_kms通常能提供更好的性能和更低的延迟，因为它绕过了传统的窗口系统。

```
# 这是你正在使用的后端
export QT_QPA_PLATFORM=eglfs
export QT_QPA_EGLFS_INTEGRATION=eglfs_kms
Qt应用 → OpenGL ES → EGL → DRM/KMS API → 内核DRM子系统 → 硬件显示控制器
```


## 设备树节点和DRM关系
设备树告诉 DRM 驱动“硬件是什么、怎么连的”，DRM 驱动则根据这些信息来初始化和操作硬件。
SoC厂商提供的DRM驱动在启动时，会解析设备树中与显示相关的节点。在内部创建并注册对应的 DRM/KMS 核心对象（CRTC、Encoder、Connector、Plane），最终，这些硬件对象通过 /dev/dri/cardX 设备文件暴露给用户空间，供 libdrm 和显示服务器（如 Wayland/Weston）使用。

## 如何在 DRM 中找到对应的显示接口元素

1、检查dmesg
```
dmesg | grep -i "drm\|dri\|connector\|crtc"
```
比如CCMP25上电时，会有两个DRM驱动被成功初始化了：
[drm] Initialized simpledrm 1.0.0 20200625 for ba200000.framebuffer on minor 0
作用：simpledrm是一个简单的通用帧缓冲驱动，通常用于在系统启动早期提供基本的显示输出，直到更复杂的专用DRM驱动接管。它直接管理一个固定的帧缓冲内存区域（ba200000.framebuffer）。
[drm] Initialized stm 1.0.0 20170330 for 48010000.display-controller on minor 0
作用：stm 驱动是STM32平台专用的DRM显示驱动，用于驱动你的SoC（STM32MP系列）的显示控制器硬件（48010000.display-controller）。这是你的主显示驱动。

2、使用 modetest 工具（最直接）
```
# 查看所有 DRM 设备的显示流水线状态
modetest -M <driver_name> -s
# 例如，对于CCMP25平台：modetest -M stm -s

# 查看更详细的属性信息
modetest -M <driver_name> -p
```

3、查看内核调试文件系统（debugfs）
内核 DRM 驱动通常会在 /sys/kernel/debug/dri/ 目录下提供丰富的调试信息。
```
# 假设 card0 是第一个 DRM 设备
ls /sys/kernel/debug/dri/0/

# 查看显示流水线各组件状态
cat /sys/kernel/debug/dri/0/state
```

4、直接查看 /sys/class/drm/ 目录
这是一个用户空间友好的接口，以目录结构展示 DRM 设备。
```
ls /sys/class/drm/
# 通常会看到 card0、card0-DSI-1、card0-HDMI-A-1 等目录

# 查看某个 connector 的状态
cat /sys/class/drm/card0-HDMI-A-1/status # 输出可能是 "connected" 或 "disconnected"
cat /sys/class/drm/card0-LVDS-1/modes # 显示支持的分辨率模式
```

## weston的双屏显示切换
weston服务可通过/etc/xdg/weston/weston.ini来指定配置，如果硬件不能支持双屏显示，也可以通过两个不同的配置文件来切换。DEY下的weston服务通过/lib/systemd/system/weston-launch.service这个服务文件来控制，开启或停止weston，只需：
```
systemctl start/stop weston-launch
```

## 无weston的双屏显示切换
如果是QT程序，主要取决于QT的配置

## 实站ccmp25开发套件
下面以实例来展示，最开始在设备树中开启两个显示器都为1280x800分辨率，不过由于HDMI显示器至少需要60Hz的刷新率才能显示，所以下面这个输出看似正常，但HDMI并没有生效，最后一个命令可看到HDMI的crtc是null
```
root@ccmp25-dvk:~# ls /sys/class/drm/
card0           card0-HDMI-A-1  card0-LVDS-1    version
root@ccmp25-dvk:~# cat /sys/class/drm/card0-HDMI-A-1/status
connected
root@ccmp25-dvk:~# cat /sys/class/drm/card0-HDMI-A-1/modes 
1280x800
root@ccmp25-dvk:~# cat /sys/class/drm/card0-LVDS-1/status
connected
root@ccmp25-dvk:~# cat /sys/class/drm/card0-LVDS-1/modes 
1280x800
root@ccmp25-dvk:~# cat /sys/kernel/debug/dri/0/state
...
crtc[44]: crtc-0
...
        mode: "1280x800": 60 71000 1280 1328 1360 1440 800 803 809 824 0x48 0x0
...
connector[32]: HDMI-A-1
        crtc=(null)
        self_refresh_aware=0
        max_requested_bpc=0
        colorspace=Default
connector[34]: LVDS-1
        crtc=crtc-0
        self_refresh_aware=0
        max_requested_bpc=0
        colorspace=Default
```
但此时LVDS也没显示，这就和weston.ini有关了，