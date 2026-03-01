import{_ as e,o as i,c as s,b as n}from"./app-oTA4_50g.js";const a={},t=n(`<h1 id="触控屏驱动调校" tabindex="-1"><a class="header-anchor" href="#触控屏驱动调校"><span>触控屏驱动调校</span></a></h1><p>Linux下开发驱动程序，实际是是开发对应驱动的设备树片段。它主要是根据对应驱动芯片和设备的文档来进行调校。 本章以兼容TI ADS7846驱动的ET2046芯片和一款四线电阻屏为例来讲解。</p><h2 id="硬件gpio" tabindex="-1"><a class="header-anchor" href="#硬件gpio"><span>硬件GPIO</span></a></h2><p>触控屏一般会有一个中断GPIO，不同芯片由于这个引脚在内部处理不同而有所区别，比如goodix中它是推挽输出（Push-Pull），驱动可能自动配置bias或在它的方案中有偏置，因此对应这个引脚的GPIO的pinctrl可以不配置。而ET2046中，PENIRQ这个中断引脚是开漏输出（Open-Drain）, 必须外接上拉电阻，而在电路中没有上拉，则在MPU中需要设置对应GPIO上拉偏置。 另外，ET2046内部上拉电阻设计目标是： 未触摸时：PENIRQ = VCC（使能中断检测下降沿）； 触摸时：PENIRQ = 0（触发中断）。 应根据这一逻辑来设计设备树。</p><h2 id="设备树参数" tabindex="-1"><a class="header-anchor" href="#设备树参数"><span>设备树参数</span></a></h2><p>首先，我们需要知道触控芯片对应的参数，这需要访问https://github.com/digi-embedded/linux/blob/v6.6/stm/dey-5.0/maint/Documentation/devicetree/bindings/input/touchscreen/ads7846.txt</p><p>从工程图上可以看到一些参数，比如：</p><p>面板电阻（ti,x-plate-ohms）：指导电层本体电阻，即上/下电极ITO薄膜的电阻值。工程图上标注&quot;上电极400Ω&quot;和&quot;下电极400Ω&quot;就是面板电阻。回路电阻指从触摸芯片引脚完整回路的总电阻，包含面板电阻+走线电阻+接触电阻等，所以范围更大（如X:400~1200Ω）。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>ti,x-plate-ohms = &lt;400&gt;;   /* 用面板电阻400Ω，不是回路电阻范围 */
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>ti,x-min/max和ti,y-min/max 这些是实际触摸测试边缘的ADC值，x对应左右边缘，y对应上下边缘。</p><p>TI的TSC2046，用内部基准电压源有很多办法，至少打开keep-vref-on和vref-mv设置为2500是可以的。 但SPI通信碰上cs-gpios片选极性反转问题，需要相反配置在反转回来。</p><p>在 ads7846 驱动中，需debounce-max 和 debounce-rep（两者非零），则每个坐标采样 debounce_rep+2 次。</p><p>去抖参数的定义和行为如下：</p><p>ti,debounce-max</p><p>确切意义：当读数不一致（即本次读数与上次读数之差超过 debounce-tol）时，允许尝试的最大采样次数。若达到此次数后仍无法获得一致读数，则本次测量被忽略。</p><p>默认值：0（表示不启用去抖功能）。只有在设备树中明确设置且值 &gt;0 时，去抖滤波器才会激活。</p><p>ti,debounce-tol</p><p>意义：连续两次读数之间允许的最大绝对差值，用于判断是否“一致”。若差值 ≤ debounce-tol，则认为一致。</p><p>默认值：若启用了去抖但未设置该属性，默认为 0（即要求两次读数完全相同才认为一致）。</p><p>ti,debounce-rep</p><p>意义：需要连续一致读数的次数。驱动中实际逻辑是：当连续一致读数的计数 read_rep 大于 debounce-rep 时，才认为该坐标有效。因此，若 debounce-rep = N，则实际需要 N+1 次连续一致。</p><p>默认值：若启用了去抖但未设置，默认为 0，即需要 1 次连续一致就 OK（但此时 read_rep 从 0 开始，首次一致后 read_rep=1，满足 1&gt;0，所以一次一致即可）。</p><p>关于 ti,vref-mv：</p><p>该参数仅用于 HWMON（硬件监控）子系统，将 ADC 原始值转换为实际电压（毫伏）。触摸测量本身是比率测量，不依赖此值。即使设置为 2500，也不会让驱动误认为使用外部参考，驱动内部对 7846 会默认使用 2.5V 内部参考（若未提供则打印警告）。因此，ti,vref-mv 的取值不会影响触摸功能，可保留 2500 或忽略。</p><p>ti,settle-delay-usec</p><p>实现方式：通过增加每个命令的无效样本数（count_skip）来模拟延时，而不是插入真正的等待。</p><p>效果：使一次 SPI 消息变长，从而延长了单次读取的时间，间接增加了相邻两次采样的间隔（如果发生重复，则间隔等于一次消息的持续时间）。但它不会在两次消息之间插入空闲时间。</p><p>若增大此值，每次消息变长，采样率会下降，有利于信号稳定。</p><p>vref_delay_usecs</p><p>仅在单端读取（如 HWMON）时使用，不影响触摸采样。在触摸读取的 SPI 消息中未用到。</p><p>penirq_recheck_delay_usecs</p><p>发生在数据已获取、上报之前，用于再次确认 pen 是否仍按下。这个延迟不影响两次采样之间的间隔，只影响上报时刻。</p><h2 id="测试方法" tabindex="-1"><a class="header-anchor" href="#测试方法"><span>测试方法</span></a></h2><p>一般上电后，可通过检查spi相关的log，来确定驱动是否生效</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>root@ccmp25-dvk:~# dmesg |grep spi
[    0.000000] OF: reserved mem: 0x0000000060000000..0x000000006fffffff (262144 KiB) nomap non-reusable mm-ospi@60000000
[   10.144457] spi_stm32 400c0000.spi: driver initialized (master mode)
[   10.941720] ads7846 spi0.0: touchscreen, irq 92
[   10.951908] input: ADS7846 Touchscreen as /devices/platform/soc@0/42080000.bus/400c0000.spi/spi_master/spi0/spi0.0/input/input1
root@ccmp25-dvk:~# dmesg |grep touch
[   10.138865] touchscreen@0 enforce active low on GPIO handle
[   10.941720] ads7846 spi0.0: touchscreen, irq 92
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果触控没反应，可以用这两个命令检查</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 方法1：查看中断是否生效
cat /proc/interrupts | grep ads7846  # 触碰几下，再用这个命令查，会看到中断数增加
或是用这个来实时观察： watch -n 0.5 &#39;cat /proc/interrupts | grep ads7846&#39;

# 方法二：确认事件和触碰数据
cat /proc/bus/input/devices
查看ads7846驱动对应的handler，如果是event1，则用
hexdump -v /dev/input/event1
在屏上触碰，观察是否有数据 

# 方法三

按下触摸屏时，主机发出的 24 位帧（8 位命令 + 16 位数据）应类似：
MOSI: 0x90 0x00 0x00   // 读 X
MISO: 0xXX 0xXX 0xXX   // 高 12 位有效
若 MISO 全 0x00 或 0xFF → 基准/供电/连线问题；
若 12 位值在 300–3500 区间 → ADC 正常，跳第 3 步。
3. 检查驱动 “无效采样” 过滤
ads7846 驱动在 ads7846_read12_ser() 里会连续丢包的条件：
X=0 或 Y=0
pressure=0（Z1=0 或 Z2=0）
X/Y &gt; max（被你设为 3550/4050）
只要任一条件为真，就会 continue 掉，evtest 看不到事件。

快速验证
echo 8 &gt; /proc/sys/kernel/printk   # 打开 debug
echo 1 &gt; /sys/module/ads7846/parameters/debug    # 如果编译了 CONFIG_TOUCHSCREEN_ADS7846_DEBUG


再按屏，dmesg 会打出：
ads7846: X=0 Y=0 Z1=0 Z2=0  &lt;--- 被丢
或者
ads7846: X=3899 (&gt;x_max) dropped
出现 全 0 → 回第 1/2 步，基准或采样时序 不对；
出现 &gt;max → 把 ti,x-max/y-max 再放大 20 %；
Z1=0 → 把 ti,pressure-min 改成 0 先关掉压力过滤：



****
进一步确认：用 ls /sys/class/spi_master/spi0/statistics，触摸时看 bytes/messages/transfers 计数是否增（表示 SPI 事务发生）。如果不增，可能是 CS 或时钟问题。

# 清屏前
cd /sys/class/spi_master/spi0/statistics
cat messages timedout errors
# 输出：messages: 12  timedout: 0  errors: 0

# 手指按住屏 5 秒
sleep 5; cat messages timedout errors
# 输出：messages: 112  timedout: 0  errors: 0   &lt;-- messages 涨 100，正常
# 输出：messages: 12   timedout: 0  errors: 0   &lt;-- 不涨 → PENIRQ 中断根本没来
# 输出：messages: 112  timedout: 15 errors: 0   &lt;-- timedout 涨 → SPI 硬件超时

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="gpio检查" tabindex="-1"><a class="header-anchor" href="#gpio检查"><span>gpio检查</span></a></h2><p>cat /sys/kernel/debug/gpio 检查各GPIO情况</p><h2 id="添加校准" tabindex="-1"><a class="header-anchor" href="#添加校准"><span>添加校准</span></a></h2><h1 id="方法2-使用tslib校准" tabindex="-1"><a class="header-anchor" href="#方法2-使用tslib校准"><span>方法2：使用tslib校准</span></a></h1><p>ts_calibrate # 生成校准文件pointercal</p><h1 id="方法3-查看驱动调试信息" tabindex="-1"><a class="header-anchor" href="#方法3-查看驱动调试信息"><span>方法3：查看驱动调试信息</span></a></h1><p>dmesg | grep ads7846 # 部分驱动会输出实测范围</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># SPI模式确认
根据spec第8页，DCLK和DIN的时序图，这是在时钟上升沿采样，下降沿切换，
因此显示SPI中要显式定义：
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><pre><code>    spi-max-frequency = &lt;2000000&gt;;
    spi-cpol = &lt;0&gt;;
    spi-cpha = &lt;0&gt;;
</code></pre><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 电阻屏校准
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h1 id="安装tslib工具进行校准" tabindex="-1"><a class="header-anchor" href="#安装tslib工具进行校准"><span>安装tslib工具进行校准</span></a></h1><p>ts_calibrate</p><h1 id="查看生成的pointercal文件获取min-max值" tabindex="-1"><a class="header-anchor" href="#查看生成的pointercal文件获取min-max值"><span>查看生成的pointercal文件获取min/max值</span></a></h1><h1 id="系统首次启动时自动执行-通过systemd服务" tabindex="-1"><a class="header-anchor" href="#系统首次启动时自动执行-通过systemd服务"><span>系统首次启动时自动执行（通过systemd服务）</span></a></h1><p>/usr/bin/ts_calibrate</p><h1 id="生成的校准文件-存于可写文件系统" tabindex="-1"><a class="header-anchor" href="#生成的校准文件-存于可写文件系统"><span>生成的校准文件（存于可写文件系统）</span></a></h1><p>cat /etc/pointercal -1234 1.002 -0.034 5678 0.998 12.34 65536</p><h1 id="启动脚本自动加载校准" tabindex="-1"><a class="header-anchor" href="#启动脚本自动加载校准"><span>启动脚本自动加载校准</span></a></h1><p>export TSLIB_CALIBFILE=/etc/pointercal export TSLIB_TSDEVICE=/dev/input/event0</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>用服务来处理
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h1 id="在buildroot-rootfs中添加校准服务" tabindex="-1"><a class="header-anchor" href="#在buildroot-rootfs中添加校准服务"><span>在buildroot/rootfs中添加校准服务</span></a></h1><p>/etc/systemd/system/touchscreen-calibrate.service: [Unit] Description=Touchscreen Calibration ConditionFirstBoot=yes # 仅首次启动运行</p><p>[Service] Type=oneshot ExecStart=/usr/bin/ts_calibrate RemainAfterExit=yes</p><p>[Install] WantedBy=multi-user.target</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>并在udev规则中自动应用校准
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h1 id="etc-udev-rules-d-99-touchscreen-rules" tabindex="-1"><a class="header-anchor" href="#etc-udev-rules-d-99-touchscreen-rules"><span>/etc/udev/rules.d/99-touchscreen.rules</span></a></h1><p>SUBSYSTEM==&quot;input&quot;, KERNEL==&quot;event[0-9]*&quot;, ENV{ID_INPUT_TOUCHSCREEN}==&quot;1&quot;, <br> RUN+=&quot;/usr/bin/tslib-setup.sh&quot;</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code></code></pre><div class="line-numbers" aria-hidden="true"></div></div>`,65),d=[t];function r(l,c){return i(),s("div",null,d)}const u=e(a,[["render",r],["__file","tsc-driver.html.vue"]]),o=JSON.parse('{"path":"/zh/note/digi/dey/tsc-driver.html","title":"触控屏驱动调校","lang":"zh-CN","frontmatter":{"description":"触控屏驱动调校 Linux下开发驱动程序，实际是是开发对应驱动的设备树片段。它主要是根据对应驱动芯片和设备的文档来进行调校。 本章以兼容TI ADS7846驱动的ET2046芯片和一款四线电阻屏为例来讲解。 硬件GPIO 触控屏一般会有一个中断GPIO，不同芯片由于这个引脚在内部处理不同而有所区别，比如goodix中它是推挽输出（Push-Pull），...","head":[["meta",{"property":"og:url","content":"https://peyoot.github.io/zh/note/digi/dey/tsc-driver.html"}],["meta",{"property":"og:title","content":"触控屏驱动调校"}],["meta",{"property":"og:description","content":"触控屏驱动调校 Linux下开发驱动程序，实际是是开发对应驱动的设备树片段。它主要是根据对应驱动芯片和设备的文档来进行调校。 本章以兼容TI ADS7846驱动的ET2046芯片和一款四线电阻屏为例来讲解。 硬件GPIO 触控屏一般会有一个中断GPIO，不同芯片由于这个引脚在内部处理不同而有所区别，比如goodix中它是推挽输出（Push-Pull），..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"触控屏驱动调校\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[{"level":2,"title":"硬件GPIO","slug":"硬件gpio","link":"#硬件gpio","children":[]},{"level":2,"title":"设备树参数","slug":"设备树参数","link":"#设备树参数","children":[]},{"level":2,"title":"测试方法","slug":"测试方法","link":"#测试方法","children":[]},{"level":2,"title":"gpio检查","slug":"gpio检查","link":"#gpio检查","children":[]},{"level":2,"title":"添加校准","slug":"添加校准","link":"#添加校准","children":[]}],"git":{},"autoDesc":true,"filePathRelative":"zh/note/digi/dey/tsc-driver.md"}');export{u as comp,o as data};
