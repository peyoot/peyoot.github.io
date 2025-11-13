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

# 2. 配置devtool下的conf/local.conf
有一些必须设置项目，否则会出错
```
MACHINE = "ccmp25-dvk"
DISTRO ?= "dey"
DL_DIR ?= "${TOPDIR}/../project_shared/downloads"
SSTATE_DIR ?= "${TOPDIR}/../project_shared/sstate-cache"
SSTATE_SKIP_CREATION:pn-lua-native = "1"
```

# 3. 修改驱动
vim workspace/sources/linux-dey/drivers/media/i2c/ov2740.c

# 4. 打开内核配置
devtool menuconfig linux-dey
# → 打开 OV2740、添加自定义选项

# 5. 编译测试
devtool build linux-dey

# 6. 提交并生成补丁 + 合并到你的层
# 进入源码目录
cd ~/deyaio-rtsp/dey5.0/workspace/sources/linux-dey
# 查看修改
git status
# 提交修改，比如
git add drivers/media/i2c/ov2740.c
git commit -m "ov2740: support device tree and 24MHz clock"
# devtool update-recipe virtual/kernel -a meta-custom
# 或者（推荐）：
devtool finish virtual/kernel meta-custom

# 7. 清理 devtool 环境
devtool reset virtual/kernel

# 8. 完整构建镜像
bitbake dey-image-qt   # 你的镜像名

```

