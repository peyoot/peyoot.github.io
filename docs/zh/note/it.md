# Peyoot IT 记事本

通过Python的远程开机方法
---
需要找一台目标机器局域网内可执行python开机脚本的设备，可以是Digi路由器或是Linux电脑等，需安装wakeonlan库，然后执行下面的开机命令，注意Mac地址替换为目标机器：

```python
pip3 install wakeonlan

from wakeonlan import send_magic_packet
send_magic_packet('00:11:22:33:44:d2')
```

## 我的服务器

### 家中
### 公司
| PVE主机 | PVE MAC/VM主机 | 名称 | 用途 | 登陆 |
|---------|---------|---------|---------|---------|
| 10.70.1.20 | 50:65:f3:40:23:e0 | pvehpdesk | 挂载web虚拟机 | r@.k系列1刀hill |
|  | 10.70.1.80 | ecceeweb1 | eccee web服务器 | rob*@.k系列 |
|  | 10.70.1.81| storage.eccee.com | filebrowser网盘 | 单元格 3 |
| 10.70.1.21 | 64:51:06:a0:36:3a | pve-meeetingroom-table | 开发测试pve主机 | r@.k系列1刀hill |
|  | 10.70.1.40 | ubuntu2204-dey | dey编译机 | r@.k系列1刀hill |
| 10.70.1.22 | 8c:dc:d4:d4:59:05 | hp850ip67 | 备份机pve主机 | r@.k系列1刀hill |
|  | 10.70.1.90 | ecceewebbk | 备份机 | r@.k系列1刀hill |
| 10.70.1.16 | 1c:69:7a:01:3f:1d | nuc8pve | 备份机pve主机 | r@.k系列1刀hill |
|  | 10.70.1.60 | nuc8vm1ip60 | 杂项 | r@.k系列 |
| 10.70.1.23 | 1c:69:7a:ab:20:f0 | hp850ip67 | nuc11pve | r@.k系列1刀hill |

### 云端 
| 服务商 | 控制台登陆或备注 | 服务器IP | 用途 | 登陆 |
|---------|---------|---------|---------|---------|
| Aliyun.com | alipay扫码 | |  | sales@ec*e.com |
|  | *.1#3.20#.*0 | #*为老家home | webportal | ubu*@.Ak系列1刀hill |
|  | |  |  |  |
| Qcloud | 微信扫码 |  |  | 晓* |
|  |  |  | | 弃用 |