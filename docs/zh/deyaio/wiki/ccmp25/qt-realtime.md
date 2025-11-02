# 支持实时的QT镜像编译
为了在QT镜像下能有较好的实时效果，需要对镜像做一些裁减优化，可用repo检出下面仓库：
repo init -u https://github.com/peyoot/dey-aio-manifest.git -b scarthgap -m qtfb-rtnodemo.xml
并在conf/local.conf中配置：
```
DISTRO_FEATURES:append = " rt"

# 添加Qt基础包（仅核心功能）
IMAGE_INSTALL:append = " \
    qtbase \
    qtbase-plugins \
    qtbase-examples \
    qt5everywheredemo \
"

# 显式禁用Wayland和OpenGL
DISTRO_FEATURES:remove = "wayland opengl x11"

# 确保framebuffer支持
DISTRO_FEATURES:append = " fbdev "

# 精简qtbase配置，只启用framebuffer和基础功能
PACKAGECONFIG:remove:pn-qtbase = "glib gles2 egl x11 xcb"
PACKAGECONFIG:append:pn-qtbase = " linuxfb gif png jpeg fontconfig"

# 基础字体支持（可选，但推荐）
IMAGE_INSTALL:append = " ttf-dejavu-sans "

```

# QT例程
时钟例程，需要先设置环境变量
```
export QT_QPA_PLATFORM=linuxfb
./analogclock > /dev/null 2>&1 &

```

# QT5镜像上电后的默认环境变量

```
export DBUS_SESSION_BUS_ADDRESS="unix:path=/run/user/0/bus"
export EDITOR="vi"
export HOME="/root"
export HUSHLOGIN="FALSE"
export LANG="C"
export LOGNAME="root"
export MAIL="/var/spool/mail/root"
export MOTD_SHOWN="pam"
export OLDPWD
export OPIEDIR
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/local/sbin:/usr/sbin:/sbin"
export PS1="\\u@\\h:\\w\\\$ "
export PWD="/root"
export QPEDIR
export QTDIR
export QT_QPA_EGLFS_ALWAYS_SET_MODE="1"
export QT_QPA_EGLFS_INTEGRATION="eglfs_kms"
export QT_QPA_EGLFS_KMS_ATOMIC="1"
export QT_QPA_EGLFS_KMS_CONFIG="/usr/share/qt5/cursor.json"
export QT_QPA_PLATFORM="eglfs"
export SHELL="/bin/sh"
export SHLVL="1"
export SYSTEMD_PAGER=""
export TERM="linux"
export USER="root"
export XDG_RUNTIME_DIR="/run/user/0"
export XDG_SESSION_CLASS="user"
export XDG_SESSION_ID="c1"
export XDG_SESSION_TYPE="tty"

```

# 完整测试流程
上电后，用root登陆后，稍等个15秒，以防止有登陆后没执行完的启动脚本影响测试结果。

有些程序，比如指针时钟的例程需要配置环境变量：
```
export QT_QPA_PLATFORM=linuxfb
cd /usr/share/examples/widgets/widgets/analogclock
./analogclock /dev/null 2>&1 &
```
不过不同的程序，用到不同的库，环境变量会有不同的效果，默认的qt5everywhere例程就不需要上面这条参数设置，反而默认的会更高效:
```
export QT_QPA_PLATFORM="eglfs"
cd /usr/share/qt5everywheredemo-1.0
./QtDemo > /dev/null 2>&1 &
```
当然，这是个相当大的例程，所以和占用内存大小也有关系，
测试命令可以参考：
```
cyclictest -p 98 -t5 -m -l 100000

cyclictest --mlockall --smp --priority=98 --interval=1000 --distance=0 -l 100000

```

# 无显示接口的ccmp25plc板卡进阶配置
有些PLC板卡没有显示接口，此时可以通过上位机来显示。包括：直接X11转发（SSH），使用VNC，和虚拟帧缓冲（Xvfb）。
如果板子上运行完整的X11服务器（包括窗口管理器），那么它需要较多的资源，因为它提供了完整的桌面环境支持。但是，我们也可以只运行一个极简的X服务器（比如Xvfb）而不运行窗口管理器。
Xvfb（虚拟帧缓冲X服务器）是一个不输出到物理显示器的X服务器。它只在内存中模拟一个帧缓冲区。因此，它不需要物理显示设备，也不需要图形界面。相比完整的X服务器，Xvfb省去了与物理显示设备交互的部分，因此更轻量。

## xvfb方案
ST公司的ccmp25plc板并没有显示接口，因此我们可以用Xvfb配合VNC实现远程的界面显示。

### 项目配置
在conf/local.conf中配置
```
# Add Qt base packages (core functionality only)
IMAGE_INSTALL:append = " \
    qtbase \
    qtbase-plugins \
    qtbase-examples \
    qt5everywheredemo \
    xauth \
    xserver-xorg \
    x11vnc \
    libx11 \
    libxcb \
    mesa \                    # 开源OpenGL实现
    mesa-demos \              # OpenGL测试工具
    libglu \                  # OpenGL工具库
"

# Ensure framebuffer or xvfb support
DISTRO_FEATURES:append = " fbdev x11 opengl gles2 "


# Streamline qtbase configuration, enable only framebuffer and basic features
# PACKAGECONFIG:remove:pn-qtbase = "glib gles2 egl x11 xcb"
# PACKAGECONFIG:append:pn-qtbase = " linuxfb gles2 gif jpeg fontconfig xcb"

IMAGE_INSTALL:append = " \
    qt5everywheredemo \
    xauth \
    xserver-xorg \
    x11vnc \
    libx11 \
    libxcb \
    mesa \
    mesa-demos \
    libglu \
"
```

### 使用方式

方式1：手动选择后端
```
# 使用framebuffer（如果有物理显示）
export QT_QPA_PLATFORM=linuxfb
./qt_app

# 使用Xvfb（远程显示）
export DISPLAY=:99
export QT_QPA_PLATFORM=xcb
Xvfb :99 -screen 0 1024x768x24 &
./qt_app

# 使用VNC直接显示
export QT_QPA_PLATFORM=vnc:size=800x600
./qt_app
```
方式2：自动检测脚本
```
# /usr/bin/start-qt-remote
#!/bin/sh
export DISPLAY=:99

# 启动Xvfb
Xvfb :99 -screen 0 1024x768x24 &

# 启动VNC服务器（可选）
x11vnc -display :99 -forever -shared -nopw -bg

# 设置QT平台
export QT_QPA_PLATFORM=xcb

# 运行应用
exec "$@"
```
## 虚拟DRM方案
但上面有一个缺点，xvfb通常没法用集成的GPU。
在QT中，我们通常使用eglfs（基于EGL的全屏显示）平台插件来利用GPU进行硬件加速。但是，eglfs需要实际的显示设备（即使是一个虚拟的显示设备节点）。在无显示接口的核心板上，我们可以创建一个虚拟的DRM（Direct Rendering Manager）设备，然后让eglfs使用这个虚拟设备。