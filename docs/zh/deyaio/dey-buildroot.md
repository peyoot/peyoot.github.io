# 离线编译DEY项目

DEY项目的编译并不总是需要联网。Yocto项目的编译受益于开源项目，通常也建议保持更新以使用最新的上游源码，这对于获取一些较新的软件包或驱动来说至关重要。不过对于工业项目来说，稳定可靠，可重复编译出原始的镜像，这也很重要。本章节我们将讨论如何锁定DEYAIO编译出来的项目版本，并支持离线编译，以便在内网环境中持续开发项目。

## 锁定DEY项目中manifest仓库指定的各软件库的git版本

DEY AIO的manifest仓库定义了上游软件库的git版本，在DEY项目根目录我们可以通过
```
cat .repo/manifest.xml
```
来查看当初新建项目时使用的manifest仓库的xml文件，比如下面这个输出：
```
$ cat .repo/manifest.xml
<?xml version="1.0" encoding="UTF-8"?>
...
<manifest>
  <include name="ccmp25plc.xml" />
</manifest>
```
表明当前的manifest仓库是ccmp25plc.xml。而打开.repo/manifests/ccmp25plc.xml，就可以看到各个project拉取的git分支。
以meta-custom为例，
```
 <project name="meta-custom.git" path="dey5.0/sources/meta-custom" remote="peyoot" revision="scarthgap-ccmp25plc"/>
```
注意这里的revision，这是一个分支名称，而非具体的某次提交，也就是它总是拉取最新的版本，如果上游发生变化，重新repo sync后，编译出来的版本也会相应有所变化。为了离线编译，我们首先需要锁定版本。

使用下面命令生成一个新的manifest文件，并用提交的hash值作为revision版本，然后切换到这个manifest仓库：
```
repo manifest -o .repo/manifests/my_frozen_ccmp25plc.xml -r --suppress-upstream-revision --suppress-dest-branch
repo init -b scarthgap -m my_frozen_ccmp25plc.xml
```

## 设置downloads目录在内网共享
DEY AIO项目默认会把下载的构件放在workspace/project_shared/downloads下，我们需要设置HTTP服务器共享，以便内网其它机器可以访问。
以python为例，进入downloads目录后，执行：
```
python3 -m http.server 8000
```
记下此服务器的IP和上面设置的端口，比如：192.168.1.100:8000

### 配置本机或内网机器

在内网中其他无法访问外网的开发机器上，您需要修改Yocto构建目录中的conf/local.conf配置文件，添加以下关键设置：

```
# 指定源码镜像的URL，请替换为您的实际IP和端口
SOURCE_MIRROR_URL = "http://192.168.1.100:8000/"
# 本机也可使用SOURCE_MIRROR_URL = file://path_to_your_downloads
# 继承own-mirrors类以启用镜像设置
INHERIT += "own-mirrors"
# 强制禁止网络访问，确保完全离线构建
BB_NO_NETWORK = "1"
```

这样，你的内网其它机器也就可以实用这些下载好的源码进行内网编译。

