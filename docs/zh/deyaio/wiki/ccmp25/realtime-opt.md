# 实时镜像的测试
即使带有多种GUI和应用程序包及例程的实时镜像，仍可以得到最佳的测试效果。编译出镜像固然是要优化技巧，对已经编译好的镜像做实时任务的优化同样重要。本文以CCMP255为例，它有两个A35大核。

1、查看各中断在CPU0/CPU1上的分布
```
cat /proc/interrupts
```
绝大部分外设中断都被分配到了 CPU0，这是默认中断亲和性的结果（GIC默认倾向于CPU0）。但本地定时器中断arch_timer，和核间中断重调度IPI却不受此限制，它们与CPU本地相关，无法通过简单的中断亲和性迁移。
  * 添加内核启动参数
  在 U-Boot 的 extra_bootargs 中配置：
```
setenv extra_bootargs isolcpus=1 nohz_full=1 rcu_nocbs=1 irqaffinity=0
saveenv
```
isolcpus=1：CPU1 脱离通用调度器，普通进程不会自动分配到 CPU1。
nohz_full=1：CPU1 上无任务运行时，停止周期性 tick（即 arch_timer 几乎不再触发）。
rcu_nocbs=1：RCU 回调 offload 到 CPU0，不在 CPU1 上执行。
irqaffinity=0：所有可迁移的中断默认只发往 CPU0。

重启后，再执行检查
```
taskset -c 0 cyclictest -p 98 -t 5 -a 1 -m -l 100000 -h 1000

各参数含义：
-a 1：把测量线程绑定到 CPU1
-t 1：只起 1 个测量线程（配合 -a 1 就是单核单线程）
taskset -c 0 ...：把 cyclictest 的主线程（非实时 SCHED_OTHER）钉在 CPU0 上，避免主线程干扰 CPU1 上的测量线程
-m：锁内存，防止换页
-n：用 clock_nanosleep，精度更高
-i 1000：1ms 周期
-l 100000：10 万次循环
```
或是
```
# CPU0 上加压（模拟真实业务）
taskset -c 0 stress-ng --cpu 1 --io 2 --vm 1 --vm-bytes 128M &

# CPU1 上跑实时测试
taskset -c 0 cyclictest -p 98 -t 1 -a 1 -m -n -i 1000 -l 1000000 -h 2000

# 跑完后杀掉 stress-ng
killall stress-ng
```



# 实时性优化
包括内核优化和软件服务优化
## 内核优化
无用的内核，像虚拟化支持等

## 软件服务优化
注意，不可以在local.conf中用变量名，而应该在bbappend中去用，比如在packagegroup-dey-network.bb中定义有：
```
CELLULAR_PKGS = " modemmanager ppp "
```
那么如果在local.conf中操作，就是对这两个包的移除，而不能用变量名，如果用bbapend或是image的配方，是可以用
```
CELLULAR_PKGS= ""
CCCS_PKGS = ""
CC_DEMO_PACKAGE = ""
```
#### Distro Feature优化
Distro Feature内置特性不容易从安装包配置中，比如移除蜂窝网，在local.conf中使用
```
RDEPENDS:packagegroup-dey-network:remove = " ppp modemmanager "
```
或是把包添加到IMAGE_INSTALL:remove
```
IMAGE_INSTALL:remove = " ppp modemmanager "
```
都没有效果，这时就要查Distro Feature了
##### 移除ModemManager
```
robin@dev-all-in-one-ubuntu:~/deyaio-viena/dey5.0/workspace/ccmp25-viena$ bitbake -e packagegroup-dey-network | grep ^DISTRO_FEATURES
DISTRO_FEATURES="acl alsa bluetooth debuginfod ext2 ipv4 ipv6 pcmcia usbgadget usbhost wifi xattr   pci    vfat seccomp opengl  multiarch  vulkan rt opengl pam  vulkan  opencl  cellular gstreamer pam efi optee systemd usrmerge pulseaudio gobject-introspection-data ldconfig"
DISTRO_FEATURES_BACKFILL="pulseaudio sysvinit gobject-introspection-data ldconfig"
DISTRO_FEATURES_BACKFILL_CONSIDERED=" sysvinit"
DISTRO_FEATURES_DEFAULT="acl alsa bluetooth debuginfod ext2 ipv4 ipv6 pcmcia usbgadget usbhost wifi xattr nfs zeroconf pci 3g nfc x11 vfat seccomp"
DISTRO_FEATURES_FILTER_NATIVE="api-documentation debuginfod opengl wayland"
DISTRO_FEATURES_FILTER_NATIVESDK="api-documentation debuginfod opengl wayland"
DISTRO_FEATURES_NATIVE="acl x11 ipv6 xattr"
DISTRO_FEATURES_NATIVESDK="x11"

```
其中看到Default里有cellular 3g ，因此可以用DISTRO_FEATURES:remove移除
```
DISTRO_FEATURES:remove = "  cellular 3g  "

检查是否仍有/usr/sbin/ModemManager
```
#### 禁用wifi，BT,音视频
禁用这些可以提升实时性，但根据硬件需要可以有所选择保留
```
DISTRO_FEATURES:remove = " pulseaudio alsa bluetooth wifi gstreamer "
```