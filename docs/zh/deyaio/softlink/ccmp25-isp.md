# 如何添加ConnectCore ISP支持
DEY-5.0-r4将基于最新的ST v6.2.0 ,而当前2026年5月 X-LINUX-ISP ST并没有发布X-LINUX-ISP的V6.2.0版本。所以可以为了支持ISP功能，可以：
  * 使用DEY-5.0-r3 配合内网stash中的meta-digi的de852f317d711486e7d5f615cface46fe3557e15中的更改
  * 等待ST发布更新的X-LINUX-ISP layer（支持OpenLinux v6.2.0 ）

  由于上述原因，de852没有推送到github，我们将在meta-custom中加入相关支持，可以先推送到ecceegit的分支来替代原来的meta-digi，再尝试用meta-custom添加更改，限制在dey 5.0r3，以防止出错。
  内网中开始支持V6.2的提交号是2ec067c6ee22afd6cd0c01d1e5d82663c96f06e3，因此在它之前的一个commit作为基础，由于官方分支号从master变为dey-5.0/maint，所以配方中也要相应调整，最终推送到这个tag：
  https://git.eccee.com/Digi/meta-digi/src/branch/dey-5.0r3isp

  DEY 5.0R3中，在deyaio-manifest内，可以通过限制ST相关layer的hash版本来限制使用在OpenSTLinux v6.1.1，以防止V6.2引入编译问题，同时使用上述ecceegit中的meta-digi匹配版本，已经调校好的支持ISP版本是  ：
  https://github.com/peyoot/dey-aio-manifest/blob/dey5.0-r3/isp.xml

  因此创建dey aio环境时时用上面tag：
 
```
cd
mkdir deyaio-isp
cd deyaio-isp
repo init -u https://github.com/peyoot/dey-aio-manifest.git -b refs/tags/dey5.0-r3 -m isp.xml
repo sync
```

然后就可以创建项目：

```
cd dey5.0/workspace
mkdir ccmp25-isp
source ../../mkproject.sh -l
source ../../mkproject.sh -p ccmp25-dvk
bitbake dey-image-lvgl
```