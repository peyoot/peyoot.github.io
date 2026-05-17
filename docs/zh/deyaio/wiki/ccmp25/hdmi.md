# ConnectCore MP25的HDMI接口
MP25 开发套件（DVK）的 HDMI 输出通过 MIPI DSI 接口 + Lontium LT8912B MIPI-to-HDMI 桥接芯片 实现，连接到标准 HDMI 连接器 J32。模块本身只有 MIPI DSI（无原生 HDMI），LT8912B 负责转换。
LT8912B 支持 HDMI Hot Plug Detection（HPD），但不支持 DDC/EDID 和 HDCP（这在驱动/设备树中已处理）。

## 接口电路分析
```
Pin 20 (HOTPLUG_DET_OUT) → HDMI Pin 19，带 10k 阻容下拉保护
Pin 19 (HOTPLUG_DET_IN) → 处理器/LT8912B HPD 输入，是通过NTS0102GT电平转换为HDMI_HPD_3V3连接处理器
```
注意，HDMI_HPD_1V8在开发套件上并没有连接到LT8912B，而是通过NTS0102GT电平转换为HDMI_HPD_3V3连接到处理器。这是常规做法，用GPIO来检测HPD是否接入。而用LT8912B则是通过I2C2和处理器通信，如果连接到LT8912B桥接芯片，则也可以通过它来获取HPD状态。此外，TPD12S521也是通过I2C2和处理器通信。

部分客户的板卡，用的是I2C3。

## Linux下HPD作用
在Linux下，通过
```
root@ccmp25-dvk:~# gpioinfo gpiochip3
gpiochip3 - 16 lines:
        line   0:        "PD0"       kernel   input  active-high [used]
        line   1:        "PD1"       kernel   input  active-high [used]
        line   2:        "PD2"        "hpd"   input  active-high [used]

```
标签为 "hpd"，[used]显示已被内核占用。这意味着：
DRM/KMS 显示子系统已经占用了这个 GPIO，无法通过 gpioget 直接读取（可能会报错 "Device or resource busy"），需要通过DRM接口来检测连接状态。

检测方法：
```
 cat /sys/class/drm/card0-HDMI-A-1/status
 或
 modetest -M stm 2>/dev/null | grep -i "connected\|hdmi"
 默认设备树有加载时，都是connected状态，插拨没影响

```
如果是监听热插拨事件，要用udevadm monitor命令，但它也不能判断是插入还是拨除，
<summary>完整udev命令和动作响应</summary>
<details>
```
# 监听显示连接器变化
udevadm monitor --property --subsystem-match=drm
如：
root@ccmp25-dvk:~# udevadm monitor --property --subsystem-match=drm
monitor will print the received events for:
UDEV - the event which udev sends out after rule processing
KERNEL - the kernel uevent

拨除时：

KERNEL[809.106604] change   /devices/platform/soc@0/42080000.bus/48010000.display-controller/drm/card0 (drm)
ACTION=change
DEVPATH=/devices/platform/soc@0/42080000.bus/48010000.display-controller/drm/card0
SUBSYSTEM=drm
HOTPLUG=1
CONNECTOR=32
DEVNAME=/dev/dri/card0
DEVTYPE=drm_minor
SEQNUM=3365
MAJOR=226
MINOR=0

UDEV  [809.157771] change   /devices/platform/soc@0/42080000.bus/48010000.display-controller/drm/card0 (drm)
ACTION=change
DEVPATH=/devices/platform/soc@0/42080000.bus/48010000.display-controller/drm/card0
SUBSYSTEM=drm
HOTPLUG=1
CONNECTOR=32
DEVNAME=/dev/dri/card0
DEVTYPE=drm_minor
SEQNUM=3365
USEC_INITIALIZED=9908488
ID_PATH=platform-48010000.display-controller
ID_PATH_TAG=platform-48010000_display-controller
ID_FOR_SEAT=drm-platform-48010000_display-controller
MAJOR=226
MINOR=0
DEVLINKS=/dev/dri/by-path/platform-48010000.display-controller-card
TAGS=:uaccess:master-of-seat:seat:
CURRENT_TAGS=:uaccess:master-of-seat:seat:

KERNEL[809.460080] change   /devices/platform/soc@0/42080000.bus/48010000.display-controller/drm/card0 (drm)
ACTION=change
DEVPATH=/devices/platform/soc@0/42080000.bus/48010000.display-controller/drm/card0
SUBSYSTEM=drm
HOTPLUG=1
CONNECTOR=32
DEVNAME=/dev/dri/card0
DEVTYPE=drm_minor
SEQNUM=3366
MAJOR=226
MINOR=0

UDEV  [809.516180] change   /devices/platform/soc@0/42080000.bus/48010000.display-controller/drm/card0 (drm)
ACTION=change
DEVPATH=/devices/platform/soc@0/42080000.bus/48010000.display-controller/drm/card0
SUBSYSTEM=drm
HOTPLUG=1
CONNECTOR=32
DEVNAME=/dev/dri/card0
DEVTYPE=drm_minor
SEQNUM=3366
USEC_INITIALIZED=9908488
ID_PATH=platform-48010000.display-controller
ID_PATH_TAG=platform-48010000_display-controller
ID_FOR_SEAT=drm-platform-48010000_display-controller
MAJOR=226
MINOR=0
DEVLINKS=/dev/dri/by-path/platform-48010000.display-controller-card
TAGS=:uaccess:master-of-seat:seat:
CURRENT_TAGS=:uaccess:master-of-seat:seat:

插入时：
KERNEL[987.351852] change   /devices/platform/soc@0/42080000.bus/48010000.display-controller/drm/card0 (drm)
ACTION=change
DEVPATH=/devices/platform/soc@0/42080000.bus/48010000.display-controller/drm/card0
SUBSYSTEM=drm
HOTPLUG=1
CONNECTOR=32
DEVNAME=/dev/dri/card0
DEVTYPE=drm_minor
SEQNUM=3367
MAJOR=226
MINOR=0

UDEV  [987.402941] change   /devices/platform/soc@0/42080000.bus/48010000.display-controller/drm/card0 (drm)
ACTION=change
DEVPATH=/devices/platform/soc@0/42080000.bus/48010000.display-controller/drm/card0
SUBSYSTEM=drm
HOTPLUG=1
CONNECTOR=32
DEVNAME=/dev/dri/card0
DEVTYPE=drm_minor
SEQNUM=3367
USEC_INITIALIZED=9908488
ID_PATH=platform-48010000.display-controller
ID_PATH_TAG=platform-48010000_display-controller
ID_FOR_SEAT=drm-platform-48010000_display-controller
MAJOR=226
MINOR=0
DEVLINKS=/dev/dri/by-path/platform-48010000.display-controller-card
TAGS=:uaccess:master-of-seat:seat:
CURRENT_TAGS=:uaccess:master-of-seat:seat:

KERNEL[987.701682] change   /devices/platform/soc@0/42080000.bus/48010000.display-controller/drm/card0 (drm)
ACTION=change
DEVPATH=/devices/platform/soc@0/42080000.bus/48010000.display-controller/drm/card0
SUBSYSTEM=drm
HOTPLUG=1
CONNECTOR=32
DEVNAME=/dev/dri/card0
DEVTYPE=drm_minor
SEQNUM=3368
MAJOR=226
MINOR=0

UDEV  [987.742144] change   /devices/platform/soc@0/42080000.bus/48010000.display-controller/drm/card0 (drm)
ACTION=change
DEVPATH=/devices/platform/soc@0/42080000.bus/48010000.display-controller/drm/card0
SUBSYSTEM=drm
HOTPLUG=1
CONNECTOR=32
DEVNAME=/dev/dri/card0
DEVTYPE=drm_minor
SEQNUM=3368
USEC_INITIALIZED=9908488
ID_PATH=platform-48010000.display-controller
ID_PATH_TAG=platform-48010000_display-controller
ID_FOR_SEAT=drm-platform-48010000_display-controller
MAJOR=226
MINOR=0
DEVLINKS=/dev/dri/by-path/platform-48010000.display-controller-card
TAGS=:uaccess:master-of-seat:seat:
CURRENT_TAGS=:uaccess:master-of-seat:seat:
```
</details>
为了判断是什么事件，可以用EDID。
HDMI 接口的 DDC（Display Data Channel） 通道是标准的 I2C 总线，其地址分配由 VESA 和 HDMI 规范 定义，其中0x50 是 EDID 的标准地址，所有 HDMI 显示器都必须响应这个地址。

具体来说，链路是这样的：
```
I2C-1 (STM32 I2C2 控制器)
    ├── LT8912B (0x48 或 0x4A)  ← 配置 MIPI→HDMI 转换
    └── HDMI DDC 通道
            └── 显示器 EDID (0x50)  ← 通过 TPD12S521 的 DDC 通道
```
通过I2C扫描可判断
```
没插HDMI显示器时
root@ccmp25-dvk:~# i2cdetect -y 1
     0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f
00:          -- -- -- -- -- -- -- -- -- -- -- -- --
10: UU -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
20: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
30: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
40: -- -- -- -- -- -- -- -- UU UU 4a 4b -- -- -- --
50: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
60: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
70: -- -- -- -- -- -- -- --

插入HDMI后，是这样：
root@ccmp25-dvk:~# i2cdetect -y 1
     0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f
00:          -- -- -- -- -- -- -- -- -- -- -- -- --
10: UU -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
20: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
30: -- -- -- -- -- -- -- -- -- -- 3a -- -- -- -- --
40: -- -- -- -- -- -- -- -- UU UU 4a 4b -- -- -- --
50: 50 -- -- -- 54 -- -- -- -- -- -- -- -- -- -- --
60: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
70: -- -- -- -- -- -- -- --
```
其中，

| 地址         | 未插显示器   | 插入显示器   | 说明                    |
| ---------- | ------- | ------- | --------------------- |
| **0x50**   | `--`    | `50`    | **EDID 主地址，检测显示器的关键** |
| **0x54**   | `--`    | `54`    | EDID 段地址/扩展           |
| **0x3A**   | `--`    | `3A`    | 可能是显示器 CEC 或其他功能      |
| 0x4A, 0x4B | `4a 4b` | `4a 4b` | LT8912B（始终存在）         |

因此，用一行命令读0x50第一字节，即可检测HDMI是否连接，采用“命令A && 命令B”的方法，&&逻辑与（前命令成功时执行）和“命令A || 命令B” 方法，||逻辑或（前命令失败时执行）
```
root@ccmp25-dvk:~# i2cget -y 1 0x50 0x00 >/dev/null 2>&1 && echo "connected" || echo "disconnected"
connected
root@ccmp25-dvk:~# i2cget -y 1 0x50 0x00 >/dev/null 2>&1 && echo "connected" || echo "disconnected"
disconnected
root@ccmp25-dvk:~#
或用
i2cget -y 1 0x50 0x00 >/dev/null 2>&1
echo $?   # 显示上一个命令的退出码
插入显示器时输出 0
未插入时输出 1
```
总结一下，linux内可以用：
```
i2cget -y 1 0x50 0x00 >/dev/null 2>&1
HPD_STATUS=$?

if [ $HPD_STATUS -eq 0 ]; then
    echo "connected"
    # 这里可以添加连接后的操作
else
    echo "disconnected"
    # 这里可以添加断开后的操作
fi

```
