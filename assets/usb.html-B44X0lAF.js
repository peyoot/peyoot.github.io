import{_ as t,o as i,c as e,b as n}from"./app-oTA4_50g.js";const s={},l=n(`<h1 id="i2c1的潜在影响" tabindex="-1"><a class="header-anchor" href="#i2c1的潜在影响"><span>I2C1的潜在影响</span></a></h1><p>在Digi官方的开发板上，I2C1并没有连接什么东西，而在viena中I2C1还接着STUSB1600AQTR，但一般无需用它控制更改参数，除非将来需要更改模式，比如U口供电。</p><h1 id="usb-host电路" tabindex="-1"><a class="header-anchor" href="#usb-host电路"><span>USB HOST电路</span></a></h1><p>官方开发板的USB HOST电路中，有用到5v_board，并通过它接到带保护和报告的电源开关MIC2026，生成的USB_3V3给USB2514BI-AEZG（Microchip USB/pcie集线器扩展芯片）供电。这种方案在uboot也是即插即用，不用担心时序。 Viena中改用CH334H这个USB Hub芯片，固定偏置PWR和Reset，在linux下由于芯恒驱动会兼容Linux标准而没有影响，但在uboot下不行，如果想在uboot下也能用（主要是用U盘升固件，替代用法很多），需要改uboot源码，为了避免不确定性，暂时不处理，因为主要用途在linux下，已经测过可用。 但我们多一种在UBoot下单独更新固件的方式，除了网口外，可以测一下SD卡，这个应该在驱动上已经适配（片选信号和开发板不同，但已针对改好）。 测试办法： 找一张TF/Micro Sd卡，容量在16G以下最合适，可用windows格式化（小容量默认格为FAT32），如果超过16G，可用guiformat32工具或其它磁盘工具格式化为FAT32。插入后停在UBoot下，然后打mmcinfo显示相关内容。</p><p>注：使用viena的uboot刷到dvk上，会造成dvk的uboot也不能用，可能和5v_board有实施负载开关有关，因为viena硬件上拉，这个负载开关控制的GPIO已经在之前移除，但可以加回去，不过需要反转控制电平（和SPI片选被gpio子系统反转一样的原因，这个坑已经处理过，可以完美避开）。 但需调查一下官方开发板的负载开关片选为何不受影响。</p><h1 id="uboot下的usb调试" tabindex="-1"><a class="header-anchor" href="#uboot下的usb调试"><span>UBoot下的USB调试</span></a></h1><p>参考下面官方开发板的调试命令</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>=&gt; usb start
starting USB...
Bus usb@482f0000: USB EHCI 1.00
scanning bus usb@482f0000 for devices... 3 USB Device(s) found
       scanning usb for storage devices... 1 Storage Device(s) found
=&gt; usb info
1: Hub,  USB Revision 2.0
 - u-boot EHCI Host Controller
 - Class: Hub
 - PacketSize: 64  Configurations: 1
 - Vendor: 0x0000  Product 0x0000 Version 1.0
   Configuration: 1
   - Interfaces: 1 Self Powered 0mA
     Interface: 0
     - Alternate Setting 0, Endpoints: 1
     - Class Hub
     - Endpoint 1 In Interrupt MaxPacket 8 Interval 255ms

2: Hub,  USB Revision 2.0
 - Class: Hub
 - PacketSize: 64  Configurations: 1
 - Vendor: 0x0424  Product 0x2514 Version 11.179
   Configuration: 1
   - Interfaces: 1 Self Powered Remote Wakeup 2mA
     Interface: 0
     - Alternate Setting 0, Endpoints: 1
     - Class Hub
     - Endpoint 1 In Interrupt MaxPacket 1 Interval 12ms
     - Endpoint 1 In Interrupt MaxPacket 1 Interval 12ms

3: Mass Storage,  USB Revision 2.0
 - Generic Mass Storage 5083A0CA
 - Class: (from Interface) Mass Storage
 - PacketSize: 64  Configurations: 1
 - Vendor: 0x058f  Product 0x6387 Version 1.3
   Configuration: 1
   - Interfaces: 1 Bus Powered 100mA
     Interface: 0
     - Alternate Setting 0, Endpoints: 2
     - Class Mass Storage, Transp. SCSI, Bulk only
     - Endpoint 1 Out Bulk MaxPacket 512
     - Endpoint 2 In Bulk MaxPacket 512

=&gt; usb tree
USB device tree:
  1  Hub (480 Mb/s, 0mA)
  |  u-boot EHCI Host Controller
  |
  +-2  Hub (480 Mb/s, 2mA)
    |
    +-3  Mass Storage (480 Mb/s, 100mA)
         Generic Mass Storage 5083A0CA

=&gt; usb storage
  Device 0: Vendor: Generic  Rev: 8.07 Prod: Flash Disk
            Type: Removable Hard Disk
            Capacity: 4012.0 MB = 3.9 GB (8216576 x 512)
=&gt; fatls usb 0:1
            System Volume Information/
            core-image-base-ccmp25-dvk-20251119164915.installer/
            dfu-util/
            core-image-base-ccmp25-viena-20260113014420.installer/
 667422720   core-image-base-ccmp25-dvk.ext4
 12887552   core-image-base-ccmp25-dvk.boot.vfat

2 file(s), 4 dir(s)

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="usb设备树片段" tabindex="-1"><a class="header-anchor" href="#usb设备树片段"><span>USB设备树片段</span></a></h1><p>原始的USB接口定义在STM32MP251.dtsi中，包括：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>/{
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="usb硬件电路" tabindex="-1"><a class="header-anchor" href="#usb硬件电路"><span>USB硬件电路</span></a></h1><p>ST的PLC参考设计板提供了最简的USB电路，但这个电路中的type C只是下载接口，而ST官方用STUSB1600来实现OTG功能，可能是一个正常的设计。</p>`,19),d=[l];function a(v,c){return i(),e("div",null,d)}const r=t(s,[["render",a],["__file","usb.html.vue"]]),b=JSON.parse('{"path":"/zh/deyaio/wiki/ccmp25/usb.html","title":"I2C1的潜在影响","lang":"zh-CN","frontmatter":{"description":"I2C1的潜在影响 在Digi官方的开发板上，I2C1并没有连接什么东西，而在viena中I2C1还接着STUSB1600AQTR，但一般无需用它控制更改参数，除非将来需要更改模式，比如U口供电。 USB HOST电路 官方开发板的USB HOST电路中，有用到5v_board，并通过它接到带保护和报告的电源开关MIC2026，生成的USB_3V3给U...","head":[["meta",{"property":"og:url","content":"https://peyoot.github.io/zh/deyaio/wiki/ccmp25/usb.html"}],["meta",{"property":"og:title","content":"I2C1的潜在影响"}],["meta",{"property":"og:description","content":"I2C1的潜在影响 在Digi官方的开发板上，I2C1并没有连接什么东西，而在viena中I2C1还接着STUSB1600AQTR，但一般无需用它控制更改参数，除非将来需要更改模式，比如U口供电。 USB HOST电路 官方开发板的USB HOST电路中，有用到5v_board，并通过它接到带保护和报告的电源开关MIC2026，生成的USB_3V3给U..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"I2C1的潜在影响\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[],"git":{},"autoDesc":true,"filePathRelative":"zh/deyaio/wiki/ccmp25/usb.md"}');export{r as comp,b as data};
