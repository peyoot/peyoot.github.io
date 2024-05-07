# 简介

DEY All In One（deyaio）是Digi嵌入式产品（核心板，单板机）的系统开发工具集。它是一个工具集，可帮助用户快速设置Yocto系统开发环境，并方便用户定制和定制固件和设备树。

## 特点

功能包括：

- DEY 系统开发 docker-compose 工具。支持单个文件夹中的所有 DEY 版本（从 DEY 3.2 开始）。
- docker-compose 和原生开发方式共享相同的工作空间和工具。
- meta-custom示例，用于构建在 rootfs 固件映像中包含应用程序4，配置文件或驱动等。
- 在项目之间共享downloads和 sstate-cache 以节省磁盘空间
- 客户的源码库和Digi源码库版本管理可在共同构建时分开维护。
- 快速复制必要的映像以释放文件夹并打包安装程序 zip 文件。
- 还可以选择发布到本地 TFTP 服务器文件夹或 scp 到远程服务器进行共享。

## 它是如何工作的
Deyaio 由三个部分组成：dey-aio、meta-custom 和 dey-aio-manifest。它包含 DEY 官方meta-digi层和自定义的meta-custom层。它还包含特定的层，如其分支中的 ros。
它包含开箱即用的脚本，用于启用对这些layer的支持。它还有一个发布脚本，用于将编译后的输出复制到发布目录或 FTP/NFS 路径，并将其打包到 SD 卡安装程序中。

Deyaio将Docker开发方法和原生开发方法集成到一个工具集中。您可以在同一台主机中同时运行不同的 DEY 版本。
用户可以使用meta-custom作为模板来定制自己的 rootfs 镜像。

dey-aio-manifest使用repo方式，集成 dey-aio 和 DEY 的官方系统开发工具，形成一个完整的工具集。用户可以选择共享相同发布工具的 docker-compose 或官方原生开发方法。


