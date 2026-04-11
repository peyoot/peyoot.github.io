## DEY工具链定制-go语言支持

在DEY项目中，可以直接bitbake出工具链

bitbake meta-ide-support


如果我们需要在其它电脑上安装，就要生成SDK,在镜像名后面加“-c populate_sdk”,比如:

bitbake dey-image-qt -c populate_sdk

另外，如果需要镜像能支持远程调试，镜像的文件系统需要跑一个tcf-agent进程，这可以在local.conf中添加下面Feature来实现

EXTRA_IMAGE_FEATURES = “tools-debug eclipse-debug”



**********************

在使用 -c populate_sdk时，有默认SDK所需的包套件生成。 TOOLCHAIN_HOST_TASK 和 TOOLCHAIN_TARGET_TASK 控制着哪些包添加到SDK中，要添加包到SDK中给主机运行的交叉编译工具链使用，用TOOLCHAIN_HOST_TASK，往开发板运行的镜像中添加开发环境所需的包，用TOOLCHAIN_TARGET_TASK 。

网上查得：

方案一：正确

应该在local.conf中加上：
```
TOOLCHAIN_HOST_TASK:append = " \
   packagegroup-go-cross-canadian-${MACHINE} \
"

TOOLCHAIN_TARGET_TASK:append = " \
   ${@multilib_pkg_extend(d, 'packagegroup-go-sdk-target')} \
"

```
然后
bitbake dey-image-webkit -c populate_sdk

方案二：不是在local.conf中，而是在镜像中，或者不是这个包名

不过，文心一言给出这个，不知道是否可行：

SDKIMAGE_FEATURES += “tools-debugtools-go”

***