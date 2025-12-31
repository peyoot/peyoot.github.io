# 触控屏驱动调校
Linux下开发驱动程序，实际是是开发对应驱动的设备树片段。它主要是根据对应驱动芯片和设备的文档来进行调校。
本章以兼容TI ADS7846驱动的ET2046芯片和一款四线电阻屏为例来讲解。

## 硬件GPIO
触控屏一般会有一个中断GPIO，不同芯片由于这个引脚在内部处理不同而有所区别，比如goodix中它是推挽输出（Push-Pull），驱动可能自动配置bias或在它的方案中有偏置，因此对应这个引脚的GPIO的pinctrl可以不配置。而ET2046中，PENIRQ这个中断引脚是开漏输出（Open-Drain）, 必须外接上拉电阻，而在电路中没有上拉，则在MPU中需要设置对应GPIO上拉偏置。
另外，ET2046内部上拉电阻设计目标是：
未触摸时：PENIRQ = VCC（使能中断检测下降沿）；
触摸时：PENIRQ = 0（触发中断）。
应根据这一逻辑来设计设备树。


## 设备树参数
首先，我们需要知道触控芯片对应的参数，这需要访问https://github.com/digi-embedded/linux/blob/v6.6/stm/dey-5.0/maint/Documentation/devicetree/bindings/input/touchscreen/ads7846.txt

从工程图上可以看到一些参数，比如：

面板电阻（ti,x-plate-ohms）：指导电层本体电阻，即上/下电极ITO薄膜的电阻值。工程图上标注"上电极400Ω"和"下电极400Ω"就是面板电阻。回路电阻指从触摸芯片引脚完整回路的总电阻，包含面板电阻+走线电阻+接触电阻等，所以范围更大（如X:400~1200Ω）。
```
ti,x-plate-ohms = <400>;   /* 用面板电阻400Ω，不是回路电阻范围 */
```
ti,x-min/max和ti,y-min/max 这些是实际触摸测试边缘的ADC值，x对应左右边缘，y对应上下边缘。
## 测试方法
一般上电后，可通过检查spi相关的log，来确定驱动是否生效
```
root@ccmp25-dvk:~# dmesg |grep spi
[    0.000000] OF: reserved mem: 0x0000000060000000..0x000000006fffffff (262144 KiB) nomap non-reusable mm-ospi@60000000
[   10.144457] spi_stm32 400c0000.spi: driver initialized (master mode)
[   10.941720] ads7846 spi0.0: touchscreen, irq 92
[   10.951908] input: ADS7846 Touchscreen as /devices/platform/soc@0/42080000.bus/400c0000.spi/spi_master/spi0/spi0.0/input/input1
root@ccmp25-dvk:~# dmesg |grep touch
[   10.138865] touchscreen@0 enforce active low on GPIO handle
[   10.941720] ads7846 spi0.0: touchscreen, irq 92
```
如果触控没反应，可以用这两个命令检查
```
# 方法1：查看中断是否生效
cat /proc/interrupts | grep ads7846  # 触碰几下，再用这个命令查，会看到中断数增加
或是用这个来实时观察： watch -n 0.5 'cat /proc/interrupts | grep ads7846'

# 方法二：确认事件和触碰数据
cat /proc/bus/input/devices
查看ads7846驱动对应的handler，如果是event1，则用
hexdump -v /dev/input/event1
在屏上触碰，观察是否有数据 
```
## 添加校准


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