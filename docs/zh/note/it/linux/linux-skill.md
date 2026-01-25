# Ubuntu 上高效打包 + 适度压缩 + 安全传输
推荐方案：tar（不压缩） + zstd（多线程压缩），每卷 ≤ 3.8 GiB（兼容 FAT32 / 网盘 / 邮件）
```
# 1. 进入目录的上层
cd /path/to/parent

# 2. 多线程压缩 + 分卷（每卷 3.8G，兼容大多数网盘）
tar -I 'zstd -5 -T0' -cf - project_shared \
  | split -d -b 3800M - project_shared.tar.zst.part_

# 说明：
# -I 'zstd -5 -T0' → 使用 zstd 级别5，全核压缩
# -cf - → tar 输出到 stdout
# split -b 3800M → 每卷 ≈3.8GiB（留 200M 余量防碎片）
# 最终生成：project_shared.tar.zst.part_00, part_01, ...
```
目标机器上还原：
```
# 合并分卷后再解压（推荐）
cat project_shared.tar.zst.part_* > project_shared.tar.zst

# 解压（zstd 自动多线程，内存 < 500M）
tar -I 'zstd -d -T0' -xf project_shared.tar.zst
或者 边合并边解压（节省磁盘）：
bashcat project_shared.tar.zst.part_* | tar -I 'zstd -d -T0' -xf -
```