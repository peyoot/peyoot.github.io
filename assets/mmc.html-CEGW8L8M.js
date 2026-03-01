import{_ as i,o as e,c as n,b as s}from"./app-oTA4_50g.js";const l={},d=s(`<h1 id="如何测试sd卡接口" tabindex="-1"><a class="header-anchor" href="#如何测试sd卡接口"><span>如何测试SD卡接口</span></a></h1><p>TF卡也叫Micro SD卡，通常linux下直接看lsblk，uboot下则要看mmc list</p><h1 id="官方开发套件示例" tabindex="-1"><a class="header-anchor" href="#官方开发套件示例"><span>官方开发套件示例</span></a></h1><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>NOTICE:  CPU: STM32MP255CAL Rev.Y
NOTICE:  Model: Digi International ConnectCore MP25 Development Kit
NOTICE:  Reset reason: Power-on reset (por_rstn) (0x2035)
NOTICE:  BL2: v2.10-stm32mp2-r1.0(release):e22f7d898-dirty(e22f7d89)
NOTICE:  BL2: Built : 09:14:57, Jul  2 2025
NOTICE:  BL2: Booting BL31
NOTICE:  BL31: v2.10-stm32mp2-r1.0(release):e22f7d898-dirty(e22f7d89)
NOTICE:  BL31: Built : 09:14:57, Jul  2 2025
[    0.000000] SCP-firmware 2.13.0-intree-optee-os-da06ccf75
[    0.000000]
[    0.000000] [FWK] Module initialization complete!


U-Boot dub-2023.10-r2.1 (Jul 04 2025 - 07:26:38 +0000)

CPU: STM32MP255CAL Rev.Y
DRAM:  1 GiB
optee optee: OP-TEE: revision 4.0 (da06ccf7)
Core:  432 devices, 39 uclasses, devicetree: board
WDT:   Started watchdog with servicing every 1000ms (32s timeout)
MMC:   STM32 SD/MMC: 0, STM32 SD/MMC: 2
In:    serial
Out:   serial
Err:   serial
Model: Digi International ConnectCore MP25 Development Kit
ConnectCore MP25 SOM variant 0x03: 1 GiB DDR4, Wi-Fi, Bluetooth
  Board version 5, ID undefined
Boot:  MMC
Net:   eth0: eth1@482c0000, eth1: eth2@482d0000
No EFI system partition
No EFI system partition
Failed to persist EFI variables
Normal Boot
Hit any key to stop autoboot:  0
=&gt; mmcinfo
Device: STM32 SD/MMC
Manufacturer ID: d6
OEM: 3
Name: 88A398
Bus Speed: 52000000
Mode: MMC DDR52 (52MHz)
Rd Block Len: 512
MMC version 5.1
High Capacity: Yes
Capacity: 7.3 GiB
Bus Width: 8-bit DDR
Erase Group Size: 512 KiB
HC WP Group Size: 8 MiB
User Capacity: 7.3 GiB WRREL
Boot Capacity: 4 MiB ENH
RPMB Capacity: 4 MiB ENH
Boot area 0 is not write protected
Boot area 1 is not write protected
=&gt; mmc list
STM32 SD/MMC: 0 (eMMC)
STM32 SD/MMC: 2 (SD)
=&gt; fatls mmc 2:1
            System Volume Information/
     8415   install_linux_fw_sd.scr
     8423   install_linux_fw_usb.scr
     3640   boot.scr
  1908736   imx-boot-ccimx93-dvk-A0.bin
  1942528   imx-boot-ccimx93-dvk.bin
 14030848   dey-image-lvgl-xwayland-ccimx93-dvk.boot.vfat
    11460   install_linux_fw_uuu.sh
 21154816   dey-image-lvgl-xwayland-ccimx93-dvk.recovery.vfat
 532676608   dey-image-lvgl-xwayland-ccimx93-dvk.ext4

9 file(s), 1 dir(s)

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,4),a=[d];function t(r,v){return e(),n("div",null,a)}const m=i(l,[["render",t],["__file","mmc.html.vue"]]),o=JSON.parse('{"path":"/zh/deyaio/wiki/ccmp25/mmc.html","title":"如何测试SD卡接口","lang":"zh-CN","frontmatter":{"description":"如何测试SD卡接口 TF卡也叫Micro SD卡，通常linux下直接看lsblk，uboot下则要看mmc list 官方开发套件示例","head":[["meta",{"property":"og:url","content":"https://peyoot.github.io/zh/deyaio/wiki/ccmp25/mmc.html"}],["meta",{"property":"og:title","content":"如何测试SD卡接口"}],["meta",{"property":"og:description","content":"如何测试SD卡接口 TF卡也叫Micro SD卡，通常linux下直接看lsblk，uboot下则要看mmc list 官方开发套件示例"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"如何测试SD卡接口\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[],"git":{},"autoDesc":true,"filePathRelative":"zh/deyaio/wiki/ccmp25/mmc.md"}');export{m as comp,o as data};
