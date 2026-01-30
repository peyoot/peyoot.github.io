# vienaPLC设备接口同DVK区别

#### HDMI接口相关 
1、DSI_RST 原开发板用pd7， vienaPLC用SPI3_MOSI，即PB8， 对应驱动要调整，但刚好板子只用MIPI转的信号，不需要MIPI DSI接口，所以不用改


## TSC2046驱动调优日志

1、确定了vref-mv才是内外参考源的控制参数
2、确定了keep-vrefon会出轮询数据 ，只用中断数据比较难出
3、有无滤波电容对参数影响巨大
4、SPI可用，模式极性是对的，所以片选也不用翻转，01r


### 寄到上海的产品初测：
![alt text](1dc0e7c9-0ee2-46f5-b35f-669b845a417e.png)

X面板电阻：1，3引脚： 695
Y面板电阻：2, 4引脚： 235

触碰范围尺寸，即X，Y电极包裹的内尺寸为：225.32 X 127.88 mm
LVDS液晶屏尺寸: 222.72 x 125.28

考虑添加：
```
    /* 关键校准属性 */
    touchscreen-size-x = <1024>; // 映射到显示屏的水平像素数
    touchscreen-size-y = <600>;  // 映射到显示屏的垂直像素数

    /* 可选但建议：声明触摸屏的物理尺寸，有助于系统进行更精确的校准 */
    touchscreen-physical-width = <22532>; // 单位通常是0.01mm，即225.32mm
    touchscreen-physical-height = <12788>; // 127.88mm
```




