import{_ as e,o as n,c as i,b as s}from"./app-BqJ8WAA6.js";const d={},a=s(`<h1 id="ccmp25双屏显示研究" tabindex="-1"><a class="header-anchor" href="#ccmp25双屏显示研究"><span>CCMP25双屏显示研究</span></a></h1><h2 id="从linux显示子系统说起" tabindex="-1"><a class="header-anchor" href="#从linux显示子系统说起"><span>从Linux显示子系统说起</span></a></h2><p>背景知识： Linux的DRM（Direct Rendering Manager，直接渲染管理器）和KMS（Kernel Mode Setting，内核模式设置） 是Linux内核中用于管理图形显示的核心子系统。 DRM负责管理现代显卡的硬件加速图形渲染，提供统一的接口让用户空间程序（如X11、Wayland、应用程序）安全、高效地访问GPU功能。KMS是DRM的一个子模块，专门控制显示输出的基本设置，例如分辨率、刷新率、多显示器配置等。 设备树（Device Tree） 描述硬件连接，DRM/KMS驱动据此初始化显示控制器，实现屏幕驱动。</p><p>在 DRM/KMS 框架中，显示流水线是KMS模块的核心，它通过一系列硬件抽象对象来模拟现代显示控制器的工作流程。这个流水线定义了从内存中的图像数据（帧缓冲区）到物理显示器上像素的完整路径。即： FrameBuffer -&gt; Plane -&gt; CRTC -&gt; Encoder -&gt; Connector -&gt; 物理显示器</p><p>一个FrameBuffer是一块在内存（或显存）中分配好的缓冲区，里面存储了即将显示的一帧图像的像素数据，它与硬件无关，通常对应一个单独的图像图层。复杂的桌面合成器（如Wayland/Weston）会为每个窗口或界面元素创建各自的FrameBuffer。</p><h2 id="qt程序后端" tabindex="-1"><a class="header-anchor" href="#qt程序后端"><span>QT程序后端</span></a></h2><p>eglfs​是Qt的嵌入式平台插件，全称是 &quot;EGL Full Screen&quot;。它是专门为嵌入式 Linux 系统设计的显示后端，特点是：</p><ul><li>无窗口系统：直接在 framebuffer 上全屏渲染</li><li>低延迟：绕过了 X11/Wayland 等窗口管理器</li><li>轻量级：专为嵌入式设备优化</li><li>GPU 加速：通过 EGL/OpenGL ES 利用 GPU 硬件加速</li></ul><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>Qt应用程序
    ↓
Qt Quick / QWidgets
    ↓
OpenGL / OpenGL ES
    ↓
EGL (Embedded-System Graphics Library)
    ↓
GPU驱动 (Vivante, Mali, Adreno等)
    ↓
显示系统 (DRM/KMS 或 framebuffer)
    ↓
物理显示器
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>eglfs有两种主要后端，eglfs_kms通常能提供更好的性能和更低的延迟，因为它绕过了传统的窗口系统。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 这是你正在使用的后端
export QT_QPA_PLATFORM=eglfs
export QT_QPA_EGLFS_INTEGRATION=eglfs_kms
Qt应用 → OpenGL ES → EGL → DRM/KMS API → 内核DRM子系统 → 硬件显示控制器
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="设备树节点和drm关系" tabindex="-1"><a class="header-anchor" href="#设备树节点和drm关系"><span>设备树节点和DRM关系</span></a></h2><p>设备树告诉 DRM 驱动“硬件是什么、怎么连的”，DRM 驱动则根据这些信息来初始化和操作硬件。 SoC厂商提供的DRM驱动在启动时，会解析设备树中与显示相关的节点。在内部创建并注册对应的 DRM/KMS 核心对象（CRTC、Encoder、Connector、Plane），最终，这些硬件对象通过 /dev/dri/cardX 设备文件暴露给用户空间，供 libdrm 和显示服务器（如 Wayland/Weston）使用。</p><h2 id="如何在-drm-中找到对应的显示接口元素" tabindex="-1"><a class="header-anchor" href="#如何在-drm-中找到对应的显示接口元素"><span>如何在 DRM 中找到对应的显示接口元素</span></a></h2><p>1、检查dmesg</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>dmesg | grep -i &quot;drm\\|dri\\|connector\\|crtc&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>比如CCMP25上电时，会有两个DRM驱动被成功初始化了： [drm] Initialized simpledrm 1.0.0 20200625 for ba200000.framebuffer on minor 0 作用：simpledrm是一个简单的通用帧缓冲驱动，通常用于在系统启动早期提供基本的显示输出，直到更复杂的专用DRM驱动接管。它直接管理一个固定的帧缓冲内存区域（ba200000.framebuffer）。 [drm] Initialized stm 1.0.0 20170330 for 48010000.display-controller on minor 0 作用：stm 驱动是STM32平台专用的DRM显示驱动，用于驱动你的SoC（STM32MP系列）的显示控制器硬件（48010000.display-controller）。这是你的主显示驱动。</p><p>2、使用 modetest 工具（最直接）</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 查看所有 DRM 设备的显示流水线状态
modetest -M &lt;driver_name&gt; -s
# 例如，对于CCMP25平台：modetest -M stm -s

# 查看更详细的属性信息
modetest -M &lt;driver_name&gt; -p
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>3、查看内核调试文件系统（debugfs） 内核 DRM 驱动通常会在 /sys/kernel/debug/dri/ 目录下提供丰富的调试信息。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 假设 card0 是第一个 DRM 设备
ls /sys/kernel/debug/dri/0/

# 查看显示流水线各组件状态
cat /sys/kernel/debug/dri/0/state
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>4、直接查看 /sys/class/drm/ 目录 这是一个用户空间友好的接口，以目录结构展示 DRM 设备。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>ls /sys/class/drm/
# 通常会看到 card0、card0-DSI-1、card0-HDMI-A-1 等目录

# 查看某个 connector 的状态
cat /sys/class/drm/card0-HDMI-A-1/status # 输出可能是 &quot;connected&quot; 或 &quot;disconnected&quot;
cat /sys/class/drm/card0-LVDS-1/modes # 显示支持的分辨率模式
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="weston的双屏显示切换" tabindex="-1"><a class="header-anchor" href="#weston的双屏显示切换"><span>weston的双屏显示切换</span></a></h2><p>weston服务可通过/etc/xdg/weston/weston.ini来指定配置，如果硬件不能支持双屏显示，也可以通过两个不同的配置文件来切换。DEY下的weston服务通过/lib/systemd/system/weston-launch.service这个服务文件来控制，开启或停止weston，只需：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>systemctl start/stop weston-launch
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="无weston的双屏显示切换" tabindex="-1"><a class="header-anchor" href="#无weston的双屏显示切换"><span>无weston的双屏显示切换</span></a></h2><p>如果是QT程序，主要取决于QT的配置</p><h2 id="实站ccmp25开发套件" tabindex="-1"><a class="header-anchor" href="#实站ccmp25开发套件"><span>实站ccmp25开发套件</span></a></h2><p>下面以实例来展示，最开始在设备树中开启两个显示器都为1280x800分辨率，不过由于HDMI显示器至少需要60Hz的刷新率才能显示，所以下面这个输出看似正常，但HDMI并没有生效，最后一个命令可看到HDMI的crtc是null</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>root@ccmp25-dvk:~# ls /sys/class/drm/
card0           card0-HDMI-A-1  card0-LVDS-1    version
root@ccmp25-dvk:~# cat /sys/class/drm/card0-HDMI-A-1/status
connected
root@ccmp25-dvk:~# cat /sys/class/drm/card0-HDMI-A-1/modes 
1280x800
root@ccmp25-dvk:~# cat /sys/class/drm/card0-LVDS-1/status
connected
root@ccmp25-dvk:~# cat /sys/class/drm/card0-LVDS-1/modes 
1280x800
root@ccmp25-dvk:~# cat /sys/kernel/debug/dri/0/state
...
crtc[44]: crtc-0
...
        mode: &quot;1280x800&quot;: 60 71000 1280 1328 1360 1440 800 803 809 824 0x48 0x0
...
connector[32]: HDMI-A-1
        crtc=(null)
        self_refresh_aware=0
        max_requested_bpc=0
        colorspace=Default
connector[34]: LVDS-1
        crtc=crtc-0
        self_refresh_aware=0
        max_requested_bpc=0
        colorspace=Default
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但此时LVDS也没显示，这就和weston.ini有关了，</p>`,32),l=[a];function t(r,c){return n(),i("div",null,l)}const m=e(d,[["render",t],["__file","dualdisplay.html.vue"]]),o=JSON.parse('{"path":"/zh/deyaio/viena/dualdisplay.html","title":"CCMP25双屏显示研究","lang":"zh-CN","frontmatter":{"description":"CCMP25双屏显示研究 从Linux显示子系统说起 背景知识： Linux的DRM（Direct Rendering Manager，直接渲染管理器）和KMS（Kernel Mode Setting，内核模式设置） 是Linux内核中用于管理图形显示的核心子系统。 DRM负责管理现代显卡的硬件加速图形渲染，提供统一的接口让用户空间程序（如X11、Wa...","head":[["meta",{"property":"og:url","content":"https://peyoot.github.io/zh/deyaio/viena/dualdisplay.html"}],["meta",{"property":"og:title","content":"CCMP25双屏显示研究"}],["meta",{"property":"og:description","content":"CCMP25双屏显示研究 从Linux显示子系统说起 背景知识： Linux的DRM（Direct Rendering Manager，直接渲染管理器）和KMS（Kernel Mode Setting，内核模式设置） 是Linux内核中用于管理图形显示的核心子系统。 DRM负责管理现代显卡的硬件加速图形渲染，提供统一的接口让用户空间程序（如X11、Wa..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"CCMP25双屏显示研究\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[{"level":2,"title":"从Linux显示子系统说起","slug":"从linux显示子系统说起","link":"#从linux显示子系统说起","children":[]},{"level":2,"title":"QT程序后端","slug":"qt程序后端","link":"#qt程序后端","children":[]},{"level":2,"title":"设备树节点和DRM关系","slug":"设备树节点和drm关系","link":"#设备树节点和drm关系","children":[]},{"level":2,"title":"如何在 DRM 中找到对应的显示接口元素","slug":"如何在-drm-中找到对应的显示接口元素","link":"#如何在-drm-中找到对应的显示接口元素","children":[]},{"level":2,"title":"weston的双屏显示切换","slug":"weston的双屏显示切换","link":"#weston的双屏显示切换","children":[]},{"level":2,"title":"无weston的双屏显示切换","slug":"无weston的双屏显示切换","link":"#无weston的双屏显示切换","children":[]},{"level":2,"title":"实站ccmp25开发套件","slug":"实站ccmp25开发套件","link":"#实站ccmp25开发套件","children":[]}],"git":{},"autoDesc":true,"filePathRelative":"zh/deyaio/viena/dualdisplay.md"}');export{m as comp,o as data};
