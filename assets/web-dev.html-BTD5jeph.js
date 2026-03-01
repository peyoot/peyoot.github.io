import{_ as e,o as n,c as i,b as s}from"./app-oTA4_50g.js";const d={},l=s(`<h1 id="安装portainer和dnmp开发环境" tabindex="-1"><a class="header-anchor" href="#安装portainer和dnmp开发环境"><span>安装portainer和dnmp开发环境</span></a></h1><h2 id="安装docker和docker-compose" tabindex="-1"><a class="header-anchor" href="#安装docker和docker-compose"><span>安装docker和docker compose</span></a></h2><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 更新软件包列表
sudo apt update

# 安装核心包：Docker 引擎 (docker.io) 和 Docker Compose V2 (docker-compose-v2)
sudo apt install docker.io docker-compose-v2

# （强烈推荐）安装 buildx 插件以获得更好的构建体验
sudo apt install docker-buildx

# 将当前登录用户加入 docker 组
sudo usermod -aG docker $USER

# 生效组权限（需要重新登录系统，或者执行以下命令立即生效）
newgrp docker

# 检查 Docker 引擎版本
docker --version
# 预期输出：Docker version 20.10.21, ...  （版本号可能不同，但证明安装成功）

# 检查 Docker Compose V2 插件版本
docker compose version
# 预期输出：Docker Compose version v2.6.0 ... （注意命令是 \`docker compose\`，没有横线）

# 运行一个测试容器
docker run hello-world

创建自定义网段：
docker network create pvpn --subnet 172.100.100.0/24

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="用docker-compose运行portainer" tabindex="-1"><a class="header-anchor" href="#用docker-compose运行portainer"><span>用docker compose运行portainer</span></a></h2><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>mkdir -p ~/docker/portainer
nano ~/docker/portainer/docker-compose.yml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>原先测试用2.19.4，现在最新版已经是2.33.1了，docker-compose.yml文件内容如下，其中一些过时的用法已经修正，比如移除version, 修正name，external定义等：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>services:
  portainer:
    image: portainer/portainer-ce:2.33.6
    container_name: portainer
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - data:/data
    ports:
      - 9000:9000
volumes:
  data:
networks:
  default:
    name: pvpn
    external: true

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>把它放在~/docker/portainer下，然后用docker compose up -d来运行它，之后就可以打开http://ip:9000，使用portainer的stack来运行dnmp</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>version: &quot;3&quot;
services:
  nginx:
    image: peyoot/nginx:1.25.1-alpine
    container_name: nginx
    ports:
      - &quot;80:80&quot;
      - &quot;443:443&quot;
    volumes:
      - /var/lib/docker/volumes/dnmp_www/_data:/www/:rw
      - /var/lib/docker/volumes/dnmp_services/_data/nginx/ssl:/ssl:rw
      - /var/lib/docker/volumes/dnmp_services/_data/nginx/conf.d:/etc/nginx/conf.d:rw
      - /var/lib/docker/volumes/dnmp_services/_data/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - /var/lib/docker/volumes/dnmp_services/_data/nginx/fastcgi-php.conf:/etc/nginx/fastcgi-php.conf:ro
      - /var/lib/docker/volumes/dnmp_services/_data/nginx/fastcgi_params:/etc/nginx/fastcgi_params:ro
      - /var/lib/docker/volumes/dnmp_logs/_data/nginx:/var/log/nginx/:rw
    environment:
      - TZ=Asia/Shanghai
    restart: always

  php:
    image: peyoot/php:7.4.33-fpm-alpine
    container_name: php
    expose:
      - 9501
    volumes:
      - /var/lib/docker/volumes/dnmp_www/_data:/www/:rw
      - /var/lib/docker/volumes/dnmp_services/_data/php/php.ini:/usr/local/etc/php/php.ini:ro
      - /var/lib/docker/volumes/dnmp_services/_data/php/php-fpm.conf:/usr/local/etc/php-fpm.d/www.conf:rw
      - /var/lib/docker/volumes/dnmp_logs/_data/php:/var/log/php
      - /var/lib/docker/volumes/dnmp_data/_data/composer:/tmp/composer
    restart: always
    cap_add:
      - SYS_PTRACE

  php81:
    image: peyoot/php:8.1.22-fpm-alpine
    container_name: php81
    expose:
      - 9501
    volumes:
      - /var/lib/docker/volumes/dnmp_www/_data:/www/:rw
      - /var/lib/docker/volumes/dnmp_services/_data/php81/php.ini:/usr/local/etc/php/php.ini:ro
      - /var/lib/docker/volumes/dnmp_services/_data/php81/php-fpm.conf:/usr/local/etc/php-fpm.d/www.conf:rw
      - /var/lib/docker/volumes/dnmp_logs/_data/php81:/var/log/php
      - /var/lib/docker/volumes/dnmp_data/_data/composer:/tmp/composer
    restart: always
    cap_add:
      - SYS_PTRACE

#  php56:
#    image: peyoot/php:5.6.40-fpm-alpine
#    container_name: php56
#    expose:
#      - 9501
#    volumes:
#      - /var/lib/docker/volumes/dnmp_www/_data:/www/:rw
#      - /var/lib/docker/volumes/dnmp_services/_data/php56/php.ini:/usr/local/etc/php/php.ini:ro
#      - /var/lib/docker/volumes/dnmp_services/_data/php56/php-fpm.conf:/usr/local/etc/php-fpm.d/www.conf:rw
#      - /var/lib/docker/volumes/dnmp_logs/_data/php56:/var/log/php
#      - /var/lib/docker/volumes/dnmp_data/_data/composer:/tmp/composer
#    restart: always
#    cap_add:
#      - SYS_PTRACE

  mysql:
    image: mysql:8.0.34
    container_name: mysql
    ports:
      - &quot;3306:3306&quot;
    volumes:
      - /var/lib/docker/volumes/dnmp_services/_data/mysql/mysql.cnf:/etc/mysql/conf.d/mysql.cnf:ro
      - /var/lib/docker/volumes/dnmp_data/_data/mysql:/var/lib/mysql/:rw
      - /var/lib/docker/volumes/dnmp_logs/_data/mysql:/var/log/mysql/:rw

    restart: always
    environment:
      - MYSQL_ROOT_PASSWORD=Mpswroot
      - MYSQL_ROOT_HOST=%
      - TZ=Asia/Shanghai

  redis:
    image: redis:6.2.13-alpine
    container_name: redis
    ports:
      - &quot;16379:6379&quot;
    volumes:
      - /var/lib/docker/volumes/dnmp_services/_data/redis/redis-6.conf:/etc/redis.conf:ro
      - /var/lib/docker/volumes/dnmp_data/_data/redis:/data/:rw
    restart: always
    entrypoint: [&quot;redis-server&quot;, &quot;/etc/redis.conf&quot;]
    environment:
      - TZ=Asia/Shanghai

  #rabbitmq:
  #  image: peyoot/rabbitmq:3.12.2-management
  #  container_name: rabbitmq
  #  restart: always
  #  ports:
  #    - &quot;5672:5672&quot;
  #    - &quot;15672:15672&quot;
  #  volumes:
  #    - /var/lib/docker/volumes/dnmp_data/_data/rabbitmq:/var/lib/rabbitmq
  #  environment:
  #    - TZ=Asia/Shanghai
  #    - RABBITMQ_DEFAULT_USER=peyoot
  #    - RABBITMQ_DEFAULT_PASS=Mpswpeyoot

  phpmyadmin:
    image: phpmyadmin/phpmyadmin:5.2.1
    container_name: phpmyadmin
    ports:
      - &quot;8080:80&quot;
    volumes:
      - /var/lib/docker/volumes/dnmp_services/_data/phpmyadmin/config.user.inc.php:/etc/phpmyadmin/config.user.inc.php:ro
      - /var/lib/docker/volumes/dnmp_services/_data/phpmyadmin/php-phpmyadmin.ini:/usr/local/etc/php/conf.d/php-phpmyadmin.ini:ro
    environment:
      - PMA_HOST=mysql
      - PMA_PORT=3306
      - TZ=Asia/Shanghai

#  elasticsearch:
#    image: peyoot/elasticsearch:7.17.7
#    container_name: elasticsearch
#    environment:
#      - TZ=Asia/Shanghai
#      - discovery.type=single-node
#      - &quot;ES_JAVA_OPTS=-Xms512m -Xmx512m&quot;
#    volumes:
#      - /var/lib/docker/volumes/dnmp_data/_data/esdata:/usr/share/elasticsearch/data
#      - /var/lib/docker/volumes/dnmp_services/_data/elasticsearch/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml
#    hostname: elasticsearch
#    restart: always
#    ports:
#      - &quot;9200:9200&quot;
#      - &quot;9300:9300&quot;

volumes:
  dnmp_www:
    external: true
  dnmp_services:
    external: true
  dnmp_logs:
    external: true
  dnmp_data:
    external: true

networks:
  default:
    external:
      name: pvpn

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>配置好nginx后，在开发电脑的hosts上，编写测试站点的域名，指向这个开发机，即可。</p>`,10),a=[l];function r(v,c){return n(),i("div",null,a)}const o=e(d,[["render",r],["__file","web-dev.html.vue"]]),t=JSON.parse('{"path":"/zh/note/it/application/web-dev.html","title":"安装portainer和dnmp开发环境","lang":"zh-CN","frontmatter":{"description":"安装portainer和dnmp开发环境 安装docker和docker compose 用docker compose运行portainer 原先测试用2.19.4，现在最新版已经是2.33.1了，docker-compose.yml文件内容如下，其中一些过时的用法已经修正，比如移除version, 修正name，external定义等： 把它放在~...","head":[["meta",{"property":"og:url","content":"https://peyoot.github.io/zh/note/it/application/web-dev.html"}],["meta",{"property":"og:title","content":"安装portainer和dnmp开发环境"}],["meta",{"property":"og:description","content":"安装portainer和dnmp开发环境 安装docker和docker compose 用docker compose运行portainer 原先测试用2.19.4，现在最新版已经是2.33.1了，docker-compose.yml文件内容如下，其中一些过时的用法已经修正，比如移除version, 修正name，external定义等： 把它放在~..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"安装portainer和dnmp开发环境\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[{"level":2,"title":"安装docker和docker compose","slug":"安装docker和docker-compose","link":"#安装docker和docker-compose","children":[]},{"level":2,"title":"用docker compose运行portainer","slug":"用docker-compose运行portainer","link":"#用docker-compose运行portainer","children":[]}],"git":{},"autoDesc":true,"filePathRelative":"zh/note/it/application/web-dev.md"}');export{o as comp,t as data};
