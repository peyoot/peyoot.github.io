import{_ as e,o as i,c as n,b as s}from"./app-oTA4_50g.js";const l={},d=s(`<h1 id="安装" tabindex="-1"><a class="header-anchor" href="#安装"><span>安装</span></a></h1><hr><p>为了正确安装和使用dey-aio，您需要安装yocto开发环境所需的依赖包，如果您要使用docker进行开发，则还需要安装docker和docker-compose。 强烈建议您使用一台Linux服务器来安装deyaio开发环境。由于编译自定义的Linux镜像，特别是第一次编译耗时较长，尽量避免使用笔记本或日常工作的电脑来安装DEY开发环境。使用服务器来安装开发环境，在开发时通过日常工作所用的电脑 SSH远程登陆的方式来进行配置和编译，结合tmux工具让编译在SSH Session退出或关闭的情况下不中断编译过程，从而获得更好的系统编译开发体验。 下面安装过程以Ubuntu 22.04为例，同样也适用于Ubuntu 20.04，请使用普通用户来执行这些命令。</p><p>由于国内github访问经常被间歇式阻断，而编译过程中需要流畅的github访问，建议使用PVPN自行搭建科学上网的环境，以确保编译不受GFW防火墙的干扰。</p><h2 id="安装必要的依赖包" tabindex="-1"><a class="header-anchor" href="#安装必要的依赖包"><span>安装必要的依赖包</span></a></h2><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>sudo apt update
sudo apt install gawk wget bison file flex git diffstat unzip texinfo gcc build-essential chrpath socat cpio python3 python3-pip python3-pexpect xz-utils debianutils iputils-ping python3-git python3-jinja2 libegl1-mesa-dev libsdl1.2-dev libncurses-dev pylint xterm python3-subunit mesa-common-dev zstd liblz4-tool tmux
sudo apt install python-is-python3
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="安装repo并配置好git" tabindex="-1"><a class="header-anchor" href="#安装repo并配置好git"><span>安装repo并配置好git</span></a></h2><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>sudo apt install repo
git config --global user.name  “yourname”   请用你的英文名称替换yourname
git config --global user.email &quot;you@email.com“  请用你的邮箱替换
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="用repo安装dey-aio工具集" tabindex="-1"><a class="header-anchor" href="#用repo安装dey-aio工具集"><span>用repo安装dey-aio工具集</span></a></h2><p>dey-aio-manifest的main分支持包含不同版本的DEY支持，如果只需开发特定版本，也可以用Yocto代号指定</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>cd
mkdir deyaio-viena
cd deyaio-viena
repo init -u https://github.com/peyoot/dey-aio-manifest.git -b scarthgap -m viena.xml 
repo sync
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样，dey-aio的工具集就安装好了，可以新建项目进行DEY系统开发。</p><h2 id="编译系统镜像前的准备" tabindex="-1"><a class="header-anchor" href="#编译系统镜像前的准备"><span>编译系统镜像前的准备</span></a></h2><p>dey-aio工具集在安装时就已经自动拉取DEY源码到sources，您可以在workspace中创建项目，直接编译。本项目对下载目录和sstate缓存做了一些优化处理，它们都存放于父级目录下的project_shared，以方便不同项目使用。</p><p>1、创建项目</p><div class="language-text-plain line-numbers-mode" data-ext="text-plain" data-title="text-plain"><pre class="language-text-plain"><code>cd workspace
mkdir ccmp25-viena
source ../../mkproject.sh -l
source ../../mkproject.sh -p ccmp25-dvk
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>阅读DEY的开源声明，空格键翻页，最后输入y确认。</p><p>创建好项目后，根据需要更改QT支持选项，修改conf/bblayers.conf中的QT版本，默认是QT6，如果是要QT5，请改为QT5。</p><p>在conf/local.conf中设置实时选项，添加或移除包， 实时开启：</p><p>如果需要对镜像做裁减和增加不同包，可以用： IMAGE_INSTALL:append = &quot; 包名&quot; 和 IMAGE_INSTALL:remove = &quot; 包名&quot; 来实现。 大而全的配置可以用下面这个，然后再裁减：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>DISTRO_FEATURES:append = &quot; rt opengl pam  hwlatdetect&quot;

DISTRO_FEATURES:remove = &quot; wayland x11&quot;

# IMAGE_FEATURES:append = &quot; ssh-server-openssh&quot;
# 设置默认的Qt平台（针对STM32MP25优化）
QT_QPA_DEFAULT_PLATFORM = &quot;eglfs&quot;

# STM32特定的eglfs配置
QT_QPA_EGLFS_INTEGRATION = &quot;eglfs_kms&quot;
#QT_QPA_EGLFS_KMS_CONFIG = &quot;/etc/qt5/eglfs_kms_config.json&quot;

GLIBC_GENERATE_LOCALES = &quot;zh_CN.UTF-8 en_GB.UTF-8 en_US.UTF-8&quot;
IMAGE_LINGUAS = &quot;zh-cn&quot;
LOCALE_UTF8_ONLY=&quot;1&quot;

IMAGE_INSTALL:append = &quot; perf glibc-utils localedef tmux homeaddons&quot;

IMAGE_INSTALL:append = &quot; \\
    touch-calibration \\
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
    qtremoteobjects \\
    libxkbcommon \\
    libdrm \\
    libegl \\
    libgles2 \\
    tslib tslib-calibrate tslib-tests evtest \\
    iproute2 numactl i2c-tools perl opkg \\
    mesa \\
&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="镜像优化" tabindex="-1"><a class="header-anchor" href="#镜像优化"><span>镜像优化</span></a></h2><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>DISTRO_FEATURES:append = &quot; rt opengl pam &quot;
DISTRO_FEATURES:remove = &quot; wayland x11 &quot;

# 设置默认的Qt平台（针对STM32MP25优化）
QT_QPA_DEFAULT_PLATFORM = &quot;eglfs&quot;
QT_QPA_EGLFS_INTEGRATION = &quot;eglfs_kms&quot;

GLIBC_GENERATE_LOCALES = &quot;zh_CN.UTF-8 en_GB.UTF-8 en_US.UTF-8&quot;
IMAGE_LINGUAS = &quot;zh-cn&quot;
# LOCALE_UTF8_ONLY=&quot;1&quot;

IMAGE_INSTALL:append = &quot; \\
    qtbase \\
    qtbase-plugins \\
    qtdeclarative \\
    qtquickcontrols2 \\
    qtquickcontrols2-qmlplugins \\
    qtgraphicaleffects \\
    qtgraphicaleffects-qmlplugins \\
    qtsvg \\
    qtserialport \\
    qtwebsockets \\
    libdrm \\
    libegl \\
    libgles2 \\
    tslib tslib-calibrate touch-calibration \\
    homeaddons \\
    iproute2 i2c-tools \\
    mesa \\
    ttf-dejavu-sans \\
&quot;

RDEPENDS:packagegroup-dey-core:remove = &quot;connectcore-demo-example&quot;
CELLULAR_PKGS= &quot;&quot;
CCCS_PKGS = &quot;&quot;
CC_DEMO_PACKAGE = &quot;&quot;


# 移除不再需要的配置，特别是明确禁用linuxfb和egl
PACKAGECONFIG:remove:pn-qtbase = &quot;glib x11 xcb linuxfb&quot;
PACKAGECONFIG:remove:pn-gstreamer1.0-plugins-bad = &quot;vulkan&quot;

# 添加DRM/KMS和硬件加速所必须的配置
PACKAGECONFIG:append:pn-qtbase = &quot; kms gbm eglfs egl gles2 fontconfig jpeg png gif&quot;

IMAGE_INSTALL:remove = &quot; wayland wayland-protocols libxkbcommon libinput libevdev \\
                         mtdev vsftpd lighttpd avahi-daemon hostapd \\
                         tools-debug \\
                         swupdate swupdate-www ssh-server-openssh \\
                       &quot;


</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,23),a=[d];function t(o,r){return i(),n("div",null,a)}const v=e(l,[["render",t],["__file","gs.html.vue"]]),u=JSON.parse('{"path":"/zh/deyaio/viena/gs.html","title":"安装","lang":"zh-CN","frontmatter":{"description":"安装 为了正确安装和使用dey-aio，您需要安装yocto开发环境所需的依赖包，如果您要使用docker进行开发，则还需要安装docker和docker-compose。 强烈建议您使用一台Linux服务器来安装deyaio开发环境。由于编译自定义的Linux镜像，特别是第一次编译耗时较长，尽量避免使用笔记本或日常工作的电脑来安装DEY开发环境。使用...","head":[["meta",{"property":"og:url","content":"https://peyoot.github.io/zh/deyaio/viena/gs.html"}],["meta",{"property":"og:title","content":"安装"}],["meta",{"property":"og:description","content":"安装 为了正确安装和使用dey-aio，您需要安装yocto开发环境所需的依赖包，如果您要使用docker进行开发，则还需要安装docker和docker-compose。 强烈建议您使用一台Linux服务器来安装deyaio开发环境。由于编译自定义的Linux镜像，特别是第一次编译耗时较长，尽量避免使用笔记本或日常工作的电脑来安装DEY开发环境。使用..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"安装\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[{"level":2,"title":"安装必要的依赖包","slug":"安装必要的依赖包","link":"#安装必要的依赖包","children":[]},{"level":2,"title":"安装repo并配置好git","slug":"安装repo并配置好git","link":"#安装repo并配置好git","children":[]},{"level":2,"title":"用repo安装dey-aio工具集","slug":"用repo安装dey-aio工具集","link":"#用repo安装dey-aio工具集","children":[]},{"level":2,"title":"编译系统镜像前的准备","slug":"编译系统镜像前的准备","link":"#编译系统镜像前的准备","children":[]},{"level":2,"title":"镜像优化","slug":"镜像优化","link":"#镜像优化","children":[]}],"git":{},"autoDesc":true,"filePathRelative":"zh/deyaio/viena/gs.md"}');export{v as comp,u as data};
