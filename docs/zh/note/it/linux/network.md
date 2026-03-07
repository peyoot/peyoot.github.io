# 修改无线网卡的网络配置忽略其自动获取的DNS服务器

```
nmcli connection show --active

sudo nmcli connection modify "STKNXHADEMO" ipv4.ignore-auto-dns yes

sudo nmcli connection reload

sudo nmcli connection up STKNXHADEMO
```