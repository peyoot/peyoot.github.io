# vscode配置免费登陆
1. windows下，以管理员身份打开powershell，执行
```
ssh-keygen -t ed25519
```
2. 手动复制公钥内容（C:\Users\rtu\.ssh\ed25519.pub）并粘贴到远程服务器的 ~/.ssh/authorized_keys 文件中

3. 在 C:\Users\rtu\.ssh\config 文件中为你的远程服务器添加配置，指定使用哪个私钥文件。示例：

Host my_remote_server
    HostName remote_host_ip_or_domain
    User your_username
    IdentityFile ~/.ssh/id_25519
    # 如果默认端口不是22，可添加 Port 2222