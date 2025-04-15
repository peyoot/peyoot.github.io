import{_ as e,o as a,c as t,b as n}from"./app-D0aTEsZS.js";const o={},i=n(`<h1 id="mono-getting-started" tabindex="-1"><a class="header-anchor" href="#mono-getting-started"><span>Mono Getting Started</span></a></h1><p>Mono is an open-source, cross-platform implementation of Microsoft’s .NET Framework. It allows developers to build and run .NET applications on non-Windows platforms, such as Linux, macOS, and various other operating systems.</p><div class="custom-container warning"><p class="custom-container-title">WARNING</p><p>Currently only very limit Mono support was tested and it was only verified with DEY4.0 kirkstone. Other version may of DEY may work but you need to modify dey-aio-manifest repo and try by your own effort.</p></div><h2 id="preparation" tabindex="-1"><a class="header-anchor" href="#preparation"><span>Preparation</span></a></h2><p>Ubuntu 22.04 as example</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>sudo apt install gawk wget file git diffstat file unzip texinfo gcc build-essential chrpath socat cpio python3 python3-pip python3-pexpect xz-utils debianutils iputils-ping python3-git python3-jinja2 libegl1-mesa-dev libsdl1.2-dev pylint xterm python3-subunit mesa-common-dev zstd liblz4-tool
sudo apt install python-is-python3
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>If you haven&#39;t install repo and config git</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>sudo apt install repo
git config --global user.name yourname
git config --global user.email you@email.com
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="install-deyaio-with-mono-support" tabindex="-1"><a class="header-anchor" href="#install-deyaio-with-mono-support"><span>Install deyaio with mono support</span></a></h2><p>If you have install deyaio and now you need mono support version. It&#39;s suggested that you install to another folder like deyaio-mono</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token builtin class-name">cd</span>
<span class="token function">mkdir</span> deyaio-mono
<span class="token builtin class-name">cd</span> deyaio-mono
repo init <span class="token parameter variable">-u</span> https://github.com/peyoot/dey-aio-manifest.git <span class="token parameter variable">-b</span> mono
repo <span class="token function">sync</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="create-a-mono-related-project" tabindex="-1"><a class="header-anchor" href="#create-a-mono-related-project"><span>Create a mono related project</span></a></h2><p>cd dey4.0/workspace mkdir my93mono cd my93mono source ../../mkproject.sh -p ccimx93-dvk</p><h2 id="configure-and-build-a-mono-support-image" tabindex="-1"><a class="header-anchor" href="#configure-and-build-a-mono-support-image"><span>configure and build a mono support image</span></a></h2><p>Edit conf/local.conf and add packages you need. For example, use following in local.conf:</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>GLIBC_GENERATE_LOCALES = &quot;en_GB.UTF-8 en_US.UTF-8&quot;
IMAGE_LINGUAS = &quot;zh-cn&quot;
LOCALE_UTF8_ONLY=&quot;1&quot;

IMAGE_INSTALL:append = &quot; glibc-utils localedef tmux homeaddons&quot;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Now compile image</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>bitbake core-image-mono
or
bitbake dey-image-mono
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="publish-and-pack-installer" tabindex="-1"><a class="header-anchor" href="#publish-and-pack-installer"><span>Publish and pack installer</span></a></h2><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>cd ../..
./publish
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>Follow the prompts and select correct items. For image type, you still need to choose 6 to manually input the image name. For example: core-image-mono</p><p>You can choose to copy compile outputs to release directory and pack it into installer or publish to TFTP/NFS server.</p>`,22),s=[i];function l(r,d){return a(),t("div",null,s)}const c=e(o,[["render",l],["__file","mono.html.vue"]]),u=JSON.parse('{"path":"/deyaio/mono.html","title":"Mono Getting Started","lang":"en-US","frontmatter":{"description":"Mono Getting Started Mono is an open-source, cross-platform implementation of Microsoft’s .NET Framework. It allows developers to build and run .NET applications on non-Windows ...","head":[["link",{"rel":"alternate","hreflang":"zh-cn","href":"https://peyoot.github.io/zh/deyaio/mono.html"}],["meta",{"property":"og:url","content":"https://peyoot.github.io/deyaio/mono.html"}],["meta",{"property":"og:title","content":"Mono Getting Started"}],["meta",{"property":"og:description","content":"Mono Getting Started Mono is an open-source, cross-platform implementation of Microsoft’s .NET Framework. It allows developers to build and run .NET applications on non-Windows ..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:locale:alternate","content":"zh-CN"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Mono Getting Started\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[{"level":2,"title":"Preparation","slug":"preparation","link":"#preparation","children":[]},{"level":2,"title":"Install deyaio with mono support","slug":"install-deyaio-with-mono-support","link":"#install-deyaio-with-mono-support","children":[]},{"level":2,"title":"Create a mono related project","slug":"create-a-mono-related-project","link":"#create-a-mono-related-project","children":[]},{"level":2,"title":"configure and build a mono support image","slug":"configure-and-build-a-mono-support-image","link":"#configure-and-build-a-mono-support-image","children":[]},{"level":2,"title":"Publish and pack installer","slug":"publish-and-pack-installer","link":"#publish-and-pack-installer","children":[]}],"git":{},"autoDesc":true,"filePathRelative":"deyaio/mono.md"}');export{c as comp,u as data};
