# 驱动修改编译后的问题
原始的Linux源码树下的ov2740.c 是为ACPI平台（Intel） 设计的，缺少现代Linux设备树（.of_match_table）和时钟支持所需的函数或头文件。
修改后，可编译通过，但仍然无法识别，具体表现有：
```
root@ccmp25-dvk:~# dmesg | grep -i i2c
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
```
# 检查完整的I2c1设备树链路
```
#stm32mp251.dtsi:
i2c1: i2c@40120000 {
				compatible = "st,stm32mp25-i2c";
				reg = <0x40120000 0x400>;
				interrupt-names = "event";
				interrupts = <GIC_SPI 108 IRQ_TYPE_LEVEL_HIGH>;
				clocks = <&rcc CK_KER_I2C1>;
				resets = <&rcc I2C1_R>;
				#address-cells = <1>;
				#size-cells = <0>;
				dmas = <&hpdma 27 0x20 0x00003012>,
				       <&hpdma 28 0x20 0x00003021>;
				dma-names = "rx", "tx";
				access-controllers = <&rifsc 41>;
				power-domains = <&CLUSTER_PD>;
				status = "disabled";
			};

#ccmp25-softlink.dts：
/* MIPI-CSI camera */
	ov2740_mipi: ov2740_mipi@36 {
		compatible = "ovti,ov2740";
		reg = <0x36>;
		clocks = <&clk_ext_camera>;
		clock-names = "xclk";
		clock-frequency = <24000000>;
		
		DOVDD-supply = <&scmi_v3v3>;
		AVDD-supply = <&reg_2v8>; 
    	DVDD-supply = <&reg_1v2>;
		/* CSI_RESET */
	    /*	powerdown-gpios = <&gpiog 7 (GPIO_ACTIVE_LOW | GPIO_PUSH_PULL)>; */
		status = "okay";

		port {
			ov2740_mipi_ep: endpoint {
				remote-endpoint = <&csi_sink>;
				data-lanes = <1 2>;
				link-frequencies = /bits/ 64 <360000000>;
			};
		};
	};


	clocks {
		clk_ext_camera: clk-ext-camera {
			#clock-cells = <0>;
			compatible = "fixed-clock";
			clock-frequency = <24000000>;
		};
	};

```
检查驱动源码：
```
v4l2_fwnode_endpoint_parse() 解析失败
check_hwcfg 中：
ret = v4l2_fwnode_endpoint_parse(ep, &bus_cfg);
失败了！ 导致 bus_cfg.nr_of_link_frequencies == 0
用了 fwnode_graph_get_next_endpoint(dev_fwnode(dev), NULL)
但 dev_fwnode(dev) 是 I2C 设备的 fwnode，不是 CSI 端点的 fwnode！
I2C 设备没有 port 节点！ → endpoint 解析失败！
```
解决办法：
当前驱动是 I2C 驱动，但 port 是写在 设备树中，必须重写 ov2740_check_hwcfg()用 OF 接口 读取。
```
static int ov2740_check_hwcfg(struct device *dev)
{
	struct device_node *np = dev->of_node;
	struct device_node *endpoint;
	struct v4l2_fwnode_endpoint bus_cfg = { .bus_type = V4L2_MBUS_CSI2_DPHY };
	u32 mclk;
	int ret;

	if (!np) {
		dev_err(dev, "no device tree node\n");
		return -EINVAL;
	}

	/* 1. 读取 clock-frequency */
	if (of_property_read_u32(np, "clock-frequency", &mclk)) {
		dev_err(dev, "missing clock-frequency\n");
		return -EINVAL;
	}
	if (mclk != 24000000) {
		dev_err(dev, "only 24MHz supported, got %u\n", mclk);
		return -EINVAL;
	}

	/* 2. 查找 port -> endpoint */
	endpoint = of_graph_get_next_endpoint(np, NULL);
	if (!endpoint) {
		dev_err(dev, "no endpoint in port\n");
		return -ENXIO;
	}

	/* 3. 解析 endpoint */
	ret = v4l2_fwnode_endpoint_parse(of_fwnode_handle(endpoint), &bus_cfg);
	of_node_put(endpoint);
	if (ret) {
		dev_err(dev, "failed to parse endpoint: %d\n", ret);
		return ret;
	}

	/* 4. 检查 data-lanes */
	if (bus_cfg.bus.mipi_csi2.num_data_lanes != OV2740_DATA_LANES) {
		dev_err(dev, "need %d data lanes, got %d\n",
			OV2740_DATA_LANES, bus_cfg.bus.mipi_csi2.num_data_lanes);
		return -EINVAL;
	}

	/* 5. 检查 link-frequencies */
	if (!bus_cfg.nr_of_link_frequencies) {
		dev_err(dev, "no link-frequencies defined\n");
		return -EINVAL;
	}

	if (bus_cfg.link_frequencies[0] != 360000000ULL) {
		dev_err(dev, "link frequency must be 360MHz, got %lld\n",
			bus_cfg.link_frequencies[0]);
		return -EINVAL;
	}

	return 0;
}
```