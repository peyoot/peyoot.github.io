# 离线编译DEY项目

DEY项目的编译并不总是需要联网。Yocto项目的编译受益于开源项目，通常也建议保持更新以使用最新的上游源码，这对于获取一些较新的软件包或驱动来说至关重要。不过对于工业项目来说，稳定可靠，可重复编译出原始的镜像，这也很重要。本章节我们将讨论如何锁定DEYAIO编译出来的项目版本，并支持离线编译，以便在内网环境中持续开发项目。

## 锁定DEY项目中manifest仓库指定的各软件库的git版本
首先检查编译所使用的软件仓库，DEY项目通过repo管理整个项目用到的软件包。DEY AIO的manifest仓库定义了上游软件库的git版本，在DEY项目根目录我们可以通过
```
cat .repo/manifest.xml
```
来查看当初新建项目时使用的manifest仓库的xml文件，比如下面这个输出：
```
$ cat .repo/manifest.xml
<?xml version="1.0" encoding="UTF-8"?>
...
<manifest>
  <include name="isp.xml" />
</manifest>
```
表明当前的manifest仓库是isp.xml。结合下面
```
$ cd .repo/manifests
$ git remote show origin
* remote origin
  Fetch URL: https://github.com/peyoot/dey-aio-manifest.git
  Push  URL: https://github.com/peyoot/dey-aio-manifest.git
  HEAD branch: main
  Remote branches:
    dey5.0-r2.2 tracked
    kirkstone   tracked
    main        tracked
    scarthgap   tracked
  Local branch configured for 'git pull':
    default merges with remote refs/tags/dey5.0-r3
```
它表明当初用的是初始化项目用的是：
```
repo init -u https://github.com/peyoot/dey-aio-manifest.git -b refs/tags/dey5.0-r3 -m isp.xml
```

而打开.repo/manifests/isp.xml，就可以看到各个project拉取的git分支。其中revision是某个提交的hash值的，表明是锁定版本，而如果是像scarthgap之类的yocto版本号，则表明这个项目的版本取决于上游对应该版本号的最新提交。为了确保离线编译，我们可以先创建一个锁定版本my_fronzon_isp.xml，并切换到这个manifest仓库： 

```
repo manifest -o .repo/manifests/my_frozen_isp.xml -r --suppress-upstream-revision --suppress-dest-branch
repo init -m my_frozen_isp.xml
```

## 联网状态下完成一次完整的编译
上面操作后，我们检出了锁定版本的isp.xml，这是一个各层配方均有锁定版本的manifest仓库，我们需要在联网状态下完成一次编译，以便在编译过程中下载相应的源码，作为后续内网编译或本机编译时使用。这一步骤和正常的的DEY项目完全一样，不过为了方便后续内部机器通过内网编译，需要在创建好项目后，修改conf/local.conf，在最后处添加一句：BB_GENERATE_MIRROR_TARBALLS = "1"
完整过程
```
cd dey5.0/workspace
mkdir -p ccmp25-softlink
cd ccmp25-softlink
source ../../mkproject.sh -p ccmp25-dvk
nano conf/local.conf  
请添加上面所说的那句配置，以便生成镜像所需的tar包，再编译：
bitbake dey-image-lvgl
```
注，如果因网络问题始终无法完成一次完整编译时，检查每次报错时所用的配方，先
```
bitbake -c cleansstate 出错配方名
bitbake dey-image-lvgl
```
直到最终编译完成，上面编译镜像也可用bitbake -k dey-image-lvgl以加快速度。
如果确实无法编译完成，请向Digi官方索取相关的编译环境压缩包

## 本机离线编译配置

在conf/local.conf中添加下面关键设置：
```
# 指定源码URL镜像，请替换为您的实际IP和端口和本机downloads目录
SOURCE_MIRROR_URL ?= "\
file://.* file:///home/rtu/deyaio-isp/dey5.0/workspace/project_shared/downloads"

# 继承own-mirrors类以启用镜像设置
INHERIT += "own-mirrors"
# 只允许用本地缓存
BB_FETCH_PREMIRRORONLY = "1"
# 禁掉网络，仅本机编译，确保完全离线构建
BB_NO_NETWORK = "1"
```

## 内网编译

内网编译是指不访问公网github，仅使用内部局域网实现多台机器编译DEY项目。如果仅是本机单机离线编译，参考上面的内容就足够了。如果需要实现内网任意机器共用这个源码来编译或开发，请继续配置。

### 设置downloads和sstate-cache目录在内网共享
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
sudo apt update && sudo apt install nginx
#安装智能http的必要组件

```
2、配置Nginx
创建或编辑配置文件 /etc/nginx/sites-available/yocto-mirror：
```

server {
    listen 8000;
    server_name 192.168.1.100;

    # 设置web目录路径，注意所有父目录都要有755权限，以防止访问限制问题，请替换自己的路径
    root /home/rtu/deyaio-isp/dey5.0/workspace/project_shared;
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

### 打包downloads目录下的git裸仓库
默认地，yocto会去查找指定格式的压缩包，并通过http协议来下载。但有些源码仍以裸仓库的形式存放在downloadds/git2目录下，我们需要把这部分git裸仓库也一并以正确的方法打包，以方便用web的方式在内网访问到。
```
# 进入 downloads 目录
cd ~/deyaio-isp/dey5.0/workspace/project_shared/downloads

# 为所有 Git 仓库创建 tar 包
for item in git2/*; do
    if [[ -d "$item" && "$item" != *.done ]]; then
        base_name=$(basename "$item")
        echo "打包 Git 裸仓库: $base_name"
        tar -czf "git2_${base_name}.tar.gz" -C git2 "$base_name"
    fi
done

# 检查创建的文件
ls -la git2_*.tar.gz | head -5

```

### 配置内网其它机器

在内网中其他无法访问外网的开发机器上，您需要修改Yocto构建目录中的conf/local.conf配置文件，添加以下关键设置：

```
# 只从内网预镜像获取，不访问外网
BB_FETCH_PREMIRRORONLY = "1"

INHERIT += "own-mirrors"

SOURCE_MIRROR_URL = "http://192.168.1.100:8000/downloads"

PREMIRRORS = " \
    git://.*/.*     http://192.168.1.100:8000/downloads/ \n \
    gitsm://.*/.*   http://192.168.1.100:8000/downloads/ \n \
    http://.*/.*    http://192.168.1.100:8000/downloads/ \n \
    https://.*/.*   http://192.168.1.100:8000/downloads/ \n \
"

SSTATE_MIRRORS = " \
    file://.* http://192.168.1.100:8000/sstate-cache/PATH \
"

# 注意：PATH 是字面量，不要改，Yocto 会自动替换为实际路径

```
这样，你的内网其它机器也就可以实用这些下载好的源码进行内网编译。

