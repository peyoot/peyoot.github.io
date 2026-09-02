import{_ as e,o as t,c as n,b as s}from"./app-Crg5dGGQ.js";const a={},o=s(`<h1 id="weston与显示后端" tabindex="-1"><a class="header-anchor" href="#weston与显示后端"><span>Weston与显示后端</span></a></h1><h2 id="qt是否需要weston平台" tabindex="-1"><a class="header-anchor" href="#qt是否需要weston平台"><span>QT是否需要Weston平台</span></a></h2><p>通常镜像中需要包含 qtwayland 包, Weston 启动后会设置环境变量 WAYLAND_DISPLAY=wayland-0，Qt会自动检测到 Weston 正在运行，并使用自动选用 Wayland 平台。Wayland 后端（Weston）会统一管理所有显示输出（HDMI、LVDS 等），Qt 应用程序无需关心具体输出接口。你只需确保 Weston 配置正确（/etc/xdg/weston/weston.ini 或 /etc/weston.ini），Qt 应用会自动适配 Weston 管理的屏幕。</p><p>如果没启用Weston，则设置 QT_QPA_PLATFORM=eglfs，Qt 尝试直接通过 DRM/KMS 接管显示输出。在Weston启用时，如果设置这个参数，因Weston 已经占用了 DRM master 权限。两个进程争夺 DRM master，非 master 的一方就会收到 Permission denied。</p><p>假如不用weston，则在KMS/DRM 后端支持通过一个 JSON 配置文件来定义多个 output，mode 可以是 off / current / preferred / 宽x高 等形式。关键点是：output 的 name 必须和内核 DRM 报告的连接器名一致。</p><p>例：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>{
  &quot;device&quot;: &quot;/dev/dri/card0&quot;,
  &quot;hwcursor&quot;: false,
  &quot;separateScreens&quot;: false,
  &quot;outputs&quot;: [
    {
      &quot;name&quot;: &quot;HDMI-A-1&quot;,
      &quot;mode&quot;: &quot;preferred&quot;
    },
    {
      &quot;name&quot;: &quot;LVDS-1&quot;,
      &quot;mode&quot;: &quot;1280x800&quot;
    }
  ]
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面的链接器需要根据实际情况来修改，可以用这个检测：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>for p in /sys/class/drm/card0-*/status; do
    name=$(basename $(dirname $p))
    status=$(cat $p)
    echo &quot;$name: $status&quot;
done
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,9),i=[o];function d(l,r){return t(),n("div",null,i)}const u=e(a,[["render",d],["__file","weston.html.vue"]]),m=JSON.parse('{"path":"/zh/note/dev/weston/weston.html","title":"Weston与显示后端","lang":"zh-CN","frontmatter":{"description":"Weston与显示后端 QT是否需要Weston平台 通常镜像中需要包含 qtwayland 包, Weston 启动后会设置环境变量 WAYLAND_DISPLAY=wayland-0，Qt会自动检测到 Weston 正在运行，并使用自动选用 Wayland 平台。Wayland 后端（Weston）会统一管理所有显示输出（HDMI、LVDS 等），...","head":[["meta",{"property":"og:url","content":"https://peyoot.github.io/zh/note/dev/weston/weston.html"}],["meta",{"property":"og:title","content":"Weston与显示后端"}],["meta",{"property":"og:description","content":"Weston与显示后端 QT是否需要Weston平台 通常镜像中需要包含 qtwayland 包, Weston 启动后会设置环境变量 WAYLAND_DISPLAY=wayland-0，Qt会自动检测到 Weston 正在运行，并使用自动选用 Wayland 平台。Wayland 后端（Weston）会统一管理所有显示输出（HDMI、LVDS 等），..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Weston与显示后端\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[{"level":2,"title":"QT是否需要Weston平台","slug":"qt是否需要weston平台","link":"#qt是否需要weston平台","children":[]}],"git":{},"autoDesc":true,"filePathRelative":"zh/note/dev/weston/weston.md"}');export{u as comp,m as data};
