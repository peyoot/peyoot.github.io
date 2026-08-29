##配置Linux内核选项
在dey-aio项目中，可以很方便通过meta-custom配置修改Linux的默认内核选项。除了用devshell方式查看外，一般可以在开始编译Linux之前，先确定一下当前的内核选项配置。比如在ConnectCore MP255的项目中，查看音频芯片MAX98088的驱动支持情况，用：
```
bitbake -c configure linux-dey
grep -E MAX98088 tmp/work/ccmp25_dvk-dey-linux/linux-dey/6.6/build/.config
```

在meta-custom中，内核选项通过linux-dey_%.bbappend修改，当内核选项更改时，可以
```
bitbake -c configure -f linux-dey
```
如果是已经刷入板卡，可以进入Linux后输入查询命令，如
```
# 在板卡上查看当前内核配置
zcat /proc/config.gz | grep -E "AUDIO|MAX98088"
```
