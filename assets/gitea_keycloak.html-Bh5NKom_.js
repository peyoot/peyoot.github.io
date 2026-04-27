import{_ as e,o as i,c as n,b as t}from"./app-C-PasaP0.js";const s={},d=t(`<h2 id="搭建npm-gitea和keycloak-sso系统" tabindex="-1"><a class="header-anchor" href="#搭建npm-gitea和keycloak-sso系统"><span>搭建npm,gitea和keycloak sso系统</span></a></h2><p>本系统在公网上部署Nginx Proxy Manager(npm)，使用Let&#39;s Encrypt证书，使用portainer stack在内网编排部署gitea和keycloak sso系统，并使用podmant替代docker。</p><h2 id="在云服务器上部署npm" tabindex="-1"><a class="header-anchor" href="#在云服务器上部署npm"><span>在云服务器上部署npm</span></a></h2><p>云服务器需开放80,81,443端口，结合openvpn隧道实现路由转发到内网，先实现内网访问，再由云服务器npm转发，请参考最后的章节。</p><h2 id="gitea和keycloak-sso系统搭建" tabindex="-1"><a class="header-anchor" href="#gitea和keycloak-sso系统搭建"><span>gitea和keycloak sso系统搭建</span></a></h2><p>在portainer中编排这个服务，</p><ol><li>创建stack Portainer → Stacks → Add stack</li></ol><table><thead><tr><th>字段</th><th>填写内容</th></tr></thead><tbody><tr><td><strong>Name</strong></td><td><code>git-keycloak</code></td></tr><tr><td><strong>Build method</strong></td><td>Web editor</td></tr><tr><td><strong>Web editor</strong></td><td>贴下面的 compose 文件</td></tr><tr><td><strong>Environment variables</strong></td><td><strong>点 &quot;Advanced mode&quot;</strong> → 逐行添加（见下表）</td></tr></tbody></table><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>KC_ADMIN=admin
KC_ADMIN_PWD=.p系列1刀h+dual叹
KC_DB_PWD=K+密+用户
GITEA_DB_PWD=G+密+用户
KC_HOST=sso.eccee.com
GITEA_HOST=git.eccee.com
PGADMIN_EMAIL=p*t@h*t.com
PGADMIN_PWD=P+密+用户
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3"><li>compose文件</li></ol><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>version: &quot;3.8&quot;

services:
  # ========== 1. SSO 中心 ==========
  keycloak-db:
    image: docker.io/postgres:15-alpine
    container_name: keycloak-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: keycloak
      POSTGRES_USER: keycloak
      POSTGRES_PASSWORD: \${KC_DB_PWD}
    volumes:
      - kc_db:/var/lib/postgresql/data
    networks:
      - npm

  keycloak:
    image: quay.io/keycloak/keycloak:24.0
    container_name: keycloak
    restart: unless-stopped
    command: start-dev
    ports:
      - &quot;8080:8080&quot;
    environment:
      KC_DB: postgres
      KC_DB_URL_HOST: keycloak-db
      KC_DB_URL_DATABASE: keycloak
      KC_DB_USERNAME: keycloak
      KC_DB_PASSWORD: \${KC_DB_PWD}
      KEYCLOAK_ADMIN: \${KC_ADMIN}
      KEYCLOAK_ADMIN_PASSWORD: \${KC_ADMIN_PWD}
      KC_HTTP_ENABLED: &quot;true&quot;
      KC_HOSTNAME_STRICT: &quot;false&quot;
      KC_PROXY: &quot;edge&quot;
    volumes:
      - kc_themes:/opt/keycloak/themes
      - kc_providers:/opt/keycloak/providers
    networks:
      - npm
    depends_on:
      - keycloak-db

  # ========== 2. Git 托管 ==========
  gitea-db:
    image: docker.io/postgres:15-alpine
    container_name: gitea-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: gitea
      POSTGRES_USER: gitea
      POSTGRES_PASSWORD: \${GITEA_DB_PWD}
    volumes:
      - gitea_db:/var/lib/postgresql/data
    networks:
      - npm

  gitea:
    image: docker.io/gitea/gitea:1.21-rootless
    container_name: gitea
    restart: unless-stopped
    ports:
      - &quot;3000:3000&quot;
    environment:
      GITEA__database__DB_TYPE: postgres
      GITEA__database__HOST: gitea-db:5432
      GITEA__database__NAME: gitea
      GITEA__database__USER: gitea
      GITEA__database__PASSWD: \${GITEA_DB_PWD}
      GITEA__server__DOMAIN: \${GITEA_HOST}
      GITEA__server__ROOT_URL: https://\${GITEA_HOST}/
      GITEA__server__HTTP_PORT: 3000
      GITEA__security__INSTALL_LOCK: &quot;true&quot;
      GITEA__oauth__ENABLE_OPENID_SIGNIN: &quot;true&quot;
      GITEA__oauth__ENABLE_OPENID_SIGNUP: &quot;true&quot;
    volumes:
      - gitea_data:/var/lib/gitea
    networks:
      - npm
    depends_on:
      - gitea-db

  # ========== 3. 数据库管理 ==========
  pgadmin:
    image: docker.io/dpage/pgadmin4:latest
    container_name: pgadmin
    restart: unless-stopped
    ports:
      - &quot;8081:80&quot;
    environment:
      PGADMIN_DEFAULT_EMAIL: \${PGADMIN_EMAIL}
      PGADMIN_DEFAULT_PASSWORD: \${PGADMIN_PWD}
      PGADMIN_CONFIG_SERVER_MODE: &quot;False&quot;
    volumes:
      - pgadmin_data:/var/lib/pgadmin
    networks:
      - npm

networks:
  npm:
    driver: bridge

volumes:
  kc_db:
  kc_themes:
  kc_providers:
  gitea_db:
  gitea_data:
  pgadmin_data:
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>4、登陆keycloak<br> 登陆用户名和密码就是Advance Mode中定义的KC_ADMIN和它的密码。</p><p>5、创建gitea管理员并登陆<br> Gitea 首次访问时，不会自动弹出安装向导（因为设置了 GITEA__security__INSTALL_LOCK: &quot;true&quot;），你需要手动执行创建管理员的操作。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 进入 gitea 容器
docker exec -it gitea /bin/sh

# 创建管理员账号
gitea admin user create \\
  --username peyoot \\
  --password g+k系列1刀h \\
  --email p*t@hotmail.com \\
  --admin
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意，默认的配置是https://ROOT_URL ，内网用ip是无法登陆，要在公网反向代理设置好，可用https://sso.eccee.com登陆</p><p>6、让gitea使用keycloak用户 A. keycloak中配置</p><ul><li>登录 https://ssoip90.eccee.com/admin</li><li>选择你的 realm（默认是 master，新建一个 eccee）</li><li>Clients → Create client<br> Client ID: gitea<br> Client Protocol: openid-connect<br> 点击 Next<br> Capability config:<br> ✅ Client authentication: ON<br> ✅ Standard flow: ON<br> ✅ Direct access grants: ON<br> 点击 Next，然后 Save</li><li>进入刚创建的 gitea 客户端，Credentials 标签页：<br> Client Authenticator: Client ID and Secret<br> 复制 Client Secret（一串 UUID，后面要用）</li><li>Settings 标签页，配置 Valid redirect URIs:<br> https://gitip90.eccee.com/user/oauth2/keycloak/callback<br> 或更宽松（测试用）：https://gitip90.eccee.com/*</li><li>记录 OpenID Endpoint Configuration： https://ssoip90.eccee.com/realms/eccee/.well-known/openid-configuration</li></ul><p>B. gitea配置OAuth2</p><ul><li>用管理员账号登录 Gitea<br> 点击头像 → Site Administration → Authentication Sources → Add Authentication Source<br> 填写表单：</li></ul><table><thead><tr><th>字段</th><th>值</th></tr></thead><tbody><tr><td>Authentication Name</td><td>Keycloak</td></tr><tr><td>Authentication Type</td><td>OAuth2</td></tr><tr><td>OAuth2 Provider</td><td>OpenID Connect</td></tr><tr><td>Client ID</td><td>gitea</td></tr><tr><td>Client Secret</td><td>刚才复制的 Client Secret</td></tr><tr><td>OpenID Connect Auto Discovery URL</td><td>https://ssoip90.eccee.com/realms/eccee/.well-known/openid-configuration</td></tr><tr><td>Additional Scopes</td><td>openid email profile</td></tr></tbody></table><p>点击 Add Authentication Source</p><p>C.测试 SSO 登录</p><ul><li>退出 Gitea，回到登录页</li><li>应该出现 &quot;Sign in with Keycloak&quot; 按钮</li><li>点击后跳转到 Keycloak 登录页</li><li>用 Keycloak 中的用户登录</li><li>首次登录会自动在 Gitea 创建关联账号</li></ul><hr><ol start="7"><li>公网部署反代操作</li></ol><p>如果已经实现公网内网的VPN隧道，只需用podman compose编排npm服务。</p><ul><li>安装podman</li></ul><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>sudo apt update
sudo apt install -y podman podman-compose
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>创建目录</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>sudo mkdir -p /opt/npm
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>创建/opt/npm/npm.yml文件，注意使用podman不认短容器名，要加docker.io</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>version: &quot;3&quot;

services:
  npm:
    image: docker.io/jc21/nginx-proxy-manager:latest
    container_name: npm
    restart: unless-stopped
    ports:
      - &quot;80:80&quot;
      - &quot;443:443&quot;
      - &quot;81:81&quot;
    volumes:
      - /opt/npm/data:/data
      - /opt/npm/letsencrypt:/etc/letsencrypt
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>手动启动服务</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>sudo podman-compose -f /opt/npm/npm.yml up -d
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><table><thead><tr><th>任务</th><th>操作</th></tr></thead><tbody><tr><td>申请 SSL</td><td><code>http://&lt;服务器IP&gt;:81</code> → NPM → SSL Certificates</td></tr><tr><td>配置反向代理</td><td>NPM → Proxy Hosts → 添加两条路由</td></tr><tr><td>上传插件（可选）</td><td>Portainer → Volumes → <code>kc_providers</code> → Browse</td></tr></tbody></table><p>首次打开http://IP:81 会创建用户密码，用p<em>t@h</em>.com，密码为一点也不介意</p><p>浏览器打开 http://IP:81 先添加 SSL 证书（Let’s Encrypt → 输入 git.eccee.com + sso.eccee.com 一键申请） 再建两条 Proxy Host，scheme是http，Forward Hostname/IP填的是容器名：</p><ol><li>sso.eccee.com 转到 内网IP:8080 Cache assets不勾选，Block Common Exploits建议勾选，Websockets Support必须勾选， 可用Ssl,可勾选Advanced项。</li><li>git.eccee.com 转到 内网IP:3000 Cache assets可勾选，Block Common Exploits建议勾选，Websockets Support可选， 证书一定要，Advanced也要勾选</li></ol><p>ssl页面选择申请的证书，勾选这两项：<br> ✅ Force SSL<br> ✅ HTTP/2 Support</p><p>并且开启Advanced中的选项，以实现包头转发</p>`,40),a=[d];function l(r,c){return i(),n("div",null,a)}const v=e(s,[["render",l],["__file","gitea_keycloak.html.vue"]]),m=JSON.parse(`{"path":"/zh/note/it/application/gitea_keycloak.html","title":"","lang":"zh-CN","frontmatter":{"description":"搭建npm,gitea和keycloak sso系统 本系统在公网上部署Nginx Proxy Manager(npm)，使用Let's Encrypt证书，使用portainer stack在内网编排部署gitea和keycloak sso系统，并使用podmant替代docker。 在云服务器上部署npm 云服务器需开放80,81,443端口，结合...","head":[["meta",{"property":"og:url","content":"https://peyoot.github.io/zh/note/it/application/gitea_keycloak.html"}],["meta",{"property":"og:description","content":"搭建npm,gitea和keycloak sso系统 本系统在公网上部署Nginx Proxy Manager(npm)，使用Let's Encrypt证书，使用portainer stack在内网编排部署gitea和keycloak sso系统，并使用podmant替代docker。 在云服务器上部署npm 云服务器需开放80,81,443端口，结合..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[{"level":2,"title":"搭建npm,gitea和keycloak sso系统","slug":"搭建npm-gitea和keycloak-sso系统","link":"#搭建npm-gitea和keycloak-sso系统","children":[]},{"level":2,"title":"在云服务器上部署npm","slug":"在云服务器上部署npm","link":"#在云服务器上部署npm","children":[]},{"level":2,"title":"gitea和keycloak sso系统搭建","slug":"gitea和keycloak-sso系统搭建","link":"#gitea和keycloak-sso系统搭建","children":[]}],"git":{},"autoDesc":true,"filePathRelative":"zh/note/it/application/gitea_keycloak.md"}`);export{v as comp,m as data};
