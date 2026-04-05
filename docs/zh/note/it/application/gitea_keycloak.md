## 搭建npm,gitea和keycloak sso系统
本系统在公网上部署Nginx Proxy Manager(npm)，使用Let's Encrypt证书，使用portainer stack在内网编排部署gitea和keycloak sso系统，并使用podmant替代docker。

## 在云服务器上部署npm
云服务器需开放80,81,443端口，结合openvpn隧道实现路由转发到内网，先实现内网访问，再由云服务器npm转发，请参考最后的章节。

## gitea和keycloak sso系统搭建
在portainer中编排这个服务，

1. 创建stack
Portainer → Stacks → Add stack

| 字段                        | 填写内容                              |
| ------------------------- | --------------------------------- |
| **Name**                  | `git-keycloak`                    |
| **Build method**          | Web editor                        |
| **Web editor**            | 贴下面的 compose 文件                   |
| **Environment variables** | **点 "Advanced mode"** → 逐行添加（见下表） |
```
KC_ADMIN=admin
KC_ADMIN_PWD=.p系列1刀h+dual叹
KC_DB_PWD=K+密+用户
GITEA_DB_PWD=G+密+用户
KC_HOST=sso.eccee.com
GITEA_HOST=git.eccee.com
PGADMIN_EMAIL=p*t@h*t.com
PGADMIN_PWD=P+密+用户
```
3. compose文件
```
version: "3.8"

services:
  # ========== 1. SSO 中心 ==========
  keycloak-db:
    image: docker.io/postgres:15-alpine
    container_name: keycloak-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: keycloak
      POSTGRES_USER: keycloak
      POSTGRES_PASSWORD: ${KC_DB_PWD}
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
      - "8080:8080"
    environment:
      KC_DB: postgres
      KC_DB_URL_HOST: keycloak-db
      KC_DB_URL_DATABASE: keycloak
      KC_DB_USERNAME: keycloak
      KC_DB_PASSWORD: ${KC_DB_PWD}
      KEYCLOAK_ADMIN: ${KC_ADMIN}
      KEYCLOAK_ADMIN_PASSWORD: ${KC_ADMIN_PWD}
      KC_HTTP_ENABLED: "true"
      KC_HOSTNAME_STRICT: "false"
      KC_PROXY: "edge"
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
      POSTGRES_PASSWORD: ${GITEA_DB_PWD}
    volumes:
      - gitea_db:/var/lib/postgresql/data
    networks:
      - npm

  gitea:
    image: docker.io/gitea/gitea:1.21-rootless
    container_name: gitea
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      GITEA__database__DB_TYPE: postgres
      GITEA__database__HOST: gitea-db:5432
      GITEA__database__NAME: gitea
      GITEA__database__USER: gitea
      GITEA__database__PASSWD: ${GITEA_DB_PWD}
      GITEA__server__DOMAIN: ${GITEA_HOST}
      GITEA__server__ROOT_URL: https://${GITEA_HOST}/
      GITEA__server__HTTP_PORT: 3000
      GITEA__security__INSTALL_LOCK: "true"
      GITEA__oauth__ENABLE_OPENID_SIGNIN: "true"
      GITEA__oauth__ENABLE_OPENID_SIGNUP: "true"
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
      - "8081:80"
    environment:
      PGADMIN_DEFAULT_EMAIL: ${PGADMIN_EMAIL}
      PGADMIN_DEFAULT_PASSWORD: ${PGADMIN_PWD}
      PGADMIN_CONFIG_SERVER_MODE: "False"
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
```


4、登陆keycloak  
登陆用户名和密码就是Advance Mode中定义的KC_ADMIN和它的密码。

5、创建gitea管理员并登陆  
Gitea 首次访问时，不会自动弹出安装向导（因为设置了 GITEA__security__INSTALL_LOCK: "true"），你需要手动执行创建管理员的操作。
```
# 进入 gitea 容器
docker exec -it gitea /bin/sh

# 创建管理员账号
gitea admin user create \
  --username peyoot \
  --password 1点也不介意生年 \
  --email peyoot@hotmail.com \
  --admin
```
注意，默认的配置是https://ROOT_URL ，内网用ip是无法登陆，要在公网反向代理设置好，可用https://sso.eccee.com登陆

6、让gitea使用keycloak用户
  A. keycloak中配置
  * 登录 https://ssoip90.eccee.com/admin
  * 选择你的 realm（默认是 master，新建一个 eccee）
  * Clients → Create client  
Client ID: gitea  
Client Protocol: openid-connect  
点击 Next  
Capability config:  
✅ Client authentication: ON  
✅ Standard flow: ON  
✅ Direct access grants: ON  
点击 Next，然后 Save  
  * 进入刚创建的 gitea 客户端，Credentials 标签页：  
Client Authenticator: Client ID and Secret  
复制 Client Secret（一串 UUID，后面要用）  
  * Settings 标签页，配置 Valid redirect URIs:  
  https://gitip90.eccee.com/user/oauth2/keycloak/callback  
  或更宽松（测试用）：https://gitip90.eccee.com/*
  * 记录 OpenID Endpoint Configuration：
  https://ssoip90.eccee.com/realms/eccee/.well-known/openid-configuration  

B. gitea配置OAuth2
  * 用管理员账号登录 Gitea  
点击头像 → Site Administration → Authentication Sources → Add Authentication Source  
填写表单：

| 字段 | 值 |
|----|---|  
| Authentication Name | Keycloak |
| Authentication Type | OAuth2 |
| OAuth2 Provider |	OpenID Connect |
| Client ID | gitea |
| Client Secret |	刚才复制的 Client Secret |
| OpenID Connect Auto Discovery URL |	https://ssoip90.eccee.com/realms/eccee/.well-known/openid-configuration |
| Additional Scopes |	openid email profile |

点击 Add Authentication Source  

C.测试 SSO 登录
  * 退出 Gitea，回到登录页
  * 应该出现 "Sign in with Keycloak" 按钮
  * 点击后跳转到 Keycloak 登录页
  * 用 Keycloak 中的用户登录
  * 首次登录会自动在 Gitea 创建关联账号

  ***********
  
7. 公网部署反代操作
| 任务       | 操作                                           |
| -------- | --------------------------------------------- |
| 申请 SSL   | `http://<服务器IP>:81` → NPM → SSL Certificates  |
| 配置反向代理   | NPM → Proxy Hosts → 添加两条路由                    |
| 上传插件（可选） | Portainer → Volumes → `kc_providers` → Browse |

首次打开http://IP:81 会创建用户密码，用p*t@h*.com，密码为一点也不介意

浏览器打开 http://IP:81
先添加 SSL 证书（Let’s Encrypt → 输入 git.eccee.com + sso.eccee.com 一键申请）
再建两条 Proxy Host，scheme是http，Forward Hostname/IP填的是容器名：  
1. sso.eccee.com  转到 keycloak:8080  Cache assets不勾选，Block Common Exploits建议勾选，Websockets Support必须勾选
2. git.eccee.com  转到 gitea:3000 Cache assets可勾选，Block Common Exploits建议勾选，Websockets Support可选

ssl页面选择申请的证书，勾选这两项：  
✅ Force SSL  
✅ HTTP/2 Support 

并且开启Advanced中的选项，以实现包头转发

