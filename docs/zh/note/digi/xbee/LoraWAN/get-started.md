## 申请测试帐号
可手动通过套件扫码创建，或是通过销售申请，这个帐号用于登陆XON平台https://us1.haxiot.com/，以便添加网关或模块。

## 扫码添加网关和模块
笔记本电脑有些会禁用网页调用摄像头，所以最方便的还是手机，无需安装，打开https://scan-us1.haxiot.com/

先扫码添加网关，注意首次添加成功后，网关需要下载软件，大约有十几分钟时间，请保持连网状态以便完成，然后在上面XON平台就可以看到网关了，其中Name这一项是网关的序列号。

网关添加好后，再扫码添加XBee LR模块，模块的EUI和XBee Studio看到的一样，Description则对应是模块标签上的系列号。

扫码添加中碰到的任何连接问题的提示，都可以忽略，因为这只是授权相互关联，真正的连接还需要终端发起，一般由程序实现，在开发板上可以用AT命令来建立连接。

## 使用XBee Studio和XBee开发板测试

文档：https://docs.digi.com//resources/documentation/digidocs/90002591/

打开XBee Studio，添加后先升级一下XBee LR模块固件，确保最新版本。

