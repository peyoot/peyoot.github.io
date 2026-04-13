## 企业邮箱的设置策略和内网发信问题

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

官方文档是用ssl 465端口

## 在公司内网配置使用企业邮箱
容器使用腾讯企业邮箱，但一直无法发信，因为企业邮箱需要开启TLS/SSL加密，465端口，最后通过下面这个手段找到原因：
```
openssl s_client -connect smtp.exmail.qq.com:465 \
  -CApath /etc/ssl/certs \
  -showcerts </dev/null
```
部分响应：
```
SSL handshake has read 3322 bytes and written 400 bytes
Verification error: self-signed certificate in certificate chain
---
New, TLSv1.3, Cipher is TLS_AES_256_GCM_SHA384
Server public key is 2048 bit
Secure Renegotiation IS NOT supported
Compression: NONE
Expansion: NONE
No ALPN negotiated
Early data was not sent
Verify return code: 19 (self-signed certificate in certificate chain)
---
DONE
```

拦截是善意的（公司运维），公司/IDC 的透明代理防火墙：位于你的宿主机之外，强制解密所有 TLS 流量。

解决办法：

首先，容器是需要有ca-certificats包以便发送TLS邮件，dnmp中如果没有要加上，

其次，保存公司的根证书，我们可以在宿主机上操作，然后映射到窗口中（只读挂载）

```
cat > /etc/ssl/certs/company_root.pem << 'EOF'
-----BEGIN CERTIFICATE-----
MIIC7jCCAdagAwIBAgIFANeM8i4wDQYJKoZIhvcNAQELBQAwKTEnMCUGA1UEAxMe
...内容换成上面响应的root那个证书内容
-----END CERTIFICATE-----
EOF

cd /etc/ssl/certs
# 生成链接名（会输出一串哈希）
openssl x509 -hash -noout -in company_root.pem
# 假设输出 abcdefg，则执行：
ln -s company_root.pem abcdefg.0

上面软链接也可一步到位：
sudo ln -sf company_root.pem `openssl x509 -hash -noout -in company_root.pem`.0
```
然后
```
services:
  php56:
    volumes:
      - /etc/ssl/certs:/etc/ssl/certs:ro  # 只读映射

  php74:
    volumes:
      - /etc/ssl/certs:/etc/ssl/certs:ro

  php81:
    volumes:
      - /etc/ssl/certs:/etc/ssl/certs:ro
```

在php.ini也指定公司证书

```
[openssl]
; 强制指定 CA 文件（直接指向你那个能用的公司证书）
openssl.cafile = /etc/ssl/certs/company_root.pem
; 或者指定 CA 目录，让它自己去搜（推荐，兼容性更好）
openssl.capath = /etc/ssl/certs
```

msmtp命令行测试：

```
cat > ~/.msmtprc << 'EOF'
account default
host smtp.exmail.qq.com
port 465
from noreply@my.com
user noreply@my.com
password ov...gx
tls on
tls_starttls off
tls_trust_file /etc/ssl/certs/company_root.pem
auth on
EOF


测试发送

echo "Test from msmtp after company root ca" | msmtp -v me@hotmail.com

```

## keycloak和gitea

用同样的方式添加只读挂载

```
services:
  keycloak:
    volumes:
      - /etc/ssl/certs:/etc/ssl/certs:ro  # 关键：系统级映射
  gitea:
    volumes:
      - /etc/ssl/certs:/etc/ssl/certs:ro  # 关键：系统级映射

```