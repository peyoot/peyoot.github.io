# 来自 [docker-hexo](https://github.com/zeusro/docker-hexo)
# peyoot自行修改

只需一个 GitHub URL ,轻松打包成一个 docker 镜像 . 并且利用了 `npm 淘宝`+ `中科大包镜像`,构建速度超快,比较适合墙内用户.

基于 `node:12-alpine` ,镜像超小(41Mb),运行时自动拉取最新代码(所以初次启动会慢点),使用方便.

## 使用方法


### docker-compose

1. 修改 `docker-compose.yml` 里的 `environment`;
2. 修改 Dockerfile  url 以及注释掉国内镜像（国外服务器没法用，或是upstream已经失效） 
3. 修改_config.yml 

这里把整站源码放在项目master，而生成的主页放在gh-pages


4. `docker-compose up --force-recreate --build`

### [docker](https://hub.docker.com/r/zeusro/hexo)

```bash
    docker run -p 4000:4000 zeusro/hexo:latest  \
    --env PUBLIC_HEXO_GITHUB_URL=https://github.com/peyoot/peyoot.github.io.git
```

注意，这只是让hexo当server, build_and_run.sh中并没有hexo deploy，如果不把本地hexo当web服务器，而只是发布到github上，测试成功后要加上
