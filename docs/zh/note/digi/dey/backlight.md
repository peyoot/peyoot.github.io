#### 自动熄屏的正确实现方式
这是一个典型的系统电源管理场景
##### 方案 1：systemd-logind（推荐，最简单）
```
# 编辑 /etc/systemd/logind.conf
[Login]
# 空闲 5 分钟后降低亮度（省电但不熄屏）
IdleAction=ignore
IdleActionSec=5min

# 或者配合背光服务
```
更好的做法：创建背光管理服务

##### 方案 2：自定义空闲检测脚本
创建 /usr/local/bin/backlight-idle.sh：
```
#!/bin/bash

BACKLIGHT_DEVICE="/sys/class/backlight/panel-lvds-pwm-backlight"
IDLE_TIME_LIMIT=300000  # 5 分钟（毫秒）
DIM_BRIGHTNESS=10       # 低亮度值（索引）
OFF_BRIGHTNESS=0        # 关闭

# 获取当前空闲时间（需要安装 xprintidle 或类似工具）
get_idle_time() {
    xprintidle  # 返回毫秒
}

# 设置亮度
set_brightness() {
    echo "$1" > "$BACKLIGHT_DEVICE/brightness"
}

# 保存原始亮度
save_brightness() {
    cat "$BACKLIGHT_DEVICE/brightness" > /tmp/backlight_saved
}

# 恢复亮度
restore_brightness() {
    if [ -f /tmp/backlight_saved ]; then
        cat /tmp/backlight_saved > "$BACKLIGHT_DEVICE/brightness"
    fi
}

# 主循环
while true; do
    IDLE=$(get_idle_time)
    
    if [ "$IDLE" -gt "$IDLE_TIME_LIMIT" ]; then
        # 用户空闲超时
        CURRENT=$(cat "$BACKLIGHT_DEVICE/brightness")
        
        if [ "$CURRENT" -ne "$OFF_BRIGHTNESS" ]; then
            # 第一次超时：先降低亮度（警告）
            save_brightness
            set_brightness "$DIM_BRIGHTNESS"
            sleep 10
            
            # 检查是否仍然空闲
            if [ "$(get_idle_time)" -gt "$IDLE_TIME_LIMIT" ]; then
                # 仍然空闲：完全关闭（EN 脚会自动拉低）
                set_brightness "$OFF_BRIGHTNESS"
            fi
        fi
    else
        # 用户活动，恢复亮度
        if [ -f /tmp/backlight_saved ]; then
            restore_brightness
            rm /tmp/backlight_saved
        fi
    fi
    
    sleep 1
done

```
##### 方案 3：内核级空闲检测（更底层）
使用 input 子系统的 evtest 检测触摸/按键事件：
```
#!/bin/bash

DEVICE="/dev/input/event0"  # 触摸屏设备
BACKLIGHT="/sys/class/backlight/panel-lvds-pwm-backlight"
TIMEOUT=300  # 秒

last_activity=$(date +%s)

# 后台监控输入事件
monitor_input() {
    evtest "$DEVICE" | while read line; do
        last_activity=$(date +%s)
        # 恢复背光
        echo 138 > "$BACKLIGHT/brightness"
    done
}

monitor_input &

# 主循环检查超时
while true; do
    now=$(date +%s)
    idle=$((now - last_activity))
    
    if [ "$idle" -gt "$TIMEOUT" ]; then
        # 超时关闭背光（EN 脚拉低）
        echo 0 > "$BACKLIGHT/brightness"
    fi
    
    sleep 1
done

```

#### 系统级集成建议
创建 /etc/systemd/system/backlight-idle.service

```
[Unit]
Description=Backlight idle dimming service
After=graphical.target

[Service]
Type=simple
ExecStart=/usr/local/bin/backlight-idle.sh
Restart=always

[Install]
WantedBy=multi-user.target
```
systemctl enable backlight-idle
systemctl start backlight-idle

#### 与图形界面集成（如 Qt/EFL）
```
// Qt 示例：检测用户活动
QTimer *idleTimer = new QTimer(this);
idleTimer->setInterval(300000); // 5 分钟
connect(idleTimer, &QTimer::timeout, this, [](){
    // 设置背光为 0（触发 EN 脚关闭）
    QProcess::execute("echo 0 > /sys/class/backlight/panel-lvds-pwm-backlight/brightness");
});
idleTimer->start();

// 检测鼠标/键盘事件重置计时器
void MainWindow::mousePressEvent(QMouseEvent *event) {
    idleTimer->stop();
    idleTimer->start();
    // 恢复背光...
}
```
