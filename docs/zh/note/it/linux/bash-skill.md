# 压缩指定大小分卷
```
tar -cJf - -C ~ deyaio-ccmp25plc |split -b 999M - deyaio-ccmp25plc.tar.xz.
命令详解：
tar -cJf -：用 xz 算法创建压缩包，并输出到标准输出 (-)。
-C ~ deyaio：进入 ~ 目录，压缩 deyaio 文件夹。
| split -b 999M -：用 split 命令将接收到的数据流，按每块 999MB 进行分割。
deyaio-ccmp25plc.tar.xz.：分卷文件的前缀，生成的文件名类似 deyaio-ccmp25plc.tar.xz.aa, deyaio-ccmp25plc.tar.xz.ab。

何解压分卷文件？
将全部分卷（deyaio-ccmp25plc.tar.xz.aa, deyaio-ccmp25plc.tar.xz.ab ...）放在同一目录，然后执行：
cat deyaio-ccmp25plc.tar.xz.* | tar -xJf -

将 cat 命令的输出（即合并后的数据流）传递给 tar 命令
-x：解压/提取模式
-J：使用 xz 压缩算法解压
-f -：-f 指定输入文件，- 表示从标准输入读取数据（即从管道传来的数据）
```
