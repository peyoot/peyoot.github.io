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

TI的TSC2046，用内部基准电压源有很多办法，至少打开keep-vref-on和vref-mv设置为2500是可以的。 但SPI通信碰上cs-gpios片选极性反转问题，需要相反配置在反转回来。

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

# 方法三

按下触摸屏时，主机发出的 24 位帧（8 位命令 + 16 位数据）应类似：
MOSI: 0x90 0x00 0x00   // 读 X
MISO: 0xXX 0xXX 0xXX   // 高 12 位有效
若 MISO 全 0x00 或 0xFF → 基准/供电/连线问题；
若 12 位值在 300–3500 区间 → ADC 正常，跳第 3 步。
3. 检查驱动 “无效采样” 过滤
ads7846 驱动在 ads7846_read12_ser() 里会连续丢包的条件：
X=0 或 Y=0
pressure=0（Z1=0 或 Z2=0）
X/Y > max（被你设为 3550/4050）
只要任一条件为真，就会 continue 掉，evtest 看不到事件。

快速验证
echo 8 > /proc/sys/kernel/printk   # 打开 debug
echo 1 > /sys/module/ads7846/parameters/debug    # 如果编译了 CONFIG_TOUCHSCREEN_ADS7846_DEBUG


再按屏，dmesg 会打出：
ads7846: X=0 Y=0 Z1=0 Z2=0  <--- 被丢
或者
ads7846: X=3899 (>x_max) dropped
出现 全 0 → 回第 1/2 步，基准或采样时序 不对；
出现 >max → 把 ti,x-max/y-max 再放大 20 %；
Z1=0 → 把 ti,pressure-min 改成 0 先关掉压力过滤：



****
进一步确认：用 ls /sys/class/spi_master/spi0/statistics，触摸时看 bytes/messages/transfers 计数是否增（表示 SPI 事务发生）。如果不增，可能是 CS 或时钟问题。

# 清屏前
cd /sys/class/spi_master/spi0/statistics
cat messages timedout errors
# 输出：messages: 12  timedout: 0  errors: 0

# 手指按住屏 5 秒
sleep 5; cat messages timedout errors
# 输出：messages: 112  timedout: 0  errors: 0   <-- messages 涨 100，正常
# 输出：messages: 12   timedout: 0  errors: 0   <-- 不涨 → PENIRQ 中断根本没来
# 输出：messages: 112  timedout: 15 errors: 0   <-- timedout 涨 → SPI 硬件超时

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