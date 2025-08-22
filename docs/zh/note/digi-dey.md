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
