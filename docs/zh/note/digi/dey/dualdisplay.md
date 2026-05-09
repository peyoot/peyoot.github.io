# weston
尝试 Weston 作为 Wayland compositor，它在处理多显示器克隆模式上可能更稳定。你可以在 /etc/xdg/weston.ini 中进行类似配置：
```
[core]
# Wayland socket
[shell]
background-color=0xff000000
panel-position=none
locking=false
[screensaver]
# Disable screensaver
[output]
name=LVDS-1
mode=1280x800
[output]
name=HDMI-A-1
mode=1280x800

```
设置 Qt 应用使用 Wayland 后端启动：
export QT_QPA_PLATFORM=wayland-egl
./YourQtApp