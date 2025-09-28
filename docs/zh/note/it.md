# Peyoot IT 记事本

通过Python的远程开机方法
---
需要找一台目标机器局域网内可执行python开机脚本的设备，可以是Digi路由器或是Linux电脑等，需安装wakeonlan库，然后执行下面的开机命令，注意Mac地址替换为目标机器：

```python
pip3 install wakeonlan

from wakeonlan import send_magic_packet
send_magic_packet('00:11:22:33:44:d2')
```

取消DHCP获取的DNS
在网卡中指定DNS，这里列举如何取消DHCP自动获取的DNS，改用自定义的DNS。
在网卡的netplan中，
```
network:
    ethernets:
        eno1:
            dhcp4: true
            dhcp4-overrides:
                use-dns: false
            nameservers:
                addresses:
                    - 1.1.1.1
    wifis:
        yourssid:
            dhcp4: true
            dhcp4-overrides:
                use-dns: false
            access-points:
                robin:
                    password:  yourpassword

    version: 2

```
上面在netplan中直接指定了DNS，当然您也可以在运行时为某个接口指定ＤＮＳ，命令如下：
```
resolvectl dns wlo1 1.1.1.1
```

## 我的服务器

### 家中
| PVE主机 | PVE MAC/VM主机 | 名称 | 用途 | 登陆 |
|---------|---------|---------|---------|---------|
| 10.70.1.20 | 50:65:f3:40:23:e0 | pvehpdesk | 挂载web虚拟机 | r@.k系列1刀h |
|  | 10.70.1.80 | ecceeweb1 | eccee web服务器 | rob*@.k系列 |
### 公司
#### 路由器
| 路由器 | 位置 | IP | 用途 | 登陆 |
|---------|---------|---------|---------|---------|
| IX20W | 电信光猫路由之后 | 10.70.1.100 | 统合内外网科学上网 | admin@.D系列办室+1刀h |

#### OVPN
客户端指定IP，用户名和CCD文件名约定：test_客户缩写 放在：etc/config/scripts/ccd
CCD内容，以sholan的ip15为例： ifconfig-push 192.168.14.15 255.255.255.0 
| OVPN Server | OVPN client | IP | 用途 | 登陆 |
|---------|---------|---------|---------|---------|
| sholan | - | 192.168.14.1 | 科学上网路由 |  |
| - | robin | - | 个人科学上网 | ..K系列1刀hill |
| - | test_softlink |  192.168.14.240| 临时开放 | Digi+Test1 |
| shodigi | - | 192.168.14.1 | 接入digi内网，但本地上网 | - |

#### 虚拟机
| PVE主机 | PVE MAC/VM主机 | 名称 | 用途 | 登陆 |
|---------|---------|---------|---------|---------|
| 10.70.1.20 | 50:65:f3:40:23:e0 | pvehpdesk | 挂载web虚拟机 | r@.k系列1刀h |
|  | 10.70.1.80 | ecceeweb1 | eccee web服务器 | rob*@.k系列 |
|  | 10.70.1.81| storage.eccee.com | filebrowser网盘 | 单元格 3 |
| 10.70.1.21 | 64:51:06:a0:36:3a | pve-meeetingroom-table | 开发测试pve主机 | r@.k系列1刀h |
|  | 10.70.1.40 | ubuntu2204-dey | dey编译机 | r@.k系列1刀h |
| 10.70.1.22 | 8c:dc:d4:d4:59:05 | hp850ip67 | 备份机pve主机 | r@.k系列1刀h |
|  | 10.70.1.90 | ecceewebbk | 备份机 | r@.k系列1刀h |
| 10.70.1.16 | 1c:69:7a:01:3f:1d | nuc8pve | 备份机pve主机 | r@.k系列1刀h |
|  | 10.70.1.60 | nuc8vm1ip60 | 杂项 | r@.k系列 |
| 10.70.1.23 | 1c:69:7a:ab:20:f0 | hp850ip67 | nuc11pve | r@.k系列1刀h |


### 云端 
| 服务商 | 控制台登陆或备注 | 服务器IP | 用途 | 登陆 |
|---------|---------|---------|---------|---------|
| Aliyun.com | alipay扫码 | |  | sales@ec*e.com |
|  | *.1#3.20#.*0 | #*为老家home | webportal | ubu*@.Ak系列1刀h |
|  | |  |  |  |
| Qcloud | 微信扫码 |  |  | 晓* |
|  |  |  | | 弃用 |