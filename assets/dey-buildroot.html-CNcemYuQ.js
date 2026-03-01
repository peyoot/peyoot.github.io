import{_ as e,o as i,c as n,b as d}from"./app-oTA4_50g.js";const a={},s=d(`<h1 id="离线编译dey项目" tabindex="-1"><a class="header-anchor" href="#离线编译dey项目"><span>离线编译DEY项目</span></a></h1><p>DEY项目的编译并不总是需要联网。Yocto项目的编译受益于开源项目，通常也建议保持更新以使用最新的上游源码，这对于获取一些较新的软件包或驱动来说至关重要。不过对于工业项目来说，稳定可靠，可重复编译出原始的镜像，这也很重要。本章节我们将讨论如何锁定DEYAIO编译出来的项目版本，并支持离线编译，以便在内网环境中持续开发项目。</p><h2 id="锁定dey项目中manifest仓库指定的各软件库的git版本" tabindex="-1"><a class="header-anchor" href="#锁定dey项目中manifest仓库指定的各软件库的git版本"><span>锁定DEY项目中manifest仓库指定的各软件库的git版本</span></a></h2><p>DEY AIO的manifest仓库定义了上游软件库的git版本，在DEY项目根目录我们可以通过</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>cat .repo/manifest.xml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>来查看当初新建项目时使用的manifest仓库的xml文件，比如下面这个输出：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>$ cat .repo/manifest.xml
&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;
...
&lt;manifest&gt;
  &lt;include name=&quot;ccmp25plc.xml&quot; /&gt;
&lt;/manifest&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>表明当前的manifest仓库是ccmp25plc.xml。而打开.repo/manifests/ccmp25plc.xml，就可以看到各个project拉取的git分支。 以meta-custom为例，</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code> &lt;project name=&quot;meta-custom.git&quot; path=&quot;dey5.0/sources/meta-custom&quot; remote=&quot;peyoot&quot; revision=&quot;scarthgap-ccmp25plc&quot;/&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>注意这里的revision，这是一个分支名称，而非具体的某次提交，也就是它总是拉取最新的版本，如果上游发生变化，重新repo sync后，编译出来的版本也会相应有所变化。为了离线编译，我们首先需要锁定版本。</p><p>DEY的发行版，每隔一段时间，就会release一个版本号的tag，在这个特定的release版本中，不仅各层对应的git版本是锁定的提交版本，其内部的配方中如果有从github拉取源码，相应的SRCREV也会锁定，这样的版本，只要编译或下载过，就可以本地编译，而不依赖网络。</p><p>下面我们以DEY5.0-r2.2为例，在官方的源码库中，它对应的tag就是5.0-r2.2，在dey-aio-manifest中，对应这个版本的是一个叫dey5.0-r2.2分支，</p><p>在创建deyaio项目时，我们可以检出这个分支，在联网状态下先编译出这个版本的镜像。然后再利用这个下载好的源，作本机或内网其它机器的编译时所需的镜像源，即可实现内部网或或离线编译。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>repo sync
repo init -u https://github.com/peyoot/dey-aio-manifest.git -b dey5.0-r2.2 -m ccmp25plc.xml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>如果当前有一个dey-aio项目，不想重新建立deyaio项目时，也可以这样操作（不推荐）</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>repo sync
cd .repo/manifests
git checkout dey5.0-r2.2
cd ../..
repo init -b dey5.0-r2.2 -m ccmp25plc.xml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="联网状态下完成一次完整的编译" tabindex="-1"><a class="header-anchor" href="#联网状态下完成一次完整的编译"><span>联网状态下完成一次完整的编译</span></a></h2><p>上面操作后，我们检出了dey5.0-r2.2的ccmp25plc.xml，这是一个各配方均有锁定版本的manifest仓库，我们需要在联网状态下完成一次编译，以便在编译过程中下载相应的源码，作为后续内网编译或本机编译时使用。这一步骤和正常的的DEY项目完全一样，不过为了方便后续内部机器通过内网编译，需要在创建好项目后，修改conf/local.conf，添加一句：BB_GENERATE_MIRROR_TARBALLS = &quot;1&quot; 完整过程</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>cd dey5.0/workspace
mkdir -p myccmp25plc
cd myccmp25plc
source ../../mkproject.sh -p ccmp25-dvk
nano conf/local.conf  
请添加上面所说的那句配置，以便生成镜像所需的tar包，再编译：
bitbake core-image-base
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="本机离线编译配置" tabindex="-1"><a class="header-anchor" href="#本机离线编译配置"><span>本机离线编译配置</span></a></h2><p>在conf/local.conf中添加下面关键设置：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 指定源码URL镜像，请替换为您的实际IP和端口和本机downloads目录
SOURCE_MIRROR_URL ?= &quot;\\
file://.* file:///home/rtu/deyaio-ccmp25plc/dey5.0/workspace/project_shared/downloads&quot;

# 继承own-mirrors类以启用镜像设置
INHERIT += &quot;own-mirrors&quot;
# 只允许用本地缓存
BB_FETCH_PREMIRRORONLY = &quot;1&quot;
# 禁掉网络，仅本机编译，确保完全离线构建
BB_NO_NETWORK = &quot;1&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="设置downloads和sstate-cache目录在内网共享" tabindex="-1"><a class="header-anchor" href="#设置downloads和sstate-cache目录在内网共享"><span>设置downloads和sstate-cache目录在内网共享</span></a></h2><p>DEY AIO项目默认会把下载的构件和缓存放在workspace/project_shared的相应目录下，我们需要设置HTTP服务器共享，以便内网其它机器可以访问。 这实际上是要配置一个web服务器，并且可以访问文件系统目录，有很多实现方法，建议以nginx来搭建，不过如果寻求快速，也可以用python。 方法一：用python命令快速搭建web服务器： 以python为例，进入workspace/project_shared目录后，执行：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>python3 -m http.server 8000
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>记下此服务器的IP和上面设置的端口，比如：192.168.1.100:8000</p><p>方法二：Nignx作为web服务器（推荐）</p><p>1、安装 Nginx</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># Ubuntu/Debian
sudo apt update &amp;&amp; sudo apt install nginx
#安装智能http的必要组件

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2、配置Nginx 创建或编辑配置文件 /etc/nginx/sites-available/yocto-mirror：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>
server {
    listen 8000;
    server_name 192.168.1.100;

    # 设置web目录路径，注意所有父目录都要有755权限，以防止访问限制问题，请替换自己的路径
    root /home/rtu/deyaio-ccmp25plc/dey5.0/workspace/project_shared;
    # 启用自动索引，方便浏览文件
    autoindex on;
    autoindex_exact_size off;
    autoindex_localtime on;

    # 性能优化设置
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;

    # 文件下载相关设置
    location / {
        # 允许大文件下载
        client_max_body_size 0;
        # 允许跨目录访问（如果需要）
        disable_symlinks off;

        # 设置缓存时间
        location ~* \\.(tar|gz|bz2|xz|zip|tgz|tbz2|txz)$ {
            expires 30d;
            add_header Cache-Control &quot;public, immutable&quot;;
        }

        # 设置日志格式
        access_log /var/log/nginx/yocto-access.log;
        error_log /var/log/nginx/yocto-error.log;
    }


    # 设置正确的MIME类型
    include       mime.types;
    default_type  application/octet-stream;

}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="打包downloads目录下的git裸仓库" tabindex="-1"><a class="header-anchor" href="#打包downloads目录下的git裸仓库"><span>打包downloads目录下的git裸仓库</span></a></h3><p>默认地，yocto会去查找指定格式的压缩包，并通过http协议来下载。但有些源码仍以裸仓库的形式存放在downloadds/git2目录下，我们需要把这部分git裸仓库也一并以正确的方法打包，以方便用web的方式在内网访问到。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 进入 downloads 目录
cd ~/deyaio-ccmp25plc/dey5.0/workspace/project_shared/downloads

# 为所有 Git 仓库创建 tar 包
for item in git2/*; do
    if [[ -d &quot;$item&quot; &amp;&amp; &quot;$item&quot; != *.done ]]; then
        base_name=$(basename &quot;$item&quot;)
        echo &quot;打包 Git 裸仓库: $base_name&quot;
        tar -czf &quot;git2_\${base_name}.tar.gz&quot; -C git2 &quot;$base_name&quot;
    fi
done

# 检查创建的文件
ls -la git2_*.tar.gz | head -5

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="配置内网其它机器" tabindex="-1"><a class="header-anchor" href="#配置内网其它机器"><span>配置内网其它机器</span></a></h3><p>在内网中其他无法访问外网的开发机器上，您需要修改Yocto构建目录中的conf/local.conf配置文件，添加以下关键设置：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 只从内网预镜像获取，不访问外网
BB_FETCH_PREMIRRORONLY = &quot;1&quot;

INHERIT += &quot;own-mirrors&quot;

SOURCE_MIRROR_URL = &quot;http://192.168.1.100:8000/downloads&quot;

PREMIRRORS = &quot; \\
    git://.*/.*     http://192.168.1.100:8000/downloads/ \\n \\
    gitsm://.*/.*   http://192.168.1.100:8000/downloads/ \\n \\
    http://.*/.*    http://192.168.1.100:8000/downloads/ \\n \\
    https://.*/.*   http://192.168.1.100:8000/downloads/ \\n \\
&quot;

SSTATE_MIRRORS = &quot; \\
    file://.* http://192.168.1.100:8000/sstate-cache/PATH \\
&quot;

# 注意：PATH 是字面量，不要改，Yocto 会自动替换为实际路径

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样，你的内网其它机器也就可以实用这些下载好的源码进行内网编译。</p>`,38),t=[s];function l(c,r){return i(),n("div",null,t)}const v=e(a,[["render",l],["__file","dey-buildroot.html.vue"]]),u=JSON.parse('{"path":"/zh/deyaio/dey-buildroot.html","title":"离线编译DEY项目","lang":"zh-CN","frontmatter":{"description":"离线编译DEY项目 DEY项目的编译并不总是需要联网。Yocto项目的编译受益于开源项目，通常也建议保持更新以使用最新的上游源码，这对于获取一些较新的软件包或驱动来说至关重要。不过对于工业项目来说，稳定可靠，可重复编译出原始的镜像，这也很重要。本章节我们将讨论如何锁定DEYAIO编译出来的项目版本，并支持离线编译，以便在内网环境中持续开发项目。 锁定D...","head":[["meta",{"property":"og:url","content":"https://peyoot.github.io/zh/deyaio/dey-buildroot.html"}],["meta",{"property":"og:title","content":"离线编译DEY项目"}],["meta",{"property":"og:description","content":"离线编译DEY项目 DEY项目的编译并不总是需要联网。Yocto项目的编译受益于开源项目，通常也建议保持更新以使用最新的上游源码，这对于获取一些较新的软件包或驱动来说至关重要。不过对于工业项目来说，稳定可靠，可重复编译出原始的镜像，这也很重要。本章节我们将讨论如何锁定DEYAIO编译出来的项目版本，并支持离线编译，以便在内网环境中持续开发项目。 锁定D..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"离线编译DEY项目\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[{"level":2,"title":"锁定DEY项目中manifest仓库指定的各软件库的git版本","slug":"锁定dey项目中manifest仓库指定的各软件库的git版本","link":"#锁定dey项目中manifest仓库指定的各软件库的git版本","children":[]},{"level":2,"title":"联网状态下完成一次完整的编译","slug":"联网状态下完成一次完整的编译","link":"#联网状态下完成一次完整的编译","children":[]},{"level":2,"title":"本机离线编译配置","slug":"本机离线编译配置","link":"#本机离线编译配置","children":[]},{"level":2,"title":"设置downloads和sstate-cache目录在内网共享","slug":"设置downloads和sstate-cache目录在内网共享","link":"#设置downloads和sstate-cache目录在内网共享","children":[{"level":3,"title":"打包downloads目录下的git裸仓库","slug":"打包downloads目录下的git裸仓库","link":"#打包downloads目录下的git裸仓库","children":[]},{"level":3,"title":"配置内网其它机器","slug":"配置内网其它机器","link":"#配置内网其它机器","children":[]}]}],"git":{},"autoDesc":true,"filePathRelative":"zh/deyaio/dey-buildroot.md"}');export{v as comp,u as data};
