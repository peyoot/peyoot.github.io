# Compiling a light Real-time DEY Image with QT support
To achieve better real-time performance under the QT image, some image trimming and optimization are required. 
After installing DEY AIO, You can check out the following repository using repo:
```
repo init -u https://github.com/peyoot/dey-aio-manifest.git -b scarthgap -m qtfb-rtnodemo.xml
```
If you need QT5 support ,change it in conf/bblayers.conf,
and then configure in conf/local.conf:

```
DISTRO_FEATURES:append = " rt"

# Add Qt base packages (core functionality only)
IMAGE_INSTALL:append = " \
    qtbase \
    qtbase-plugins \
    qtbase-examples \
    qt5everywheredemo \
"

# Explicitly disable Wayland and OpenGL
DISTRO_FEATURES:remove = "wayland opengl x11"

# Ensure framebuffer support
DISTRO_FEATURES:append = " fbdev "

# Streamline qtbase configuration, enable only framebuffer and basic features
PACKAGECONFIG:remove:pn-qtbase = "glib gles2 egl x11 xcb"
PACKAGECONFIG:append:pn-qtbase = " linuxfb gif png jpeg fontconfig"

# Basic font support (optional but recommended)
IMAGE_INSTALL:append = " ttf-dejavu-sans "
```
## QT Examples

Some programs, such as the analog clock example, require configuring environment variables:

```
export QT_QPA_PLATFORM=linuxfb
cd /usr/share/examples/widgets/widgets/analogclock
./analogclock /dev/null 2>&1 &
```
However, different programs use different libraries, and environment variables will have different effects. The default qt5everywhere example does not require the above parameter setting, and the default is more efficient:

```
export QT_QPA_PLATFORM="eglfs"
cd /usr/share/qt5everywheredemo-1.0
./QtDemo > /dev/null 2>&1 &
```
Of course, compare to analogclock , this is a relatively larger demo with more memory footprint. so performance is not so good as pure core-image-base, but still can meet the expectation.

Real time performance can refer to following commands:
```
cyclictest -p 98 -t5 -m -l 100000

cyclictest --mlockall --smp --priority=98 --interval=1000 --distance=0 -l 100000
```