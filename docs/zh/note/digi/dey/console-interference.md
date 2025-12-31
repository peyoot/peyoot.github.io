# Console引脚浮空串扰问题
使用Digi ConnectCore SOM设计板卡，有时会出现如果没连接console口，会很容易停在uboot界面而无法进入系统，这通常是因为console口引脚浮空引发的串扰。
本文以CCMP2为例来解释这个问题，其它平台如有类似问题，也可以参考。

## uboot中console口的定义
CCMP25使用的是USART2作为console口，在[uboot板级设备树](https://github.com/digi-embedded/u-boot/blob/v2023.10/maint/arch/arm/dts/ccmp25-dvk.dts)中它是这样定义的：
```
/* Console A35 */
&usart2 {
	pinctrl-names = "default", "idle", "sleep";
	pinctrl-0 = <&usart2_pins_a>;
	pinctrl-1 = <&usart2_idle_pins_a>;
	pinctrl-2 = <&usart2_sleep_pins_a>;
	/delete-property/dmas;
	/delete-property/dma-names;
	status = "okay";
};

```
其中usart2_pins_a，我们可以换成自己的定义
```
/* 覆盖或新定义usart2_pins_a，添加pull-up */
    usart2_pins_a: usart2-0 {
        pins1 {  /* TX引脚，不加pull-up */
            pinmux = <STM32_PINMUX('G', 0, AF6)>;  /* 示例: USART2_TX on PG0, AF6 - 确认你的引脚 */
            bias-disable;  /* 默认无bias */
            drive-push-pull;
            slew-rate = <0>;
        };
        pins2 {  /* RX引脚，加pull-up */
            pinmux = <STM32_PINMUX('G', 1, AF6)>;  /* 示例: USART2_RX on PG1, AF6 - 确认你的引脚 */
            bias-pull-up;  /* 启用内部pull-up */
            slew-rate = <0>;
        };
    };

    /* 如果有idle/sleep状态，也类似覆盖 */
    usart2_idle_pins_a: usart2-idle-0 {
        /* 类似pins1/pins2配置，添加bias-pull-up到RX */
    };

    usart2_sleep_pins_a: usart2-sleep-0 {
        /* 类似配置 */
    };
```