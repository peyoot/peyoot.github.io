import{_ as t,o as s,c as e,b as i}from"./app-BrhskwpR.js";const n={},l=i(`<h1 id="usb设备树片段" tabindex="-1"><a class="header-anchor" href="#usb设备树片段"><span>USB设备树片段</span></a></h1><p>原始的USB接口定义在STM32MP251.dtsi中，包括：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>/{
	usb2_phy1: usb2-phy1 {
		compatible      = &quot;st,stm32mp25-usb2phy&quot;;
		#phy-cells      = &lt;0&gt;;
		#clock-cells    = &lt;0&gt;;
		st,syscfg       = &lt;&amp;syscfg 0x2400&gt;;
		clocks          = &lt;&amp;rcc CK_KER_USB2PHY1&gt;;
		resets          = &lt;&amp;rcc USB2PHY1_R&gt;;
		status          = &quot;disabled&quot;;
	};

	usb2_phy2: usb2-phy2 {
		compatible      = &quot;st,stm32mp25-usb2phy&quot;;
		#phy-cells      = &lt;0&gt;;
		#clock-cells    = &lt;0&gt;;
		st,syscfg       = &lt;&amp;syscfg 0x2800&gt;;
		clocks          = &lt;&amp;rcc CK_KER_USB2PHY2EN&gt;;
		resets          = &lt;&amp;rcc USB2PHY2_R&gt;;
		status          = &quot;disabled&quot;;
	};

	soc@0 {

			combophy: phy@480c0000 {
				compatible = &quot;st,stm32mp25-combophy&quot;;
				reg = &lt;0x480c0000 0x1000&gt;;
				#phy-cells = &lt;1&gt;;
				clocks = &lt;&amp;rcc CK_BUS_USB3PCIEPHY&gt;, &lt;&amp;rcc CK_KER_USB3PCIEPHY&gt;;
				clock-names = &quot;apb-clk&quot;, &quot;ker-clk&quot;;
				resets = &lt;&amp;rcc USB3PCIEPHY_R&gt;;
				reset-names = &quot;phy-rst&quot;;
				st,syscfg = &lt;&amp;syscfg&gt;;
				access-controllers = &lt;&amp;rifsc 67&gt;;
				power-domains = &lt;&amp;CLUSTER_PD&gt;;
				wakeup-source;
				interrupts-extended = &lt;&amp;exti1 45 IRQ_TYPE_EDGE_FALLING&gt;;
				status = &quot;disabled&quot;;
			};

            
			usbh: usb@482e0000 {
				compatible = &quot;st,stm32mp25-usbh&quot;;
				st,syscfg = &lt;&amp;syscfg 0x2420&gt;;
				#address-cells = &lt;1&gt;;
				#size-cells = &lt;1&gt;;
				ranges = &lt;0x482e0000 0x482e0000 0x20000&gt;;
				access-controllers = &lt;&amp;rifsc 63&gt;;
				power-domains = &lt;&amp;CLUSTER_PD&gt;;
				wakeup-source;
				interrupts-extended = &lt;&amp;exti1 43 IRQ_TYPE_EDGE_RISING&gt;;
				status = &quot;disabled&quot;;

				usbh_ohci: usb@482e0000 {
					compatible = &quot;generic-ohci&quot;;
					reg = &lt;0x482e0000 0x1000&gt;;
					clocks = &lt;&amp;usb2_phy1&gt;, &lt;&amp;rcc CK_BUS_USB2OHCI&gt;;
					resets = &lt;&amp;rcc USB2_R&gt;;
					interrupts = &lt;GIC_SPI 140 IRQ_TYPE_LEVEL_HIGH&gt;;
					phys = &lt;&amp;usb2_phy1&gt;;
					phy-names = &quot;usb&quot;;
					wakeup-source;
					status = &quot;disabled&quot;;
				};

				usbh_ehci: usb@482f0000 {
					compatible = &quot;generic-ehci&quot;;
					reg = &lt;0x482f0000 0x1000&gt;;
					clocks = &lt;&amp;rcc CK_BUS_USB2EHCI&gt;;
					resets = &lt;&amp;rcc USB2_R&gt;;
					interrupts = &lt;GIC_SPI 139 IRQ_TYPE_LEVEL_HIGH&gt;;
					companion = &lt;&amp;usbh_ohci&gt;;
					phys = &lt;&amp;usb2_phy1&gt;;
					phy-names = &quot;usb&quot;;
					wakeup-source;
					status = &quot;disabled&quot;;
				};
			};

			usb3dr: usb@48300000 {
				compatible = &quot;st,stm32mp25-dwc3&quot;;
				st,syscfg = &lt;&amp;syscfg 0x4800&gt;;
				#address-cells = &lt;1&gt;;
				#size-cells = &lt;1&gt;;
				ranges = &lt;0x48300000 0x48300000 0x100000&gt;;
				access-controllers = &lt;&amp;rifsc 66&gt;;
				power-domains = &lt;&amp;CLUSTER_PD&gt;;
				wakeup-source;
				interrupts-extended = &lt;&amp;exti1 44 IRQ_TYPE_EDGE_RISING&gt;;
				status = &quot;disabled&quot;;

				dwc3: usb@48300000 {
					compatible = &quot;snps,dwc3&quot;;
					reg = &lt;0x48300000 0x100000&gt;;
					interrupts = &lt;GIC_SPI 228 IRQ_TYPE_LEVEL_HIGH&gt;;
					clock-names = &quot;ref&quot;, &quot;bus_early&quot;, &quot;suspend&quot;;
					clocks = &lt;&amp;rcc CK_KER_USB2PHY2&gt;, &lt;&amp;rcc CK_BUS_USB3DR&gt;,
						 &lt;&amp;rcc CK_KER_USB2PHY2&gt;;
					resets = &lt;&amp;rcc USB3DR_R&gt;;
					phys = &lt;&amp;usb2_phy2&gt;;
					phy-names = &quot;usb2-phy&quot;;
					wakeup-source;
				};
			};


        
    }

}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在板级设备树中关键启用是：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>&amp;usbh {
	status = &quot;okay&quot;;
};

&amp;usbh_ehci {
	status = &quot;okay&quot;;
};

&amp;usb3dr {
	status = &quot;okay&quot;;

	dwc3: usb@48300000 {
		maximum-speed = &quot;high-speed&quot;;
		usb-role-switch;
		role-switch-default-mode = &quot;peripheral&quot;;
	};
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在PLC的板子上，usbh_ehci: usb@482f0000 这个用的是usb2_phy1,对应板子上的USB HOST接口，而usb3dr是用usb2_phy2，对应板子上的U21 type C接口。</p><p>ST开发板，默认的DTS中明确禁用了OHCI (usbh_ohci: usb@482e0000 { status = &quot;disabled&quot;; }😉，但板载了一个USB Hub芯片（compatible=&quot;usb424,2514&quot;，如USB2514系列）。这个Hub是高速度Hub，它可以作为中介处理FS/LS设备：即使OHCI禁用，Hub会将FS/LS信号转换为HS信号，再由EHCI处理。 因此，一些像伪ch343的USB转serial低速设备在能被识别（尽管DTS只启用了EHCI）——这是Hub的功劳，而不是直接依赖OHCI。</p><p>但单端USB的PLC板卡，对于FS设备如USB转serial，缺少OHCI会导致内核无法正确切换和处理低速信号。因此我们需要启用OHCI。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>&amp;usbh_ohci {
    status = &quot;okay&quot;;
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="usb硬件电路" tabindex="-1"><a class="header-anchor" href="#usb硬件电路"><span>USB硬件电路</span></a></h1><p>ST的PLC参考设计板提供了最简的USB电路，但这个电路中的type C只是下载接口，而ST官方用STUSB1600来实现OTG功能，可能是一个正常的设计。</p>`,11),d=[l];function a(u,c){return s(),e("div",null,d)}const r=t(n,[["render",a],["__file","usb.html.vue"]]),m=JSON.parse('{"path":"/zh/deyaio/wiki/ccmp25/usb.html","title":"USB设备树片段","lang":"zh-CN","frontmatter":{"description":"USB设备树片段 原始的USB接口定义在STM32MP251.dtsi中，包括： 在板级设备树中关键启用是： 在PLC的板子上，usbh_ehci: usb@482f0000 这个用的是usb2_phy1,对应板子上的USB HOST接口，而usb3dr是用usb2_phy2，对应板子上的U21 type C接口。 ST开发板，默认的DTS中明确禁用了...","head":[["meta",{"property":"og:url","content":"https://peyoot.github.io/zh/deyaio/wiki/ccmp25/usb.html"}],["meta",{"property":"og:title","content":"USB设备树片段"}],["meta",{"property":"og:description","content":"USB设备树片段 原始的USB接口定义在STM32MP251.dtsi中，包括： 在板级设备树中关键启用是： 在PLC的板子上，usbh_ehci: usb@482f0000 这个用的是usb2_phy1,对应板子上的USB HOST接口，而usb3dr是用usb2_phy2，对应板子上的U21 type C接口。 ST开发板，默认的DTS中明确禁用了..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"USB设备树片段\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[],"git":{},"autoDesc":true,"filePathRelative":"zh/deyaio/wiki/ccmp25/usb.md"}');export{r as comp,m as data};
