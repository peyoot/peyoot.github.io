# ConnectCore MP25的HDMI接口
MP25 开发套件（DVK）的 HDMI 输出通过 MIPI DSI 接口 + Lontium LT8912B MIPI-to-HDMI 桥接芯片 实现，连接到标准 HDMI 连接器 J32。模块本身只有 MIPI DSI（无原生 HDMI），LT8912B 负责转换。
LT8912B 支持 HDMI Hot Plug Detection（HPD），但不支持 DDC/EDID 和 HDCP（这在驱动/设备树中已处理）。

## 接口电路分析
```
Pin 20 (HOTPLUG_DET_OUT) → HDMI Pin 19，带 10k 阻容下拉保护
Pin 19 (HOTPLUG_DET_IN) → 处理器/LT8912B HPD 输入
```
注意，HDMI_HPD_1V8在开发套件上并没有连接到LT8912B，而是通过NTS0102GT电平转换为HDMI_HPD_3V3连接到处理器。这是常规做法，用GPIO来检测HPD是否接入。而用LT8912B则是通过I2C2和处理器通信，如果连接到LT8912B桥接芯片，则也可以通过它来获取HPD状态。此外，TPD12S521也是通过I2C2和处理器通信。

部分客户的板卡，用的是I2C3。

