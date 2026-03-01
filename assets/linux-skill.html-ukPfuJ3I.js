import{_ as t,o as e,c as n,b as i}from"./app-oTA4_50g.js";const a={},s=i(`<h1 id="ubuntu-上高效打包-适度压缩-安全传输" tabindex="-1"><a class="header-anchor" href="#ubuntu-上高效打包-适度压缩-安全传输"><span>Ubuntu 上高效打包 + 适度压缩 + 安全传输</span></a></h1><p>推荐方案：tar（不压缩） + zstd（多线程压缩），每卷 ≤ 3.8 GiB（兼容 FAT32 / 网盘 / 邮件）</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 1. 进入目录的上层
cd /path/to/parent

# 2. 多线程压缩 + 分卷（每卷 3.8G，兼容大多数网盘）
tar -I &#39;zstd -5 -T0&#39; -cf - project_shared \\
  | split -d -b 3800M - project_shared.tar.zst.part_

# 说明：
# -I &#39;zstd -5 -T0&#39; → 使用 zstd 级别5，全核压缩
# -cf - → tar 输出到 stdout
# split -b 3800M → 每卷 ≈3.8GiB（留 200M 余量防碎片）
# 最终生成：project_shared.tar.zst.part_00, part_01, ...
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>目标机器上还原：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 合并分卷后再解压（推荐）
cat project_shared.tar.zst.part_* &gt; project_shared.tar.zst

# 解压（zstd 自动多线程，内存 &lt; 500M）
tar -I &#39;zstd -d -T0&#39; -xf project_shared.tar.zst
或者 边合并边解压（节省磁盘）：
bashcat project_shared.tar.zst.part_* | tar -I &#39;zstd -d -T0&#39; -xf -
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5),r=[s];function d(l,c){return e(),n("div",null,r)}const u=t(a,[["render",d],["__file","linux-skill.html.vue"]]),p=JSON.parse('{"path":"/zh/note/it/linux/linux-skill.html","title":"Ubuntu 上高效打包 + 适度压缩 + 安全传输","lang":"zh-CN","frontmatter":{"description":"Ubuntu 上高效打包 + 适度压缩 + 安全传输 推荐方案：tar（不压缩） + zstd（多线程压缩），每卷 ≤ 3.8 GiB（兼容 FAT32 / 网盘 / 邮件） 目标机器上还原：","head":[["meta",{"property":"og:url","content":"https://peyoot.github.io/zh/note/it/linux/linux-skill.html"}],["meta",{"property":"og:title","content":"Ubuntu 上高效打包 + 适度压缩 + 安全传输"}],["meta",{"property":"og:description","content":"Ubuntu 上高效打包 + 适度压缩 + 安全传输 推荐方案：tar（不压缩） + zstd（多线程压缩），每卷 ≤ 3.8 GiB（兼容 FAT32 / 网盘 / 邮件） 目标机器上还原："}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Ubuntu 上高效打包 + 适度压缩 + 安全传输\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[],"git":{},"autoDesc":true,"filePathRelative":"zh/note/it/linux/linux-skill.md"}');export{u as comp,p as data};
