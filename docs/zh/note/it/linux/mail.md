## 企业邮箱的设置策略

如果希望用posix和企业邮箱同时可用，在spf上可这样设置：

"v=spf1 ip4:1.2.3.4/23 ip4:198.1.2.0/24 include:spf.exmail.qq.com ~all"

注意查询自己的IP出口替换

## 测试

swaks \
  --to peyoot@hotmail.com \
  --from info@eccee.com \
  --server smtp.exmail.qq.com:587 \
  --tls \
  --auth-user info@eccee.com \
  --auth-password "vxxxxxxxxg"