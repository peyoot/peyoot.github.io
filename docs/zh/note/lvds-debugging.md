## 调试ccmp25 dvk和屏套件
基本参考是https://github.com/digi-embedded/linux/blob/v6.6/stm/dey-5.0/maint/Documentation/devicetree/bindings/display/panel/panel-lvds.yaml
除非特定屏，比如：Innolux Corporation 10.1" EE101IA-01D WXGA (1280x800) LVDS panel 有专门驱动：
https://github.com/digi-embedded/linux/blob/v6.6/stm/dey-5.0/maint/Documentation/devicetree/bindings/display/panel/innolux%2Cee101ia-01d.yaml

另外，panel-simple里定义了一系列常用屏：
https://github.com/digi-embedded/linux/blob/v6.6/stm/dey-5.0/maint/Documentation/devicetree/bindings/display/panel/panel-simple.yaml

时序定义上有几种：
https://github.com/digi-embedded/linux/blob/v6.6/stm/dey-5.0/maint/Documentation/devicetree/bindings/display/panel/panel-timing.yaml
https://github.com/digi-embedded/linux/blob/v6.6/stm/dey-5.0/maint/Documentation/devicetree/bindings/display/panel/display-timings.yaml

以下是官方套件lvds屏输出参考
```
root@ccmp25-dvk:~# dmesg |grep -i ltdc
[    0.000000] OF: reserved mem: 0x00000000be800000..0x00000000beffffff (8192 KiB) nomap non-reusable ltdc-sec-layer@be800000
[    0.000000] OF: reserved mem: 0x00000000bf000000..0x00000000bfffffff (16384 KiB) nomap non-reusable ltdc-sec-rotation@bf000000
root@ccmp25-dvk:~# ls /dev/fb*
/dev/fb   /dev/fb0
root@ccmp25-dvk:~# cat /sys/class/graphics/fb0/modes
U:1280x800p-0
root@ccmp25-dvk:~# find /sys/firmware/devicetree/base -name "*ltdc*" -o -name "*lvds*" -o -name "*panel*" | xargs ls -la
-r--r--r--    1 root     root            48 May 29 19:43 /sys/firmware/devicetree/base/__symbols__/ltdc
-r--r--r--    1 root     root            64 May 29 19:43 /sys/firmware/devicetree/base/__symbols__/ltdc_ep0_out
-r--r--r--    1 root     root            64 May 29 19:43 /sys/firmware/devicetree/base/__symbols__/ltdc_ep1_out
-r--r--r--    1 root     root            41 May 29 19:43 /sys/firmware/devicetree/base/__symbols__/ltdc_sec_layer
-r--r--r--    1 root     root            44 May 29 19:43 /sys/firmware/devicetree/base/__symbols__/ltdc_sec_rotation
-r--r--r--    1 root     root            34 May 29 19:43 /sys/firmware/devicetree/base/__symbols__/lvds
-r--r--r--    1 root     root            56 May 29 19:43 /sys/firmware/devicetree/base/__symbols__/lvds_in
-r--r--r--    1 root     root            56 May 29 19:43 /sys/firmware/devicetree/base/__symbols__/lvds_out0
-r--r--r--    1 root     root            26 May 29 19:43 /sys/firmware/devicetree/base/__symbols__/lvds_panel_in
-r--r--r--    1 root     root            26 May 29 19:43 /sys/firmware/devicetree/base/__symbols__/panel_dsi_gpio_backlight
-r--r--r--    1 root     root            25 May 29 19:43 /sys/firmware/devicetree/base/__symbols__/panel_dsi_pwm_backlight
-r--r--r--    1 root     root            12 May 29 19:43 /sys/firmware/devicetree/base/__symbols__/panel_lvds
-r--r--r--    1 root     root            27 May 29 19:43 /sys/firmware/devicetree/base/__symbols__/panel_lvds_gpio_backlight
-r--r--r--    1 root     root            26 May 29 19:43 /sys/firmware/devicetree/base/__symbols__/panel_lvds_pwm_backlight
-r--r--r--    1 root     root            39 May 29 19:43 /sys/firmware/devicetree/base/__symbols__/pwm_lvds_bckl

/sys/firmware/devicetree/base/panel-dsi-gpio-backlight:
drwxr-xr-x    2 root     root             0 May 29 19:43 .
drwxr-xr-x   34 root     root             0 May 29 18:48 ..
-r--r--r--    1 root     root            15 May 29 19:43 compatible
-r--r--r--    1 root     root             4 May 29 19:43 default-brightness-level
-r--r--r--    1 root     root            12 May 29 19:43 gpios
-r--r--r--    1 root     root            25 May 29 19:43 name
-r--r--r--    1 root     root             4 May 29 19:43 phandle
-r--r--r--    1 root     root             9 May 29 19:43 status

/sys/firmware/devicetree/base/panel-dsi-pwm-backlight:
drwxr-xr-x    2 root     root             0 May 29 19:43 .
drwxr-xr-x   34 root     root             0 May 29 18:48 ..
-r--r--r--    1 root     root            44 May 29 19:43 brightness-levels
-r--r--r--    1 root     root            14 May 29 19:43 compatible
-r--r--r--    1 root     root             4 May 29 19:43 default-brightness-level
-r--r--r--    1 root     root            24 May 29 19:43 name
-r--r--r--    1 root     root             4 May 29 19:43 phandle
-r--r--r--    1 root     root             4 May 29 19:43 power-supply
-r--r--r--    1 root     root            16 May 29 19:43 pwms
-r--r--r--    1 root     root             9 May 29 19:43 status

/sys/firmware/devicetree/base/panel-lvds:
drwxr-xr-x    4 root     root             0 May 29 19:43 .
drwxr-xr-x   34 root     root             0 May 29 18:48 ..
-r--r--r--    1 root     root             4 May 29 19:43 backlight
-r--r--r--    1 root     root            26 May 29 19:43 compatible
-r--r--r--    1 root     root             9 May 29 19:43 data-mapping
-r--r--r--    1 root     root             4 May 29 19:43 height-mm
-r--r--r--    1 root     root            11 May 29 19:43 name
drwxr-xr-x    2 root     root             0 May 29 19:43 panel-timing
-r--r--r--    1 root     root             4 May 29 19:43 phandle
drwxr-xr-x    3 root     root             0 May 29 19:43 port
-r--r--r--    1 root     root             4 May 29 19:43 power-supply
-r--r--r--    1 root     root             5 May 29 19:43 status
-r--r--r--    1 root     root             4 May 29 19:43 width-mm

/sys/firmware/devicetree/base/panel-lvds-gpio-backlight:
drwxr-xr-x    2 root     root             0 May 29 19:43 .
drwxr-xr-x   34 root     root             0 May 29 18:48 ..
-r--r--r--    1 root     root            15 May 29 19:43 compatible
-r--r--r--    1 root     root             4 May 29 19:43 default-brightness-level
-r--r--r--    1 root     root            12 May 29 19:43 gpios
-r--r--r--    1 root     root            26 May 29 19:43 name
-r--r--r--    1 root     root             4 May 29 19:43 phandle
-r--r--r--    1 root     root             9 May 29 19:43 status

/sys/firmware/devicetree/base/panel-lvds-pwm-backlight:
drwxr-xr-x    2 root     root             0 May 29 19:43 .
drwxr-xr-x   34 root     root             0 May 29 18:48 ..
-r--r--r--    1 root     root            44 May 29 19:43 brightness-levels
-r--r--r--    1 root     root            14 May 29 19:43 compatible
-r--r--r--    1 root     root             4 May 29 19:43 default-brightness-level
-r--r--r--    1 root     root            25 May 29 19:43 name
-r--r--r--    1 root     root             4 May 29 19:43 phandle
-r--r--r--    1 root     root             4 May 29 19:43 power-supply
-r--r--r--    1 root     root            16 May 29 19:43 pwms
-r--r--r--    1 root     root             5 May 29 19:43 status

/sys/firmware/devicetree/base/panel-lvds/panel-timing:
drwxr-xr-x    2 root     root             0 May 29 19:43 .
drwxr-xr-x    4 root     root             0 May 29 19:43 ..
-r--r--r--    1 root     root             4 May 29 19:43 clock-frequency
-r--r--r--    1 root     root             4 May 29 19:43 hactive
-r--r--r--    1 root     root             4 May 29 19:43 hback-porch
-r--r--r--    1 root     root             4 May 29 19:43 hfront-porch
-r--r--r--    1 root     root             4 May 29 19:43 hsync-len
-r--r--r--    1 root     root            13 May 29 19:43 name
-r--r--r--    1 root     root             4 May 29 19:43 vactive
-r--r--r--    1 root     root             4 May 29 19:43 vback-porch
-r--r--r--    1 root     root             4 May 29 19:43 vfront-porch
-r--r--r--    1 root     root             4 May 29 19:43 vsync-len

/sys/firmware/devicetree/base/reserved-memory/ltdc-sec-layer@be800000:
drwxr-xr-x    2 root     root             0 May 29 19:43 .
drwxr-xr-x   35 root     root             0 May 29 19:43 ..
-r--r--r--    1 root     root            15 May 29 19:43 name
-r--r--r--    1 root     root             0 May 29 19:43 no-map
-r--r--r--    1 root     root             4 May 29 19:43 phandle
-r--r--r--    1 root     root            16 May 29 19:43 reg

/sys/firmware/devicetree/base/reserved-memory/ltdc-sec-rotation@bf000000:
drwxr-xr-x    2 root     root             0 May 29 19:43 .
drwxr-xr-x   35 root     root             0 May 29 19:43 ..
-r--r--r--    1 root     root            18 May 29 19:43 name
-r--r--r--    1 root     root             0 May 29 19:43 no-map
-r--r--r--    1 root     root             4 May 29 19:43 phandle
-r--r--r--    1 root     root            16 May 29 19:43 reg

/sys/firmware/devicetree/base/soc@0/bus@42080000/lvds@48060000:
-r--r--r--    1 root     root             4 May 29 19:43 #clock-cells
drwxr-xr-x    3 root     root             0 May 29 19:43 .
drwxr-xr-x   94 root     root             0 May 29 18:48 ..
-r--r--r--    1 root     root             8 May 29 19:43 access-controllers
-r--r--r--    1 root     root            16 May 29 19:43 clock-names
-r--r--r--    1 root     root            24 May 29 19:43 clocks
-r--r--r--    1 root     root            18 May 29 19:43 compatible
-r--r--r--    1 root     root             5 May 29 19:43 name
-r--r--r--    1 root     root             4 May 29 19:43 phandle
drwxr-xr-x    4 root     root             0 May 29 19:43 ports
-r--r--r--    1 root     root             4 May 29 19:43 power-domains
-r--r--r--    1 root     root             8 May 29 19:43 reg
-r--r--r--    1 root     root             8 May 29 19:43 resets
-r--r--r--    1 root     root             5 May 29 19:43 status
-r--r--r--    1 root     root             4 May 29 19:43 vdd-supply
-r--r--r--    1 root     root             4 May 29 19:43 vdda18-supply
root@ccmp25-dvk:~# cat /proc/fb
0 stmdrmfb
root@ccmp25-dvk:~# ls /sys/class/graphics/fb0/
bits_per_pixel  console         dev             mode            name            power           state           subsystem       virtual_size
blank           cursor          device          modes           pan             rotate          stride          uevent
root@ccmp25-dvk:~# echo 0 > /sys/class/graphics/fb0/blank                 打开显示
root@ccmp25-dvk:~# echo 1 > /sys/class/graphics/fb0/blank                 关闭显示
root@ccmp25-dvk:/usr/share/qt5everywheredemo-1.0# ls /sys/class/graphics
fb0    fbcon
root@ccmp25-dvk:/usr/share/qt5everywheredemo-1.0# ls /dev/dri/
by-path  card0
root@ccmp25-dvk:/usr/share/qt5everywheredemo-1.0# dmesg | grep -E "(drm|ltdc|lvds|panel|fb)"
[    0.000000] OF: reserved mem: 0x0000000081300000..0x0000000081fbffff (13056 KiB) nomap non-reusable spare1@81300000
[    0.000000] OF: reserved mem: 0x00000000be800000..0x00000000beffffff (8192 KiB) nomap non-reusable ltdc-sec-layer@be800000
[    0.000000] OF: reserved mem: 0x00000000bf000000..0x00000000bfffffff (16384 KiB) nomap non-reusable ltdc-sec-rotation@bf000000
[    0.000000] NUMA: NODE_DATA [mem 0xb9fbcac0-0xb9fbefff]
[    0.000000] Kernel command line: console=ttySTM0,115200 fbcon=logo-pos:center fbcon=logo-count:1 root=PARTUUID=3fcf7bf1-b6fe-419d-9a14-f87950727bc0 rootwait rw
[    0.077260] /soc@0/bus@42080000/display-controller@48010000: Fixed dependency cycle(s) with /soc@0/bus@42080000/lvds@48060000
[    0.077856] /soc@0/bus@42080000/lvds@48060000: Fixed dependency cycle(s) with /soc@0/bus@42080000/display-controller@48010000
[    0.080085] /soc@0/bus@42080000/display-controller@48010000: Fixed dependency cycle(s) with /soc@0/bus@42080000/lvds@48060000
[    0.080628] /soc@0/bus@42080000/lvds@48060000: Fixed dependency cycle(s) with /soc@0/bus@42080000/display-controller@48010000
[    0.086787] /soc@0/bus@42080000/display-controller@48010000: Fixed dependency cycle(s) with /soc@0/bus@42080000/lvds@48060000
[    0.092242] /soc@0/bus@42080000/display-controller@48010000: Fixed dependency cycle(s) with /soc@0/bus@42080000/lvds@48060000
[    0.092354] /soc@0/bus@42080000/lvds@48060000: Fixed dependency cycle(s) with /soc@0/bus@42080000/display-controller@48010000
[    0.105705] /soc@0/bus@42080000/lvds@48060000: Fixed dependency cycle(s) with /panel-lvds
[    0.105844] /panel-lvds: Fixed dependency cycle(s) with /soc@0/bus@42080000/lvds@48060000
[    0.347328] scmi-regulator scmi_dev.5: Regulator vrefbuf registered for domain [9]
[    0.437475] [drm] Initialized simpledrm 1.0.0 20200625 for ba200000.framebuffer on minor 0
[    0.461912] simple-framebuffer ba200000.framebuffer: [drm] fb0: simpledrmdrmfb frame buffer device
[    1.927141] stm32-display-lvds 48060000.lvds: version 0x20 initialized
[    4.157911] [drm] Initialized stm 1.0.0 20170330 for 48010000.display-controller on minor 0
[    4.263738] stm32-display 48010000.display-controller: [drm] fb0: stmdrmfb frame buffer device
[    5.769397] systemd[1]: Starting Load Kernel Module drm...
root@ccmp25-dvk:/usr/share/qt5everywheredemo-1.0# echo 0 > /sys/class/graphics/fb0/blank
root@ccmp25-dvk:/usr/share/qt5everywheredemo-1.0# cat /sys/kernel/debug/dri/0/state
plane[34]: plane-0
        crtc=crtc-0
        fb=58
                allocated by = QSGRenderThread
                refcount=2
                format=XR24 little-endian (0x34325258)
                modifier=0x0
                size=1280x800
                layers:
                        size[0]=1280x800
                        pitch[0]=5120
                        offset[0]=0
                        obj[0]:
                                name=0
                                refcount=2
                                start=001009c4
                                size=4096000
                                imported=yes
                                dma_addr=0x00000000bb039000
                                vaddr=0000000000000000
        crtc-pos=1280x800+0+0
        src-pos=1280.000000x800.000000+0.000000+0.000000
        rotation=1
        normalized-zpos=0
        color-encoding=ITU-R BT.601 YCbCr
        color-range=YCbCr limited range
        user_updates=25fps
plane[42]: plane-1
        crtc=(null)
        fb=0
        crtc-pos=0x0+0+0
        src-pos=0.000000x0.000000+0.000000+0.000000
        rotation=1
        normalized-zpos=1
        color-encoding=ITU-R BT.601 YCbCr
        color-range=YCbCr limited range
        user_updates=0fps
plane[49]: plane-2
        crtc=(null)
        fb=0
        crtc-pos=0x0+0+0
        src-pos=0.000000x0.000000+0.000000+0.000000
        rotation=1
        normalized-zpos=2
        color-encoding=ITU-R BT.601 YCbCr
        color-range=YCbCr limited range
        user_updates=0fps
crtc[41]: crtc-0
        enable=1
        active=1
        self_refresh_active=0
        planes_changed=1
        mode_changed=0
        active_changed=0
        connectors_changed=0
        color_mgmt_changed=0
        plane_mask=1
        connector_mask=1
        encoder_mask=1
        mode: "1280x800": 46 54000 1280 1362 1364 1448 800 808 810 816 0x48 0x0
        transfer_error=0
        fifo_underrun_error=0
        fifo_underrun_warning=0
        fifo_underrun_rotation=0
        fifo_underrun_threshold=128
connector[32]: LVDS-1
        crtc=crtc-0
        self_refresh_aware=0
        max_requested_bpc=0
        colorspace=Default
------------------------------------------------------
1. 检查显示设备状态
# 检查帧缓冲设备
root@ccmp25-dvk:~# ls /dev/fb*
/dev/fb   /dev/fb0
# 检查DRM设备
root@ccmp25-dvk:~# ls /dev/dri/
by-path  card0
# 检查显示相关的sysfs节点
root@ccmp25-dvk:~# ls /sys/class/graphics/
fb0    fbcon
root@ccmp25-dvk:~# ls /sys/class/drm/
card0         card0-LVDS-1  version

2. 检查显示驱动加载状态
# 检查所有显示相关驱动
root@ccmp25-dvk:~# dmesg | grep -E "(drm|fb|ltdc|lvds|panel|display)"
[    0.000000] OF: reserved mem: 0x0000000081300000..0x0000000081fbffff (13056 KiB) nomap non-reusable spare1@81300000
[    0.000000] OF: reserved mem: 0x00000000be800000..0x00000000beffffff (8192 KiB) nomap non-reusable ltdc-sec-layer@be800000
[    0.000000] OF: reserved mem: 0x00000000bf000000..0x00000000bfffffff (16384 KiB) nomap non-reusable ltdc-sec-rotation@bf000000
[    0.000000] NUMA: NODE_DATA [mem 0xb9fbcac0-0xb9fbefff]
[    0.000000] Kernel command line: console=ttySTM0,115200 fbcon=logo-pos:center fbcon=logo-count:1 root=PARTUUID=3fcf7bf1-b6fe-419d-9a14-f87950727bc0 rootwait rw
[    0.077296] /soc@0/bus@42080000/display-controller@48010000: Fixed dependency cycle(s) with /soc@0/bus@42080000/lvds@48060000
[    0.077895] /soc@0/bus@42080000/lvds@48060000: Fixed dependency cycle(s) with /soc@0/bus@42080000/display-controller@48010000
[    0.080122] /soc@0/bus@42080000/display-controller@48010000: Fixed dependency cycle(s) with /soc@0/bus@42080000/lvds@48060000
[    0.080665] /soc@0/bus@42080000/lvds@48060000: Fixed dependency cycle(s) with /soc@0/bus@42080000/display-controller@48010000
[    0.086824] /soc@0/bus@42080000/display-controller@48010000: Fixed dependency cycle(s) with /soc@0/bus@42080000/lvds@48060000
[    0.092271] /soc@0/bus@42080000/display-controller@48010000: Fixed dependency cycle(s) with /soc@0/bus@42080000/lvds@48060000
[    0.092381] /soc@0/bus@42080000/lvds@48060000: Fixed dependency cycle(s) with /soc@0/bus@42080000/display-controller@48010000
[    0.105738] /soc@0/bus@42080000/lvds@48060000: Fixed dependency cycle(s) with /panel-lvds
[    0.105879] /panel-lvds: Fixed dependency cycle(s) with /soc@0/bus@42080000/lvds@48060000
[    0.348780] scmi-regulator scmi_dev.5: Regulator vrefbuf registered for domain [9]
[    0.438990] [drm] Initialized simpledrm 1.0.0 20200625 for ba200000.framebuffer on minor 0
[    0.464269] simple-framebuffer ba200000.framebuffer: [drm] fb0: simpledrmdrmfb frame buffer device
[    1.931131] stm32-display-lvds 48060000.lvds: version 0x20 initialized
[    4.159652] [drm] Initialized stm 1.0.0 20170330 for 48010000.display-controller on minor 0
[    4.200883] stm32-display 48010000.display-controller: Runtime PM usage count underflow!
[    4.269047] stm32-display 48010000.display-controller: [drm] fb0: stmdrmfb frame buffer device
[    5.776716] systemd[1]: Starting Load Kernel Module drm...
[    6.309467] systemd[1]: modprobe@drm.service: Deactivated successfully.
[    6.310460] systemd[1]: Finished Load Kernel Module drm.

#仅查看panel面板驱动是否加载
root@ccmp25-dvk:~# dmesg |grep panel                            
[    0.105738] /soc@0/bus@42080000/lvds@48060000: Fixed dependency cycle(s) with /panel-lvds
[    0.105879] /panel-lvds: Fixed dependency cycle(s) with /soc@0/bus@42080000/lvds@48060000
#查看背光亮度实际值，不论有无程序
root@ccmp25-dvk:~# cat /sys/class/backlight/panel-lvds-pwm-backlight/actual_brightness  
8
# 检查具体的设备状态
cat /sys/kernel/debug/dri/0/state 2>/dev/null || echo "DRM debug not available"
有输出即可
# 检查设备树节点状态
find /sys/firmware/devicetree/base -name "*ltdc*" -o -name "*lvds*" -o -name "*panel*" | xargs ls -la

3. 检查显示流水线连接

# 检查显示控制器状态
cat /sys/class/graphics/fb0/name 2>/dev/null || echo "No framebuffer"
```