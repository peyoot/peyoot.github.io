import{_ as e,o as i,c as n,b as s}from"./app-C-PasaP0.js";const l={},t=s(`<h2 id="企业邮箱的设置策略和内网发信问题" tabindex="-1"><a class="header-anchor" href="#企业邮箱的设置策略和内网发信问题"><span>企业邮箱的设置策略和内网发信问题</span></a></h2><p>如果希望用posix和企业邮箱同时可用，在spf上可这样设置：</p><p>&quot;v=spf1 ip4:1.2.3.4/23 ip4:198.1.2.0/24 include:spf.exmail.qq.com ~all&quot;</p><p>注意查询自己的IP出口替换</p><h2 id="测试" tabindex="-1"><a class="header-anchor" href="#测试"><span>测试</span></a></h2><p>swaks <br> --to peyoot@hotmail.com <br> --from info@eccee.com <br> --server smtp.exmail.qq.com:587 <br> --tls <br> --auth-user info@eccee.com <br> --auth-password &quot;vxxxxxxxxg&quot;</p><p>官方文档是用ssl 465端口</p><h2 id="在公司内网配置使用企业邮箱" tabindex="-1"><a class="header-anchor" href="#在公司内网配置使用企业邮箱"><span>在公司内网配置使用企业邮箱</span></a></h2><p>容器使用腾讯企业邮箱，但一直无法发信，因为企业邮箱需要开启TLS/SSL加密，465端口，最后通过下面这个手段找到原因：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>openssl s_client -connect smtp.exmail.qq.com:465 \\
  -CApath /etc/ssl/certs \\
  -showcerts &lt;/dev/null
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>部分响应：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>SSL handshake has read 3322 bytes and written 400 bytes
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>拦截是善意的（公司运维），公司/IDC 的透明代理防火墙：位于你的宿主机之外，强制解密所有 TLS 流量。</p><p>解决办法：</p><p>首先，容器是需要有ca-certificats包以便发送TLS邮件，dnmp中如果没有要加上，</p><p>其次，保存公司的根证书，我们可以在宿主机上操作，然后映射到窗口中（只读挂载）</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>cat &gt; /etc/ssl/certs/company_root.pem &lt;&lt; &#39;EOF&#39;
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
sudo ln -sf company_root.pem \`openssl x509 -hash -noout -in company_root.pem\`.0
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>services:
  php56:
    volumes:
      - /etc/ssl/certs:/etc/ssl/certs:ro  # 只读映射

  php74:
    volumes:
      - /etc/ssl/certs:/etc/ssl/certs:ro

  php81:
    volumes:
      - /etc/ssl/certs:/etc/ssl/certs:ro
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在php.ini也指定公司证书</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>[openssl]
; 强制指定 CA 文件（直接指向你那个能用的公司证书）
openssl.cafile = /etc/ssl/certs/company_root.pem
; 或者指定 CA 目录，让它自己去搜（推荐，兼容性更好）
openssl.capath = /etc/ssl/certs
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>msmtp命令行测试：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>cat &gt; ~/.msmtprc &lt;&lt; &#39;EOF&#39;
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

echo &quot;Test from msmtp after company root ca&quot; | msmtp -v me@hotmail.com

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="keycloak和gitea" tabindex="-1"><a class="header-anchor" href="#keycloak和gitea"><span>keycloak和gitea</span></a></h2><p>用同样的方式添加只读挂载，不过keycloak是java程序，它不直接扫描文件系统里的 .pem文件，而是依赖一个专用的数据库文件（Keystore/Truststore），通常是 cacerts或 .jks文件。 必须用 keytool这个专门的工具，把证书“登记/导入”到这个数据库里，Java 运行时才会认。仅仅把证书文件放在磁盘上，Java 是看不见的。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>    volumes:
      - /etc/ssl/certs/company_root.pem:/tmp/company_root.pem:ro # 挂载证书
    user: root
    entrypoint: [&quot;/bin/bash&quot;, &quot;-c&quot;]
    command:
      - |
        keytool -import -alias company_root \\
          -keystore /etc/pki/ca-trust/extracted/java/cacerts \\
          -file /tmp/company_root.pem \\
          -storepass changeit -noprompt
        exec /opt/keycloak/bin/kc.sh start-dev
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但是rootless没法导入证书，所以得用rootful的方式运行服务和容器，上面加了user:root, 但如果portainer本身是rootless，可能还是无法拉起，先到宿主机用rootful来启动portainer, 不过实测发现，只要用user:root就可以了，不需要实施下面的情况</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>podman-compose down

# 用 Root 强制拉起（绕过 Portainer）  不需要，因为yaml文件里还用了rootless的socket，虽然关系不大，即使需要也只要运行一次把证书装上，但实测已经显示 不需要用rootful的portainer了
sudo podman-compose up -d

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,28),a=[t];function d(r,c){return i(),n("div",null,a)}const v=e(l,[["render",d],["__file","mail.html.vue"]]),m=JSON.parse('{"path":"/zh/note/it/linux/mail.html","title":"","lang":"zh-CN","frontmatter":{"description":"企业邮箱的设置策略和内网发信问题 如果希望用posix和企业邮箱同时可用，在spf上可这样设置： \\"v=spf1 ip4:1.2.3.4/23 ip4:198.1.2.0/24 include:spf.exmail.qq.com ~all\\" 注意查询自己的IP出口替换 测试 swaks --to peyoot@hotmail.com --from in...","head":[["meta",{"property":"og:url","content":"https://peyoot.github.io/zh/note/it/linux/mail.html"}],["meta",{"property":"og:description","content":"企业邮箱的设置策略和内网发信问题 如果希望用posix和企业邮箱同时可用，在spf上可这样设置： \\"v=spf1 ip4:1.2.3.4/23 ip4:198.1.2.0/24 include:spf.exmail.qq.com ~all\\" 注意查询自己的IP出口替换 测试 swaks --to peyoot@hotmail.com --from in..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[{"level":2,"title":"企业邮箱的设置策略和内网发信问题","slug":"企业邮箱的设置策略和内网发信问题","link":"#企业邮箱的设置策略和内网发信问题","children":[]},{"level":2,"title":"测试","slug":"测试","link":"#测试","children":[]},{"level":2,"title":"在公司内网配置使用企业邮箱","slug":"在公司内网配置使用企业邮箱","link":"#在公司内网配置使用企业邮箱","children":[]},{"level":2,"title":"keycloak和gitea","slug":"keycloak和gitea","link":"#keycloak和gitea","children":[]}],"git":{},"autoDesc":true,"filePathRelative":"zh/note/it/linux/mail.md"}');export{v as comp,m as data};
