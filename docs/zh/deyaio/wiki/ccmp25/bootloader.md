## STM32MP25的启动链和U-Boot修改
在 STM32MP2 上,U-Boot 和 OP-TEE 是并列的两个组件,不是包含关系:

BootROM → TF-A BL2(trusted-firmware-a)→ BL31(安全监控)+ BL32 = OP-TEE(安全世界)→ BL33 = U-Boot(非安全世界引导器)

这几块(BL31 / BL32-OP-TEE / BL33-U-Boot + 若干 device tree)最终被打包进一个 FIP(Firmware Image Package)容器,也就是 fip-stm32mp 干的事。板子上烧的是 FIP,而不是单独的 u-boot.bin。所以 U-Boot 和 OP-TEE 是被 FIP 平级装在一起。

正因为 U-Boot 是 FIP 里的 BL33，所以改U-Boot必须让 FIP 重新打包把新 u-boot 收进去。
```
bash
cd ~/deyaio-isp/dey5.0/workspace/ccmp25-softlink
bitbake -c cleansstate u-boot-dey
bitbake -c cleansstate fip-stm32mp
bitbake fip-stm32mp        # 或直接 bitbake 你的整镜像
```
