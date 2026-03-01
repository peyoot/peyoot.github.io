import{_ as e,o as t,c as i,b as a}from"./app-oTA4_50g.js";const n={},l=a(`<h1 id="压缩指定大小分卷" tabindex="-1"><a class="header-anchor" href="#压缩指定大小分卷"><span>压缩指定大小分卷</span></a></h1><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>tar -cJf - -C ~ deyaio-ccmp25plc |split -b 999M - deyaio-ccmp25plc.tar.xz.
命令详解：
tar -cJf -：用 xz 算法创建压缩包，并输出到标准输出 (-)。
-C ~ deyaio：进入 ~ 目录，压缩 deyaio 文件夹。
| split -b 999M -：用 split 命令将接收到的数据流，按每块 999MB 进行分割。
deyaio-ccmp25plc.tar.xz.：分卷文件的前缀，生成的文件名类似 deyaio-ccmp25plc.tar.xz.aa, deyaio-ccmp25plc.tar.xz.ab。

何解压分卷文件？
将全部分卷（deyaio-ccmp25plc.tar.xz.aa, deyaio-ccmp25plc.tar.xz.ab ...）放在同一目录，然后执行：
cat deyaio-ccmp25plc.tar.xz.* | tar -xJf -

将 cat 命令的输出（即合并后的数据流）传递给 tar 命令
-x：解压/提取模式
-J：使用 xz 压缩算法解压
-f -：-f 指定输入文件，- 表示从标准输入读取数据（即从管道传来的数据）
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2),c=[l];function s(d,r){return t(),i("div",null,c)}const p=e(n,[["render",s],["__file","bash-skill.html.vue"]]),m=JSON.parse('{"path":"/zh/note/it/linux/bash-skill.html","title":"压缩指定大小分卷","lang":"zh-CN","frontmatter":{"description":"压缩指定大小分卷","head":[["meta",{"property":"og:url","content":"https://peyoot.github.io/zh/note/it/linux/bash-skill.html"}],["meta",{"property":"og:title","content":"压缩指定大小分卷"}],["meta",{"property":"og:description","content":"压缩指定大小分卷"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"压缩指定大小分卷\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[],"git":{},"autoDesc":true,"filePathRelative":"zh/note/it/linux/bash-skill.md"}');export{p as comp,m as data};
