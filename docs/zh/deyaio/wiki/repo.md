## 根据处理器来使用
```
repo sync -j $(nproc)
```
## 在同一个repo的项目中检出不同的xml

```
比如之前已经是检出deyaio，切换不同的xml，重新repo init, 如果相同分支，可省-b
repo init -b scarthgap -m rt-nodemo.xml
cat .repo/manifest.xml
repo sync
如果要检测查内网下合并 manifest的override是否生效
ls .repo/manifests/local_manifests/
repo manifest -r | grep -A3 "meta-arm"

```