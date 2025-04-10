## 如何查询当前DEY AIO项目所用的manifest仓库
可以在deyaio项目中，用不同的manifest仓库来实现编译出不同的镜像。
要查询当前项目的dey-aio-manifest所用的分支或版本，可以用命令：
```
cd .repo/manifests
git remote show origin
```
上面的命令中输出后，在Local branch configured for 'git pull：'这行后面记录有当时repo init所用的分支，也就是当前的所用manifest的分支，比如这个输出：
```
$ git remote show origin
* remote origin
  Fetch URL: https://github.com/peyoot/dey-aio-manifest.git
  Push  URL: https://github.com/peyoot/dey-aio-manifest.git
  HEAD branch: main
  Remote branches:
    kirkstone tracked
    main      tracked
    scarthgap tracked
  Local branch configured for 'git pull':
    default merges with remote main

```
其中，default merges with remote main, 表示本地拉取远程库的main分支。

此外，还可以查看当初 repo init 使用的是哪个XML文件，用命令：
```
cat .repo/manifest.xml
```
得到的输出：
```
...
<manifest>
  <include name="ccmp25plc.xml" />
</manifest>
```
这个repo指定的是ccmp25plc.xml，所以结合起来，当初repo init初始化manifest仓库所用的命令就是：
```
repo init https://github.com/peyoot/dey-aio-manifest.git -b main -m ccmp25plc.xml
```
## 如何在不同的manifest仓库间切换
在了解了DEY AIO当前所用的manifest仓库之后，可以根据需要切换不同的分支或xml文件。通常，我们关注的是切换不同的xml文件来实现不同的镜像功能合集。
repo init 拉取的 manifest 仓库会被克隆到 .repo/manifests 中：
```
cd .repo/manifests
#先更新manifest仓库
git fetch origin
git checkout main  # 假设 manifest 文件在 main 分支，根据实际情况调整分支名
git pull
ls rtsp.xml #检查所需的xml
#使用 repo init 的 -m 参数重新初始化，比如指定 rtsp.xml
repo init -m rtsp.xml
如果 rtsp.xml 不在默认分支的根目录，你需要确保分支和路径正确，用-b指定分支
repo init -b some-branch -m rtsp.xml
repo sync
```