# 简介
这是一个用于服务器运维和备份的脚本工具，实现服务器健康报告、docker和docker-composite备份、冗余服务器同步。
如果您有使用 docker 的服务，并且需要定期报告服务器运行状况、备份和同步重要数据，以便在服务器硬件故障或故障的情况下可以随时切换备用平台，那么服务器维护者是正确的选择。

您可以在一台或多台服务器上运行项目的脚本。为了实现此脚本的最佳匹配，我们建议您按以下方式运行 docker 平台：

1. 以 docker-compose 的形式运行 portainer，路径为 ~/docker/portainer
2. 使用 portainer 运行 docker-compose 相关的容器服务（即stack）
3. 所有服务均由 Portainer 管理

## 用法
您可以从脚本运行它，也可以将其安装为 systemd守护进程。若要将其作为工具手动运行，您需要在server-maintainer.sh的路径下拥有.env配置文件
运行“sudo ./server-maintainer.sh”

要将其安装为守护进程，只需以 root 身份运行 install.sh。您需要将配置放在 /etc/server-maintainer.conf 中。
 
如果您只需要一个手动工具，只需修改 env.sample 并将其重命名为 .env。对于 systemd 守护进程，请在安装后将修改后的 env.sample 复制到 /etc/server-maintainer/server-maintainer.conf。

您可以修改 server-maintainer.timer 以使守护进程按照您自己的计划运行。（默认情况下，它每天在 05：00：00 运行。）

## 特性

### 服务器健康监测
此项目脚本将检测服务器的健康状况：包括硬盘和内存、CPU 利用率和其他数据，并通过电子邮件发送报告。

### docker 服务的备份
这个项目脚本的主要功能是备份指定的容器服务和数据，脚本会导出 Portainer 备份的一份副本，并将 Portainer 中的卷（Portainer 本身除外）同步到备份服务器。除了备份到数据服务器外，脚本还可以将所有portainer管理的卷同步到另一个热备用服务器，这样如果该服务器不可用，可以始终启用它作为替换。

## 服务器上的目录树

对于手动运行，您可以将此项目 git 克隆到您喜欢的任何路径。该脚本将具有本地备份路径BK_PATH，它将备份传输或同步到远程备份服务器的 remote-bk 文件夹。
以下是安装后相关文件夹/文件的示例。

```
/usr/local/bin/server-maintainer.sh
/etc/server-maintainer/server-maintainer.conf
/var/local/server-maintainer
		   |__backups
		        |__monthly
~/docker
  |__ portainer
        |__ docker-compose.yml

~/remote-bk
    |__<remote-hostname>/server-maintainer/backups

/var/lib/docker/volumes

```
