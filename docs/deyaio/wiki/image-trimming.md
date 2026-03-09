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
上面提到，packagegroup-dey-core.bb配方需要Xbee-init，而我们把提供者xbee配方给禁了。
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
bitbake -c cleansstate packagegroup-machine-base packagegroup-base xbee
bitbake core-image-base
```