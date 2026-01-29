## gitea和keycloak sso系统搭建
在portainer中编排这个服务，

1. 创建external网络npm
Portainer → Networks → Add network
Name = npm , Driver = bridge , Enable “Manual network creation” 
这和用docker network创建的区别在于它的attachable是"true"

2.新建stack
Portainer → Stacks → Add stack

| 字段                        | 填写内容                              |
| ------------------------- | --------------------------------- |
| **Name**                  | `git-keycloak`                    |
| **Build method**          | Web editor                        |
| **Web editor**            | 贴下面的 compose 文件                   |
| **Environment variables** | **点 "Advanced mode"** → 逐行添加（见下表） |
```
KC_ADMIN=admin
KC_ADMIN_PWD=你的强密码
KC_DB_PWD=kcdb123456
GITEA_DB_PWD=gitea123456
KC_HOST=sso.yourdomain.com
GITEA_HOST=git.yourdomain.com
```
3. compose文件
```
services:
  npm:
    image: jc21/nginx-proxy-manager:latest
    container_name: npm
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
      - "81:81"
    volumes:
      - npm_data:/data
      - npm_le:/etc/letsencrypt
    networks:
      - npm

  keycloak-db:
    image: postgres:15-alpine
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
    restart: unless-stopped
    command: start-dev
    environment:
      KC_DB: postgres
      KC_DB_URL_HOST: keycloak-db
      KC_DB_URL_DATABASE: keycloak
      KC_DB_USERNAME: keycloak
      KC_DB_PASSWORD: ${KC_DB_PWD}
      KEYCLOAK_ADMIN: ${KC_ADMIN}
      KEYCLOAK_ADMIN_PASSWORD: ${KC_ADMIN_PWD}
      KC_HOSTNAME: ${KC_HOST}
      KC_PROXY: edge
    volumes:
      - kc_themes:/opt/keycloak/themes
      - kc_providers:/opt/keycloak/providers
    networks:
      - npm
    depends_on:
      - keycloak-db

  gitea-db:
    image: postgres:15-alpine
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
    image: gitea/gitea:1.21-rootless
    restart: unless-stopped
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
```

4. 部署后操作
| 任务       | 操作                                            |
| -------- | --------------------------------------------- |
| 申请 SSL   | `http://<服务器IP>:81` → NPM → SSL Certificates  |
| 配置反向代理   | NPM → Proxy Hosts → 添加两条路由                    |
| 上传插件（可选） | Portainer → Volumes → `kc_providers` → Browse |

