import{_ as e,o as n,c as i,b as s}from"./app-oTA4_50g.js";const d={},l=s(`<h2 id="gitea和keycloak-sso系统搭建" tabindex="-1"><a class="header-anchor" href="#gitea和keycloak-sso系统搭建"><span>gitea和keycloak sso系统搭建</span></a></h2><p>在portainer中编排这个服务，</p><ol><li>创建external网络npm Portainer → Networks → Add network Name = npm , Driver = bridge , Enable “Manual network creation” 这和用docker network创建的区别在于它的attachable是&quot;true&quot;</li></ol><p>2.新建stack Portainer → Stacks → Add stack</p><table><thead><tr><th>字段</th><th>填写内容</th></tr></thead><tbody><tr><td><strong>Name</strong></td><td><code>git-keycloak</code></td></tr><tr><td><strong>Build method</strong></td><td>Web editor</td></tr><tr><td><strong>Web editor</strong></td><td>贴下面的 compose 文件</td></tr><tr><td><strong>Environment variables</strong></td><td><strong>点 &quot;Advanced mode&quot;</strong> → 逐行添加（见下表）</td></tr></tbody></table><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>KC_ADMIN=admin
KC_ADMIN_PWD=.p系列1刀h+dual叹
KC_DB_PWD=K+密+用户
GITEA_DB_PWD=G+密+用户
KC_HOST=sso.kc.ip90
GITEA_HOST=git.kc.ip90
PGADMIN_EMAIL=p*t@h*t.com
PGADMIN_PWD=P+密+用户
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3"><li>compose文件</li></ol><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>services:
  # ========== 1. 反向代理 ==========
  npm:
    image: jc21/nginx-proxy-manager:latest
    container_name: npm
    restart: unless-stopped
    ports:
      - &quot;80:80&quot;
      - &quot;443:443&quot;
      - &quot;81:81&quot;
    volumes:
      - npm_data:/data
      - npm_le:/etc/letsencrypt
    networks:
      - npm

  # ========== 2. SSO 中心 ==========
  keycloak-db:
    image: postgres:15-alpine
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
    restart: unless-stopped
    command: start-dev
    environment:
      KC_DB: postgres
      KC_DB_URL_HOST: keycloak-db
      KC_DB_URL_DATABASE: keycloak
      KC_DB_USERNAME: keycloak
      KC_DB_PASSWORD: \${KC_DB_PWD}
      KEYCLOAK_ADMIN: \${KC_ADMIN}
      KEYCLOAK_ADMIN_PASSWORD: \${KC_ADMIN_PWD}
      KC_HOSTNAME: \${KC_HOST}
      KC_PROXY: edge
    volumes:
      - kc_themes:/opt/keycloak/themes
      - kc_providers:/opt/keycloak/providers
    networks:
      - npm
    depends_on:
      - keycloak-db

  # ========== 3. Git 托管 ==========
  gitea-db:
    image: postgres:15-alpine
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
    image: gitea/gitea:1.21-rootless
    restart: unless-stopped
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

  # ========== 4. 数据库管理工具 ==========
  
  # 方案 A: pgAdmin (推荐，功能全)
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: pgadmin
    restart: unless-stopped
    environment:
      PGADMIN_DEFAULT_EMAIL: \${PGADMIN_EMAIL}
      PGADMIN_DEFAULT_PASSWORD: \${PGADMIN_PWD}
      PGADMIN_CONFIG_SERVER_MODE: &quot;False&quot;  # 单用户模式，简化登录
    volumes:
      - pgadmin_data:/var/lib/pgadmin
    networks:
      - npm

  # 方案 B: Adminer (极简备用，可选启用)
  # adminer:
  #   image: adminer:latest
  #   container_name: adminer
  #   restart: unless-stopped
  #   environment:
  #     ADMINER_DEFAULT_SERVER: gitea-db  # 默认连接 Gitea 数据库
  #   networks:
  #     - npm

networks:
  npm:
    external: true

volumes:
  npm_data:
  npm_le:
  kc_db:
  kc_themes:
  kc_providers:
  gitea_db:
  gitea_data:
  pgadmin_data:
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="4"><li>部署后操作 | 任务 | 操作 | | -------- | --------------------------------------------- | | 申请 SSL | <code>http://&lt;服务器IP&gt;:81</code> → NPM → SSL Certificates | | 配置反向代理 | NPM → Proxy Hosts → 添加两条路由 | | 上传插件（可选） | Portainer → Volumes → <code>kc_providers</code> → Browse |</li></ol>`,9),a=[l];function t(r,v){return n(),i("div",null,a)}const m=e(d,[["render",t],["__file","gitea_keycloak.html.vue"]]),o=JSON.parse('{"path":"/zh/note/it/application/gitea_keycloak.html","title":"","lang":"zh-CN","frontmatter":{"description":"gitea和keycloak sso系统搭建 在portainer中编排这个服务， 创建external网络npm Portainer → Networks → Add network Name = npm , Driver = bridge , Enable “Manual network creation” 这和用docker network创建的...","head":[["meta",{"property":"og:url","content":"https://peyoot.github.io/zh/note/it/application/gitea_keycloak.html"}],["meta",{"property":"og:description","content":"gitea和keycloak sso系统搭建 在portainer中编排这个服务， 创建external网络npm Portainer → Networks → Add network Name = npm , Driver = bridge , Enable “Manual network creation” 这和用docker network创建的..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[{"level":2,"title":"gitea和keycloak sso系统搭建","slug":"gitea和keycloak-sso系统搭建","link":"#gitea和keycloak-sso系统搭建","children":[]}],"git":{},"autoDesc":true,"filePathRelative":"zh/note/it/application/gitea_keycloak.md"}');export{m as comp,o as data};
