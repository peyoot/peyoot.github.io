# STM32MP系列处理器分类
STM32MP25系列处理器有不同等级，其中带有现在处理器安全要求的常用尾缀包括C，F。相应的价格也比其它诸如D之类的要践一些。其中C是1.2G,而F是1.5G。这两者有主频差别，按ST的官方的说法，C尾缀是为全天候7x24x365天工业环境运行10年的标准设计的，而F尾缀并不是为全天候运行设计的，更常见于HMI场景。两者是否有硅片等级的区别，那就是仁者见仁智者见智的想法了。这主频的差别，实际限制都是在软件层面，具体来说是在OP-TEE安全固件中。

在 Linux 电源管理框架里，OPP（可运行性能点）描述的是设备（这里是 Cortex-A35 CPU）可以稳定工作的"频率 + 电压"组合点。STM32MP25系列处理器的OP-TEE固件中的设备树定义了这些OPP的子节点及其所支持的硬件类型。因此可以通过修改这里的设备树定义来突破型号限制，达到超频的目标，从而让C和F有一样的处理器主频性能。

## 如何查询处理器主频
默认的内核配置并没有暴露处理器频率，事实上，OP-TEE 在启动时读取这些 OPP 定义，然后通过 SCMI Performance Domain 协议把它们暴露给Linux。如果要让Linux查询运行主频，则需要开启这些内核配置选项：
```
# 1. CPUFreq 核心框架
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
```
可在当前板卡上查询上当前的内核配置：
```
zcat /proc/config.gz | grep -E "CPU_FREQ|SCMI|PM_OPP"
```

内核选项配置正确后，可以

```
# 查看两个大核的频率配置
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
```

## 在所有CPU类型上解锁1.5G主频
对于使用DEY AIO开发环境的用户来说，有现成的补丁可直接使用，如果你使用的manifest代码仓已经集成，直接repo sync即可。
如果您原有的代码仓库没有集成，或则完成测试后，想回退到补丁前，可删除下面这个optee补丁。
内核选项的配置仅是为了方便查询主频和调频策略，不影响是否超步。但如果您仍想隐藏cpufreq，可删除fragement.cfg (有些分支用cpufreq.cfg)中对cpufreq配置选项的定义。
```
Meta-custom
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
```
## 实时系统的额外考量

打了内核补丁实现超频后，一般需要认真重新测试一下实时性，看看是否引入未知的不确定性变化。
对于实时系统，为了最佳实时性，可能需要关键动态调频，或直接在内核选项配置中指定默认用performance
```
# 查看当前 governor
cat /sys/devices/system/cpu/cpufreq/policy0/scaling_governor

# 如果是 schedutil 或 ondemand，先切换到 performance 测试
echo performance > /sys/devices/system/cpu/cpufreq/policy0/scaling_governor

# 再跑一次 RT 测试对比
cyclictest -l 100000 -m -p 99 -i 1000
```