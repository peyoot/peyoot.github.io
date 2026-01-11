# cs-gpios 极性反转问题
SPI片选的驱动有两种写法，cs-gpios和nss native, 但是Linux 内核主线在高版本有一个变更，通过 cs-gpios 分配的 GPIO 作为 CS）会被 gpiolib（GPIO 子系统）自动反转极性，这会导致CS被永久拉低。有些芯片如触屏AD采样TS2046，在通信时会关闭检测，被“锁定”在 SPI 通信模式，无法进入 power-down 状态（PD=00），从而 PENIRQ 的检测电路失效（Y- 不接 GND，按下屏无电流路径，无法拉低 PENIRQ）。

STM32的spi设备树绑定见：
https://github.com/digi-embedded/linux/blob/v6.6/stm/dey-5.0/maint/Documentation/devicetree/bindings/spi/spi-controller.yaml
和
https://github.com/digi-embedded/linux/blob/v6.6/stm/dey-5.0/maint/Documentation/devicetree/bindings/spi/st%2Cstm32-spi.yaml

注意官方的原始定义中：
```
	spi3_pins_a: spi3-0 {
		pins1 {
			pinmux = <STM32_PINMUX('B', 7, AF1)>, /* SPI3_SCK */
				 <STM32_PINMUX('B', 8, AF1)>; /* SPI3_MOSI Master output slave Input*/
			drive-push-pull;
			bias-disable;
			slew-rate = <1>;
		};
		pins2 {
			pinmux = <STM32_PINMUX('B', 10, AF1)>; /* SPI3_MISO */
			bias-disable;
		};
	};
```
MOSI处理器需要drive-push-pull，并定义slew-rate，而输入则不需要。因为​配置为推挽输出，使引脚在主动驱动时（无论是高电平还是低电平）都具有低阻抗和强驱动能力，确保信号边沿陡峭，适用于SCK、MOSI等主机输出信号。

几个问题：
1、Pinctrl配置
MISO被smartIOMX也配置成推挽输出，包括片选信号也放在MISO一组，这应该是错误的。需报告修正。

另外，片选信号可以是drive-push-pull，也可以不定义。原始cs-gpio是不定义的，因为原理图中有10K上拉，但原理图中把SCLK给下拉了，这适合从设备工作在CPOL=0的模式。

2、极性反转问题处理办法：
不可使用平台自带的NSS片选，这更容易出问题，原因是ST平台这个不稳定，参考：https://efton.sk/STM32/gotcha/g21.html 。
解决办法是把极性反转过来，只要原来是低电平使能的片选，在slave节点内配置一下“spi-cs-high; ”,这样就可以了