# DEY 镜像常用配置

## cc93
```
IMAGE_INSTALL:append = " packagegroup-imx-ml nano"

```

# DEY的显示接口配置

## CC8MN
fusion display 屏： 
```
=> setenv overlays _ov_board_hsd101pfw2-lvds_ccimx8m-dvk.dtbo
=> saveenv
或是
To enable the LVDS with the AUO 10" LCD display:
=> setenv overlays ccimx8m-dvk_lvds.dtbo,${overlays}
To enable the LVDS with the Fusion 10" LCD display:
=> setenv overlays ccimx8m-dvk_hsd101pfw2-lvds.dtbo,${overlays}
```

# cc93rtsp 演示配置
刷完固件后，需更改的一些地方：

1、/etc/NetworkManager/NetworkManager.conf
把interface-name:wlan0;添加进unmanaged-devices列表中。

2、/etc/network/interfaces中，把wifi-direct注释掉，仅保留uap0，插上摄像头，reboot重启
```
auto lo
iface lo inet loopback

# WiFi P2P interface
#auto wfd0
#iface wfd0 inet static
#        address 192.168.45.30
#        netmask 255.255.255.0
#        wpa-driver nl80211
#        wpa-conf /etc/wpa_supplicant_p2p.conf
#        pre-up [ -d /proc/device-tree/wireless ]

# Wi-Fi AP interface (NXP IW612)
auto uap0
iface uap0 inet static
        address 192.168.46.30
        netmask 255.255.255.0
        pre-up [ -d /proc/device-tree/wireless ] && REGION=$(fw_printenv -n region_code 2>/dev/null || echo US) && wl country $REGION || iw reg set $REGION
        post-up systemctl start hostapd@uap0.service
        post-up udhcpd /etc/udhcpd.conf
        pre-down systemctl stop hostapd@uap0.service
        pre-down pkill udhcpd

## Example bridge between eth0 and uap0 (NXP IW612)
#auto br0
#iface br0 inet static
#       bridge_ports eth0 uap0
#       address 192.168.42.50
#       netmask 255.255.255.0
#       pre-up [ -d /proc/device-tree/wireless ]
```

3、使用ACS时，可用 iw dev wlan0 info查看信道

# DEY实时linux配置

实时涉及内核配置和拉取PREEMPT_RT补丁包，这些都会在编译配置设置好后自动完成，修改conf/local.conf，添加如下配置即可：
```
DISTRO_FEATURES:append = " rt"
```


# locales报错解决

在ubuntu 22.04下执行命令时报错，提示“Please make sure locale 'en_US.UTF-8' is available on your system”

Ubuntu 22.04 默认把所有 locale 都编译成二进制放在 /usr/lib/locale/ 下，只有显式生成过才会出现
```
1. 重新生成 locale（确保 en_US.UTF-8 在列表里被选中）
sudo locale-gen en_US.UTF-8

2. 立即生效
sudo update-locale LANG=en_US.UTF-8
```
