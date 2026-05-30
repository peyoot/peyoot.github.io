# 常见问题 
一些常见问题列于此处

## 指定meta-digi的版本出现swupdate编译问题
有时，我们需要使用某个特定版本的meta-digi，但编译发生报错，往往是patch补丁的fuzz问题，出这个问题的原因是在meta-digi/meta-digi-dey/recipes-support/swupdate下的补丁文件并没指明swupdate的版本，而真正的swupdate版本是由另一个层meta-swupdate/recipes-support/swupdate中的swupdate_最高版本号.bb决定的。这里的最高版本号决定编译时的PV值。

```
bitbake -e swupdate | grep -E "^PV=|^PREFERRED_VERSION|^FILE="
```

如果swupdate所用的提交中的最高版本号和补丁不匹配，就会出现编译错误。
一个好的办法是需要官方去执行，即你的补丁只适用于特定版本，那么就在meta-digi/meta-digi-dey/recipes-support/swupdate/swupdate_%.bbappend里加上

```
# Force using 2025.12 version + matching patches
PREFERRED_VERSION_swupdate = "2025.12"

# 可选：提高这个 append 的优先级
DEFAULT_PREFERENCE_pn-swupdate = "1"
```



