# 下载预编译固件并更新到开发板或单板机上


# 配置显示输出

默认地，将会输出到HDMI接口，如果需要在LVDS显示，则需要设置uboot的overlays参数，可以按任意键停在U-Boot中：
```
=>setenv overlays ccmp25-dvk_g101evn010-lvds.dtbo
=>saveenv
=>reset
```
或者，在Linux中设置并重启生效
```
fw_setenv overlays ccmp25-dvk_g101evn010-lvds.dtbo 
```