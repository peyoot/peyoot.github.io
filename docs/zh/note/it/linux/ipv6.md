# ipv6基础知识
IPv6 地址一共 128 位，其中/64是最小不可再分单位。RFC 4291 写明：所有“链路本地”网段（LAN、VLAN、无线 SSID…）必须使用 /64。这是因为SLAAC 用 64 位“前缀”+ 64 位“接口标识（通常由 MAC 生成）”拼出 128 位地址，如果把 /64 切成 /65、/72…，SLAAC、ND 发现、无状态地址自动配置 等核心机制会直接失效，主机就得不到地址。

# ipv6术语解读
DHCPv6-PD：DHCPv6 Prefix Delegation 也就是IPv6前缀下发（或称IPv6前缀委托），主路由必须支持并启用DHCPv6-PD Server，当它获得一个比/64大的前缀时，可以自动分片通过PD下发给下级路由。下级路由如果拿到/64，只能给内网主机用。

SLAAC：Stateless Address Auto-Configuration 无状态地址自动配置，其实这也就是IPV6的静态IP，因为ipv6不需要手动设置，每台机器都有64位的mac地址，无需手动分配个数字。

## ipv6一般情况
对于电信宽带路由器，新建一个IPoE连接，启用ipv4/ipv6双栈，这样如AC-8的WAN口，它可以配置IPv4为静态公网IP，而ipv6的“前缀获取方式”可配置为None. 这是因为它已经在公网中，不需要DHCPv6从上级路由分配前缀。不确定这一项是否可以改为其它的。由于/64是一般家用或普通企业路由器能拿到的PD。对于“ipv6地址获取方式”，用Static，把WAN分配的ipv6地址和默认网关填好。（即电信工单上的互联地址），比如WAN用::3/64，缺省网关用::2。

而LAN口侧，以A8-C为例，它是需要在vlan1000中设置，按工单上的用户地址设置即可：
ipv6地址配置成240e:688:400:XXXX::1/64 ，静态前缀240e:688:400:XXXX::/64 ， 其它信息分配方式选择的是DHCPV6, 地址/前缀分配方式选择的是无状态SLAAC。
这种方式，AC-8 会把整个/64 通过SLAAC下发给所有直连设备，比如下级路由器如ix20的WAN 口（eth1）通过 SLAAC 拿到了公网的240e:688:400:XXXX:227:4ff:fe43:yyyy/128。

由于A8-C是接下级路由器的WAN，而下级路由器的LAN口才和办公室的内网连在一起，如果希望内多的服务器也能用这个公网IPV6网段，最好的办法是创建仅ipv6的桥接。这样就不影响ipv4本身设置好的路由功能，又能让内网的服务器通过dhcpv6获取公网IPv6地址。

## 服务器netplan的设置
注意，不要另search字段，否则访问DNS服务器都有问题，探针也ping不通
```
network:
  version: 2
  renderer: networkd
  ethernets:
    ens18:
      dhcp4: false
      dhcp6: true
      addresses:
        - 10.70.1.90/24
      routes:
        - to: default
          via: 10.70.1.1
          metric: 100
          on-link: true
      nameservers:
        addresses:
          - 1.1.1.1
          - 2606:4700:4700::1111

```
上面仅改cloudflare的ipv6 dns是没什么用，可以
```
sudo nano /etc/systemd/resolved.conf
[Resolve]
DNS=2606:4700:4700::1111 2606:4700:4700::1001
DNSOverTLS=yes
# 或使用 DoH
# DNSOverTLS=opportunistic
# 或完全强制加密
# DNSOverTLS=yes
```
上面两步对当前GFW已经够用，但DoT使用专用端口 853 进行加密传输，网络监控可以识别到端口 853 的DNS流量（虽然内容加密），如果将来访问受限，还需开启DOH，

```
[Resolve]
DNS=2606:4700:4700::1111
FallbackDNS=2606:4700:4700::1001
DNSOverHTTPS=yes
# 或者指定具体的 DoH 端点
# DNSOverHTTPS=cloudflare https://cloudflare-dns.com/dns-query
```
或者还可以进一步配置直接使用 cloudflared 作为本地DoH代理

## DAL路由器之ipv6桥接
先在ETH1和ETH2里把ipv6的功能关闭，保留原有的ipv4的功能以便不受影响。然后创建一个Bridge，命名为V6ETH，Device里一样选择ETH1和ETH2，并启用。最关键的是新建一个接口ETHV6br，Device选择"V6ETH",关闭IPV4，并开启IPV6，类型为DHCPv6 address，Zone选择"internal"。

这样，这个新接口ETHV6br就桥接ETH1和ETH2的IPV6功能，由于ETH2和内网连接，内网的服务器也能通过dhcpv6和DAL路由器一样从A8-C获取到指定前缀的公网ipv6地址。

## ipv6探针 
测一下外网连通性：
```
ping -6 240c::6666                 # 国内常用 IPv6 探针
ping -6 2001:4860:4860::8888       # Google DNS
curl -6 https://ip.sb              # 看出口地址是否为本机的ipv6地址
```

## 禁用ipv6

```
sudo nano /etc/sysctl.conf

# 禁用所有网络接口的 IPv6
net.ipv6.conf.all.disable_ipv6 = 1
net.ipv6.conf.default.disable_ipv6 = 1
# 如果需要也禁用本地回环的 IPv6
net.ipv6.conf.lo.disable_ipv6 = 1

sudo sysctl -p

重启网络
sudo systemctl restart systemd-networkd

```