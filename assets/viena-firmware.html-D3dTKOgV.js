import{_ as e,o as n,c as i,b as s}from"./app-oTA4_50g.js";const l={},t=s(`<h1 id="版本记录" tabindex="-1"><a class="header-anchor" href="#版本记录"><span>版本记录</span></a></h1><p>20251226： 镜像 core-image-base QT5实时 事件 lvds屏亮点 ccmp25_dt 89a59ba localconf:</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>
DISTRO_FEATURES:append = &quot; rt opengl pam  hwlatdetect&quot;

DISTRO_FEATURES:remove = &quot;wayland x11&quot;

IMAGE_FEATURES:append = &quot; ssh-server-openssh&quot;

# 设置默认的Qt平台（针对STM32MP25优化）
QT_QPA_DEFAULT_PLATFORM = &quot;eglfs&quot;

# STM32特定的eglfs配置
QT_QPA_EGLFS_INTEGRATION = &quot;eglfs_kms&quot;
#QT_QPA_EGLFS_KMS_CONFIG = &quot;/etc/qt5/eglfs_kms_config.json&quot;

IMAGE_INSTALL:append = &quot; \\
    qtbase \\
    qtbase-plugins \\
    qtdeclarative \\
    qtquickcontrols2 \\
    qtquickcontrols2-qmlplugins \\
    qtgraphicaleffects \\
    qt5everywheredemo \\
    qtdeclarative-qmlplugins \\
    qtquickcontrols-qmlplugins \\
    qtquickcontrols2-qmlplugins \\
    qtquick3d qt3d qtcharts qtmultimedia qtsvg \\
  qtserialport qtsensors qtwebsockets qtvirtualkeyboard \\
  qtremoteobjects cinematicexperience-rhi \\
    wayland \\
    qtwayland \\
    libxkbcommon \\
    libdrm \\
    libegl \\
    libgles2 \\
    tslib \\
    iproute2 numactl i2c-tools perl opkg \\
    mesa \\
&quot;


IMAGE_INSTALL:remove = &quot; wayland wayland-protocols libxkbcommon libinput libevdev mtdev&quot;
IMAGE_INSTALL:append = &quot; util-linux-chrt util-linux-taskset util-linux-lscpu&quot;

# PACKAGE_EXCLUDE:append = &quot; modemmanager ppp&quot;

# 配置qtbase
PACKAGECONFIG:remove:pn-qtbase = &quot;x11 xcb&quot;
PACKAGECONFIG:append:pn-qtbase = &quot; gles2 egl gbm kms eglfs&quot;
PACKAGECONFIG:remove:pn-gstreamer1.0-plugins-bad = &quot;vulkan&quot;

RDEPENDS:packagegroup-dey-core:remove = &quot;connectcore-demo-example&quot;
CELLULAR_PKGS= &quot;&quot;
CCCS_PKGS = &quot;&quot;
CC_DEMO_PACKAGE = &quot;&quot;


# 字体支持
IMAGE_INSTALL:append = &quot; \\
    ttf-dejavu-sans \\
    ttf-dejavu-sans-mono \\
    ttf-dejavu-serif \\
    fontconfig-utils \\
&quot;


</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,3),d=[t];function a(r,v){return n(),i("div",null,d)}const u=e(l,[["render",a],["__file","viena-firmware.html.vue"]]),o=JSON.parse('{"path":"/zh/note/digi/dey/customers/viena-firmware.html","title":"版本记录","lang":"zh-CN","frontmatter":{"description":"版本记录 20251226： 镜像 core-image-base QT5实时 事件 lvds屏亮点 ccmp25_dt 89a59ba localconf:","head":[["meta",{"property":"og:url","content":"https://peyoot.github.io/zh/note/digi/dey/customers/viena-firmware.html"}],["meta",{"property":"og:title","content":"版本记录"}],["meta",{"property":"og:description","content":"版本记录 20251226： 镜像 core-image-base QT5实时 事件 lvds屏亮点 ccmp25_dt 89a59ba localconf:"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"版本记录\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[],"git":{},"autoDesc":true,"filePathRelative":"zh/note/digi/dey/customers/viena-firmware.md"}');export{u as comp,o as data};
