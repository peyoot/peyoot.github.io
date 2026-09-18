### web入口和容器化应用解决方案

通常，我们用域名的方式来访问web应用，为了更安全和方便管理整个平台，采用云服务器Web入口跨机反向代理到内网portainer的容器化web应用的方式。整个网络架构中，云服务器作为VPN的客户端接入到PVPN内网中。

在内网服务器中，用portainer的stack来构建类似podman-compose服务，以实现图形化的容器管理。在具有公网IP的云服务器上，则搭设轻量，安全，方便管理的反向代理服务器。
云服务器上的反代，常见方案包括:npm和Charon等，Charon是基于Caddy的方案，在其基础上增加Web UI 管理面板，支持自动 HTTPS、WAF、CrowdSec IDS 和 Docker发现，单容器零配置文件。本文以它为实现方式。

说明：
1、可选本机容器发现，Charon 通过读取容器运行时（如 Podman）的 API 套接字（socket），来获取当前所有容器的列表和网络信息。这样，当你在 Charon 的 Web 界面添加代理规则时，就能直接从下拉菜单里选择要暴露的容器，无需手动输入 IP 和端口。只有当反代云服务器同时也跑本地容器应用时，这个功能才有用，因此这是个可选项，默认不启用。

2、关于网络模式：脚本中使用了 --network=host 模式。这是因为在 socket activation 场景下，让容器直接使用主机网络可以简化端口传递，并确保 Charon 能正常访问外部网络（例如为 Let's Encrypt 进行 ACME 挑战）。当启用本机的容器发现时，其他容器保持默认 bridge 网络，不要设置 --network=host，避免端口冲突，保持网络隔离；只需映射所需端口即可被 Charon 访问。


### 云服务器设置
办公室两个ovpn服务器，shodigi对应网段192.168.13.x，端口21194 ，而sholan对应网段192.168.14.x，端口11194. 因为云服务器作为客户端，所以倒不用开放端口，但要开80,8080,443这些。

### pvpn搭建
```
sudo apt install openvpn openvpn-systemd-resolved
```
然后，使用备份的openvpn的client配置文件和passfile，拷到/etc/openvpn/client/目录下，连上sholan进入内网即可。
注意一些优化配置，AES-256-CBC 还要配 HMAC 做完整性校验（encrypt-then-MAC，两遍扫描）。在小包场景下单包成本不低。建议改成cipher AES-128-GCM（一轮完成，现代 ARM 有加速）。此外在客户端还建议加上mssfix

```
systemctl start openvpn-client@web_qcloud_ip205
```

### nginx卸载
如果之前已经安装有nginx，先要卸载

```
sudo systemctl stop nginx
sudo systemctl disable nginx
sudo ss -tlnp | grep -E ':(80|443)\b'   确认端口已经释放
dpkg -l | grep nginx 查看安装了哪些包，再卸载，一般也只有nginx和nginx-common
sudo apt purge nginx nginx-common nginx-core nginx-full
sudo apt autoremove --purge
```
### podman-compose方式安装Charon
podman相比较于docker，能支持rootless的方式运行容器。
Rootless Podman 的权限模型确实和传统的 rootful 模式不同，它的核心思路是通过用户命名空间（User Namespace）和一系列辅助机制，让非 root 用户在无需提权的情况下，安全地完成大部分操作。

但Linux 内核默认禁止非 root 进程绑定 1024 以下的端口。因此为了用podman-compose的方式来实现Charon，有几步要做。

最后整成一个脚本一键式安装，在github.com/peyoot/podman-charon项目上。

```
git clone https://github.com/peyoot/podman-charon
cd podman-charon
./install-podman-charon.sh  #建议用非root用户安装
```

### 配置charon


