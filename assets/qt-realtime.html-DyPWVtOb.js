import{_ as e,o as t,c as i,b as n}from"./app-BYAFID3Z.js";const a={},s=n(`<h1 id="支持实时的qt镜像编译" tabindex="-1"><a class="header-anchor" href="#支持实时的qt镜像编译"><span>支持实时的QT镜像编译</span></a></h1><p>为了在QT镜像下能有较好的实时效果，需要对镜像做一些裁减优化，可用repo检出下面仓库： repo init -u https://github.com/peyoot/dey-aio-manifest.git -b scarthgap -m qtfb-rtnodemo.xml 并在conf/local.conf中配置：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>DISTRO_FEATURES:append = &quot; rt&quot;

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

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,16),l=[s];function d(o,r){return t(),i("div",null,l)}const c=e(a,[["render",d],["__file","qt-realtime.html.vue"]]),v=JSON.parse('{"path":"/zh/deyaio/wiki/ccmp25/qt-realtime.html","title":"支持实时的QT镜像编译","lang":"zh-CN","frontmatter":{"description":"支持实时的QT镜像编译 为了在QT镜像下能有较好的实时效果，需要对镜像做一些裁减优化，可用repo检出下面仓库： repo init -u https://github.com/peyoot/dey-aio-manifest.git -b scarthgap -m qtfb-rtnodemo.xml 并在conf/local.conf中配置： QT例程...","head":[["link",{"rel":"alternate","hreflang":"en-us","href":"https://peyoot.github.io/deyaio/wiki/ccmp25/qt-realtime.html"}],["meta",{"property":"og:url","content":"https://peyoot.github.io/zh/deyaio/wiki/ccmp25/qt-realtime.html"}],["meta",{"property":"og:title","content":"支持实时的QT镜像编译"}],["meta",{"property":"og:description","content":"支持实时的QT镜像编译 为了在QT镜像下能有较好的实时效果，需要对镜像做一些裁减优化，可用repo检出下面仓库： repo init -u https://github.com/peyoot/dey-aio-manifest.git -b scarthgap -m qtfb-rtnodemo.xml 并在conf/local.conf中配置： QT例程..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:locale:alternate","content":"en-US"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"支持实时的QT镜像编译\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[],"git":{},"autoDesc":true,"filePathRelative":"zh/deyaio/wiki/ccmp25/qt-realtime.md"}');export{c as comp,v as data};
