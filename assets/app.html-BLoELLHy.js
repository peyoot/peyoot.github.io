import{_ as e,o,c as t,b as a}from"./app-C2sojmts.js";const n={},p=a('<h1 id="dey-application-development" tabindex="-1"><a class="header-anchor" href="#dey-application-development"><span>DEY Application Development</span></a></h1><p>DEY application Development can be very flexible. You can use Makefile in console or Digi ADE (a custom IDE based on Eclipse) or Vscode, QT Creator, Crank software for application development. Digi provides an SDK to install the cross-compilation toolchain that required to develop your application, and you will need to download the appropriate SDK installation based on your ConnectCore hardware platform.</p><p>Digi’s official documentation provides detailed explanations of various methods for application development. This document serves as a supplement to the official documentation, using VSCODE for application development as an example.</p><h2 id="prepare-dey-app-development-environment" tabindex="-1"><a class="header-anchor" href="#prepare-dey-app-development-environment"><span>Prepare DEY app development environment</span></a></h2><ol><li>Prerequsites</li></ol><code> sudo apt update sudo apt install ibus ibus-pinyin build-essential gdb gdb-multiarch </code><p>To use IDE to development DEY app, you&#39;ll need desktop environment. Follow the following command to install Ubuntu desktop if you haven&#39;t got it. <code> sudo apt update sudo apt install --no-install-recommends ubuntu-desktop </code> And you probably would like to install your own language package if Engilish is not your expected one. For example, Chinese language pack and input method need following package:</p><code> sudo apt install language-pack-zh-hans sudo apt install language-pack-gnome-zh-hans fonts-arphic-ukai fonts-noto-cjk ibus-libpinyin fonts-noto-cjk-extra fonts-arphic-uming </code><ol start="2"><li>Download and Install SDK and IDE</li></ol>',9),i=[p];function l(r,s){return o(),t("div",null,i)}const d=e(n,[["render",l],["__file","app.html.vue"]]),m=JSON.parse('{"path":"/deyaio/app.html","title":"DEY Application Development","lang":"en-US","frontmatter":{"description":"DEY Application Development DEY application Development can be very flexible. You can use Makefile in console or Digi ADE (a custom IDE based on Eclipse) or Vscode, QT Creator, ...","head":[["meta",{"property":"og:url","content":"https://peyoot.github.io/deyaio/app.html"}],["meta",{"property":"og:title","content":"DEY Application Development"}],["meta",{"property":"og:description","content":"DEY Application Development DEY application Development can be very flexible. You can use Makefile in console or Digi ADE (a custom IDE based on Eclipse) or Vscode, QT Creator, ..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"DEY Application Development\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[{"level":2,"title":"Prepare DEY app development environment","slug":"prepare-dey-app-development-environment","link":"#prepare-dey-app-development-environment","children":[]}],"git":{},"autoDesc":true,"filePathRelative":"deyaio/app.md"}');export{d as comp,m as data};