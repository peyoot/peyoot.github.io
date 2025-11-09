# USB设备树片段
原始的USB接口定义在STM32MP251.dtsi中，包括：

```
/{
	usb2_phy1: usb2-phy1 {
		compatible      = "st,stm32mp25-usb2phy";
		#phy-cells      = <0>;
		#clock-cells    = <0>;
		st,syscfg       = <&syscfg 0x2400>;
		clocks          = <&rcc CK_KER_USB2PHY1>;
		resets          = <&rcc USB2PHY1_R>;
		status          = "disabled";
	};

	usb2_phy2: usb2-phy2 {
		compatible      = "st,stm32mp25-usb2phy";
		#phy-cells      = <0>;
		#clock-cells    = <0>;
		st,syscfg       = <&syscfg 0x2800>;
		clocks          = <&rcc CK_KER_USB2PHY2EN>;
		resets          = <&rcc USB2PHY2_R>;
		status          = "disabled";
	};

	soc@0 {

			combophy: phy@480c0000 {
				compatible = "st,stm32mp25-combophy";
				reg = <0x480c0000 0x1000>;
				#phy-cells = <1>;
				clocks = <&rcc CK_BUS_USB3PCIEPHY>, <&rcc CK_KER_USB3PCIEPHY>;
				clock-names = "apb-clk", "ker-clk";
				resets = <&rcc USB3PCIEPHY_R>;
				reset-names = "phy-rst";
				st,syscfg = <&syscfg>;
				access-controllers = <&rifsc 67>;
				power-domains = <&CLUSTER_PD>;
				wakeup-source;
				interrupts-extended = <&exti1 45 IRQ_TYPE_EDGE_FALLING>;
				status = "disabled";
			};

            
			usbh: usb@482e0000 {
				compatible = "st,stm32mp25-usbh";
				st,syscfg = <&syscfg 0x2420>;
				#address-cells = <1>;
				#size-cells = <1>;
				ranges = <0x482e0000 0x482e0000 0x20000>;
				access-controllers = <&rifsc 63>;
				power-domains = <&CLUSTER_PD>;
				wakeup-source;
				interrupts-extended = <&exti1 43 IRQ_TYPE_EDGE_RISING>;
				status = "disabled";

				usbh_ohci: usb@482e0000 {
					compatible = "generic-ohci";
					reg = <0x482e0000 0x1000>;
					clocks = <&usb2_phy1>, <&rcc CK_BUS_USB2OHCI>;
					resets = <&rcc USB2_R>;
					interrupts = <GIC_SPI 140 IRQ_TYPE_LEVEL_HIGH>;
					phys = <&usb2_phy1>;
					phy-names = "usb";
					wakeup-source;
					status = "disabled";
				};

				usbh_ehci: usb@482f0000 {
					compatible = "generic-ehci";
					reg = <0x482f0000 0x1000>;
					clocks = <&rcc CK_BUS_USB2EHCI>;
					resets = <&rcc USB2_R>;
					interrupts = <GIC_SPI 139 IRQ_TYPE_LEVEL_HIGH>;
					companion = <&usbh_ohci>;
					phys = <&usb2_phy1>;
					phy-names = "usb";
					wakeup-source;
					status = "disabled";
				};
			};

			usb3dr: usb@48300000 {
				compatible = "st,stm32mp25-dwc3";
				st,syscfg = <&syscfg 0x4800>;
				#address-cells = <1>;
				#size-cells = <1>;
				ranges = <0x48300000 0x48300000 0x100000>;
				access-controllers = <&rifsc 66>;
				power-domains = <&CLUSTER_PD>;
				wakeup-source;
				interrupts-extended = <&exti1 44 IRQ_TYPE_EDGE_RISING>;
				status = "disabled";

				dwc3: usb@48300000 {
					compatible = "snps,dwc3";
					reg = <0x48300000 0x100000>;
					interrupts = <GIC_SPI 228 IRQ_TYPE_LEVEL_HIGH>;
					clock-names = "ref", "bus_early", "suspend";
					clocks = <&rcc CK_KER_USB2PHY2>, <&rcc CK_BUS_USB3DR>,
						 <&rcc CK_KER_USB2PHY2>;
					resets = <&rcc USB3DR_R>;
					phys = <&usb2_phy2>;
					phy-names = "usb2-phy";
					wakeup-source;
				};
			};


        
    }

}

```
在板级设备树中关键启用是：
```
&usbh {
	status = "okay";
};

&usbh_ehci {
	status = "okay";
};

&usb3dr {
	status = "okay";

	dwc3: usb@48300000 {
		maximum-speed = "high-speed";
		usb-role-switch;
		role-switch-default-mode = "peripheral";
	};
};
```
在PLC的板子上，usbh_ehci: usb@482f0000 这个用的是usb2_phy1,对应板子上的USB HOST接口，而usb3dr是用usb2_phy2，对应板子上的U21 type C接口。

ST开发板，默认的DTS中明确禁用了OHCI (usbh_ohci: usb@482e0000 { status = "disabled"; };)，但板载了一个USB Hub芯片（compatible="usb424,2514"，如USB2514系列）。这个Hub是高速度Hub，它可以作为中介处理FS/LS设备：即使OHCI禁用，Hub会将FS/LS信号转换为HS信号，再由EHCI处理。 因此，一些像伪ch343的USB转serial低速设备在能被识别（尽管DTS只启用了EHCI）——这是Hub的功劳，而不是直接依赖OHCI。

但单端USB的PLC板卡，对于FS设备如USB转serial，缺少OHCI会导致内核无法正确切换和处理低速信号。因此我们需要启用OHCI。

```
&usbh_ohci {
    status = "okay";
};
```

# USB硬件电路

ST的PLC参考设计板提供了最简的USB电路，但这个电路中的type C只是下载接口，而ST官方用STUSB1600来实现OTG功能，可能是一个正常的设计。

