import{_ as e,o as t,c as i,b as a}from"./app-oTA4_50g.js";const n={},l=a(`<h1 id="compiling-a-light-real-time-dey-image-with-qt-support" tabindex="-1"><a class="header-anchor" href="#compiling-a-light-real-time-dey-image-with-qt-support"><span>Compiling a light Real-time DEY Image with QT support</span></a></h1><p>To achieve better real-time performance under the QT image, some image trimming and optimization are required. After installing DEY AIO, You can check out the following repository using repo:</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>repo init -u https://github.com/peyoot/dey-aio-manifest.git -b scarthgap -m qtfb-rtnodemo.xml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>If you need QT5 support ,change it in conf/bblayers.conf, and then configure in conf/local.conf:</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>DISTRO_FEATURES:append = &quot; rt&quot;

# Add Qt base packages (core functionality only)
IMAGE_INSTALL:append = &quot; \\
    qtbase \\
    qtbase-plugins \\
    qtbase-examples \\
    qt5everywheredemo \\
&quot;

# Explicitly disable Wayland and OpenGL
DISTRO_FEATURES:remove = &quot;wayland opengl x11&quot;

# Ensure framebuffer support
DISTRO_FEATURES:append = &quot; fbdev &quot;

# Streamline qtbase configuration, enable only framebuffer and basic features
PACKAGECONFIG:remove:pn-qtbase = &quot;glib gles2 egl x11 xcb&quot;
PACKAGECONFIG:append:pn-qtbase = &quot; linuxfb gif png jpeg fontconfig&quot;

# Basic font support (optional but recommended)
IMAGE_INSTALL:append = &quot; ttf-dejavu-sans &quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="qt-examples" tabindex="-1"><a class="header-anchor" href="#qt-examples"><span>QT Examples</span></a></h2><p>Some programs, such as the analog clock example, require configuring environment variables:</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>export QT_QPA_PLATFORM=linuxfb
cd /usr/share/examples/widgets/widgets/analogclock
./analogclock /dev/null 2&gt;&amp;1 &amp;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>However, different programs use different libraries, and environment variables will have different effects. The default qt5everywhere example does not require the above parameter setting, and the default is more efficient:</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>export QT_QPA_PLATFORM=&quot;eglfs&quot;
cd /usr/share/qt5everywheredemo-1.0
./QtDemo &gt; /dev/null 2&gt;&amp;1 &amp;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Of course, compare to analogclock , this is a relatively larger demo with more memory footprint. so performance is not so good as pure core-image-base, but still can meet the expectation.</p><p>Real time performance can refer to following commands:</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>cyclictest -p 98 -t5 -m -l 100000

cyclictest --mlockall --smp --priority=98 --interval=1000 --distance=0 -l 100000
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,13),r=[l];function s(o,d){return t(),i("div",null,r)}const c=e(n,[["render",s],["__file","qt-realtime.html.vue"]]),p=JSON.parse('{"path":"/deyaio/wiki/ccmp25/qt-realtime.html","title":"Compiling a light Real-time DEY Image with QT support","lang":"en-US","frontmatter":{"description":"Compiling a light Real-time DEY Image with QT support To achieve better real-time performance under the QT image, some image trimming and optimization are required. After instal...","head":[["link",{"rel":"alternate","hreflang":"zh-cn","href":"https://peyoot.github.io/zh/deyaio/wiki/ccmp25/qt-realtime.html"}],["meta",{"property":"og:url","content":"https://peyoot.github.io/deyaio/wiki/ccmp25/qt-realtime.html"}],["meta",{"property":"og:title","content":"Compiling a light Real-time DEY Image with QT support"}],["meta",{"property":"og:description","content":"Compiling a light Real-time DEY Image with QT support To achieve better real-time performance under the QT image, some image trimming and optimization are required. After instal..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:locale:alternate","content":"zh-CN"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Compiling a light Real-time DEY Image with QT support\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[{"level":2,"title":"QT Examples","slug":"qt-examples","link":"#qt-examples","children":[]}],"git":{},"autoDesc":true,"filePathRelative":"deyaio/wiki/ccmp25/qt-realtime.md"}');export{c as comp,p as data};
