import{_ as e,o as a,c as i,b as t}from"./app-D0aTEsZS.js";const s={},n=t('<h1 id="what-is-meta-custom" tabindex="-1"><a class="header-anchor" href="#what-is-meta-custom"><span>What is meta-custom</span></a></h1><p>This is a Yocto layer that enables numerous custom recipes. DEY-AIO utilizes meta-custom to compile feature-rich firmware images. By consolidating validated feature sets into a meta-custom branch and using the corresponding XML file in dey-aio-manifest, users can compile DEY functional firmware with one-click compilation.</p><h1 id="branches" tabindex="-1"><a class="header-anchor" href="#branches"><span>Branches</span></a></h1><p>In dey-aio-manifest, different functional firmware compilations are achieved by specifying various meta-custom branches in XML files.</p><p>The master branch integrates common recipes while removing board-specific configurations. The dev branch strives to include recipes for multiple boards, as hardware distinctions mainly manifest in kernel device trees. In the dev branch, the default board device tree remains Digi&#39;s development board ccmp25-dvk, while specific boards like ccmp25plc will automatically load their dedicated kernel device tree.</p><h1 id="recipes" tabindex="-1"><a class="header-anchor" href="#recipes"><span>Recipes</span></a></h1><p>Different recipe combinations are organized as various branches in meta-custom. You may also reference individual recipes to implement specific functionalities. Depending on the DEY version, meta-custom maintains corresponding main branches where feature sets are typically reflected in branch name suffixes. Taking &quot;scarthgap-ccmp25plc&quot; as an example, this branch represents DEY 5.0 (scarthgap) firmware implementation for CCMP25-based PLC reference boards.</p><p>This section only contains several recipes explanation. For more recipes, please refer to the branch instructions.</p><h2 id="recipes-mine" tabindex="-1"><a class="header-anchor" href="#recipes-mine"><span>recipes-mine</span></a></h2><h3 id="homeaddons" tabindex="-1"><a class="header-anchor" href="#homeaddons"><span>homeaddons</span></a></h3><p>This recipe provide a reference to install files to user&#39;s home directory. It can be text files or a pre-compiled user application.</p><h3 id="base-files" tabindex="-1"><a class="header-anchor" href="#base-files"><span>base-files</span></a></h3><p>This recipe provide a reference to override original base-files with your own .profile and .bashrc</p><h3 id="dummy-service" tabindex="-1"><a class="header-anchor" href="#dummy-service"><span>dummy-service</span></a></h3><p>This recipe provide a reference to run your own systemd service</p><h2 id="recipes-core" tabindex="-1"><a class="header-anchor" href="#recipes-core"><span>recipes-core</span></a></h2><p>Only available in some specific branches.</p><h3 id="images" tabindex="-1"><a class="header-anchor" href="#images"><span>images</span></a></h3><p>recipes in this directory provide some feature images like dey-image-qtros.</p><h2 id="recipes-vpn" tabindex="-1"><a class="header-anchor" href="#recipes-vpn"><span>recipes-vpn</span></a></h2><h3 id="pvpn-and-openvpndns" tabindex="-1"><a class="header-anchor" href="#pvpn-and-openvpndns"><span>pvpn and openvpndns</span></a></h3><p>These recipes add pvpn support to the target images.</p><p>Add the following line to local.conf: IMAGE_INSTALL:append = “ gawk unzip pvpn openvpn openvpndns stunnel”</p><p>Note: you&#39;ll also need to modify kernel option:</p><p>Enable Device Drivers → Network device support → Universal TUN/TAP device driver support</p><h2 id="recipes-qt" tabindex="-1"><a class="header-anchor" href="#recipes-qt"><span>recipes-qt</span></a></h2><p>some platform only support qt5 or qt6 by default. When switch to different version it may need to patch or hack. Recipes here can help in a seamless way. For example, ros2 with qt5 support will need a custom qt5.sh placed on /etc/profile.d. Depending the content it can recognize right display backend and user can run ros2 directory after booting into system without the need to manually source environmental script.</p><p>To enable ros2 in the image, just checkout the ros branch in dey-aio-manifest.</p>',28),r=[n];function o(c,p){return a(),i("div",null,r)}const h=e(s,[["render",o],["__file","meta-custom.html.vue"]]),d=JSON.parse('{"path":"/deyaio/meta-custom.html","title":"What is meta-custom","lang":"en-US","frontmatter":{"description":"What is meta-custom This is a Yocto layer that enables numerous custom recipes. DEY-AIO utilizes meta-custom to compile feature-rich firmware images. By consolidating validated ...","head":[["link",{"rel":"alternate","hreflang":"zh-cn","href":"https://peyoot.github.io/zh/deyaio/meta-custom.html"}],["meta",{"property":"og:url","content":"https://peyoot.github.io/deyaio/meta-custom.html"}],["meta",{"property":"og:title","content":"What is meta-custom"}],["meta",{"property":"og:description","content":"What is meta-custom This is a Yocto layer that enables numerous custom recipes. DEY-AIO utilizes meta-custom to compile feature-rich firmware images. By consolidating validated ..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:locale:alternate","content":"zh-CN"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"What is meta-custom\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[{"level":2,"title":"recipes-mine","slug":"recipes-mine","link":"#recipes-mine","children":[{"level":3,"title":"homeaddons","slug":"homeaddons","link":"#homeaddons","children":[]},{"level":3,"title":"base-files","slug":"base-files","link":"#base-files","children":[]},{"level":3,"title":"dummy-service","slug":"dummy-service","link":"#dummy-service","children":[]}]},{"level":2,"title":"recipes-core","slug":"recipes-core","link":"#recipes-core","children":[{"level":3,"title":"images","slug":"images","link":"#images","children":[]}]},{"level":2,"title":"recipes-vpn","slug":"recipes-vpn","link":"#recipes-vpn","children":[{"level":3,"title":"pvpn and openvpndns","slug":"pvpn-and-openvpndns","link":"#pvpn-and-openvpndns","children":[]}]},{"level":2,"title":"recipes-qt","slug":"recipes-qt","link":"#recipes-qt","children":[]}],"git":{},"autoDesc":true,"filePathRelative":"deyaio/meta-custom.md"}');export{h as comp,d as data};
