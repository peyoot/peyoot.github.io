import{_ as e,o as i,c as n,b as d}from"./app-Dbzm7Suq.js";const s={},t=d(`<h1 id="dey-aio驱动开发示例" tabindex="-1"><a class="header-anchor" href="#dey-aio驱动开发示例"><span>DEY AIO驱动开发示例</span></a></h1><p>Linux源码树在~/deyaio-rtnodemo/dey5.0/workspace/ccmp25dvkrt/tmp/work/ccmp25_dvk-dey-linux/linux-dey/6.6/git 而内核自带的设备驱动目录是~/deyaio-rtnodemo/dey5.0/workspace/ccmp25dvkrt/tmp/work/ccmp25_dvk-dey-linux/linux-dey/6.6/git/drivers/，每个目录下有相应的Makefile和Kconfig。</p><h2 id="usb扩展串口的驱动集成" tabindex="-1"><a class="header-anchor" href="#usb扩展串口的驱动集成"><span>USB扩展串口的驱动集成</span></a></h2><p>本文以CH343的驱动开发为例，其它的驱动可以参考实现。CH343可以支持系统内置的ACM驱动，默认该内核选项已经打开：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>bitbake -c menuconfig virtual/kernel
配置路径：
Device Drivers → USB support → USB Modem (CDC ACM) support
确保 CONFIG_USB_ACM=y
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果需要用到流控功能，需要使用厂商驱动：https://github.com/WCHSoftGroup/ch343ser_linux</p><p>最后在~/deyaio-rtnodemo/dey5.0/workspace/ccmp25dvkrt/tmp/work/ccmp25_dvk-dey-linux/linux-dey/6.6/git/drivers/usb/serial/下有Makefile和Kconfig,以及不同USB转串口芯片厂家的驱动源码。</p><p>为了生成可以直接用于配方的补丁，我们应该将CH343的驱动源码（ch343.c和ch343.h）放在drivers/usb/serial/目录下，并修改该目录下的Kconfig和Makefile，以添加CH343的配置和编译选项。</p><p>1、拉取驱动源码并放置到驱动目录：</p><p>首先，从github临时拉取这些源码，比如：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>cd ~/mygit/github/
git clone https://github.com/WCHSoftGroup/ch343ser_linux.git
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>然后在内核驱动目录下操作</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 进入内核源码的USB串口驱动目录
cd ~/deyaio-rtnodemo/dey5.0/workspace/ccmp25dvkrt/tmp/work/ccmp25_dvk-dey-linux/linux-dey/6.6/git/drivers/usb/serial/

# 将CH343驱动文件复制到这里
cp ~/mygit/github/ch343ser_linux/ch343.c .
cp ~/mygit/github/ch343ser_linux/ch343.h .
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2、修改Makefile和内核配置</p><p>1）修改 Makefile： 在 drivers/usb/serial/Makefile 中，找到其他USB串口驱动的位置（如 ch341.o 附近），添加：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>obj-$(CONFIG_USB_SERIAL_CH343)		+= ch343.o
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>2）修改 Kconfig： 在 drivers/usb/serial/Kconfig 中，找到合适位置添加：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>config USB_SERIAL_CH343
	tristate &quot;CH343 USB to serial converter&quot;
	help
	  Say Y here if you want to use a CH343 USB to serial converter.

	  This driver allows you to use CH343 based USB to serial converters.

	  To compile this driver as a module, choose M here: the module will be called ch343.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>3、编译驱动 现在你可以用DEY的构建环境来编译驱动：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 进入内核构建目录
最安全的构建环境是devshell,在项目文件夹中执行
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>bitbake -c devshell virtual/kernel</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>此命令会解压内核源码，配置好所有环境变量（如ARCH和CROSS_COMPILE），并打开一个新的shell终端以便手动开发调试

# 配置内核，启用CH343驱动
make menuconfig
# 进入 Device Drivers → USB support → USB Serial Converter support
# 找到并选择 &quot;CH343 USB to serial converter&quot; 为 M (模块) 或 Y (内置)

# 或者直接修改 .config 文件
echo &#39;CONFIG_USB_SERIAL_CH343=m&#39; &gt;&gt; .config

# 编译特定目录驱动模块
make drivers/usb/serial/

# 或者编译所有USB串口驱动
make M=drivers/usb/serial/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>编译完成后，.ko 文件会生成在相应的位置。</p><p>4、生成内核补丁 由于是在git仓库中操作，生成补丁非常方便，但是由于执行手动的make，环境已经被污染，先要恢复一下， 首先备份一下改动：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>cp drivers/usb/serial/Makefile ~/tempbk/
cp drivers/usb/serial/Kconfig ~/tempbk/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>然后用exit退出devshell，执行清理：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>bitbake -c cleansstate virtual/kernel
因为这会删除之前下载和编译的内核文件及源码，所以还需要再执行一次进入devshell并恢复原始的源码库：
 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>bitbake -c devshell virtual/kernel git reset --hard</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 修改并生成变更到配方

# 查看当前修改状态
git status
这里有一些untrack并没有影响，
git diff
此时变动为空，因为我们主要是要增加ch343相关的驱动，将备份的东西拷回来，再git diff一下，

# 添加新文件到git
git add drivers/usb/serial/ch343.c drivers/usb/serial/ch343.h
git add drivers/usb/serial/Makefile drivers/usb/serial/Kconfig

# 提交更改
git commit -m &quot;Add CH343 USB to serial driver&quot;

# 生成补丁文件
git format-patch -1 --stdout &gt; 0001-add-ch343-usb-serial-driver.patch

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>5、验证补丁内容</p><p>生成的补丁文件应该包含：</p><p>新增的 ch343.c 和 ch343.h 文件 对 Makefile 的修改（添加 ch343.o 编译条目） 对 Kconfig 的修改（添加配置选项）</p><p>如果要进一步验证，可以：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>cd some-clean-kernel-source 
git apply /path/to/0001-add-ch343-usb-serial-driver.patch
# 验证是否能正常应用
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>6、集成到Yocto配方</p><p>将补丁文件（如 0001-add-ch343-usb-serial-driver.patch）和可能的内核配置文件（如 ch343-config.cfg，内容为 CONFIG_USB_SERIAL_CH343=m）放在你Yocto层的 meta-custom/recipes-kernel/linux/linux-dey/ 目录下</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>mkdir -p meta-custom/recipes-kernel/linux/linux-dey/

cp 0001-add-ch343-usb-serial-driver.patch meta-custom/recipes-kernel/linux/linux-dey/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>创建或修改 linux-dey_%.bbappend 文件</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>FILESEXTRAPATHS_prepend := &quot;\${THISDIR}/\${PN}:&quot;

SRC_URI += &quot; \\
    file://ch343-config.cfg \\
    file://0001-add-ch343-usb-serial-driver.patch \\
&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="电阻屏的支持" tabindex="-1"><a class="header-anchor" href="#电阻屏的支持"><span>电阻屏的支持</span></a></h2><p>电阻屏需要专用的驱动芯片，这个芯片内部集成了模拟开关、ADC、逻辑控制和驱动。对外一般是SPI接口和一个中断GPIO来连接处理器。 Linux内核的驱动也是与这些控制器芯片对接的，内核配置选项的路径如下，以ADS7843/TSC2046系列兼容芯片为例：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>Device Drivers  ---&gt;
    Input device support  ---&gt;
        Touchscreens  ---&gt;
		&lt;*&gt; ADS7846/TSC2046/AD7873 and AD7843 based touchscreen 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>硬件连接：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>四线电阻屏引脚 → ADS7843引脚：
X+ → VIN1
Y+ → VIN2
X- → VIN3  
Y- → VIN4

ADS7843 → ARM处理器：
DOUT → SPI_MISO
DIN  → SPI_MOSI
CS   → SPI_CS
CLK  → SPI_CLK
PENIRQ → GPIO（任意可用GPIO，配置为中断）
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>SPI是一种总线，添加SPI接口时，我们可添加NSS就是硬件片选信号（NSS = Negative Slave Select），这是供主设备去控制选中外部SPI设备的，但如果你想连接多个SPI设备，可以使用任意GPIO作为额外的片选信号。</p><p>设备树示例:</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>&amp;spi2 {
    pinctrl-names = &quot;default&quot;, &quot;sleep&quot;;
    pinctrl-0 = &lt;&amp;ccmp25_spi2_pins&gt;;
    pinctrl-1 = &lt;&amp;ccmp25_spi2_sleep_pins&gt;;
    status = &quot;okay&quot;;
    
    /* USER CODE BEGIN spi2 */
    // 使用硬件NSS，不需要cs-gpios
	// cs-gpios = &lt;&amp;gpiob 1 GPIO_ACTIVE_LOW&gt;; // 取消注释，并使用PB1作为片选
    
    touchscreen@0 {
        compatible = &quot;ti,ads7846&quot;;  // 或 &quot;xpt2046&quot; 如果驱动支持
        reg = &lt;0&gt;;                  // 使用硬件NSS 或使用cs-gpios中的第一个片选，即PB1，都是（片选0）
        spi-max-frequency = &lt;1000000&gt;;
        interrupts = &lt;&amp;gpioc 13 IRQ_TYPE_EDGE_FALLING&gt;;  // 假设使用PC13作为中断
        interrupt-parent = &lt;&amp;gpioc&gt;;
        
        /* 触摸屏参数 */
        ti,x-min = /bits/ 16 &lt;0&gt;;
        ti,x-max = /bits/ 16 &lt;4095&gt;;
        ti,y-min = /bits/ 16 &lt;0&gt;;
        ti,y-max = /bits/ 16 &lt;4095&gt;;
        ti,pressure-min = /bits/ 16 &lt;0&gt;;
        ti,pressure-max = /bits/ 16 &lt;255&gt;;
        ti,x-plate-ohms = /bits/ 16 &lt;400&gt;;
    };
    /* USER CODE END spi2 */
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,47),l=[t];function a(r,c){return i(),n("div",null,l)}const u=e(s,[["render",a],["__file","dey-driver.html.vue"]]),m=JSON.parse('{"path":"/zh/note/dey-driver.html","title":"DEY AIO驱动开发示例","lang":"zh-CN","frontmatter":{"description":"DEY AIO驱动开发示例 Linux源码树在~/deyaio-rtnodemo/dey5.0/workspace/ccmp25dvkrt/tmp/work/ccmp25_dvk-dey-linux/linux-dey/6.6/git 而内核自带的设备驱动目录是~/deyaio-rtnodemo/dey5.0/workspace/ccmp25dvkrt...","head":[["meta",{"property":"og:url","content":"https://peyoot.github.io/zh/note/dey-driver.html"}],["meta",{"property":"og:title","content":"DEY AIO驱动开发示例"}],["meta",{"property":"og:description","content":"DEY AIO驱动开发示例 Linux源码树在~/deyaio-rtnodemo/dey5.0/workspace/ccmp25dvkrt/tmp/work/ccmp25_dvk-dey-linux/linux-dey/6.6/git 而内核自带的设备驱动目录是~/deyaio-rtnodemo/dey5.0/workspace/ccmp25dvkrt..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"DEY AIO驱动开发示例\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[{"level":2,"title":"USB扩展串口的驱动集成","slug":"usb扩展串口的驱动集成","link":"#usb扩展串口的驱动集成","children":[]},{"level":2,"title":"电阻屏的支持","slug":"电阻屏的支持","link":"#电阻屏的支持","children":[]}],"git":{},"autoDesc":true,"filePathRelative":"zh/note/dey-driver.md"}');export{u as comp,m as data};
