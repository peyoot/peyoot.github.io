# 如何添加ConnectCore ISP支持
DEY-5.0-r4将基于最新的ST v6.2.0 ,而当前2026年5月 X-LINUX-ISP ST并没有发布X-LINUX-ISP的V6.2.0版本。所以可以为了支持ISP功能，可以：
  * 使用DEY-5.0-r3 配合de852f317d711486e7d5f615cface46fe3557e15中的更改
  * 等待ST发布更新的X-LINUX-ISP layer（支持v6.2.0 ）

  由于上述原因，de852没有推送到github，我们将在meta-custom中加入相关支持，可以先推送到ecceegit的分支来替代原来的meta-digi，再尝试用meta-custom添加更改，限制在dey 5.0r3，以防止出错。

  DEY 5.0R3中，在dey-manifest和deyaio-manifest内，可以能过限制hash版本来限制使用在OpenSTLinux v6.1.1，以防止V6.2引入编译问题 ：
  ```
  <project name="meta-st-stm32mp.git" path="sources/meta-st-stm32mp" remote="stm" revision="fae1c3bcad05f338da80e69fc150b8697ad874c5"/>
  <project name="meta-st-x-linux-ai.git" path="sources/meta-st-x-linux-ai" remote="stm" revision="6813080f1bb326793950c5a3ae02a3fd59a94f28"/>
  ```
注意，上面并没有包括meta-st-x-linux-isp的harsh，虽然它当前仅支持v6.1.1，我们也需要限制到最新版本，以防止将来升级时用v6.2的版本和上述混编译。
查得：https://github.com/STMicroelectronics/meta-st-x-linux-isp/tree/scarthgap
当前的hash是：36d6caacc9978c7d78b8b68a3f958850d8614138

所以，在deyaio-manifest中，添加：

```
<project name="meta-digi.git" path="dey5.0/sources/meta-digi" remote="ecceegit" revision="5.0r3-isp"/>

<project name="meta-st-stm32mp.git" path="dey5.0/sources/meta-st-stm32mp" remote="stm" revision="fae1c3bcad05f338da80e69fc150b8697ad874c5"/>
  <project name="meta-st-x-linux-ai.git" path="dey5.0/sources/meta-st-x-linux-ai" remote="stm" revision="6813080f1bb326793950c5a3ae02a3fd59a94f28"/>
  <project name="meta-st-x-linux-isp.git" path="dey5.0/sources/meta-st-x-linux-isp" remote="stm" revision="36d6caacc9978c7d78b8b68a3f958850d8614138"/>
```
通过上面的hash值限制，就可以不用担心dey5.0版本的限制，即使当前的dey5.0r4仍可以用，在内网stash的源码中，layer.conf都有这个isp支持，可以拉取推送到ecceegit，以供用户编译。
截止当前官方的dey-manifest仍是5.0r3: 
https://github.com/digi-embedded/dey-manifest/tree/7e394f852e7a09eefb329525aa6a14f00f9580be

除meta-digi用自己的外，其它相关分支均可参考上面这次提交。根据这些内容，制作一版deyaio的isp.xml，用于开发板镜像的编译。

  ## 整个meta-digi的替代



  ## meta-custom方式的替代
  注意，要限制meta-digi的版本，不能用5.0r4，所以在meta-custom中要限制兼容的版本
