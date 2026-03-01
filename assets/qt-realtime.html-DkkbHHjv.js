import{_ as e,o as n,c as i,b as l}from"./app-oTA4_50g.js";const s={},a=l(`<h1 id="支持实时的qt镜像编译" tabindex="-1"><a class="header-anchor" href="#支持实时的qt镜像编译"><span>支持实时的QT镜像编译</span></a></h1><p>为了在QT镜像下能有较好的实时效果，需要对镜像做一些裁减优化，可用repo检出下面仓库： repo init -u https://github.com/peyoot/dey-aio-manifest.git -b scarthgap -m qtfb-rtnodemo.xml 并在conf/local.conf中配置：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>DISTRO_FEATURES:append = &quot; rt&quot;

# 添加Qt基础包（仅核心功能）
IMAGE_INSTALL:append = &quot; \\
    qtbase \\
    qtbase-plugins \\
    qtbase-examples \\
    qt5everywheredemo \\
&quot;

# 显式禁用Wayland和OpenGL
DISTRO_FEATURES:remove = &quot;wayland opengl x11&quot;

# 确保framebuffer支持
DISTRO_FEATURES:append = &quot; fbdev &quot;

# 精简qtbase配置，只启用framebuffer和基础功能
PACKAGECONFIG:remove:pn-qtbase = &quot;glib gles2 egl x11 xcb&quot;
PACKAGECONFIG:append:pn-qtbase = &quot; linuxfb gif png jpeg fontconfig&quot;

# 基础字体支持（可选，但推荐）
IMAGE_INSTALL:append = &quot; ttf-dejavu-sans &quot;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="qt例程" tabindex="-1"><a class="header-anchor" href="#qt例程"><span>QT例程</span></a></h1><p>时钟例程，需要先设置环境变量</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>export QT_QPA_PLATFORM=linuxfb
./analogclock &gt; /dev/null 2&gt;&amp;1 &amp;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="qt5镜像上电后的默认环境变量" tabindex="-1"><a class="header-anchor" href="#qt5镜像上电后的默认环境变量"><span>QT5镜像上电后的默认环境变量</span></a></h1><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>export DBUS_SESSION_BUS_ADDRESS=&quot;unix:path=/run/user/0/bus&quot;
export EDITOR=&quot;vi&quot;
export HOME=&quot;/root&quot;
export HUSHLOGIN=&quot;FALSE&quot;
export LANG=&quot;C&quot;
export LOGNAME=&quot;root&quot;
export MAIL=&quot;/var/spool/mail/root&quot;
export MOTD_SHOWN=&quot;pam&quot;
export OLDPWD
export OPIEDIR
export PATH=&quot;/usr/local/bin:/usr/bin:/bin:/usr/local/sbin:/usr/sbin:/sbin&quot;
export PS1=&quot;\\\\u@\\\\h:\\\\w\\\\\\$ &quot;
export PWD=&quot;/root&quot;
export QPEDIR
export QTDIR
export QT_QPA_EGLFS_ALWAYS_SET_MODE=&quot;1&quot;
export QT_QPA_EGLFS_INTEGRATION=&quot;eglfs_kms&quot;
export QT_QPA_EGLFS_KMS_ATOMIC=&quot;1&quot;
export QT_QPA_EGLFS_KMS_CONFIG=&quot;/usr/share/qt5/cursor.json&quot;
export QT_QPA_PLATFORM=&quot;eglfs&quot;
export SHELL=&quot;/bin/sh&quot;
export SHLVL=&quot;1&quot;
export SYSTEMD_PAGER=&quot;&quot;
export TERM=&quot;linux&quot;
export USER=&quot;root&quot;
export XDG_RUNTIME_DIR=&quot;/run/user/0&quot;
export XDG_SESSION_CLASS=&quot;user&quot;
export XDG_SESSION_ID=&quot;c1&quot;
export XDG_SESSION_TYPE=&quot;tty&quot;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="完整测试流程" tabindex="-1"><a class="header-anchor" href="#完整测试流程"><span>完整测试流程</span></a></h1><p>上电后，用root登陆后，稍等个15秒，以防止有登陆后没执行完的启动脚本影响测试结果。</p><p>有些程序，比如指针时钟的例程需要配置环境变量：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>export QT_QPA_PLATFORM=linuxfb
cd /usr/share/examples/widgets/widgets/analogclock
./analogclock /dev/null 2&gt;&amp;1 &amp;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>不过不同的程序，用到不同的库，环境变量会有不同的效果，默认的qt5everywhere例程就不需要上面这条参数设置，反而默认的会更高效:</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>export QT_QPA_PLATFORM=&quot;eglfs&quot;
cd /usr/share/qt5everywheredemo-1.0
./QtDemo &gt; /dev/null 2&gt;&amp;1 &amp;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当然，这是个相当大的例程，所以和占用内存大小也有关系， 测试命令可以参考：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>cyclictest -p 98 -t5 -m -l 100000

cyclictest --mlockall --smp --priority=98 --interval=1000 --distance=0 -l 100000

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="无显示接口的ccmp25plc板卡进阶配置" tabindex="-1"><a class="header-anchor" href="#无显示接口的ccmp25plc板卡进阶配置"><span>无显示接口的ccmp25plc板卡进阶配置</span></a></h1><p>有些PLC板卡没有显示接口，此时可以通过上位机来显示。包括：直接X11转发（SSH），使用VNC，和虚拟帧缓冲（Xvfb）。 如果板子上运行完整的X11服务器（包括窗口管理器），那么它需要较多的资源，因为它提供了完整的桌面环境支持。但是，我们也可以只运行一个极简的X服务器（比如Xvfb）而不运行窗口管理器。 Xvfb（虚拟帧缓冲X服务器）是一个不输出到物理显示器的X服务器。它只在内存中模拟一个帧缓冲区。因此，它不需要物理显示设备，也不需要图形界面。相比完整的X服务器，Xvfb省去了与物理显示设备交互的部分，因此更轻量。</p><h2 id="xvfb方案" tabindex="-1"><a class="header-anchor" href="#xvfb方案"><span>xvfb方案</span></a></h2><p>ST公司的ccmp25plc板并没有显示接口，因此我们可以用Xvfb配合VNC实现远程的界面显示。</p><h3 id="项目配置" tabindex="-1"><a class="header-anchor" href="#项目配置"><span>项目配置</span></a></h3><p>在conf/local.conf中配置</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># Add Qt base packages (core functionality only)
IMAGE_INSTALL:append = &quot; \\
    qtbase \\
    qtbase-plugins \\
    qtbase-examples \\
    qt5everywheredemo \\
    xauth \\
    xserver-xorg \\
    x11vnc \\
    libx11 \\
    libxcb \\
    mesa \\                    # 开源OpenGL实现
    mesa-demos \\              # OpenGL测试工具
    libglu \\                  # OpenGL工具库
&quot;

# Ensure framebuffer or xvfb support
DISTRO_FEATURES:append = &quot; fbdev x11 opengl gles2 &quot;


# Streamline qtbase configuration, enable only framebuffer and basic features
# PACKAGECONFIG:remove:pn-qtbase = &quot;glib gles2 egl x11 xcb&quot;
# PACKAGECONFIG:append:pn-qtbase = &quot; linuxfb gles2 gif jpeg fontconfig xcb&quot;

IMAGE_INSTALL:append = &quot; \\
    qt5everywheredemo \\
    xauth \\
    xorg-xserver-xvfb \\
    x11vnc \\
    libx11 \\
    libxcb \\
    mesa \\
    mesa-demos \\
    libglu \\
&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="使用方式" tabindex="-1"><a class="header-anchor" href="#使用方式"><span>使用方式</span></a></h3><p>方式1：手动选择后端</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 使用framebuffer（如果有物理显示）
export QT_QPA_PLATFORM=linuxfb
./qt_app

# 使用Xvfb（远程显示）
export DISPLAY=:99
export QT_QPA_PLATFORM=xcb
Xvfb :99 -screen 0 1024x768x24 &amp;
./qt_app

# 使用VNC直接显示
export QT_QPA_PLATFORM=vnc:size=800x600
./qt_app
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>方式2：自动检测脚本</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># /usr/bin/start-qt-remote
#!/bin/sh
export DISPLAY=:99

# 启动Xvfb
Xvfb :99 -screen 0 1024x768x24 &amp;

# 启动VNC服务器（可选）
x11vnc -display :99 -forever -shared -nopw -bg

# 设置QT平台
export QT_QPA_PLATFORM=xcb

# 运行应用
exec &quot;$@&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="虚拟drm方案" tabindex="-1"><a class="header-anchor" href="#虚拟drm方案"><span>虚拟DRM方案</span></a></h2><p>但上面有一个缺点，xvfb通常没法用集成的GPU。 在QT中，我们通常使用eglfs（基于EGL的全屏显示）平台插件来利用GPU进行硬件加速。但是，eglfs需要实际的显示设备（即使是一个虚拟的显示设备节点）。在无显示接口的核心板上，我们可以创建一个虚拟的DRM（Direct Rendering Manager）设备，然后让eglfs使用这个虚拟设备。</p>`,30),t=[a];function d(r,v){return n(),i("div",null,t)}const c=e(s,[["render",d],["__file","qt-realtime.html.vue"]]),o=JSON.parse('{"path":"/zh/deyaio/wiki/ccmp25/qt-realtime.html","title":"支持实时的QT镜像编译","lang":"zh-CN","frontmatter":{"description":"支持实时的QT镜像编译 为了在QT镜像下能有较好的实时效果，需要对镜像做一些裁减优化，可用repo检出下面仓库： repo init -u https://github.com/peyoot/dey-aio-manifest.git -b scarthgap -m qtfb-rtnodemo.xml 并在conf/local.conf中配置： QT例程...","head":[["link",{"rel":"alternate","hreflang":"en-us","href":"https://peyoot.github.io/deyaio/wiki/ccmp25/qt-realtime.html"}],["meta",{"property":"og:url","content":"https://peyoot.github.io/zh/deyaio/wiki/ccmp25/qt-realtime.html"}],["meta",{"property":"og:title","content":"支持实时的QT镜像编译"}],["meta",{"property":"og:description","content":"支持实时的QT镜像编译 为了在QT镜像下能有较好的实时效果，需要对镜像做一些裁减优化，可用repo检出下面仓库： repo init -u https://github.com/peyoot/dey-aio-manifest.git -b scarthgap -m qtfb-rtnodemo.xml 并在conf/local.conf中配置： QT例程..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:locale:alternate","content":"en-US"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"支持实时的QT镜像编译\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[{"level":2,"title":"xvfb方案","slug":"xvfb方案","link":"#xvfb方案","children":[{"level":3,"title":"项目配置","slug":"项目配置","link":"#项目配置","children":[]},{"level":3,"title":"使用方式","slug":"使用方式","link":"#使用方式","children":[]}]},{"level":2,"title":"虚拟DRM方案","slug":"虚拟drm方案","link":"#虚拟drm方案","children":[]}],"git":{},"autoDesc":true,"filePathRelative":"zh/deyaio/wiki/ccmp25/qt-realtime.md"}');export{c as comp,o as data};
