import{_ as e,o as a,c as s,b as n}from"./app-C2sojmts.js";const t={},i=n('<h1 id="meta-custom是什么" tabindex="-1"><a class="header-anchor" href="#meta-custom是什么"><span>meta-custom是什么</span></a></h1><p>这是一个 yocto 层，可以启用许多自定义食谱。DEYAIO使用元自定义来编译各种功能丰富的固件镜像。</p><h1 id="配方" tabindex="-1"><a class="header-anchor" href="#配方"><span>配方</span></a></h1><h2 id="recipes-mine" tabindex="-1"><a class="header-anchor" href="#recipes-mine"><span>recipes-mine</span></a></h2><h3 id="homeaddons" tabindex="-1"><a class="header-anchor" href="#homeaddons"><span>homeaddons</span></a></h3><p>此配方提供将文件安装到用户主目录的参考。它可以是文本文件或预编译的用户应用程序。</p><h3 id="base-files" tabindex="-1"><a class="header-anchor" href="#base-files"><span>base-files</span></a></h3><p>此配方提供了一个参考，以使用您自己的 .profile 和 .bashrc 覆盖原始基本文件</p><h3 id="dummy-service" tabindex="-1"><a class="header-anchor" href="#dummy-service"><span>dummy-service</span></a></h3><p>dummy-service配方提供了运行您自己的 systemd 服务的参考</p><h2 id="recipes-core" tabindex="-1"><a class="header-anchor" href="#recipes-core"><span>recipes-core</span></a></h2><p>仅特定分支有此目录来提供特定的镜像配方</p><h3 id="images" tabindex="-1"><a class="header-anchor" href="#images"><span>images</span></a></h3><p>该目录下提供一系列自定义的目标镜像配方</p><h2 id="recipes-vpn" tabindex="-1"><a class="header-anchor" href="#recipes-vpn"><span>recipes-VPN</span></a></h2><h3 id="pvpn-和-openvpndns" tabindex="-1"><a class="header-anchor" href="#pvpn-和-openvpndns"><span>pvpn 和 openvpndns</span></a></h3><p>这些配方为目标镜像添加了 pvpn 支持。</p><p>将以下行添加到 local.conf： IMAGE_INSTALL:append = “ gawk unzip pvpn openvpn openvpndns stunnel”</p><p>注意：您还需要修改内核选项：</p><p>Enable Device Drivers → Network device support → Universal TUN/TAP device driver support</p><h2 id="recipes-qt" tabindex="-1"><a class="header-anchor" href="#recipes-qt"><span>recipes-qt</span></a></h2><p>ROS2需要QT5的支持，它需要一个自定义的配置放在 /etc/profile.d/qt5.sh。根据其内容用户可以免运行环境配置脚本直接运行ros2命令。 要启用ros2支持，请在dey-aio-manifest中检出kirkstone-ros分支。</p>',22),p=[i];function r(o,c){return a(),s("div",null,p)}const h=e(t,[["render",r],["__file","meta-custom.html.vue"]]),d=JSON.parse('{"path":"/zh/deyaio/meta-custom.html","title":"meta-custom是什么","lang":"zh-CN","frontmatter":{"description":"meta-custom是什么 这是一个 yocto 层，可以启用许多自定义食谱。DEYAIO使用元自定义来编译各种功能丰富的固件镜像。 配方 recipes-mine homeaddons 此配方提供将文件安装到用户主目录的参考。它可以是文本文件或预编译的用户应用程序。 base-files 此配方提供了一个参考，以使用您自己的 .profile 和 ...","head":[["link",{"rel":"alternate","hreflang":"en-us","href":"https://peyoot.github.io/deyaio/meta-custom.html"}],["meta",{"property":"og:url","content":"https://peyoot.github.io/zh/deyaio/meta-custom.html"}],["meta",{"property":"og:title","content":"meta-custom是什么"}],["meta",{"property":"og:description","content":"meta-custom是什么 这是一个 yocto 层，可以启用许多自定义食谱。DEYAIO使用元自定义来编译各种功能丰富的固件镜像。 配方 recipes-mine homeaddons 此配方提供将文件安装到用户主目录的参考。它可以是文本文件或预编译的用户应用程序。 base-files 此配方提供了一个参考，以使用您自己的 .profile 和 ..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:locale:alternate","content":"en-US"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"meta-custom是什么\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[{"level":2,"title":"recipes-mine","slug":"recipes-mine","link":"#recipes-mine","children":[{"level":3,"title":"homeaddons","slug":"homeaddons","link":"#homeaddons","children":[]},{"level":3,"title":"base-files","slug":"base-files","link":"#base-files","children":[]},{"level":3,"title":"dummy-service","slug":"dummy-service","link":"#dummy-service","children":[]}]},{"level":2,"title":"recipes-core","slug":"recipes-core","link":"#recipes-core","children":[{"level":3,"title":"images","slug":"images","link":"#images","children":[]}]},{"level":2,"title":"recipes-VPN","slug":"recipes-vpn","link":"#recipes-vpn","children":[{"level":3,"title":"pvpn 和 openvpndns","slug":"pvpn-和-openvpndns","link":"#pvpn-和-openvpndns","children":[]}]},{"level":2,"title":"recipes-qt","slug":"recipes-qt","link":"#recipes-qt","children":[]}],"git":{},"autoDesc":true,"filePathRelative":"zh/deyaio/meta-custom.md"}');export{h as comp,d as data};