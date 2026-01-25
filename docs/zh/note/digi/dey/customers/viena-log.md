# vienaPLC设备接口同DVK区别

#### HDMI接口相关 
1、DSI_RST 原开发板用pd7， vienaPLC用SPI3_MOSI，即PB8， 对应驱动要调整，但刚好板子只用MIPI转的信号，不需要MIPI DSI接口，所以不用改


## TSC2046驱动调优日志

1、确定了vref-mv才是内外参考源的控制参数
2、确定了keep-vrefon会出轮询数据 ，只用中断数据比较难出
3、有无滤波电容对参数影响巨大
4、SPI可用，模式极性是对的，所以片选也不用翻转，01r