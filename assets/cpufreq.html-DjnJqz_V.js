import{_ as e,o as i,c as n,b as s}from"./app-Crg5dGGQ.js";const a={},l=s(`<h1 id="如何解锁stm32mp255c的频率限制" tabindex="-1"><a class="header-anchor" href="#如何解锁stm32mp255c的频率限制"><span>如何解锁STM32MP255C的频率限制</span></a></h1><h2 id="stm32mp系列处理器分类" tabindex="-1"><a class="header-anchor" href="#stm32mp系列处理器分类"><span>STM32MP系列处理器分类</span></a></h2><p>STM32MP255系列处理器有不同等级，其中带有现在处理器安全要求的常用尾缀包括C，F。相应的价格也比其它诸如D之类的要贵一些。其中尾缀C的处理器主频是1.2GHz,而F尾缀则是1.5GHz。这两者有主频差别，按ST的官方的说法，C尾缀是为全天候百分百负荷7x24x365天工业环境运行10年的标准设计的，而F尾缀并不是为全天候运行设计的，更常见于HMI场景。这两者是否有真有硅片等级的区别，那就是仁者见仁智者见智的想法了。不过处理器主频的差别，实际限制都是在软件层面，具体来说是在OP-TEE安全固件中。</p><p>在 Linux 电源管理框架里，OPP（可运行性能点）描述的是设备（这里是 Cortex-A35 CPU）可以稳定工作的&quot;频率 + 电压&quot;组合点。STM32MP25系列处理器的OP-TEE固件中的设备树定义了这些OPP的子节点及其所支持的硬件类型。因此可以通过修改这里的设备树定义来突破型号限制，达到超频的目标，从而让C和F有一样的处理器主频性能。</p><h2 id="如何查询处理器主频" tabindex="-1"><a class="header-anchor" href="#如何查询处理器主频"><span>如何查询处理器主频</span></a></h2><p>默认的内核配置并没有暴露处理器频率，事实上，OP-TEE 在启动时读取这些 OPP 定义，然后通过 SCMI Performance Domain 协议把它们暴露给Linux。如果要让Linux查询运行主频，则需要开启这些内核配置选项：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 1. CPUFreq 核心框架
CONFIG_CPU_FREQ=y
CONFIG_CPU_FREQ_STAT=y
CONFIG_PM_OPP=y
# 2. SCMI 协议栈
CONFIG_ARM_SCMI_PROTOCOL=y
CONFIG_ARM_SCMI_PERF_PROTOCOL=y    ← 性能域协议，cpufreq 依赖此项
# 3. SCMI CPUFreq 驱动
CONFIG_ARM_SCMI_CPUFREQ=y          ← 这是关键，缺少它 cpufreq 目录不会出现
# 4. 调频策略（三种至少选一个）
CONFIG_CPU_FREQ_GOV_SCHEDUTIL=y    ← 适合嵌入式，但调频调度不利于实时性
CONFIG_CPU_FREQ_GOV_PERFORMANCE=y  
CONFIG_CPU_FREQ_GOV_ONDEMAND=y
CONFIG_CPU_FREQ_DEFAULT_GOV_PERFORMANCE=y  ← 默认用 performance ，实时性最好
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可在当前板卡上查询上当前的内核配置：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>zcat /proc/config.gz | grep -E &quot;CPU_FREQ|SCMI|PM_OPP&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>上述内核选项配置正确后，可以使用下面的方式查询</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 查看两个大核的频率配置
ls /sys/devices/system/cpu/cpu0/cpufreq -la6
ls /sys/devices/system/cpu/cpu1/cpufreq -la
# 默认都指向
cd /sys/devices/system/cpu/cpufreq/policy0/

# 当前实际运行频率（内核视角）
cat cpuinfo_cur_freq

# 当前频率（cpufreq 策略视角，部分平台可能与上面略有差异）
cat scaling_cur_freq

# 可用频率点（就是 OPP 表里那些频率）
cat scaling_available_frequencies

# 当前使用的调频策略
cat scaling_governor

# 最大/最小频率
cat cpuinfo_max_freq
cat cpuinfo_min_freq

# 复检opp表
ls /sys/kernel/debug/opp/cpu*

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="在所有处理器类型上解锁1-5g主频" tabindex="-1"><a class="header-anchor" href="#在所有处理器类型上解锁1-5g主频"><span>在所有处理器类型上解锁1.5G主频</span></a></h2><p>对于使用DEY AIO开发环境的用户来说，有现成的补丁可直接使用，如果你使用的manifest代码仓已经集成，直接repo sync即可。 如果您原有的代码仓库没有集成，或则完成测试后，想回退到补丁前，可删除下面这个optee补丁。 内核选项的配置仅是为了方便查询主频和调频策略，不影响是否超步。但如果您仍想隐藏cpufreq，可删除内核配置文件fragement.cfg中所添加的对cpufreq配置选项的定义。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>Meta-custom
├── dynamic-layers
│   └── stm-st-stm32mp
│       └── recipes-security
│           └── optee
│               ├── optee-os-stm32mp
│               │   └── 0001-unlock-MP255C-frequency.patch
│               └── optee-os-stm32mp_4.0.0.bbappend
├── recipes-kernel
         └── linux
         ├── linux-dey
          └── fragment.cfg
          └── linux-dey_%.bbappend
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>涉及到对内核选项和FIP固件的变更，因此需要清理</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>bitbake -c cleansstate linux-dey fip-stm32mp
bitbake -c cleansstate core-image-base
bitbake fip-stm32mp
bitbake linux-dey
bitbake core-image-base
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="实时系统的额外考量" tabindex="-1"><a class="header-anchor" href="#实时系统的额外考量"><span>实时系统的额外考量</span></a></h2><p>打了内核补丁实现超频后，一般需要认真重新测试一下实时性，看看是否引入未知的不确定性变化。也要关注对温度的影响，毕竟为了为了最佳实时性，通常需要在内核选项配置中指定governor为performance。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 查看当前 governor
cat /sys/devices/system/cpu/cpufreq/policy0/scaling_governor

# 如果是 schedutil 或 ondemand，先切换到 performance 测试
echo performance &gt; /sys/devices/system/cpu/cpufreq/policy0/scaling_governor

# 再跑一次 RT 测试对比
cyclictest -l 100000 -m -p 99 -i 1000
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="防止cpu超温引发问题" tabindex="-1"><a class="header-anchor" href="#防止cpu超温引发问题"><span>防止CPU超温引发问题</span></a></h2><p>默认地，DEY系统设置了个超温保护机制，在超105°C critical温度时，系统会重启。因此如果板卡没有散热措施，应关注常态运行时的温度。如果只是偶发临近关断温度，也可略微上调这个设定值。如果是长时间在高温下运行，应考增加虑散热片等措施。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 持续监控处理器温度
watch -n 1 &#39;for z in /sys/class/thermal/thermal_zone*; do
    echo &quot;$(cat $z/type): $(( $(cat $z/temp) / 1000 ))°C&quot;
done&#39;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,22),d=[l];function c(t,r){return i(),n("div",null,d)}const u=e(a,[["render",c],["__file","cpufreq.html.vue"]]),m=JSON.parse('{"path":"/zh/deyaio/wiki/ccmp25/cpufreq.html","title":"如何解锁STM32MP255C的频率限制","lang":"zh-CN","frontmatter":{"description":"如何解锁STM32MP255C的频率限制 STM32MP系列处理器分类 STM32MP255系列处理器有不同等级，其中带有现在处理器安全要求的常用尾缀包括C，F。相应的价格也比其它诸如D之类的要贵一些。其中尾缀C的处理器主频是1.2GHz,而F尾缀则是1.5GHz。这两者有主频差别，按ST的官方的说法，C尾缀是为全天候百分百负荷7x24x365天工业环...","head":[["meta",{"property":"og:url","content":"https://peyoot.github.io/zh/deyaio/wiki/ccmp25/cpufreq.html"}],["meta",{"property":"og:title","content":"如何解锁STM32MP255C的频率限制"}],["meta",{"property":"og:description","content":"如何解锁STM32MP255C的频率限制 STM32MP系列处理器分类 STM32MP255系列处理器有不同等级，其中带有现在处理器安全要求的常用尾缀包括C，F。相应的价格也比其它诸如D之类的要贵一些。其中尾缀C的处理器主频是1.2GHz,而F尾缀则是1.5GHz。这两者有主频差别，按ST的官方的说法，C尾缀是为全天候百分百负荷7x24x365天工业环..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"如何解锁STM32MP255C的频率限制\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[{"level":2,"title":"STM32MP系列处理器分类","slug":"stm32mp系列处理器分类","link":"#stm32mp系列处理器分类","children":[]},{"level":2,"title":"如何查询处理器主频","slug":"如何查询处理器主频","link":"#如何查询处理器主频","children":[]},{"level":2,"title":"在所有处理器类型上解锁1.5G主频","slug":"在所有处理器类型上解锁1-5g主频","link":"#在所有处理器类型上解锁1-5g主频","children":[]},{"level":2,"title":"实时系统的额外考量","slug":"实时系统的额外考量","link":"#实时系统的额外考量","children":[]},{"level":2,"title":"防止CPU超温引发问题","slug":"防止cpu超温引发问题","link":"#防止cpu超温引发问题","children":[]}],"git":{},"autoDesc":true,"filePathRelative":"zh/deyaio/wiki/ccmp25/cpufreq.md"}');export{u as comp,m as data};
