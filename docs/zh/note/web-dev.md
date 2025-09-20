# 安装portainer和dnmp开发环境

## 安装docker和docker compose
```
# 更新软件包列表
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
# 预期输出：Docker Compose version v2.6.0 ... （注意命令是 `docker compose`，没有横线）

# 运行一个测试容器
docker run hello-world
```