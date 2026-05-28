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

