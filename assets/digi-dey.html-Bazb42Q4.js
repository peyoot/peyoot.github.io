import{_ as e,o as n,c as a,b as i}from"./app-KcBkLqJR.js";const s={},d=i(`<h1 id="dey-镜像常用配置" tabindex="-1"><a class="header-anchor" href="#dey-镜像常用配置"><span>DEY 镜像常用配置</span></a></h1><h2 id="cc93" tabindex="-1"><a class="header-anchor" href="#cc93"><span>cc93</span></a></h2><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>IMAGE_INSTALL:append = &quot; packagegroup-imx-ml nano&quot;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="dey的显示接口配置" tabindex="-1"><a class="header-anchor" href="#dey的显示接口配置"><span>DEY的显示接口配置</span></a></h1><h2 id="cc8mn" tabindex="-1"><a class="header-anchor" href="#cc8mn"><span>CC8MN</span></a></h2><p>fusion display 屏：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>=&gt; setenv overlays _ov_board_hsd101pfw2-lvds_ccimx8m-dvk.dtbo
=&gt; saveenv
或是
To enable the LVDS with the AUO 10&quot; LCD display:
=&gt; setenv overlays ccimx8m-dvk_lvds.dtbo,\${overlays}
To enable the LVDS with the Fusion 10&quot; LCD display:
=&gt; setenv overlays ccimx8m-dvk_hsd101pfw2-lvds.dtbo,\${overlays}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="cc93rtsp-演示配置" tabindex="-1"><a class="header-anchor" href="#cc93rtsp-演示配置"><span>cc93rtsp 演示配置</span></a></h1><p>刷完固件后，需更改的一些地方：</p><p>1、/etc/NetworkManager/NetworkManager.conf 把interface-name:wlan0;添加进unmanaged-devices列表中。</p><p>2、/etc/network/interfaces中，把wifi-direct注释掉，仅保留uap0，插上摄像头，reboot重启</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>auto lo
iface lo inet loopback

# WiFi P2P interface
#auto wfd0
#iface wfd0 inet static
#        address 192.168.45.30
#        netmask 255.255.255.0
#        wpa-driver nl80211
#        wpa-conf /etc/wpa_supplicant_p2p.conf
#        pre-up [ -d /proc/device-tree/wireless ]

# Wi-Fi AP interface (NXP IW612)
auto uap0
iface uap0 inet static
        address 192.168.46.30
        netmask 255.255.255.0
        pre-up [ -d /proc/device-tree/wireless ] &amp;&amp; REGION=$(fw_printenv -n region_code 2&gt;/dev/null || echo US) &amp;&amp; wl country $REGION || iw reg set $REGION
        post-up systemctl start hostapd@uap0.service
        post-up udhcpd /etc/udhcpd.conf
        pre-down systemctl stop hostapd@uap0.service
        pre-down pkill udhcpd

## Example bridge between eth0 and uap0 (NXP IW612)
#auto br0
#iface br0 inet static
#       bridge_ports eth0 uap0
#       address 192.168.42.50
#       netmask 255.255.255.0
#       pre-up [ -d /proc/device-tree/wireless ]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>3、使用ACS时，可用 iw dev wlan0 info查看信道</p><h1 id="dey实时linux配置" tabindex="-1"><a class="header-anchor" href="#dey实时linux配置"><span>DEY实时linux配置</span></a></h1><p>实时涉及内核配置和拉取PREEMPT_RT补丁包，这些都会在编译配置设置好后自动完成，修改conf/local.conf，添加如下配置即可：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>DISTRO_FEATURES:append = &quot; rt&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h1 id="locales报错解决" tabindex="-1"><a class="header-anchor" href="#locales报错解决"><span>locales报错解决</span></a></h1><p>在ubuntu 22.04下执行命令时报错，提示“Please make sure locale &#39;en_US.UTF-8&#39; is available on your system”</p><p>Ubuntu 22.04 默认把所有 locale 都编译成二进制放在 /usr/lib/locale/ 下，只有显式生成过才会出现</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>1. 重新生成 locale（确保 en_US.UTF-8 在列表里被选中）
sudo locale-gen en_US.UTF-8

2. 立即生效
sudo update-locale LANG=en_US.UTF-8
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,20),t=[d];function l(c,r){return n(),a("div",null,t)}const v=e(s,[["render",l],["__file","digi-dey.html.vue"]]),u=JSON.parse('{"path":"/zh/note/digi-dey.html","title":"DEY 镜像常用配置","lang":"zh-CN","frontmatter":{"description":"DEY 镜像常用配置 cc93 DEY的显示接口配置 CC8MN fusion display 屏： cc93rtsp 演示配置 刷完固件后，需更改的一些地方： 1、/etc/NetworkManager/NetworkManager.conf 把interface-name:wlan0;添加进unmanaged-devices列表中。 2、/etc/...","head":[["meta",{"property":"og:url","content":"https://peyoot.github.io/zh/note/digi-dey.html"}],["meta",{"property":"og:title","content":"DEY 镜像常用配置"}],["meta",{"property":"og:description","content":"DEY 镜像常用配置 cc93 DEY的显示接口配置 CC8MN fusion display 屏： cc93rtsp 演示配置 刷完固件后，需更改的一些地方： 1、/etc/NetworkManager/NetworkManager.conf 把interface-name:wlan0;添加进unmanaged-devices列表中。 2、/etc/..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"DEY 镜像常用配置\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[{"level":2,"title":"cc93","slug":"cc93","link":"#cc93","children":[]},{"level":2,"title":"CC8MN","slug":"cc8mn","link":"#cc8mn","children":[]}],"git":{},"autoDesc":true,"filePathRelative":"zh/note/digi-dey.md"}');export{v as comp,u as data};
