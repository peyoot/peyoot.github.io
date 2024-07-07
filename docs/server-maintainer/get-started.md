# Get Started
Server-Maintainer use portainer to manage containers which host websites & apps. This tool is designed for those small enterprises and engineers themselves who need host websites and apps in server but without the budget to built kubernetes based private cloud. 
You can run the tool in a nuc or low cost server and use the same budget server as backup & sync server.

## Prerequisites

As server-maintainer use portainer & docker to manager apps. If your websites or apps are installed in a standalone way, convert to containerized form first. 
Server-maintainer use portainer and it's api to manager backup process. Install docker, docker compose first and use docker-compose to run a portainer.

### Install portainer
First, create a docker container network, name it to pvpn or either name you like:
```
docker network create pvpn --subnet 172.100.100.0/24
mkdir -p ~/docker/portainer
nano docker-compose.yml
```
Here's the portainer compose file:
```
version: '3'
services:  portainer:
    image: portainer/portainer-ce:2.19.4
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
    external:
      name: pvpn

```
now start to use portainer to manage apps:
```
docker compose up -d
```
### Install dnmp as portainer stack
Open portainer web portal and enter local environment. We need to create dnmp volumes fist and then add dnmp stack.
1. create these volume: dnmp_www, dnmp_services， dnmp_data,  dnmp_logs
2. clone peyoot/dnmp and switch to portainer branch
3. copy dnmp configs:
```
sudo cp -r www/. /var/lib/docker/volumes/dnmp_www/_data/
sudo cp -r services/. /var/lib/docker/volumes/dnmp_services/_data/
sudo cp -r data/. /var/lib/docker/volumes/dnmp_data/_data/
sudo cp -r logs/. /var/lib/docker/volumes/dnmp_logs/_data/
```
4.add a dnmp stack in portainer:
```
version: "3"
services:
  nginx:
    image: peyoot/nginx:1.25.1-alpine
    container_name: nginx
    ports:
      - "80:80"
      - "443:443"
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

  mysql:
    image: mysql:8.0.34
    container_name: mysql
    ports:
      - "3306:3306"
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
      - "16379:6379"
    volumes:
      - /var/lib/docker/volumes/dnmp_services/_data/redis/redis-6.conf:/etc/redis.conf:ro
      - /var/lib/docker/volumes/dnmp_data/_data/redis:/data/:rw
    restart: always
    entrypoint: ["redis-server", "/etc/redis.conf"]
    environment:
      - TZ=Asia/Shanghai

  #rabbitmq:
  #  image: peyoot/rabbitmq:3.12.2-management
  #  container_name: rabbitmq
  #  restart: always
  #  ports:
  #    - "5672:5672"
  #    - "15672:15672"
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
      - "8080:80"
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
#      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
#    volumes:
#      - /var/lib/docker/volumes/dnmp_data/_data/esdata:/usr/share/elasticsearch/data
#      - /var/lib/docker/volumes/dnmp_services/_data/elasticsearch/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml
#    hostname: elasticsearch
#    restart: always
#    ports:
#      - "9200:9200"
#      - "9300:9300"

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

```

