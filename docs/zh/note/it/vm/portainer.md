# Portainer和docker容器的备份与恢复

当前采用的服务器管理策略是，使用docker-compose来运行portainer，然后使用portainer来管理docker容器，主要用stack的方式来编排服务，包括dnmp,trilium等。

服务器采用server-maintainer这一自研的运维管理脚本，每天一个备份，包括docker volumn，以及其相应的压缩包异地rsync同步备份，另有网站的打包备份等。

恢复时的策略包括：docker volume的备份档恢复和在其它机器中用压缩包恢复。

## docker volume整盘恢复
由于portainer的管理数据也在docker volume中，所以整盘恢复理论上不需要任何操作就可以直接运行，只要目标机器上有docker和docker compose即可。

在PVE中，我们把/var/lib/docker作为一个独立的磁盘分区挂载，虚拟机安装完后，先安装docker:
```
sudo apt install iputils-ping traceroute tmux nano rsync
sudo apt install docker.io docker-compose-v2
sudo apt install docker-buildx
sudo usermod -aG docker $USER
newgrp docker
创建pvpn网络
```
如果我们从未运行任何容器，/var/lib/docker/volume这一目录是空的，如果已经有运行过程序，也可以清空。
使用server-maintainer，一般在远程机上，docker卷的路径在~/remote-bk/ecceeweb1/server-maintainer/backups/docker_volumes下的volumes目录，只需将这个docker的volume目录同步到/var/lib/docker/volume，相关的服务即可恢复
不同docker版本是否会有影响，一般还是要看release note，小的变更如27.5到28.2应该是兼容的。但如果docker compose有大变化，则由它编排的portainer容器也容易出问题，更重要的是portainer的版本最好是相同的。
```
cd
cd remote-bk/ecceeweb1/server-maintainer/backups/docker_volumes
sudo -H tmux
cp -r volumes /var/lib/docker/
reboot
```
不过，如果是docker-compose和docker compose版本的区别，还是会引发错误，这时就要把portainer的服务单独用新的docker-compose编排，然后用下面portainer的备份档恢复。
## 通过portainer的备份和压缩档来恢复
原理上大致相同，考虑到已经有volumes整个目录备份，无需每天压一个，server-maintainer应该相应改一个版本，用于设置压缩包的时间间隔，比如每周一个。