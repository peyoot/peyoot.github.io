## 域名按区域专业分流工具MosDNS
mosdns 或 Open-Box这些工具专为旁路由和本机分流设计，提供了 WebUI 管理界面，能自动处理 DNS 分流和 IP 集管理，无需手动编写复杂的 iptables 规则和 systemd 服务。可以用它们实现国内和海外流量分流。

智谱AI (Zhipu)：风险较高。智谱设有国内 (open.bigmodel.cn) 和海外 (api.z.ai) 两套独立域名，API Key 不通用。
阿里云百炼 (Alibaba Cloud Bailian)在新加坡、美国、德国、日本等地都设有国际节点。如果你的 API Key 是在国际站申请的，直连国际节点可能更合适。如果使用的是国内站 Key，访问国内节点则可能出现认证错误。
火山引擎豆包 (Volcano Engine Doubao)火山引擎有明确的国际平台，支持邮箱注册和美元支付，并提供 OpenAI 兼容的端点。如果使用国内站账号，可将 ark.cn-beijing.volces.com 指向国内出口。

智谱AI (Zhipu)国内站 API 域名：open.bigmodel.cn ; 海外站 API 域名：api.z.ai 
部分历史 IP：47.110.175.20 (阿里云杭州), 8.133.182.104 (阿里云上海), 156.59.96.30

阿里云百炼 (Alibaba Cloud Bailian) 国内站 API 域名 (北京)：dashscope.aliyuncs.com ; 国际站 API 域名 (新加坡)：dashscope-intl.aliyuncs.com ; 国际站 API 域名 (美国)：dashscope-us.aliyuncs.com
部分历史 IP：39.96.182.163 (北京阿里云), 8.152.159.24 (北京阿里云)

火山引擎豆包 (Volcano Engine Doubao) 国内站 API 域名：ark.cn-beijing.volces.com ; 国际站 API 域名：bytepluses.com
部分历史 IP：101.126.30.167, 101.126.30.253, 180.184.65.84 (均为火山引擎北京)

由于国内国外域名和长城因素，开发电脑位置海外IP时，可采用MosDNS等工具，在本机自动处理DNS和IPset，来实现国内IP走国内VPN出口经。

## 软路由
MosDNS也常用于软路由方案，与本文无关，仅作为参考。
<details>   
<summary>国产Linux软路由系统</summary>确实普遍使用专业的域名/IP分流工具，并且生态已经相当成熟。用得最多的方案主要集中在 OpenWrt系（含iStoreOS、ImmortalWrt）和爱快（iKuai） 两个方向。
iStoreOS + MosDNS + PassWall 这个组合是目前国内软路由社区里最主流、功能最完善的国内/国际分流方案。
### 系统选择：iStoreOS
iStoreOS是基于OpenWrt深度定制的国产系统，界面友好，自带应用商店，可以一键安装MosDNS、PassWall等插件，对新手非常友好。你可以把它作为旁路由部署在你的内网中。

### 核心工具：MosDNS + PassWall

MosDNS：负责DNS层分流。它内置了完善的国内外域名分流策略，能自动判断域名归属，并将其交给正确的DNS服务器解析（国内域名走国内DNS，国外域名走国外DNS）。这能有效避免DNS污染，并确保后续的流量路由准确。

PassWall：负责流量代理。它支持多种代理协议（如VMess、VLESS、Shadowsocks等），并可以根据MosDNS的解析结果或内置规则，将国外流量通过你指定的节点转发出去。

### 配置流程：

1、部署iStoreOS：在你的内网中部署一台iStoreOS设备（物理机、虚拟机或Docker容器均可），并配置为旁路由模式。

2、安装MosDNS和PassWall：通过iStoreOS的应用商店或命令行安装这两个插件。

3、配置MosDNS：在MosDNS的WebUI中（默认地址为http://IP:9099），设置好国内DNS（如223.5.5.5）和国外DNS（如1.1.1.1），并启用其内置的分流规则。这样，查询open.bigmodel.cn时，MosDNS会自动判定为国内域名，并走国内DNS解析。

4、配置PassWall：在PassWall中填入你的代理节点信息。然后，在PassWall的DNS设置中，将DNS指向MosDNS的监听端口。在分流设置中，你可以选择基于MosDNS的DNS分流模式，或者使用PassWall自带的规则。

5、客户端网关设置：将需要分流的设备（比如你的Ubuntu开发机）的网关和DNS都指向iStoreOS旁路由的IP地址。这样，该设备的所有网络请求都会先经过iStoreOS，由MosDNS和PassWall根据规则进行分流。
</details>

## 在ubuntu使用MosDNS分流
在Ubuntu开发机上，让MosDNS成为电脑的DNS服务器，所有域名解析请求先经过它。MosDNS会根据自定义的规则，决定某个域名是去10.70.1.100（国内DNS及国内路由网关）查询，还是走默认的海外DNS。此外，通过引入 ipset + 策略路由 的联动机制，可让目标 IP 的实际流量也走该网关。

整个链路
```
MosDNS 解析域名 → 将解析出的 IP 自动写入 ipset → iptables 匹配 ipset 并打标记 → 策略路由根据标记将流量导向 10.70.1.100。
``` 

这样你只需要在 MosDNS 的配置/WebUI 中维护域名列表，IP 变化时 ipset 会自动更新，路由规则始终有效。仅这个还不够，MosDNS 相较于 dnsmasq 的核心优势——它能通过 GeoIP 数据库判断解析结果是否属于国内 IP，然后才决定是否写入 ipset，避免误将国外 IP 加入国内路由表。

### 安装MosDNS

如果有安装过dnsmasq，为了防止冲突，先卸载或停止并禁掉服务
```
sudo systemctl stop dnsmasq
sudo systemctl disable dnsmasq
```
推荐使用社区维护的MosDNS-T版本，它自带WebUI，对新手非常友好。
```
# 1. 运行一键安装脚本
wget --quiet --show-progress -O /mnt/main_install.sh https://raw.githubusercontent.com/jasonxtt/LinuxScripts/main/AIO/Scripts/main_install.sh && chmod +x /mnt/main_install.sh && /mnt/main_install.sh

# 2. 在脚本菜单中依次选择：5 -> 1 (安装mosdns) -> 选择PH版本 -> 2(RealIP ) 注意，有时这里安装的二进制不全，可手动下载yyysuo的版本
# 3. 按提示输入信息。关于代理，如果你只是做DNS分流，可以先随便填或跳过，不影响核心分流功能。
# 4. 安装完成后，WebUI地址通常是 http://你的Ubuntu IP:9099
```

### 创建ipset集合
```
sudo ipset create domestic hash:ip
sudo ipset list domestic
```
创建完成，上面查询应该显示一个空的集合，Name 为 domestic，Type 为 hash:ip 。
### 配置 MosDNS
打开 MosDNS 的 WebUI（通常是 http://你的Ubuntu IP:9099）, 可以配置它，不过这个工具更多是为软路由而准备的，我们并不需要，作为海外服务器识别中国IP的工具，其实只需用到下面这些手动配置。

ECS 是 DNS 协议的扩展，它允许递归DNS在向权威DNS查询时，附带一个“客户端子网”信息（通常是/24的IPv4地址）。权威DNS看到这个信息后，就会根据这个子网的位置来返回最优的服务器IP。Google Public DNS (8.8.8.8) 是明确支持自定义ECS的，有工具测试显示“谷歌DNS 8.8.8.8 可以正常使用”。你可以直接使用 dig 命令的 +subnet 参数来指定一个中国IP进行查询：

```
dig www.taobao.com @8.8.8.8 +subnet=101.231.57.0/22
```
利用这个办法可在海外服务器上准确获取指定域名在中国访问时的IP，我们需要改一个国内转发的配置文件/cus/mosdns/sub_config/forward_local.yaml
```
plugins:
  # 1. 定义 ECS handler：强制附加中国 IP 段
  - tag: ecs_cn
    type: ecs_handler
    args:
      forward: false
      preset: "101.231.57.0"
      send: true
      mask4: 22
 # 2. 定义 Google DNS 转发插件
  - tag: forward_google_cn
    type: forward
    args:
      concurrent: 1
      upstreams:
        - addr: "8.8.8.8:53"
  # 3. 用 sequence 重新定义 domestic：先加 ECS，再转发，中国IP写入ip集
  - tag: domestic
    type: sequence
    args:
      - exec: $ecs_cn
      - exec: $forward_google_cn
      - matches: resp_ip $geoip_cn
        exec: ipset domestic,inet,24
```
我们还需要配置系统DNS指向MosDNS，修改/etc/systemd/resolved.conf
```
[Resolve]
DNS=127.0.0.1
DNSStubListener=no
```
重启验证DNS服务器是否已指向127.0.0.1
```
sudo systemctl restart systemd-resolved
resolvectl status | grep "DNS Servers"
```


## 用策略路由“分流”
Linux的策略路由（Policy-Based Routing）允许你根据数据包的某些特征（比如目的IP），决定它走哪张路由表、用哪个网关。我们的目标：只有目的IP属于中国IP段的流量，才强制走10.70.1.100，其他流量不受影响。

之前配置MosDNS，已经把解析出的中国IP写入了系统的domestic ipset集合。现在只需要让目的地址在domestic集合中的流量，查询一张专门的路由表，该表的默认网关是10.70.1.100。

1、创建专用路由表
在/etc/iproute2/rt_tables里，添加一行
```
100 domestic_route
```
2、确认10.70.1.100的本地可达接口
```
ip route get 10.70.1.100
```
比如，得到是ens160，则在专用路由表中添加网关
```
3、 添加指向 10.70.1.100 的默认路由
onlink 参数的作用是告诉内核：“我知道这个网关不在直连网段内，但请假装它就在链路上，直接按我指定的路径发出去”
sudo ip route add default via 10.70.1.100 dev ens160 onlink table domestic_route

可用ip route show table domestic_route 复查一下，或直接用ip route show table 100
```
4、 用iptables标记domestic ipset中的流量
```
# 加载内核模块（如果尚未加载）
sudo modprobe xt_set
sudo modprobe xt_mark

# 匹配 domestic ipset，打上 fwmark 1
sudo iptables -t mangle -A PREROUTING -m set --match-set domestic dst -j MARK --set-mark 1

# 防止发往 10.70.1.100 自身的流量被标记（避免路由环路）
sudo iptables -t mangle -I PREROUTING 1 -d 10.70.1.100 -j RETURN
```

## 持久化方案
写一个持久化的脚本
```
#!/bin/bash
# /usr/local/bin/route-split.sh

# 加载内核模块（必须最先执行）
modprobe xt_set
modprobe xt_mark

# 等待 10.70.1.100 可达（最多 60 秒）
for i in $(seq 1 30); do
  ping -c 1 -W 2 10.70.1.100 >/dev/null 2>&1 && break
  sleep 2
done

# 确保路由表存在
grep -q "100 domestic_route" /etc/iproute2/rt_tables || echo "100 domestic_route" >> /etc/iproute2/rt_tables

# 添加路由
ip route flush table domestic_route 2>/dev/null
ip route add 10.70.1.100 via 10.10.8.3 dev ens160 table domestic_route
ip route add default via 10.70.1.100 dev ens160 onlink table domestic_route

# 策略规则
ip rule del fwmark 1 table domestic_route 2>/dev/null
ip rule add fwmark 1 table domestic_route priority 1000

# iptables 标记
iptables -t mangle -D PREROUTING -m set --match-set domestic dst -j MARK --set-mark 1 2>/dev/null
iptables -t mangle -A PREROUTING -m set --match-set domestic dst -j MARK --set-mark 1

iptables -t mangle -D PREROUTING -d 10.70.1.100 -j RETURN 2>/dev/null
iptables -t mangle -I PREROUTING 1 -d 10.70.1.100 -j RETURN

# 确保 ipset 存在
ipset create domestic hash:ip -exist
```
systemd文件/etc/systemd/system/route-split.service
```
[Unit]
Description=Policy routing for China IPs via 10.70.1.100
Wants=network-online.target
After=network-online.target

[Service]
Type=oneshot
ExecStart=/usr/local/bin/route-split.sh
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
```
启用：
```
sudo chmod +x /usr/local/bin/route-split.sh
sudo systemctl daemon-reload
sudo systemctl enable route-split.service
sudo systemctl start route-split.service
```
