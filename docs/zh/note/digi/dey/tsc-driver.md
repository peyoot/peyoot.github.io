# 触控屏驱动调校
Linux下开发驱动程序，实际是是开发对应驱动的设备树片段。它主要是根据对应驱动芯片和设备的文档来进行调校。
本章以兼容TI ADS7846驱动的ET2046芯片和一款四线电阻屏为例来讲解。
首先，我们需要知道触控芯片对应的参数，这需要访问https://github.com/digi-embedded/linux/blob/v6.6/stm/dey-5.0/maint/Documentation/devicetree/bindings/input/touchscreen/ads7846.txt

从工程图上可以看到一些参数，比如：

面板电阻（ti,x-plate-ohms）：指导电层本体电阻，即上/下电极ITO薄膜的电阻值。工程图上标注"上电极400Ω"和"下电极400Ω"就是面板电阻。回路电阻指从触摸芯片引脚完整回路的总电阻，包含面板电阻+走线电阻+接触电阻等，所以范围更大（如X:400~1200Ω）。
```
ti,x-plate-ohms = <400>;   /* 用面板电阻400Ω，不是回路电阻范围 */
```
ti,x-min/max和ti,y-min/max 这些是实际触摸测试边缘的ADC值，x对应左右边缘，y对应上下边缘。
# 实测方法
```
# 方法1：使用evtest查看原始值
evtest /dev/input/eventX  # 触摸四个角落，记录min/max值

# 方法2：使用tslib校准
ts_calibrate  # 生成校准文件pointercal

# 方法3：查看驱动调试信息
dmesg | grep ads7846  # 部分驱动会输出实测范围
```
# SPI模式确认
根据spec第8页，DCLK和DIN的时序图，这是在时钟上升沿采样，下降沿切换，
因此显示SPI中要显式定义：
```
        spi-max-frequency = <2000000>;
        spi-cpol = <0>;
        spi-cpha = <0>;
```
# 电阻屏校准
```

# 安装tslib工具进行校准
ts_calibrate
# 查看生成的pointercal文件获取min/max值

# 系统首次启动时自动执行（通过systemd服务）
/usr/bin/ts_calibrate

# 生成的校准文件（存于可写文件系统）
cat /etc/pointercal
-1234 1.002 -0.034 5678 0.998 12.34 65536

# 启动脚本自动加载校准
export TSLIB_CALIBFILE=/etc/pointercal
export TSLIB_TSDEVICE=/dev/input/event0
```
用服务来处理
```
# 在buildroot/rootfs中添加校准服务
/etc/systemd/system/touchscreen-calibrate.service:
[Unit]
Description=Touchscreen Calibration
ConditionFirstBoot=yes  # 仅首次启动运行

[Service]
Type=oneshot
ExecStart=/usr/bin/ts_calibrate
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
```
并在udev规则中自动应用校准
```
# /etc/udev/rules.d/99-touchscreen.rules
SUBSYSTEM=="input", KERNEL=="event[0-9]*", ENV{ID_INPUT_TOUCHSCREEN}=="1", \
  RUN+="/usr/bin/tslib-setup.sh"
```