# wl命令简介

wl 是一个常见的工具，用于配置Broadcom或Infineon等WiFi芯片的无线网络参数。

使用前，请确定已正确加载 WiFi 模块的驱动程序（如brcmfmac），并且 wl 工具已正确安装并与模块通信。
```
lsmod | grep brcm
wl ver
```

## 查看当前的国家区域配置和信道

```
wl country
wl channels
```
这会返回当前的区域代码（country code）及其对应的国家/地区。如US (US/0)

