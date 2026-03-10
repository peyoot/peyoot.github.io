# 系统镜像的裁减和定制
对于DEY的系统镜像来说，有时我们需要进行裁减，以减小系统镜像体积，或是移除一些不必要的包和服务，这里就要用到系统镜像的裁减技巧。
默认地，系统镜像并不会用到整个DEY源码库的所有配方，而系统镜像的安装包会由机器或发行版特性，系统特性，DEY默认包组或是配方引入，因此，直接排除某个配方不一定能成功，但它可以用来检查相关依赖，以方便进行进一步的配置来移除相关的包。

### 一个简单的例子
Digi的DEYl默认可以支持XBee无线模块，因此有一个xbee配方，当我们板卡上没用到xbee时，最直接的想法是在local.conf中添加一行：
```
SKIP_RECIPE[xbee] = "Not needed, no xbee module"
```
但这样直接编译时会报错
```
ERROR: Nothing RPROVIDES 'xbee-init' (but /home/robin/deyaio-ccmp25/dey5.0/sources/poky/meta/recipes-core/packagegroups/packagegroup-base.bb, /home/robin/deyaio-ccmp25/dey5.0/sources/meta-digi/meta-digi-dey/recipes-core/packagegroups/packagegroup-dey-core.bb RDEPENDS on or otherwise requires it)
xbee RPROVIDES xbee-init but was skipped: Recipe will be skipped because: Not needed, no xbee module
NOTE: Runtime target 'xbee-init' is unbuildable, removing...
Missing or unbuildable dependency chain was: ['xbee-init']
NOTE: Runtime target 'packagegroup-base-extended' is unbuildable, removing...
Missing or unbuildable dependency chain was: ['packagegroup-base-extended', 'xbee-init']
ERROR: Required build target 'core-image-base' has no buildable providers.
Missing or unbuildable dependency chain was: ['core-image-base', 'packagegroup-base-extended', 'xbee-init']

```
上面提到，packagegroup-base.bb下的packagegroup-dey-core.bb配方需要Xbee-init，而我们把提供者xbee配方给禁了。
因此，查一下是什么引入这个包，
```
$bitbake -e packagegroup-base | grep -E "^RDEPENDS:.*xbee"
RDEPENDS:packagegroup-machine-base="           optee-client       e2fsprogs-mke2fs     e2fsprogs-resize2fs     mtd-utils-ubifs     parted     xbee-init "
```
输出显示 xbee-init 直接出现在 RDEPENDS:packagegroup-machine-base中，说明它不是 PACKAGECONFIG 引入的，源头是在packagegroup-machine-base中，因此
```
# 从 machine-base 包组中移除 xbee-init
RDEPENDS:packagegroup-machine-base:remove = "xbee-init"
```
清理重新编译
```
注意，SKIP_RECIPE会略过配方，但对之前已经编译的结果并不会删除，因此，通常清理前，先注释掉要清理的配方的SKIP_RECIPE这行，以便清理掉旧有编译结果。
bitbake -c cleansstate packagegroup-machine-base packagegroup-base xbee
如需进一步检查 ，可取消注释恢复一下SKIP_RECIPE
bitbake core-image-base
```

### 更复杂的例子

比如，我们要清除ModemManager，这时，用仅用RDEPENDS并无法生效，通过 SKIP_RECIPE 我们终于挖出了真正的依赖链：core-image-base → packagegroup-base-extended → packagegroup-dey-core → networkmanager → modemmanager。这说明 networkmanager 依赖于 modemmanager，
networkmanager 的配方中，对 modemmanager 的依赖通常是通过 PACKAGECONFIG 控制的。当 modemmanager 特性启用时，会在 DEPENDS 中添加 modemmanager（构建时依赖），并且可能也会在 RDEPENDS 中添加。如果用RDEPENDS:remove 只移除了运行时依赖，但构建时依赖仍然存在，所以当 modemmanager 被 SKIP_RECIPE 跳过时，构建系统仍然需要它来满足 DEPENDS，导致错误。

解决的办法是，在local.conf中：
```
# 禁用 networkmanager 的 modemmanager 支持（这会同时移除 DEPENDS 和 RDEPENDS）
PACKAGECONFIG:remove:pn-networkmanager = "modemmanager"

# 可选：同时移除运行时依赖（虽然上面已经处理，但保留无害）
RDEPENDS:networkmanager:remove = "modemmanager ppp"
```

### 更更进阶的处理
让我们来解决这样一个问题，硬件设计上我们使用了带WiFi和不带WiFi都兼容的板卡，为了实时性，我们需要禁用WiFi和蓝牙。
WiFi和蓝牙的特性一般是由DISTRO_FEATURE来决定，先检查一下：
```
bitbake -e | grep ^DISTRO_FEATURES=
```

因此,首先是在local.conf中，用：
```
DISTRO_FEATURES:remove = " bluetooth wifi "
```
但这够了么？事实上这只是禁止安装一些相关的包和服务而已。而Digi的SOM启动时，会根据boot.scr脚本决定是否加载相关的设备树overlay，从而加载驱动，为了彻底禁掉WiFi蓝牙，更合适的办法是更改recipes-bsp/u-boot/u-boot-dey/ccmp25-dvk/boot.txt的内容，不再根据硬件支持来加载，而是为有需要的板卡完全略过设备树overlay。

以CCMP25为例，创建一个文件夹和文件meta-custom/recipes-bsp/u-boot/u-boot-dey/ccmp25-dvk/boot.txt，在boot.txt内容中移除最后模块硬件检查加载overlay部分，在meta-custom/recipes-bsp/u-boot/u-boot-dey_2023.10.bbappend中，
```
# 因为 meta-custom 优先级更高，这个 prepend 会晚于 digi 的 bbappend 执行，所以我们的路径会排在 digi 前面
FILESEXTRAPATHS:prepend:u-boot-dey_2023.10 := "${THISDIR}/files:"
```
如果仅替换boot.txt不能起作用，可以复制整个目录，或是直接在meta-digi-arm/recipes-bsp/u-boot/u-boot-dey/ccmp25-dvk中更改（临时方案）