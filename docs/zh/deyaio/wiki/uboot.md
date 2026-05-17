# U-Boot优化与定制
Connectcore不同型号和DEY版本对应有不同的U-Boot版本，meta-digi/meta-digi-arm/recipes-bsp/u-boot目录下有多个uboot版本的配方文件，配方最后COMPATIBLE_MACHINE定义了该版本适配哪个系列的Connectcore。我们可以在meta-custom/recipes-bsp/u-boot下创建一个对应版本的U-Boot配方的bbappend文件，以便实现定制和优化。

## U-Boot的Logo定制
参考[U-Boot的logo定制](custom_logo.html)

## Console口抗干扰能力加固
以CCMP25为例，默认的U-Boot的console口的板级设备树定义是：
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
而pinctrl定义见arch/arm/dts/ccmp25-dvk-u-boot.dtsi, 其中有
```
&usart2 {
	bootph-all;
};

&usart2_pins_a {
	bootph-all;
	pins1 {
		bootph-all;
	};
	pins2 {
		bootph-all;
	};
};
```
上面未涉及引脚上拉偏置，实际的定义在arch/arm/dts/stm32mp25-pinctrl.dtsi中，
```
	usart2_pins_a: usart2-0 {
		pins1 {
			pinmux = <STM32_PINMUX('A', 4, AF6)>; /* USART2_TX */
			bias-disable;
			drive-push-pull;
			slew-rate = <0>;
		};
		pins2 {
			pinmux = <STM32_PINMUX('A', 8, AF8)>; /* USART2_RX */
			bias-disable;
		};
	};
```
注意上面的RX，默认没有偏置，因此上电时容易收到干扰信号误认为是按下任意键，可以在meta-custom里用自定义的uboot设备树来更改，以peyoot/ccmp25_dt为例，在uboot-dts/ccmp25-dvk.dts中，用下面的方法改：
```
/* Console A35 */
&usart2 {
	pinctrl-names = "default", "idle", "sleep";
	- pinctrl-0 = <&usart2_pins_a>;
	- pinctrl-1 = <&usart2_idle_pins_a>;
	+ pinctrl-0 = <&ccmp25_usart2_pins_a>;
	+ pinctrl-1 = <&ccmp25_usart2_idle_pins_a>;
	pinctrl-2 = <&usart2_sleep_pins_a>;
```
然后加上下面定义，主要是RX，通过上拉防止浮空易受干扰。

```

&pinctrl {
	ccmp25_usart2_pins_a: ccmp25-usart2-0 {
		pins1 {
			pinmux = <STM32_PINMUX('A', 4, AF6)>; /* USART2_TX */
			bias-disable;
			drive-push-pull;
			slew-rate = <0>;
		};
		pins2 {
			pinmux = <STM32_PINMUX('A', 8, AF8)>; /* USART2_RX */
			/* pull-up on rx to avoid floating level */
			bias-pull-up;
		};
	};

	ccmp25_usart2_idle_pins_a: ccmp25-usart2-idle-0 {
		pins1 {
			pinmux = <STM32_PINMUX('A', 4, ANALOG)>; /* USART2_TX */
		};
		pins2 {
			pinmux = <STM32_PINMUX('A', 8, AF8)>; /* USART2_RX */
			/* pull-up on rx to avoid floating level */
			bias-pull-up;
		};
	};


```
