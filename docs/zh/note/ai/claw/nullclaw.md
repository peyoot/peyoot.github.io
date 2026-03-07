# 安装
```
wget https://github.com/nullclaw/nullclaw/releases/download/v2026.3.7/nullclaw-linux-x86_64.bin -O nullclaw
```
# 启动

```
chmod +x nullclaw
./nullclaw status
```

# 初始化
```
nullclaw onboard --interactive
```
这会自动在/home/robin/.nullclaw/workspace创建工作区，
默认配置文件是 ~/.nullclaw/config.json

# 安装大模型
再使用
model: "local-llama-3b"