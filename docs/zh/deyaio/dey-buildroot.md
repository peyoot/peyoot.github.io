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

DEY的发行版，每隔一段时间，就会release一个版本号的tag，在这个特定的release版本中，不仅各层对应的git版本是锁定的提交版本，其内部的配方中如果有从github拉取源码，相应的SRCREV也会锁定，这样的版本，只要编译或下载过，就可以本地编译，而不依赖网络。

下面我们以DEY5.0-r2.2为例，在官方的源码库中，它对应的tag就是5.0-r2.2，在dey-aio-manifest中，对应这个版本的是一个叫dey5.0-r2.2分支，

在创建deyaio项目时，我们可以检出这个分支，在联网状态下先编译出这个版本的镜像。然后再利用这个下载好的源，作本机或内网其它机器的编译时所需的镜像源，即可实现内部网或或离线编译。

```
repo sync
repo init -u https://github.com/peyoot/dey-aio-manifest.git -b dey5.0-r2.2 -m ccmp25plc.xml
```
如果当前有一个dey-aio项目，不想重新建立deyaio项目时，也可以这样操作（不推荐）
```
repo sync
cd .repo/manifests
git checkout dey5.0-r2.2
cd ../..
repo init -b dey5.0-r2.2 -m ccmp25plc.xml
```

## 联网状态下完成一次完整的编译
上面操作后，我们检出了dey5.0-r2.2的ccmp25plc.xml，这是一个各配方均有锁定版本的manifest仓库，我们需要在联网状态下完成一次编译，以便在编译过程中下载相应的源码，作为后续内网编译或本机编译时使用。这一步骤和正常的的DEY项目完全一样，比如：
```
cd dey5.0/workspace
mkdir -p myccmp25plc
cd myccmp25plc
source ../../mkproject.sh -p ccmp25-dvk
bitbake core-image-base
```

## 本机离线编译配置

在conf/local.conf中添加下面关键设置：
```
# 指定源码URL镜像，请替换为您的实际IP和端口和本机downloads目录
SOURCE_MIRROR_URL ?= "\
file://.* file:///home/rtu/deyaio-ccmp25plc/dey5.0/workspace/project_shared/downloads"

# 继承own-mirrors类以启用镜像设置
INHERIT += "own-mirrors"
# 只允许用本地缓存
BB_FETCH_PREMIRRORONLY = "1"
# 如果禁掉外网，仅本机编译，可以取消下面注释，确保完全离线构建
BB_NO_NETWORK = "1"
```

## 设置downloads和sstate-cache目录在内网共享
DEY AIO项目默认会把下载的构件和缓存放在workspace/project_shared的相应目录下，我们需要设置HTTP服务器共享，以便内网其它机器可以访问。
这实际上是要配置一个web服务器，并且可以访问文件系统目录，有很多实现方法，建议以nginx来搭建，不过如果寻求快速，也可以用python。
方法一：用python命令快速搭建web服务器：
以python为例，进入workspace/project_shared目录后，执行：
```
python3 -m http.server 8000
```
记下此服务器的IP和上面设置的端口，比如：192.168.1.100:8000

方法二：Nignx作为web服务器（推荐）

1、安装 Nginx
```
# Ubuntu/Debian
sudo apt-get update && sudo apt-get install nginx
```
2、配置Nginx
创建或编辑配置文件 /etc/nginx/sites-available/yocto-mirror：
```

server {
    listen 8000;
    server_name 10.10.8.129;

    # 设置web目录路径，注意所有父目录都要有755权限，以防止访问限制问题，请替换自己的路径
    root /home/rtu/deyaio-ccmp25plc/dey5.0/workspace/project_shared;
    # 启用自动索引，方便浏览文件
    autoindex on;
    autoindex_exact_size off;
    autoindex_localtime on;

    # 性能优化设置
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;

    # 文件下载相关设置
    location / {
        # 允许大文件下载
        client_max_body_size 0;
        # 允许跨目录访问（如果需要）
        disable_symlinks off;

        # 设置缓存时间
        location ~* \.(tar|gz|bz2|xz|zip|tgz|tbz2|txz)$ {
            expires 30d;
            add_header Cache-Control "public, immutable";
        }

        # 设置日志格式
        access_log /var/log/nginx/yocto-access.log;
        error_log /var/log/nginx/yocto-error.log;
    }


    # 设置正确的MIME类型
    include       mime.types;
    default_type  application/octet-stream;

}

```

### 配置内网其它机器

在内网中其他无法访问外网的开发机器上，您需要修改Yocto构建目录中的conf/local.conf配置文件，添加以下关键设置：

```

# 禁用网络访问
BB_NO_NETWORK = "1"

# 继承镜像功能
INHERIT += "own-mirrors"

# 设置源码镜像URL
SOURCE_MIRROR_URL = "http://10.10.8.129:8000/downloads"

# 设置SSTATE镜像
SSTATE_MIRRORS = "file://.* http://10.10.8.129:8000/sstate-cache/PATH"
# 注意：PATH 是字面量，不要改，Yocto 会自动替换为实际路径。

# 可选：确保优先从预镜像获取
BB_FETCH_PREMIRRORONLY = "1"

```
这样，你的内网其它机器也就可以实用这些下载好的源码进行内网编译。

