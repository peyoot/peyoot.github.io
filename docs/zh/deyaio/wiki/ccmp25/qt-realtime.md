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

