import{_ as e,o as i,c as n,b as t}from"./app-kKM6LUlD.js";const a={},s=t(`<h1 id="离线编译dey项目" tabindex="-1"><a class="header-anchor" href="#离线编译dey项目"><span>离线编译DEY项目</span></a></h1><p>DEY项目的编译并不总是需要联网。Yocto项目的编译受益于开源项目，通常也建议保持更新以使用最新的上游源码，这对于获取一些较新的软件包或驱动来说至关重要。不过对于工业项目来说，稳定可靠，可重复编译出原始的镜像，这也很重要。本章节我们将讨论如何锁定DEYAIO编译出来的项目版本，并支持离线编译，以便在内网环境中持续开发项目。</p><h2 id="锁定dey项目中manifest仓库指定的各软件库的git版本" tabindex="-1"><a class="header-anchor" href="#锁定dey项目中manifest仓库指定的各软件库的git版本"><span>锁定DEY项目中manifest仓库指定的各软件库的git版本</span></a></h2><p>DEY AIO的manifest仓库定义了上游软件库的git版本，在DEY项目根目录我们可以通过</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>cat .repo/manifest.xml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>来查看当初新建项目时使用的manifest仓库的xml文件，比如下面这个输出：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>$ cat .repo/manifest.xml
&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;
...
&lt;manifest&gt;
  &lt;include name=&quot;ccmp25plc.xml&quot; /&gt;
&lt;/manifest&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>表明当前的manifest仓库是ccmp25plc.xml。而打开.repo/manifests/ccmp25plc.xml，就可以看到各个project拉取的git分支。 以meta-custom为例，</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code> &lt;project name=&quot;meta-custom.git&quot; path=&quot;dey5.0/sources/meta-custom&quot; remote=&quot;peyoot&quot; revision=&quot;scarthgap-ccmp25plc&quot;/&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>注意这里的revision，这是一个分支名称，而非具体的某次提交，也就是它总是拉取最新的版本，如果上游发生变化，重新repo sync后，编译出来的版本也会相应有所变化。为了离线编译，我们首先需要锁定版本。</p><p>使用下面命令生成一个新的manifest文件，并用提交的hash值作为revision版本，然后切换到这个manifest仓库：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>repo manifest -o .repo/manifests/my_frozen_ccmp25plc.xml -r --suppress-upstream-revision --suppress-dest-branch
repo init -b scarthgap -m my_frozen_ccmp25plc.xml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="设置downloads目录在内网共享" tabindex="-1"><a class="header-anchor" href="#设置downloads目录在内网共享"><span>设置downloads目录在内网共享</span></a></h2><p>DEY AIO项目默认会把下载的构件放在workspace/project_shared/downloads下，我们需要设置HTTP服务器共享，以便内网其它机器可以访问。 这实际上是要配置一个web服务器，并且可以访问文件系统目录，有很多实现方法，建议以nginx来搭建，不过如果寻求快速，也可以用python。 方法一：用python命令快速搭建web服务器： 以python为例，进入downloads目录后，执行：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>python3 -m http.server 8000
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>记下此服务器的IP和上面设置的端口，比如：192.168.1.100:8000</p><p>方法二：Nignx作为web服务器（推荐）</p><p>1、安装 Nginx</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># Ubuntu/Debian
sudo apt-get update &amp;&amp; sudo apt-get install nginx
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>2、配置Nginx 创建或编辑配置文件 /etc/nginx/sites-available/yocto-mirror：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>server {
    listen 8000;
    server_name localhost;
    
    # 设置downloads目录路径
    root ~/deyaio-ccmp25plc/dey5.0/workspace/project-shared/downloads;
    autoindex on;  # 启用目录列表
    
    # 性能优化设置
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    
    # 设置正确的MIME类型
    types {
        application/x-sharedlib so;
        application/x-archive a;
        text/plain patch diff;
        application/gzip gz tgz;
        application/x-tar tar;
        application/zip zip;
    }
    
    # 大文件下载支持
    client_max_body_size 0;
    
    location / {
        # 允许内网所有IP访问
        allow 192.168.0.0/16;
        allow 10.0.0.0/8;
        allow 172.16.0.0/12;
        deny all;
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="配置本机或内网机器" tabindex="-1"><a class="header-anchor" href="#配置本机或内网机器"><span>配置本机或内网机器</span></a></h3><p>在内网中其他无法访问外网的开发机器上，您需要修改Yocto构建目录中的conf/local.conf配置文件，添加以下关键设置：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 指定源码镜像的URL，请替换为您的实际IP和端口
SOURCE_MIRROR_URL = &quot;http://192.168.1.100:8000/&quot;
# 本机也可使用SOURCE_MIRROR_URL = file://path_to_your_downloads
# 继承own-mirrors类以启用镜像设置
INHERIT += &quot;own-mirrors&quot;
# 强制禁止网络访问，确保完全离线构建
BB_NO_NETWORK = &quot;1&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样，你的内网其它机器也就可以实用这些下载好的源码进行内网编译。</p>`,25),d=[s];function l(o,r){return i(),n("div",null,d)}const v=e(a,[["render",l],["__file","dey-buildroot.html.vue"]]),m=JSON.parse('{"path":"/zh/deyaio/dey-buildroot.html","title":"离线编译DEY项目","lang":"zh-CN","frontmatter":{"description":"离线编译DEY项目 DEY项目的编译并不总是需要联网。Yocto项目的编译受益于开源项目，通常也建议保持更新以使用最新的上游源码，这对于获取一些较新的软件包或驱动来说至关重要。不过对于工业项目来说，稳定可靠，可重复编译出原始的镜像，这也很重要。本章节我们将讨论如何锁定DEYAIO编译出来的项目版本，并支持离线编译，以便在内网环境中持续开发项目。 锁定D...","head":[["meta",{"property":"og:url","content":"https://peyoot.github.io/zh/deyaio/dey-buildroot.html"}],["meta",{"property":"og:title","content":"离线编译DEY项目"}],["meta",{"property":"og:description","content":"离线编译DEY项目 DEY项目的编译并不总是需要联网。Yocto项目的编译受益于开源项目，通常也建议保持更新以使用最新的上游源码，这对于获取一些较新的软件包或驱动来说至关重要。不过对于工业项目来说，稳定可靠，可重复编译出原始的镜像，这也很重要。本章节我们将讨论如何锁定DEYAIO编译出来的项目版本，并支持离线编译，以便在内网环境中持续开发项目。 锁定D..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"离线编译DEY项目\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[{"level":2,"title":"锁定DEY项目中manifest仓库指定的各软件库的git版本","slug":"锁定dey项目中manifest仓库指定的各软件库的git版本","link":"#锁定dey项目中manifest仓库指定的各软件库的git版本","children":[]},{"level":2,"title":"设置downloads目录在内网共享","slug":"设置downloads目录在内网共享","link":"#设置downloads目录在内网共享","children":[{"level":3,"title":"配置本机或内网机器","slug":"配置本机或内网机器","link":"#配置本机或内网机器","children":[]}]}],"git":{},"autoDesc":true,"filePathRelative":"zh/deyaio/dey-buildroot.md"}');export{v as comp,m as data};
