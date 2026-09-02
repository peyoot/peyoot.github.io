import{_ as e,o as a,c as i,b as t}from"./app-Crg5dGGQ.js";const n={},d=t(`<h1 id="实时镜像的测试" tabindex="-1"><a class="header-anchor" href="#实时镜像的测试"><span>实时镜像的测试</span></a></h1><p>即使带有多种GUI和应用程序包及例程的实时镜像，仍可以得到最佳的测试效果。编译出镜像固然是要优化技巧，对已经编译好的镜像做实时任务的优化同样重要。本文以CCMP255为例，它有两个A35大核。</p><p>1、查看各中断在CPU0/CPU1上的分布</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>cat /proc/interrupts
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>绝大部分外设中断都被分配到了 CPU0，这是默认中断亲和性的结果（GIC默认倾向于CPU0）。但本地定时器中断arch_timer，和核间中断重调度IPI却不受此限制，它们与CPU本地相关，无法通过简单的中断亲和性迁移。</p><ul><li>添加内核启动参数 在 U-Boot 的 extra_bootargs 中配置：</li></ul><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>setenv extra_bootargs isolcpus=1 nohz_full=1 rcu_nocbs=1 irqaffinity=0
saveenv
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>isolcpus=1：CPU1 脱离通用调度器，普通进程不会自动分配到 CPU1。 nohz_full=1：CPU1 上无任务运行时，停止周期性 tick（即 arch_timer 几乎不再触发）。 rcu_nocbs=1：RCU 回调 offload 到 CPU0，不在 CPU1 上执行。 irqaffinity=0：所有可迁移的中断默认只发往 CPU0。</p><p>重启后，再执行检查</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>taskset -c 0 cyclictest -p 98 -t 5 -a 1 -m -l 100000

各参数含义：
-a 1：把测量线程绑定到 CPU1
-t 1：只起 1 个测量线程（配合 -a 1 就是单核单线程）
taskset -c 0 ...：把 cyclictest 的主线程（非实时 SCHED_OTHER）钉在 CPU0 上，避免主线程干扰 CPU1 上的测量线程
-m：锁内存，防止换页
-n：用 clock_nanosleep，精度更高
-i 1000：1ms 周期
-l 100000：10 万次循环
-h 2000 测试结束时，输出一张延迟分布的直方图到终端,最大横坐标范围是 2000 微秒（2ms）。
2000 表示直方图的
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>或是带压力测试</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>#后台CPU0 满载（死循环）
taskset -c 0 sh -c &#39;while true; do :; done&#39; &amp;
#后台加IO压力
dd if=/dev/zero of=/dev/null bs=1M &amp;
#确认后台任务已启动
jobs
#在前台运行 cyclictest
taskset -c 0 cyclictest -p 98 -t 3 -a 1 -m -l 50000
#测试结束杀后台任务
kill %1 %2 或 kill $(jobs -p)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="实时性优化" tabindex="-1"><a class="header-anchor" href="#实时性优化"><span>实时性优化</span></a></h1><p>包括内核优化和软件服务优化</p><h2 id="内核优化" tabindex="-1"><a class="header-anchor" href="#内核优化"><span>内核优化</span></a></h2><p>无用的内核，像虚拟化支持等</p><h2 id="软件服务优化" tabindex="-1"><a class="header-anchor" href="#软件服务优化"><span>软件服务优化</span></a></h2><p>注意，不可以在local.conf中用变量名，而应该在bbappend中去用，比如在packagegroup-dey-network.bb中定义有：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>CELLULAR_PKGS = &quot; modemmanager ppp &quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>那么如果在local.conf中操作，就是对这两个包的移除，而不能用变量名，如果用bbapend或是image的配方，是可以用</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>CELLULAR_PKGS= &quot;&quot;
CCCS_PKGS = &quot;&quot;
CC_DEMO_PACKAGE = &quot;&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="distro-feature优化" tabindex="-1"><a class="header-anchor" href="#distro-feature优化"><span>Distro Feature优化</span></a></h4><p>Distro Feature内置特性不容易从安装包配置中，比如移除蜂窝网，在local.conf中使用</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>RDEPENDS:packagegroup-dey-network:remove = &quot; ppp modemmanager &quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>或是把包添加到IMAGE_INSTALL:remove</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>IMAGE_INSTALL:remove = &quot; ppp modemmanager &quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>都没有效果，这时就要查Distro Feature了</p><h5 id="移除modemmanager" tabindex="-1"><a class="header-anchor" href="#移除modemmanager"><span>移除ModemManager</span></a></h5><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>robin@dev-all-in-one-ubuntu:~/deyaio-viena/dey5.0/workspace/ccmp25-viena$ bitbake -e packagegroup-dey-network | grep ^DISTRO_FEATURES
DISTRO_FEATURES=&quot;acl alsa bluetooth debuginfod ext2 ipv4 ipv6 pcmcia usbgadget usbhost wifi xattr   pci    vfat seccomp opengl  multiarch  vulkan rt opengl pam  vulkan  opencl  cellular gstreamer pam efi optee systemd usrmerge pulseaudio gobject-introspection-data ldconfig&quot;
DISTRO_FEATURES_BACKFILL=&quot;pulseaudio sysvinit gobject-introspection-data ldconfig&quot;
DISTRO_FEATURES_BACKFILL_CONSIDERED=&quot; sysvinit&quot;
DISTRO_FEATURES_DEFAULT=&quot;acl alsa bluetooth debuginfod ext2 ipv4 ipv6 pcmcia usbgadget usbhost wifi xattr nfs zeroconf pci 3g nfc x11 vfat seccomp&quot;
DISTRO_FEATURES_FILTER_NATIVE=&quot;api-documentation debuginfod opengl wayland&quot;
DISTRO_FEATURES_FILTER_NATIVESDK=&quot;api-documentation debuginfod opengl wayland&quot;
DISTRO_FEATURES_NATIVE=&quot;acl x11 ipv6 xattr&quot;
DISTRO_FEATURES_NATIVESDK=&quot;x11&quot;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其中看到Default里有cellular 3g ，因此可以用DISTRO_FEATURES:remove移除</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>DISTRO_FEATURES:remove = &quot;  cellular 3g  &quot;

检查是否仍有/usr/sbin/ModemManager
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="禁用wifi-bt-音视频" tabindex="-1"><a class="header-anchor" href="#禁用wifi-bt-音视频"><span>禁用wifi，BT,音视频</span></a></h4><p>禁用这些可以提升实时性，但根据硬件需要可以有所选择保留</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>DISTRO_FEATURES:remove = &quot; pulseaudio alsa bluetooth wifi gstreamer &quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,34),s=[d];function l(r,c){return a(),i("div",null,s)}const u=e(n,[["render",l],["__file","realtime-opt.html.vue"]]),v=JSON.parse('{"path":"/zh/deyaio/wiki/ccmp25/realtime-opt.html","title":"实时镜像的测试","lang":"zh-CN","frontmatter":{"description":"实时镜像的测试 即使带有多种GUI和应用程序包及例程的实时镜像，仍可以得到最佳的测试效果。编译出镜像固然是要优化技巧，对已经编译好的镜像做实时任务的优化同样重要。本文以CCMP255为例，它有两个A35大核。 1、查看各中断在CPU0/CPU1上的分布 绝大部分外设中断都被分配到了 CPU0，这是默认中断亲和性的结果（GIC默认倾向于CPU0）。但本地...","head":[["meta",{"property":"og:url","content":"https://peyoot.github.io/zh/deyaio/wiki/ccmp25/realtime-opt.html"}],["meta",{"property":"og:title","content":"实时镜像的测试"}],["meta",{"property":"og:description","content":"实时镜像的测试 即使带有多种GUI和应用程序包及例程的实时镜像，仍可以得到最佳的测试效果。编译出镜像固然是要优化技巧，对已经编译好的镜像做实时任务的优化同样重要。本文以CCMP255为例，它有两个A35大核。 1、查看各中断在CPU0/CPU1上的分布 绝大部分外设中断都被分配到了 CPU0，这是默认中断亲和性的结果（GIC默认倾向于CPU0）。但本地..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"实时镜像的测试\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[{"level":2,"title":"内核优化","slug":"内核优化","link":"#内核优化","children":[]},{"level":2,"title":"软件服务优化","slug":"软件服务优化","link":"#软件服务优化","children":[]}],"git":{},"autoDesc":true,"filePathRelative":"zh/deyaio/wiki/ccmp25/realtime-opt.md"}');export{u as comp,v as data};
