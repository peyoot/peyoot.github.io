## 简单修改驱动添加调试输出

如果你只是想看 dmesg 中的基本日志，不用 dynamic debug。可以临时提高内核 loglevel（echo 8 > /proc/sys/kernel/printk）来显示更多 pr_debug（但不针对特定文件/函数）。或在 ads7846.c 中改用 printk(KERN_DEBUG "...") 而非 dev_dbg，重建模块（无需 dynamic debug）。

## 内核开启动态调试
默认已经有：
```
CONFIG_DEBUG_FS=y
CONFIG_DEBUG_FS_ALLOW_ALL=y
```
加上
```
CONFIG_DYNAMIC_DEBUG_CORE=y
CONFIG_DYNAMIC_DEBUG=y
```
验证：
```
zcat /proc/config.gz | grep CONFIG_DYNAMIC_DEBUG 
```
应输出 CONFIG_DYNAMIC_DEBUG=y 和 CONFIG_DYNAMIC_DEBUG_CORE=y

## 挂载debugfs (默认自动挂载)

如果内核在 boot 时通过 cmdline 参数（如 dyndbg="file ads7846.c +p"）启用了 dynamic debug，你甚至不用手动挂载/配置，就能直接在 dmesg 看到日志。 但在运行时动态调整（如针对特定驱动），还是需要挂载 debugfs 来操作 control 文件。嵌入式一般boot时未自动挂载，所以需运行一次 mount 命令（可加到 /etc/fstab 或 init 脚本中永久化）。
```
mount -t debugfs none /sys/kernel/debug
```
测试后，运行 ls /sys/kernel/debug/ 确认有 dynamic_debug 目录即可。

事实上，dey已经默认是自动挂载，有这个dynamic_debug目录。

## 启用 ads7846 调试
运行下面命令
```
echo 'file drivers/input/touchscreen/ads7846.c +p' > /sys/kernel/debug/dynamic_debug/control
```
触碰屏幕，查看 dmesg 中的日志


