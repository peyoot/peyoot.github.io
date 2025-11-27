# 在DEY AIO环境下使用devtool进行驱动开发和调试
使用 devtool 确实是一种更简单和推荐的方式来修改 Yocto 项目中的内核源代码（如你的 OV2740 驱动补丁）。相比直接用 bitbake -c devshell virtual/kernel（这种方式需要手动管理源代码路径、生成补丁，并可能导致 tmp/work 目录混乱），devtool 有以下优势：

自动化管理：它会自动从 tmp/work 提取源代码到项目 workspace 的 sources/ 目录下，提供一个干净的开发环境。你可以像本地编辑一样修改文件，而不用担心构建目录的临时性。
补丁生成：修改后，直接用 devtool update-recipe 生成补丁，并自动更新内核配方（recipe），无需手动 quilt 或 git 格式化补丁。
构建隔离：修改只影响当前 workspace，不会污染全局构建，直到你选择更新配方。
易回滚：如果出问题，可以轻松重置或移除修改。
集成性：适合迭代开发，尤其在内核驱动如 OV2740.c 的场景下。

不过，devtool 也依赖于你的 Yocto 环境正确配置（bitbake 已初始化，source 了环境脚本）。在 Digi Embedded Yocto (DEY) 项目中，它应该无缝工作，因为 DEY 基于标准 Yocto。

# 完整示例
以下是一个完整流程，请确保是在workspace下的项目目录里操作，比如workspace/myccmp25/，
```
# 0. 确保环境
source dey-setup-environment

# 1. 提取内核（自动处理 virtual/kernel → linux-dey）
devtool modify virtual/kernel

这个命令会在项目根目录下创建workspace工作区，并它这个工作区作为一个layer加入到conf/bblayers.conf中。linux的源码树会复制一份到工作区，即workspace/sources/linux-dey。不过，需要注意的是，所有的devtool命令都需要在原来项目根目录下进行！
# 3. 修改驱动
vim workspace/sources/linux-dey/drivers/media/i2c/ov2740.c

# 4. 打开内核配置
devtool menuconfig linux-dey
# → 打开 OV2740、添加自定义选项

# 5. 编译测试
devtool build linux-dey

# 6. 内核和设备树验证
对于内置驱动的变更，直接推 Image + dtb 到开发板就可以。如果是外挂的.ko模块，则还要把对应的.ko拷到/lib/modules/6.6*/下，也可以用rsync -avz --delete \
  tmp/deploy/images/ccmp25_dvk-dey-linux/*-linux-dey/ \
  root@192.168.10.100:/lib/modules/6.6*/
登录开发板执行一次depmod -a（只在第一次推新版本模块时需要）
ssh root@192.168.10.100 depmod -a
重启或直接热加载
reboot
# 或者只重启摄像头模块：rmmod ov2740 && modprobe ov2740

# 6. 提交并生成补丁 + 合并到你的层
# 进入源码目录
cd ~/deyaio-rtsp/dey5.0/workspace/sources/linux-dey
# 查看修改
git status
# 提交修改，比如
git add drivers/media/i2c/ov2740.c
git commit -m "ov2740: support device tree and 24MHz clock"
# devtool update-recipe linux-dey -a meta-custom
# 或者（推荐）：
devtool finish linux-dey meta-custom
注意生成的bbappend中，SRC_URI可能会少空格，要自己改

# 7. 清理 devtool 环境重新开始构建

devtool reset linux-dey
devtool modify linux-dey
bitbake -c devshell linux-dey
make ccmp2_defconfig
临时验证内核选项
#make menuconfig  # 
#make savedefconfig
# 将生成的 defconfig 复制出来保存
#或 
echo "CONFIG_VIDEO_OV2740V2=m" >> .config

echo $ARCH              # 检查测试环境，必须是arm64
make ccmp2_defconfig    # 先要编译配置，以便生成.config，这是shell下编译所必须的
make ccmp25-dvk.dtb     # 测试编译设备树
make ov2740.o #测试编译驱动

exit

devtool build linux-dey


# 8. 完整构建镜像
bitbake dey-image-qt   # 你的镜像名

```
# 进行回退修改
有时，我们的patch不够完善，等到应用后才发现还有些地方要修改，这时我们需要重新用devtool回退到原来版本再次进行补丁修改。
举例来说：
我们在meta-custom的80c7179提交上加了补丁，而变成2c18b33，全新repo sync并编译后，如果我们要推翻这个修改重来，正确的步骤是：
```
1、在项目文件夹的conf/bblayer.conf中删除devtool新增的layer，一般在最后一行。如果不存在或是全新项目目录，则不需要。
2、在meta-custom中检查版本号
$ git status
$ HEAD detached at 2c18b33
$ nothing to commit, working tree clean
$ git checkout 80c7179
3、重复devtool开发过程，再次生成补丁即可
```

# 仅编译设备树

由于我们通过bbaapend拉取自定义设备树，因此在devtool下，如果想用make来编译，还需要先把设备树放在内核源码中，并在Makefile中添加，如果设备树有单独的源，可以参考如下：
```
mkdir ~/mygit
cd ~/mygit
git clone https://github.com/peyoot/ccmp25_dt.git
编辑自己的板级设备树，比如ccmp25-myboard.dts
cd workspace/sources/linux-dey/arch/arm64/boot/dts/digi
ln -s ~/mygit/github/ccmp25_dt/ccmp25-myboard.dts 
nano Makefile
在相应位置加上这个设备树的编译件dtb
cd workspace/sources/linux-dey
make ARCH=arm64 dtbs
```