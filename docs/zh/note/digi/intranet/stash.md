# 下载stash中的代码库

以下载meta-digi中的isp分支为例
```
git clone ssh://git@stash.digi.com/dey/meta-digi.git -b abuzarra/dey-5.0/master_DEL-9890_add_support_x_linux_isp_ccmp2_12012026

```

在repo中实现 <remote name="digistash"  fetch="ssh://git@stash.digi.com/dey"/> 替代github，并用
DIGI_INTERNAL_GIT ?= "1"

fetch直接用https是否可行，没试过，

如果可以，也许只要配置DIGI_INTERNAL_GIT


