## 安装podman和podman-compose
```
sudo apt install podman podman-compose
podman info --format '{{.Host.Security.Rootless}}'
输出是true表明是rootless
```
启动rootless的podman socket:
```
systemctl --user enable --now podman.socket
检查一下：
robin@u2404npm:~$ ls $XDG_RUNTIME_DIR/podman/podman.sock
/run/user/1000/podman/podman.sock
```
## 创建portainer的compose文件
mkdir -p podman/portainer/
nano docker-compose.yml

```
version: "3.8"

services:
  portainer:
    image: docker.io/portainer/portainer-ce:latest
    container_name: portainer
    restart: unless-stopped

    ports:
      - "9443:9443"
      - "9000:9000"

    volumes:
      # Portainer 数据持久化
      - portainer_data:/data

      # Podman socket（rootless）
      - $XDG_RUNTIME_DIR/podman/podman.sock:/var/run/docker.sock:Z

    security_opt:
      - label=disable

volumes:
  portainer_data:
```
## 启动portainer
```
podman-compose up -d
```
打开ip:9000，创建一个用户，默认用户名admin可改为p*t，密码用常用的.p系列1刀h+双惊

如果是要从其它平台恢复，则用restore选项。