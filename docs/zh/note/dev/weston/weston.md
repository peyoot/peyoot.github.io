# Weston与显示后端
## QT是否需要Weston平台
通常镜像中需要包含 qtwayland 包, Weston 启动后会设置环境变量 WAYLAND_DISPLAY=wayland-0，Qt会自动检测到 Weston 正在运行，并使用自动选用 Wayland 平台。Wayland 后端（Weston）会统一管理所有显示输出（HDMI、LVDS 等），Qt 应用程序无需关心具体输出接口。你只需确保 Weston 配置正确（/etc/xdg/weston/weston.ini 或 /etc/weston.ini），Qt 应用会自动适配 Weston 管理的屏幕。

如果没启用Weston，则设置 QT_QPA_PLATFORM=eglfs，Qt 尝试直接通过 DRM/KMS 接管显示输出。在Weston启用时，如果设置这个参数，因Weston 已经占用了 DRM master 权限。两个进程争夺 DRM master，非 master 的一方就会收到 Permission denied。

假如不用weston，则在KMS/DRM 后端支持通过一个 JSON 配置文件来定义多个 output，mode 可以是 off / current / preferred / 宽x高 等形式。关键点是：output 的 name 必须和内核 DRM 报告的连接器名一致。

例：
```
{
  "device": "/dev/dri/card0",
  "hwcursor": false,
  "separateScreens": false,
  "outputs": [
    {
      "name": "HDMI-A-1",
      "mode": "preferred"
    },
    {
      "name": "LVDS-1",
      "mode": "1280x800"
    }
  ]
}

```
上面的链接器需要根据实际情况来修改，可以用这个检测：

```
for p in /sys/class/drm/card0-*/status; do
    name=$(basename $(dirname $p))
    status=$(cat $p)
    echo "$name: $status"
done
```


