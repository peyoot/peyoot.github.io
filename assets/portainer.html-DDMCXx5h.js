import{_ as e,o as n,c as a,b as i}from"./app-C-PasaP0.js";const o={},t=i(`<h2 id="安装podman和podman-compose" tabindex="-1"><a class="header-anchor" href="#安装podman和podman-compose"><span>安装podman和podman-compose</span></a></h2><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>sudo apt install podman podman-compose
podman info --format &#39;{{.Host.Security.Rootless}}&#39;
输出是true表明是rootless
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>启动rootless的podman socket:</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>systemctl --user enable --now podman.socket
检查一下：
robin@u2404npm:~$ ls $XDG_RUNTIME_DIR/podman/podman.sock
/run/user/1000/podman/podman.sock
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="创建portainer的compose文件" tabindex="-1"><a class="header-anchor" href="#创建portainer的compose文件"><span>创建portainer的compose文件</span></a></h2><p>mkdir -p podman/portainer/ nano docker-compose.yml</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>version: &quot;3.8&quot;

services:
  portainer:
    image: docker.io/portainer/portainer-ce:latest
    container_name: portainer
    restart: unless-stopped

    ports:
      - &quot;9443:9443&quot;
      - &quot;9000:9000&quot;

    volumes:
      # Portainer 数据持久化
      - portainer_data:/data

      # Podman socket（rootless）
      - $XDG_RUNTIME_DIR/podman/podman.sock:/var/run/docker.sock:Z

    security_opt:
      - label=disable

volumes:
  portainer_data:
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="启动portainer" tabindex="-1"><a class="header-anchor" href="#启动portainer"><span>启动portainer</span></a></h2><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>podman-compose up -d
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>打开ip:9000，创建一个用户，默认用户名admin可改为p*t，密码用常用的.p系列1刀h+双惊</p><p>如果是要从其它平台恢复，则用restore选项。</p>`,11),s=[t];function r(d,l){return n(),a("div",null,s)}const c=e(o,[["render",r],["__file","portainer.html.vue"]]),m=JSON.parse('{"path":"/zh/note/it/application/portainer.html","title":"","lang":"zh-CN","frontmatter":{"description":"安装podman和podman-compose 启动rootless的podman socket: 创建portainer的compose文件 mkdir -p podman/portainer/ nano docker-compose.yml 启动portainer 打开ip:9000，创建一个用户，默认用户名admin可改为p*t，密码用常用的.p...","head":[["meta",{"property":"og:url","content":"https://peyoot.github.io/zh/note/it/application/portainer.html"}],["meta",{"property":"og:description","content":"安装podman和podman-compose 启动rootless的podman socket: 创建portainer的compose文件 mkdir -p podman/portainer/ nano docker-compose.yml 启动portainer 打开ip:9000，创建一个用户，默认用户名admin可改为p*t，密码用常用的.p..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[{"level":2,"title":"安装podman和podman-compose","slug":"安装podman和podman-compose","link":"#安装podman和podman-compose","children":[]},{"level":2,"title":"创建portainer的compose文件","slug":"创建portainer的compose文件","link":"#创建portainer的compose文件","children":[]},{"level":2,"title":"启动portainer","slug":"启动portainer","link":"#启动portainer","children":[]}],"git":{},"autoDesc":true,"filePathRelative":"zh/note/it/application/portainer.md"}');export{c as comp,m as data};
