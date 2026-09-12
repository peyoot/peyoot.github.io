## 多功能演示镜像 RT+Multidemo+RTSP
镜像名称：core-image-base
使用代码仓库：https://github.com/peyoot/dey-aio-manifest/blob/scarthgap/rt-multidemo.xml
meta-custom: scarthgap-rt-multidemo
local.conf: https://github.com/peyoot/meta-custom/blob/scarthgap-rt-multidemo/recipes-mine/homeaddons/files/.localconf
编译历史：
20260904： 
03335e8f0d0882dd6c96604a160c26f8  core-image-base-ccmp25-dvk-20260904144457.installer.zip

## 0904固件测试
使用LVDS屏，插入摄像头，上电后进入测得可用内存在420~423M左右，五分钟稳定后，大约在416~419M。
```
root@ccmp25-dvk:~# free -h
               total        used        free      shared  buff/cache   available
Mem:           758Mi       329Mi       194Mi       7.6Mi       255Mi       422Mi
Swap:             0B          0B          0B

```
默认启动connectcore-demo-example-webkit例程， 按三下user button2 切换QT程序，再按三下切换vital-monitor QT例程，这个忘了集成进镜像。
已经使用thttpd服务，但并不是用8080端口，而是80，检查/etc/thttpd.conf,只有一条路径设置，并不影响mjpg_streamer服务，演示可用。




