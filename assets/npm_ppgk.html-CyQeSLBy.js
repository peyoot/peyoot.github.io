import{_ as a,r as l,o as r,c as o,a as e,e as s,w as d,d as i,b as n}from"./app-C-PasaP0.js";const c={},m=e("h2",{id:"搭建npm-gitea和keycloak-sso系统",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#搭建npm-gitea和keycloak-sso系统"},[e("span",null,"搭建npm,gitea和keycloak sso系统")])],-1),v=e("p",null,"本系统在公网上部署Nginx Proxy Manager(npm)，使用Let's Encrypt证书，使用portainer stack在内网编排部署gitea和keycloak sso系统，并使用podmant替代docker。",-1),u=e("h2",{id:"在云服务器上部署npm",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#在云服务器上部署npm"},[e("span",null,"在云服务器上部署npm")])],-1),p=e("p",null,"云服务器需开放80,81,443端口，结合openvpn或FRP 隧道实现路由转发到内网。",-1),b=e("b",null,"🖧无VPN时设置FRP",-1),g=n(`<div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>[common]
bind_port = 7000
token = your_secure_token_32chars

dashboard_port = 7500
dashboard_user = admin
dashboard_pass = your_dashboard_pass
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Compose 文件</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>version: &quot;3&quot;

services:
  npm:
    image: jc21/nginx-proxy-manager:latest
    container_name: npm
    restart: unless-stopped
    ports:
      - &quot;80:80&quot;
      - &quot;443:443&quot;
      - &quot;81:81&quot;
    volumes:
      - /opt/npm/data:/data
      - /opt/npm/letsencrypt:/etc/letsencrypt

  frps:
    image: snowdreamtech/frps:latest
    container_name: frps
    restart: unless-stopped
    ports:
      - &quot;7000:7000&quot;
      - &quot;7500:7500&quot;
    volumes:
      - /opt/frp/frps.ini:/etc/frp/frps.ini:ro

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>启动：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>sudo podman-compose -f /opt/npm/compose.yml up -d
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>生成 systemd 服务（确保开机启动）</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>sudo podman generate systemd --new --name npm &gt; /etc/systemd/system/npm.service
sudo podman generate systemd --new --name frps &gt; /etc/systemd/system/frps.service
sudo systemctl daemon-reload
sudo systemctl enable npm frps
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li>内网服务器需要部署 FRP Client,<br> frpc.ini配置文件：</li></ol><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># frpc.ini
[common]
server_addr = &lt;Azure 公网 IP&gt;
server_port = 7000
token = your_secure_token_here

[keycloak]
type = http
local_port = 8080
custom_domains = sso.yourdomain.com

[gitea]
type = http
local_port = 3000
custom_domains = git.yourdomain.com

[pgadmin]
type = http
local_port = 80
custom_domains = db.yourdomain.com
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>启动frp客户端（直接运行，或是也在compose服务中类似上面加上它)：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>wget https://github.com/fatedier/frp/releases/download/v0.58.1/frp_0.58.1_linux_amd64.tar.gz
tar xzf frp_0.58.1_linux_amd64.tar.gz
./frpc -c frpc.ini
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,11),_=e("b",null,"🖧已有VPN,在云服务器中部署npm ",-1),h=e("br",null,null,-1),k=n(`<ul><li>安装podman</li></ul><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>sudo apt update
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>启动后，浏览器打开 http://IP:81 ，创建一个管理员帐户，一点也不介意生年<br> 先添加 SSL 证书（Let’s Encrypt → 输入 git.eccee.com + sso.eccee.com 一键申请） 再建两条 Proxy Host，scheme是http，Forward Hostname/IP填的是容器名：</p><ol><li>sso.eccee.com 转到 keycloak:8080 Cache assets不勾选，Block Common Exploits建议勾选，Websockets Support必须勾选</li><li>git.eccee.com 转到 gitea:3000 Cache assets可勾选，Block Common Exploits建议勾选，Websockets Support可选</li></ol><p>ssl页面选择申请的证书，勾选这两项：<br> ✅ Force SSL<br> ✅ HTTP/2 Support</p><p>设置开机启动</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 为运行中的容器生成 systemd 配置
sudo podman generate systemd --new --name npm | sudo tee /etc/systemd/system/npm.service

# 启用并开机启动
sudo systemctl daemon-reload
sudo systemctl enable --now npm
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>————————————————————————————————————————————————————————————</p><p>使用rootless的podman，在portainer中编排这个服务，</p><ol><li>新建stack Portainer → Stacks → Add stack</li></ol><table><thead><tr><th>字段</th><th>填写内容</th></tr></thead><tbody><tr><td><strong>Name</strong></td><td><code>git-keycloak</code></td></tr><tr><td><strong>Build method</strong></td><td>Web editor</td></tr><tr><td><strong>Web editor</strong></td><td>贴下面的 compose 文件</td></tr><tr><td><strong>Environment variables</strong></td><td><strong>点 &quot;Advanced mode&quot;</strong> → 逐行添加（见下表）</td></tr></tbody></table><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>KC_ADMIN=admin或p*t
KC_ADMIN_PWD=.p系列1刀h+dual叹
KC_DB_PWD=K+密+用户
GITEA_DB_PWD=G+密+用户
KC_HOST=sso.eccee.com
GITEA_HOST=git.eccee.com
PGADMIN_EMAIL=p*t@h*t.com
PGADMIN_PWD=P+密+用户
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3"><li>compose文件，注意podman和docker区别，本篇为podman版本，需先验证rootless是true并有用户的socket.</li></ol><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>version: &quot;3.8&quot;

services:
  # ========== 1. 反向代理 ==========
  npm:
    image: docker.io/jc21/nginx-proxy-manager:latest
    container_name: npm
    restart: unless-stopped
    ports:
      - &quot;8080:80&quot;    # HTTP
      - &quot;8443:443&quot;   # HTTPS
      - &quot;8081:81&quot;    # 管理界面
    volumes:
      - npm_data:/data
      - npm_le:/etc/letsencrypt
    networks:
      - npm

  # ========== 2. SSO 中心 ==========
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
      - &quot;8082:8080&quot;
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
      KC_PROXY: &quot;none&quot;
    volumes:
      - kc_themes:/opt/keycloak/themes
      - kc_providers:/opt/keycloak/providers
    networks:
      - npm
    depends_on:
      - keycloak-db

  # ========== 3. Git 托管 ==========
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

  # ========== 4. 数据库管理 ==========
  pgadmin:
    image: docker.io/dpage/pgadmin4:latest
    container_name: pgadmin
    restart: unless-stopped
    ports:
      - &quot;8083:80&quot;
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
  npm_data:
  npm_le:
  kc_db:
  kc_themes:
  kc_providers:
  gitea_db:
  gitea_data:
  pgadmin_data:

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其中npm没用，可移除</p><ol start="4"><li>部署后操作 | 任务 | 操作 | | -------- | --------------------------------------------- | | 申请 SSL | <code>http://&lt;服务器IP&gt;:81</code> → NPM → SSL Certificates | | 配置反向代理 | NPM → Proxy Hosts → 添加两条路由 | | 上传插件（可选） | Portainer → Volumes → <code>kc_providers</code> → Browse |</li></ol><p>首次打开http://IP:8081 会创建用户密码，用p<em>t@h</em>.com，密码为一点也不介意生年</p><p>浏览器打开 http://IP:8081 先添加 SSL 证书（Let’s Encrypt → 输入 git.eccee.com + sso.sso.eccee.com 一键申请） 再建两条 Proxy Host，scheme是http，Forward Hostname/IP填的是容器名：</p><ol><li>ssoip90.eccee.com 转到 keycloak:8080 Cache assets不勾选，Block Common Exploits建议勾选，Websockets Support必须勾选</li><li>gitip90.eccee.com 转到 gitea:3000 Cache assets可勾选，Block Common Exploits建议勾选，Websockets Support可选</li></ol><p>ssl页面选择申请的证书，勾选这两项：<br> ✅ Force SSL<br> ✅ HTTP/2 Support</p><p>5、登陆keycloak<br> 登陆用户名和密码就是Advance Mode中定义的KC_ADMIN和它的密码。</p><p>6、创建gitea管理员并登陆<br> Gitea 首次访问时，不会自动弹出安装向导（因为设置了 GITEA__security__INSTALL_LOCK: &quot;true&quot;），你需要手动执行创建管理员的操作。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 进入 gitea 容器
docker exec -it gitea /bin/sh

# 创建管理员账号
gitea admin user create \\
  --username peyoot \\
  --password 1点也不介意 \\
  --email peyoot@hotmail.com \\
  --admin
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>7、让gitea使用keycloak用户 A. keycloak中配置</p><ul><li>登录 https://sso.eccee.com/admin</li><li>选择你的 realm（默认是 master，新建一个 eccee）</li><li>Clients → Create client<br> Client ID: gitea<br> Client Protocol: openid-connect<br> 点击 Next<br> Capability config:<br> ✅ Client authentication: ON<br> ✅ Standard flow: ON<br> ✅ Direct access grants: ON<br> 点击 Next，然后 Save</li><li>进入刚创建的 gitea 客户端，Credentials 标签页：<br> Client Authenticator: Client ID and Secret<br> 复制 Client Secret（一串 UUID，后面要用）</li><li>Settings 标签页，配置 Valid redirect URIs: https://git.eccee.com/user/oauth2/keycloak/callback</li><li>Root URL https://git.eccee.com</li><li>记录 OpenID Endpoint Configuration： 在Realm Setting的General可找到OpenID Endpoint Configuration这个链接，到时需要用 https://sso.eccee.com/realms/eccee/.well-known/openid-configuration</li></ul><p>B. gitea配置OAuth2</p><ul><li>用管理员账号登录 Gitea<br> 点击头像 → Site Administration → Identity &amp; Access | Authentication Sources → Add Authentication Source<br> 填写表单：</li></ul><table><thead><tr><th>字段</th><th>值</th></tr></thead><tbody><tr><td>Authentication Name</td><td>Keycloak</td></tr><tr><td>Authentication Type</td><td>OAuth2</td></tr><tr><td>OAuth2 Provider</td><td>OpenID Connect</td></tr><tr><td>Client ID</td><td>gitea</td></tr><tr><td>Client Secret</td><td>刚才复制的 Client Secret</td></tr><tr><td>OpenID Connect Auto Discovery URL</td><td>https://sso.eccee.com/realms/eccee/.well-known/openid-configuration</td></tr><tr><td>Additional Scopes</td><td>openid email profile</td></tr></tbody></table><p>点击 Add Authentication Source</p><p>C.测试 SSO 登录</p><ul><li>退出 Gitea，回到登录页</li><li>应该出现 &quot;Sign in with Keycloak&quot; 按钮</li><li>点击后跳转到 Keycloak 登录页</li><li>用 Keycloak 中的用户登录</li><li>首次登录会自动在 Gitea 创建关联账号</li></ul><p>D. 开启 Keycloak 用户自注册 在 Realm settings → Login 标签页：</p><table><thead><tr><th>设置项</th><th>值</th><th>说明</th></tr></thead><tbody><tr><td><strong>User registration</strong></td><td>✅ <strong>ON</strong></td><td>允许用户自己注册</td></tr><tr><td><strong>Verify email</strong></td><td>✅ <strong>ON</strong>（推荐）</td><td>注册后需验证邮箱</td></tr><tr><td><strong>Login with email</strong></td><td>✅ <strong>ON</strong>（推荐）</td><td>允许用邮箱登录</td></tr><tr><td><strong>Forgot password</strong></td><td>✅ <strong>ON</strong>（推荐）</td><td>允许找回密码</td></tr></tbody></table><p>配置 Terms and Conditions 条款内容</p><ol><li>进入 Realm Localization 设置</li></ol><p>Realm settings → Localization → Realm overrides</p><p>点击 Add message 或找到已有条目，添加以下 Key：</p><table><thead><tr><th>Message Key</th><th>Value（中文）</th></tr></thead><tbody><tr><td><code>termsTitle</code></td><td><code>注册验证Registration Verification</code></td></tr><tr><td><code>termsText</code></td><td><code>请确认您不是机器人，并同意以下条款：本服务仅供内部使用，禁止批量注册。Please confirm you are not a robot. Bulk registration is prohibited.</code></td></tr><tr><td><code>termsAcceptanceText</code></td><td><code>我同意上述条款I agree to the terms</code></td></tr></tbody></table><p>注意，keycloak 24没有这key，我们要用自己的主题 从portainer的volume查得kc_theme路径，然后</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>cd /home/robin/.local/share/containers/storage/volumes/npm_keycloak_gitea_kc_themes/_data
mkdir -p mytheme/login/pages
mkdir -p mytheme/login/resources/messages

# 创建主题配置
cat &gt; mytheme/login/theme.properties &lt;&lt; &#39;EOF&#39;
parent=keycloak
EOF

# 创建条款模板（用 msg 变量）
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,46),y=e("p",null,[i('<#import "template.ftl" as layout> <@layout.registrationLayout displayInfo=false displayMessage=false; section> <#if section = "header"> ${msg("termsTitle")} <#elseif section = "form"> '),e("div",{id:"kc-terms-text"},' ${msg("termsText")} '),e("form",{class:"form-actions",action:"${url.loginAction}",method:"POST"},[e("div",{class:"${properties.kcFormGroupClass!}"},[e("div",{id:"kc-form-options"},[e("div",{class:"${properties.kcLabelWrapperClass!}"},[e("div",{id:"kc-registration-terms-text"},' ${msg("myCustomTermsText")} '),e("label",{class:"pf-c-check__label"},[e("input",{type:"checkbox",name:"accept",id:"accept","aria-describedby":"kc-terms-text"}),i(' ${msg("acceptTerms")} ')])])])]),e("div",{class:"${properties.kcFormGroupClass!}"},[e("button",{type:"submit",id:"kc-accept",class:"${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!}"},'${msg("acceptTerms")}')])]),i(" </#if> "),e("a",{href:"mailto:/@layout.registrationLayout"},"/@layout.registrationLayout")],-1),x=n(`<div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>
# 创建中文消息
cat &gt; mytheme/login/resources/messages/messages_zh_CN.properties &lt;&lt; &#39;EOF&#39;
myCustomTermsText=&lt;h3&gt;服务条款&lt;/h3&gt;...
EOF

# 创建英文消息
cat &gt; mytheme/login/resources/messages/messages_en.properties &lt;&lt; &#39;EOF&#39;
myCustomTermsText=&lt;h3&gt;Terms&lt;/h3&gt;...
EOF
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>似乎不起作用， 待查</p><h2 id="keycloak的路由" tabindex="-1"><a class="header-anchor" href="#keycloak的路由"><span>keycloak的路由</span></a></h2><p>Keycloak Realm URL 结构</p><table><thead><tr><th>访问地址</th><th>说明</th></tr></thead><tbody><tr><td><code>https://sso.eccee.com/admin</code></td><td>管理控制台，登录后选 realm</td></tr><tr><td><code>https://sso.eccee.com/realms/master/protocol/openid-connect/auth</code></td><td>master realm 登录页</td></tr><tr><td><code>https://sso.eccee.com/realms/eccee/protocol/openid-connect/auth</code></td><td>eccee realm 登录页</td></tr></tbody></table><p>方案 1：Nginx Proxy Manager 路径重写</p><table><thead><tr><th>NPM 配置项</th><th>值</th></tr></thead><tbody><tr><td>Forward Hostname</td><td><code>sso.eccee.com</code></td></tr><tr><td>Forward Port</td><td><code>8080</code></td></tr><tr><td><strong>Custom Locations</strong></td><td>添加 <code>/</code> → 重写到 <code>/realms/eccee/account</code></td></tr></tbody></table><p>方案 2：Keycloak 欢迎页主题（官方推荐）</p><p>方案 3：DNS + 子域名（最优雅）</p><table><thead><tr><th>子域名</th><th>用途</th><th>NPM 转发目标</th></tr></thead><tbody><tr><td><code>sso.eccee.com</code></td><td>eccee realm 登录</td><td><code>http://keycloak:8080/realms/eccee</code></td></tr><tr><td><code>admin.eccee.com</code></td><td>master realm 管理</td><td><code>http://keycloak:8080/admin</code></td></tr></tbody></table><p>在 Gitea 或其他应用里，快捷入口直接链接到：</p><p>https://sso.eccee.com/realms/eccee/protocol/openid-connect/auth?client_id=gitea&amp;redirect_uri=https://git.eccee.com/user/oauth2/keycloak/callback</p><h2 id="gitea配置自注册" tabindex="-1"><a class="header-anchor" href="#gitea配置自注册"><span>gitea配置自注册</span></a></h2><p>容器内配置文件位于/etc/gitea/app.ini ，可是 挂载的数据卷gitea_data位于home/robin/.local/share/containers/storage/volumes/npm_keycloak_gitea_gitea_data/_data，在容器内是/var/lib/gitea ，先在容器内复制一份配置：</p><p>从portainer进入容器： cp /etc/gitea/app.ini /var/lib/gitea/</p><p>挂载到同一个郑</p><pre><code>volumes:
  - gitea_data:/var/lib/gitea
  - gitea_data:/etc/gitea
</code></pre><p>修改app.ini</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>[service]
DISABLE_REGISTRATION = false
REGISTER_EMAIL_CONFIRM = true

[mailer]
ENABLED = true
HOST = smtp.exmail.qq.com:465
FROM = info@eccee.com
USER = info@eccee.com
PASSWD = ox...xgx
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,19);function S(A,P){const t=l("font");return r(),o("div",null,[m,v,u,p,e("details",null,[e("summary",null,[s(t,{size:"4"},{default:d(()=>[b]),_:1})]),i(" 如果内网环境没有公网IP出口，或无法在路由器上搭vpn，则可以用FRP。 1. 云服务器上需部署 NPM + FRP Server， 创建目录： sudo mkdir -p /opt/{npm,frp} 创建FRP文件frp.ini： "),g]),e("p",null,[i("▼"),s(t,{size:"4"},{default:d(()=>[_]),_:1}),h,i(" 如果已经实现公网内网的VPN隧道，只需用podman compose编排npm服务。")]),k,y,x])}const T=a(c,[["render",S],["__file","npm_ppgk.html.vue"]]),I=JSON.parse(`{"path":"/zh/note/it/application/npm_ppgk.html","title":"","lang":"zh-CN","frontmatter":{"description":"搭建npm,gitea和keycloak sso系统 本系统在公网上部署Nginx Proxy Manager(npm)，使用Let's Encrypt证书，使用portainer stack在内网编排部署gitea和keycloak sso系统，并使用podmant替代docker。 在云服务器上部署npm 云服务器需开放80,81,443端口，结合...","head":[["meta",{"property":"og:url","content":"https://peyoot.github.io/zh/note/it/application/npm_ppgk.html"}],["meta",{"property":"og:description","content":"搭建npm,gitea和keycloak sso系统 本系统在公网上部署Nginx Proxy Manager(npm)，使用Let's Encrypt证书，使用portainer stack在内网编排部署gitea和keycloak sso系统，并使用podmant替代docker。 在云服务器上部署npm 云服务器需开放80,81,443端口，结合..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[{"level":2,"title":"搭建npm,gitea和keycloak sso系统","slug":"搭建npm-gitea和keycloak-sso系统","link":"#搭建npm-gitea和keycloak-sso系统","children":[]},{"level":2,"title":"在云服务器上部署npm","slug":"在云服务器上部署npm","link":"#在云服务器上部署npm","children":[]},{"level":2,"title":"keycloak的路由","slug":"keycloak的路由","link":"#keycloak的路由","children":[]},{"level":2,"title":"gitea配置自注册","slug":"gitea配置自注册","link":"#gitea配置自注册","children":[]}],"git":{},"autoDesc":true,"filePathRelative":"zh/note/it/application/npm_ppgk.md"}`);export{T as comp,I as data};
