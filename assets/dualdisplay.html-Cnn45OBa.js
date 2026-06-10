import{_ as e,o as n,c as t,b as a}from"./app-BqJ8WAA6.js";const i={},s=a(`<h1 id="weston" tabindex="-1"><a class="header-anchor" href="#weston"><span>weston</span></a></h1><p>尝试 Weston 作为 Wayland compositor，它在处理多显示器克隆模式上可能更稳定。你可以在 /etc/xdg/weston.ini 中进行类似配置：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>[core]
# Wayland socket
[shell]
background-color=0xff000000
panel-position=none
locking=false
[screensaver]
# Disable screensaver
[output]
name=LVDS-1
mode=1280x800
[output]
name=HDMI-A-1
mode=1280x800

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>设置 Qt 应用使用 Wayland 后端启动： export QT_QPA_PLATFORM=wayland-egl ./YourQtApp</p>`,4),o=[s];function l(d,r){return n(),t("div",null,o)}const p=e(i,[["render",l],["__file","dualdisplay.html.vue"]]),m=JSON.parse('{"path":"/zh/note/digi/dey/dualdisplay.html","title":"weston","lang":"zh-CN","frontmatter":{"description":"weston 尝试 Weston 作为 Wayland compositor，它在处理多显示器克隆模式上可能更稳定。你可以在 /etc/xdg/weston.ini 中进行类似配置： 设置 Qt 应用使用 Wayland 后端启动： export QT_QPA_PLATFORM=wayland-egl ./YourQtApp","head":[["meta",{"property":"og:url","content":"https://peyoot.github.io/zh/note/digi/dey/dualdisplay.html"}],["meta",{"property":"og:title","content":"weston"}],["meta",{"property":"og:description","content":"weston 尝试 Weston 作为 Wayland compositor，它在处理多显示器克隆模式上可能更稳定。你可以在 /etc/xdg/weston.ini 中进行类似配置： 设置 Qt 应用使用 Wayland 后端启动： export QT_QPA_PLATFORM=wayland-egl ./YourQtApp"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"weston\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[],"git":{},"autoDesc":true,"filePathRelative":"zh/note/digi/dey/dualdisplay.md"}');export{p as comp,m as data};
