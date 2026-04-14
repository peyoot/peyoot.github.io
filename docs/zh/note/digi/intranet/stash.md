# 下载stash中的代码库

以下载meta-digi中的isp分支为例
```
git clone ssh://git@stash.digi.com/dey/meta-digi.git -b abuzarra/dey-5.0/master_DEL-9890_add_support_x_linux_isp_ccmp2_12012026

```

在repo中实现 <remote name="digistash"  fetch="ssh://git@stash.digi.com/dey"/> 替代github，并用
DIGI_INTERNAL_GIT ?= "1"

fetch直接用https是否可行，没试过，

如果可以，也许只要配置DIGI_INTERNAL_GIT


# 推送部分分支到eccee

单独下载内网meta-digi

git clone ssh://git@stash.digi.com/dey/meta-digi.git

拉取一些所需的分支：
 
git fetch origin cc95_v2_alpha

将公钥添加到gitea

创建远程库

git remote add eccee https://git.eccee.com/Digi/meta-digi.git

git push -u eccee cc95_v2_alpha

同理：
 
git clone ssh://git@stash.digi.com/dey/dey-examples.git



git remote add eccee https://git.eccee.com/Digi/dey-examples.git

git push -u eccee

git fetch origin dey-5.0/maint

git push -u eccee
