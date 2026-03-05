# sholan
这个OVPN可以访问内网和外网，网段为192.168.14.x，接入后和本地连到IX20的设备无异

# 固定IP地址帐号实施

给客户或供应商的帐号，以test_为前缀，中间是标识，用户名需带有固定IP尾缀，以方便定位分配的IP地址。
IP网段在192.126.14.240 ~192.168.14.250。
比如test_softlink_240(由于历史原因，早期用户未实施尾缀)

1、先准备好用户名，然后创建以用户名命名的文件，内容为：ifconfig-push 192.168.14.240 255.255.255.0 ，上传到//etc/config/scripts/ccd

2、到Device Configuration>Authentication>User里创建新用户名，密码统一为：一点都不介意。

3、根据目标操作系统的openvpn版本来存放用户配置文件
从status>openvpn server里下载对应的客户端模板，然后更改remote这行, 添加实际路由器的IP：
remote IP 11194

对于ubuntu来说，尾行改为：
```
#auth-user-pass
auth-user-pass passfile


mute 20
script-security 2
up /etc/openvpn/update-systemd-resolved
down /etc/openvpn/update-systemd-resolved
```
把配置文件和passfile文件上传到ubuntu服务器的client配置目录下。
其中passfile为两行，一行用户名，一行密码
