import{_ as e,o as i,c as n,b as t}from"./app-oTA4_50g.js";const d={},s=t(`<h1 id="驱动修改编译后的问题" tabindex="-1"><a class="header-anchor" href="#驱动修改编译后的问题"><span>驱动修改编译后的问题</span></a></h1><p>原始的Linux源码树下的ov2740.c 是为ACPI平台（Intel） 设计的，缺少现代Linux设备树（.of_match_table）和时钟支持所需的函数或头文件。 修改后，可编译通过，但仍然无法识别，具体表现有：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>root@ccmp25-dvk:~# dmesg | grep -i i2c
[ 0.058533] platform 48020000.csi: Fixed dependency cycle(s) with /soc@0/bus@42080000/i2c@40120000/ov2740_mipi@36
[ 0.182343] i2c_dev: i2c /dev entries driver
[ 0.362596] platform 48020000.csi: Fixed dependency cycle(s) with /soc@0/bus@42080000/i2c@40120000/ov2740_mipi@36
[ 0.362757] i2c 0-0036: Fixed dependency cycle(s) with /soc@0/bus@42080000/csi@48020000
[ 0.365934] stm32f7-i2c 40120000.i2c: STM32F7 I2C-0 bus adapter
root@ccmp25-dvk:~# dmesg | grep -i ov2740
[ 0.058533] platform 48020000.csi: Fixed dependency cycle(s) with /soc@0/bus@42080000/i2c@40120000/ov2740_mipi@36
[ 0.362596] platform 48020000.csi: Fixed dependency cycle(s) with /soc@0/bus@42080000/i2c@40120000/ov2740_mipi@36
[ 8.553469] ov2740 0-0036: no link-frequencies defined
[ 8.553515] ov2740 0-0036: error -EINVAL: HW configuration check failed
[ 8.571289] ov2740: probe of 0-0036 failed with error -22

根本原因：
ov2740_check_hwcfg() 失败 → no link-frequencies defined
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="检查完整的i2c1设备树链路" tabindex="-1"><a class="header-anchor" href="#检查完整的i2c1设备树链路"><span>检查完整的I2c1设备树链路</span></a></h1><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>#stm32mp251.dtsi:
i2c1: i2c@40120000 {
				compatible = &quot;st,stm32mp25-i2c&quot;;
				reg = &lt;0x40120000 0x400&gt;;
				interrupt-names = &quot;event&quot;;
				interrupts = &lt;GIC_SPI 108 IRQ_TYPE_LEVEL_HIGH&gt;;
				clocks = &lt;&amp;rcc CK_KER_I2C1&gt;;
				resets = &lt;&amp;rcc I2C1_R&gt;;
				#address-cells = &lt;1&gt;;
				#size-cells = &lt;0&gt;;
				dmas = &lt;&amp;hpdma 27 0x20 0x00003012&gt;,
				       &lt;&amp;hpdma 28 0x20 0x00003021&gt;;
				dma-names = &quot;rx&quot;, &quot;tx&quot;;
				access-controllers = &lt;&amp;rifsc 41&gt;;
				power-domains = &lt;&amp;CLUSTER_PD&gt;;
				status = &quot;disabled&quot;;
			};

#ccmp25-softlink.dts：
/* MIPI-CSI camera */
	ov2740_mipi: ov2740_mipi@36 {
		compatible = &quot;ovti,ov2740&quot;;
		reg = &lt;0x36&gt;;
		clocks = &lt;&amp;clk_ext_camera&gt;;
		clock-names = &quot;xclk&quot;;
		clock-frequency = &lt;24000000&gt;;
		
		DOVDD-supply = &lt;&amp;scmi_v3v3&gt;;
		AVDD-supply = &lt;&amp;reg_2v8&gt;; 
    	DVDD-supply = &lt;&amp;reg_1v2&gt;;
		/* CSI_RESET */
	    /*	powerdown-gpios = &lt;&amp;gpiog 7 (GPIO_ACTIVE_LOW | GPIO_PUSH_PULL)&gt;; */
		status = &quot;okay&quot;;

		port {
			ov2740_mipi_ep: endpoint {
				remote-endpoint = &lt;&amp;csi_sink&gt;;
				data-lanes = &lt;1 2&gt;;
				link-frequencies = /bits/ 64 &lt;360000000&gt;;
			};
		};
	};


	clocks {
		clk_ext_camera: clk-ext-camera {
			#clock-cells = &lt;0&gt;;
			compatible = &quot;fixed-clock&quot;;
			clock-frequency = &lt;24000000&gt;;
		};
	};

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>检查驱动源码：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>v4l2_fwnode_endpoint_parse() 解析失败
check_hwcfg 中：
ret = v4l2_fwnode_endpoint_parse(ep, &amp;bus_cfg);
失败了！ 导致 bus_cfg.nr_of_link_frequencies == 0
用了 fwnode_graph_get_next_endpoint(dev_fwnode(dev), NULL)
但 dev_fwnode(dev) 是 I2C 设备的 fwnode，不是 CSI 端点的 fwnode！
I2C 设备没有 port 节点！ → endpoint 解析失败！
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>解决办法： 当前驱动是 I2C 驱动，但 port 是写在 设备树中，必须重写 ov2740_check_hwcfg()用 OF 接口 读取。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>static int ov2740_check_hwcfg(struct device *dev)
{
	struct device_node *np = dev-&gt;of_node;
	struct device_node *endpoint;
	struct v4l2_fwnode_endpoint bus_cfg = { .bus_type = V4L2_MBUS_CSI2_DPHY };
	u32 mclk;
	int ret;

	if (!np) {
		dev_err(dev, &quot;no device tree node\\n&quot;);
		return -EINVAL;
	}

	/* 1. 读取 clock-frequency */
	if (of_property_read_u32(np, &quot;clock-frequency&quot;, &amp;mclk)) {
		dev_err(dev, &quot;missing clock-frequency\\n&quot;);
		return -EINVAL;
	}
	if (mclk != 24000000) {
		dev_err(dev, &quot;only 24MHz supported, got %u\\n&quot;, mclk);
		return -EINVAL;
	}

	/* 2. 查找 port -&gt; endpoint */
	endpoint = of_graph_get_next_endpoint(np, NULL);
	if (!endpoint) {
		dev_err(dev, &quot;no endpoint in port\\n&quot;);
		return -ENXIO;
	}

	/* 3. 解析 endpoint */
	ret = v4l2_fwnode_endpoint_parse(of_fwnode_handle(endpoint), &amp;bus_cfg);
	of_node_put(endpoint);
	if (ret) {
		dev_err(dev, &quot;failed to parse endpoint: %d\\n&quot;, ret);
		return ret;
	}

	/* 4. 检查 data-lanes */
	if (bus_cfg.bus.mipi_csi2.num_data_lanes != OV2740_DATA_LANES) {
		dev_err(dev, &quot;need %d data lanes, got %d\\n&quot;,
			OV2740_DATA_LANES, bus_cfg.bus.mipi_csi2.num_data_lanes);
		return -EINVAL;
	}

	/* 5. 检查 link-frequencies */
	if (!bus_cfg.nr_of_link_frequencies) {
		dev_err(dev, &quot;no link-frequencies defined\\n&quot;);
		return -EINVAL;
	}

	if (bus_cfg.link_frequencies[0] != 360000000ULL) {
		dev_err(dev, &quot;link frequency must be 360MHz, got %lld\\n&quot;,
			bus_cfg.link_frequencies[0]);
		return -EINVAL;
	}

	return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>中间很多故事，略</p><p>临时跳过 ID 读（不重新编译，用 rmmod + insmod 验证）</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>static bool skip_id;
module_param(skip_id, bool, 0644);
MODULE_PARM_DESC(skip_id, &quot;skip chip-id read for debug&quot;);

ov2740_identify_module里：
+       if (skip_id) {
+               dev_info(ov2740-&gt;dev, &quot;skip ID read for debug\\n&quot;);
+               return 0;
+       }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>编译需要进入bitbake -c devshell linux-dey, 然后make modules</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>./scripts/config --module CONFIG_VIDEO_OV2740
make olddefconfig          # 自动解决依赖
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="强制手动加载内核模块" tabindex="-1"><a class="header-anchor" href="#强制手动加载内核模块"><span>强制手动加载内核模块</span></a></h1><p>有时需要调查什么地方crash，就需要模块加载过程的一些log，而内核模块被占用就无法手动insmod，那么，可以这样做： 临时黑名单（仅本次启动生效）：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>echo blacklist ov2740 &gt; /etc/modprobe.d/ov2740.conf
echo blacklist stm32_csi &gt;&gt; /etc/modprobe.d/ov2740.conf
reboot
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>重启后 ov2740 不会自动加载，此时：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>lsmod | grep ov2740        # 应该为空
i2cdetect -y 0             # 确认 0x36 仍在
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>在“完全准备好”的用户空间手动加载</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>insmod /lib/modules/$(uname -r)/extra/ov2740.ko
dmesg | tail -20
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="编译成功后的调试" tabindex="-1"><a class="header-anchor" href="#编译成功后的调试"><span>编译成功后的调试</span></a></h1><p>按官方文档来， media-ctl -d platform:48030000.dcmipp -p 和 media-ctl -d /dev/media2 -p 效果一样 media-ctl -d /dev/media2 --print-dot &gt; graph.dot</p><p>在线转成图片 https://dreampuf.github.io/GraphvizOnline/</p>`,24),l=[s];function a(v,c){return i(),n("div",null,l)}const u=e(d,[["render",a],["__file","ov2740-debugging.html.vue"]]),o=JSON.parse('{"path":"/zh/note/digi/dey/ov2740-debugging.html","title":"驱动修改编译后的问题","lang":"zh-CN","frontmatter":{"description":"驱动修改编译后的问题 原始的Linux源码树下的ov2740.c 是为ACPI平台（Intel） 设计的，缺少现代Linux设备树（.of_match_table）和时钟支持所需的函数或头文件。 修改后，可编译通过，但仍然无法识别，具体表现有： 检查完整的I2c1设备树链路 检查驱动源码： 解决办法： 当前驱动是 I2C 驱动，但 port 是写在 设...","head":[["meta",{"property":"og:url","content":"https://peyoot.github.io/zh/note/digi/dey/ov2740-debugging.html"}],["meta",{"property":"og:title","content":"驱动修改编译后的问题"}],["meta",{"property":"og:description","content":"驱动修改编译后的问题 原始的Linux源码树下的ov2740.c 是为ACPI平台（Intel） 设计的，缺少现代Linux设备树（.of_match_table）和时钟支持所需的函数或头文件。 修改后，可编译通过，但仍然无法识别，具体表现有： 检查完整的I2c1设备树链路 检查驱动源码： 解决办法： 当前驱动是 I2C 驱动，但 port 是写在 设..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"驱动修改编译后的问题\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[],"git":{},"autoDesc":true,"filePathRelative":"zh/note/digi/dey/ov2740-debugging.md"}');export{u as comp,o as data};
