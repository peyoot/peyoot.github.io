# 域名证书管理和更新
server-maintainer项目中使用到的域名证书和申请和更新，可以用acme.sh工具配合renew_and_upload_certs.sh实现。

acme.sh是第三方工具，通过它可以申请泛域名证书。不过部署和更新时，还是用renew_and_upload_certs.sh脚本更方便。这个脚本会根据配置文件domain.list中的域名和服务器连接信息，依次为相关的域名通过acme.sh申请更新并上传到相应服务器~/certs目录下，在远程服务器上，只需将证书链接文件指向这个目录即可。

## acme.sh安装和使用
如果没安装 过，可以用curl https://get.acme.sh | sh

检查配置，以及哪些证书在这台服务器上申请
acme.sh --info
acme.sh --list

如果没有添加相关的域名服务商的密钥，添加一下：
export GD_Key="38...rN"
export GD_Secret="J3...XL"

添加新的申请
acme.sh --issue --dns dns_gd -d domain.com -d *.domain.com

或是更完整一点
acme.sh --set-default-ca --server letsencrypt --issue --dns dns_gd --dnssleep 300 -d eccee.com -d *.eccee.com

申请成功后，每个域名都会在~/.acme.sh/下有个目录，里面有相应的证书


如果要使用vpn，为了避免登陆问题，建议MTU的配置如下：

tun-mtu 1400

## renew_and_upload_certs.sh 使用
这个脚本中用到SCP需要能免密登陆到远程服务器，
注意为了防止openssl版本不一致引发的问题，建议都用ubuntu 22.04以上的版本

ssh-copy-id -p 10022 -i ~/.ssh/id_ed25519.pub ubuntu@192.168.13.254

在远程服务器把ubuntu加到sudoers中，
查看用sudo grep -n 'NOPASSWD' /etc/sudoers
编辑用sudo visudo
内容：
```
username ALL=(ALL) NOPASSWD: ALL
%groupname ALL=(ALL) NOPASSWD: ALL
```
其中 username 是不需要密码即可使用 sudo 的用户名，%groupname 是不需要密码即可使用 sudo 的用户组名。

编辑域名配置文件domain.list
```
mydomain.com ubuntu@192.168.13.254:1022 /home/ubuntu/certs
domain2.com ubuntu@100.10.10.100:22 /home/ubuntu/certs

```
运行脚本：
```
 renew_and_upload_certs.sh
```
