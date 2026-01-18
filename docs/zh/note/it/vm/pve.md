# 安装
## 安装前的清理
PVE安装盘启动时，选Advance，并进入Rescue Boot,
在开始删除之前，必须先搞清楚当前系统里有什么。以下是关键的检查命令：
检查所有逻辑卷：lvs
检查所有卷组：vgs
检查所有物理卷：pvs
检查ZFS存储池：zpool list
检查Ceph OSD状态：ceph osd tree（如果Ceph服务仍在运行）
查看PVE存储配置：cat /etc/pve/storage.cfg和 pvesm status

```
root@hp850ip67:~# lvs
  LV            VG  Attr       LSize   Pool Origin Data%  Meta%  Move Log Cpy%Sync Convert
  data          pve twi-aotz--  <1.67t             17.40  0.79                            
  root          pve -wi-ao----  96.00g                                                    
  swap          pve -wi-ao----   8.00g                                                    
  vm-100-disk-0 pve Vwi-a-tz-- 350.00g data        3.56                                   
  vm-101-disk-0 pve Vwi-a-tz-- 350.00g data        1.10                                   
  vm-102-disk-0 pve Vwi-a-tz-- 350.00g data        80.31                                  
root@hp850ip67:~# vgs
  VG  #PV #LV #SN Attr   VSize  VFree  
  pve   1   6   0 wz--n- <1.82t <16.38g
root@hp850ip67:~# pvs
  PV         VG  Fmt  Attr PSize  PFree  
  /dev/sda3  pve lvm2 a--  <1.82t <16.38g
root@hp850ip67:~# zpool list
no pools available
root@hp850ip67:~# cat /etc/pve/storage.cfg
dir: local
        path /var/lib/vz
        content iso,vztmpl,backup

lvmthin: local-lvm
        thinpool data
        vgname pve
        content rootdir,images
root@hp850ip67:~# pvesm status
Name             Type     Status           Total            Used       Available        %
local             dir     active        98497780         5049764        88398468    5.13%
local-lvm     lvmthin     active      1792008192       311809425      1480198766   17.40%
root@hp850ip67:~# 
```
1、清理Ceph存储（如果存在）
如果您的系统上有Ceph，必须严格按照顺序执行，否则可能导致数据平衡异常甚至集群报错。
首先销毁Ceph存储池（Pool）：在PVE的Web管理界面中，进入“数据中心” -> “Ceph” -> “存储池”，选择要销毁的池并点击“销毁”。系统会要求您手动输入池名称以确认，防止误操作。注意：请不要销毁默认的 device_health_metrics池。您也可以使用命令行工具pvesm来移除Ceph相关的存储定义。
然后逐一下线并销毁OSD：对于每个OSD，先在Web界面（“Ceph” -> “OSD”）中将其设置为“Out”状态，然后“Stop”，最后选择“销毁”。或者使用Ceph命令行工具完成下线操作。
清理Ceph配置文件：完成上述操作后，可以删除Ceph的配置文件目录以彻底清除：rm -rf /etc/pve/ceph.conf /etc/pve/priv/ceph.*（请谨慎操作，此操作不可逆）。

2、清理ZFS存储池（如果存在）
如果存在ZFS存储池，使用以下命令销毁它（以池名为tank为例）：
```
zpool destroy tank
如果池无法正常销毁（例如包含故障设备），可以尝试-f强制销毁

```
3、清理LVM组件
是最核心的步骤，顺序至关重要，必须从逻辑顶层向物理底层反向删除：逻辑卷(LV) -> 卷组(VG) -> 物理卷(PV)。
删除逻辑卷（LV）：使用lvremove命令。例如，删除卷组pve下的一个逻辑卷data：lvremove /dev/pve/data。系统会提示确认，输入y即可。
删除卷组（VG）：使用vgremove命令。例如，删除名为pve的卷组：vgremove pve。
删除物理卷签名（PV）：使用pvremove命令。此操作会擦除物理设备上的LVM元数据。例如，清除磁盘/dev/sdb上的PV签名：pvremove /dev/sdb。执行后，该磁盘将变为“干净”状态，可重新分区或用于其他用途。


### PVE主机版本选择
pve-meeetingroom-table是验证过的版本，安装的是8.2.2, 应该8.4.1也是稳定版本。

相关系统信息记录如下:
1.ceph 未安装


### 安装时磁盘选项
如果只有单盘，并且希望有单盘数据修复能力，只能选择ZFS(raid0)。通过设置 copies=2或更高，在单盘上存储数据副本，实现自我修复。
设置磁盘选项时，取消掉安装U盘，然后2T硬盘设置这些即可：
Advanced option: ashift=12, copies=2, compress=lz4, ARC max size = 4096, hdsize=1784

FQDN设置个好记的，比如pveip67.sho

### 安装后的操作
1、笔记本合盖不休眠
```
sudo nano /etc/systemd/logind.conf
把HandleLidSwitch相关的两条改为去注释，默认值改为ignore即可
sudo restart systemd-logind 或 reboot
```

2 、禁用自动每日更新
```
systemctl disable pve-daily-update.timer

```

3、改社区源
商业更新需要订阅，既然用不了，不如就用开源的，当然已经禁用自动每日更新，也没必要经常更新，只是要在源上准备好
```
cd /etc/apt/sources.list.d
备份到~/backup/
ceph的开源(pve 8.4)：deb http://download.proxmox.com/debian/ceph-quincy bookworm no-subscription
pve的开源社区版本： deb http://download.proxmox.com/debian/pve bookworm pve-no-subscription
```

### 新建虚拟机设置
一般，我们使用portainer，用docker-compose来启用它，然后用portainer管理各种容器。

为了方便数据盘的备份，可以把/var/lib/docker单独挂载成一个分区，而创建系统时，系统盘就不用很大。
把 /var/lib/docker、/tmp、/home 和 / 作为四个独立分区，新建虚拟机后，先不安装，而是在硬件中编辑添加这些硬盘，以便安装时可以选择挂载。

分区布局，除新建时的60G系统盘外，添加下面额外盘。如果系统盘被破坏，新创建一个挂载回额外盘即可。

系统盘60G,作为根文件系统分区，并选择"use as boot device"，这会生成一个1M的BIOS grub spacer分区，然后继续在availabe device里的这个盘添加gpt分区，选择mount为“/”根文件系统。

/tmp 36G 应对内存和缓存的功能的需求，以解压10G左右的大文件能力所需来规划。

/var/lib/docker 360G 

/home 200G 充分考虑备份需求，如果启用作为server-maintainer的备份机，每天有1~2G的远程备份增量，在清理机制未充分验证不完善的情况下，保持半年左右的备份能力。

由于用ZFS，Discard 务必勾选。


### DNS相关设置
一般search domain可以用PVE本机型号或本机位置来区别，比如pvehp850gip22.sho，这样就方便用它作为本地域名来操作。DNS用公网的即可。

### ZFS相关
Discard选项要勾选，这个选项允许虚拟机向PVE宿主发送 TRIM/Discard 指令。对于ZFS至关重要：当您在虚拟机内删除文件或格式化时，勾选此选项后，这些操作会通知到底层的ZFS存储。ZFS可以据此回收这些不再使用的数据块空间，避免虚拟磁盘文件（ZVOL）持续膨胀，占用不必要的存储池空间。虚拟机内的操作系统也需要支持并启用TRIM（对于Ubuntu，默认安装的ext4文件系统已支持，无需额外设置）。
另外如果是性能至上，还可以把Cache改为write back，不过只在ZFS池本身需配置了冗余（如RAIDZ1/2，Mirror），这样才能修复断电数据没及时写入的错误。如果是单机raid0就不要动它，用默认即可。


### PVE主机启动常见错误解决办法：
 * 错误类型1：
```
TASK ERROR: activating LV 'pve/data' failed: Activation of logical volume pve/data is prohibited while logical volume pve/data_tdata is active.
```
这个问题主要是由于LVM的thin provisioning机制在异常关机后出现的元数据同步问题。逻辑卷管理（LVM）的瘦分配扩展，依赖元数据卷(tmeta)和数据卷(tdata)的复杂交互。当系统突然断电或非正常关机时，LVM的thin pool元数据卷（tmeta）和数据卷（tdata）可能处于不一致状态，导致重启时无法正常激活。
解决办法：
```
lvchange -an pve/data_tdata
lvchange -an pve/data_tmeta
lvchange -ay pve/data
```
另外，采用ZFS能有效避免。ZFS的架构设计完全不同。它采用写时复制（Copy-on-Write）和事务型模型，每次写入都是新的事务，不会覆盖现有数据。这种设计使得ZFS在意外断电后更容易恢复到一致状态，因为它不需要复杂的元数据恢复过程。



 * 错误类型2：
```
/dev/mapper/pve-root contains a file system with errors, check forced.
Inode 5245521 seems to contain garbage.
/dev/mapper/pve-root: UNEXPECTED INCONSISTENCY; RUN fsck Mannually. 
```

解决办法：
```
在(initramfs)提示符下完成：
fsck -y /dev/mapper/pve-root ，
修复完成后，您很可能会看到类似 /dev/mapper/pve-root: FILE SYSTEM WAS MODIFIED​ 或 ***** FILE SYSTEM WAS MODIFIED *****​ 的提示。这表示修复已成功生效。
输入exit命令即可退出 initramfs环境并继续启动系统。
```