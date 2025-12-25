# 基础知识点
MPU内有一个lcdif或LTDC模块，MP25是LTDC。
LTDC是LCD-TFT Display Controller的缩写，这是STM32微控制器中专门用于驱动显示器的硬件模块。
```
CPU → 内存(FrameBuffer) → LTDC硬件 → RGB信号 → 显示器
```
显示的数据流，以LVDS为例：
```
应用程序 → 显示服务器 → Linux帧缓冲 → LTDC控制器 → LVDS转换器 → 液晶面板
    ↑              ↑           ↑           ↑           ↑           ↑
  软件层         系统层       驱动层      硬件层      接口转换    显示设备
```
STM32MP25有LTDC和LVDS两个模块，分别实现RGB信号和LVDS转换。

# 型号分析
Part Number : EN10.1-1024600W-B004  （可能是二道贩子的型号）
标签：HC101IKA0050-A86  这个大概是正式型号， 查得：https://cn.sz-htc.com/products_details/53.html#c_static_001_P_18072-16805774017790


# 是否要I2C控制
由于spec中提到driver IC是HX8282&HX8696，在LVDS屏幕中，这两颗芯片共同构成了屏驱动电路的核心：
1、HX8282是一颗接口转换与定时控制芯片，用于时序控制器 (Timing Controller, T-CON) 或源极驱动，它接收来自主板（通过LVDS接口或eDP接口）传来的图像数据和同步信号，将其转换为屏内部电路能处理的格式（通常是mini-LVDS或RSDS信号），并生成精确的时序，控制“什么时候将哪个像素的数据，送到屏幕的哪个位置”。
栅极驱动芯片 (Gate Driver)：
2、HX8696​是一颗行扫描驱动芯片，根据HX8282（T-CON）发出的指令，一行一行地、顺序地“打开”屏幕上相应行的薄膜晶体管开关。当某一行被“打开”时，该行所有像素的电极就与源极驱动器连接，准备充电到目标灰度电压。

HX8282通常需要I2C进行配置。但是，确实存在一些屏幕在硬件上已经通过电阻等将配置固定，或者芯片内部有默认配置，使得屏幕可以在不使用I2C的情况下工作。如果需要I2C控制，就会引入复杂性，因为默认内核不带有这些驱动，这需要添加内核不存在的选项和驱动。因此，优先考虑免配置的方式，这就要查LCD屏的spec。

#时序之panel-timing

时序：以DCLK为51.2MHz为例，
DE模式时，水平显示1024，水平空扫320，垂直显示600，垂直空扫35。
```
		panel-timing {
			clock-frequency = <51200000>;
			hactive = <1024>;
        	vactive = <600>;
	        hfront-porch = <160>;
    	    hback-porch = <160>;
        	hsync-len = <0>;
	        vfront-porch = <12>;
    	    vback-porch = <23>;
        	vsync-len = <0>;
	        hsync-active = <0>;
    	    vsync-active = <0>;
        	de-active = <1>;
	        pixelclk-active = <1>;
		};
```
HV模式时，水平：行显1024，行扫1344,后留白160,前留白160; 垂直：场行600，场周635，后留行23，前留行12。
和DE一样，只是把de-active改为0 ：
```
		panel-timing {
			clock-frequency = <51200000>;
			hactive = <1024>;
        	vactive = <600>;
	        hfront-porch = <160>;
    	    hback-porch = <160>;
        	hsync-len = <0>;
	        vfront-porch = <12>;
    	    vback-porch = <23>;
        	vsync-len = <0>;
	        hsync-active = <0>;
    	    vsync-active = <0>;
        	de-active = <0>;
	        pixelclk-active = <1>;
		};
```
# 时序之display-timing
有些驱动用这个兼容性好一些
```
		display-timings {
			clock-frequency = <51200000>;
			hactive = <1024>;
        	vactive = <600>;
	        hfront-porch = <160>;
    	    hback-porch = <160>;
        	hsync-len = <0>;
	        vfront-porch = <12>;
    	    vback-porch = <23>;
        	vsync-len = <0>;
	        hsync-active = <0>;
    	    vsync-active = <0>;
        	de-active = <0>;  或1
	        pixelclk-active = <1>;
		};
```
# 移除不必要的配置
// 简化LTDC配置
```
&ltdc {
    status = "okay";
    // 移除rotation-memory，可能引起问题
    // rotation-memory = <&ltdc_sec_rotation>;
```

