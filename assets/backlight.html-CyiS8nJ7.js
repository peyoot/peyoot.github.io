import{_ as i,o as e,c as n,b as s}from"./app-C-PasaP0.js";const l={},d=s(`<h4 id="自动熄屏的正确实现方式" tabindex="-1"><a class="header-anchor" href="#自动熄屏的正确实现方式"><span>自动熄屏的正确实现方式</span></a></h4><p>这是一个典型的系统电源管理场景</p><h5 id="方案-1-systemd-logind-推荐-最简单" tabindex="-1"><a class="header-anchor" href="#方案-1-systemd-logind-推荐-最简单"><span>方案 1：systemd-logind（推荐，最简单）</span></a></h5><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 编辑 /etc/systemd/logind.conf
[Login]
# 空闲 5 分钟后降低亮度（省电但不熄屏）
IdleAction=ignore
IdleActionSec=5min

# 或者配合背光服务
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>更好的做法：创建背光管理服务</p><h5 id="方案-2-自定义空闲检测脚本" tabindex="-1"><a class="header-anchor" href="#方案-2-自定义空闲检测脚本"><span>方案 2：自定义空闲检测脚本</span></a></h5><p>创建 /usr/local/bin/backlight-idle.sh：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>#!/bin/bash

BACKLIGHT_DEVICE=&quot;/sys/class/backlight/panel-lvds-pwm-backlight&quot;
IDLE_TIME_LIMIT=300000  # 5 分钟（毫秒）
DIM_BRIGHTNESS=10       # 低亮度值（索引）
OFF_BRIGHTNESS=0        # 关闭

# 获取当前空闲时间（需要安装 xprintidle 或类似工具）
get_idle_time() {
    xprintidle  # 返回毫秒
}

# 设置亮度
set_brightness() {
    echo &quot;$1&quot; &gt; &quot;$BACKLIGHT_DEVICE/brightness&quot;
}

# 保存原始亮度
save_brightness() {
    cat &quot;$BACKLIGHT_DEVICE/brightness&quot; &gt; /tmp/backlight_saved
}

# 恢复亮度
restore_brightness() {
    if [ -f /tmp/backlight_saved ]; then
        cat /tmp/backlight_saved &gt; &quot;$BACKLIGHT_DEVICE/brightness&quot;
    fi
}

# 主循环
while true; do
    IDLE=$(get_idle_time)
    
    if [ &quot;$IDLE&quot; -gt &quot;$IDLE_TIME_LIMIT&quot; ]; then
        # 用户空闲超时
        CURRENT=$(cat &quot;$BACKLIGHT_DEVICE/brightness&quot;)
        
        if [ &quot;$CURRENT&quot; -ne &quot;$OFF_BRIGHTNESS&quot; ]; then
            # 第一次超时：先降低亮度（警告）
            save_brightness
            set_brightness &quot;$DIM_BRIGHTNESS&quot;
            sleep 10
            
            # 检查是否仍然空闲
            if [ &quot;$(get_idle_time)&quot; -gt &quot;$IDLE_TIME_LIMIT&quot; ]; then
                # 仍然空闲：完全关闭（EN 脚会自动拉低）
                set_brightness &quot;$OFF_BRIGHTNESS&quot;
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

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="方案-3-内核级空闲检测-更底层" tabindex="-1"><a class="header-anchor" href="#方案-3-内核级空闲检测-更底层"><span>方案 3：内核级空闲检测（更底层）</span></a></h5><p>使用 input 子系统的 evtest 检测触摸/按键事件：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>#!/bin/bash

DEVICE=&quot;/dev/input/event0&quot;  # 触摸屏设备
BACKLIGHT=&quot;/sys/class/backlight/panel-lvds-pwm-backlight&quot;
TIMEOUT=300  # 秒

last_activity=$(date +%s)

# 后台监控输入事件
monitor_input() {
    evtest &quot;$DEVICE&quot; | while read line; do
        last_activity=$(date +%s)
        # 恢复背光
        echo 138 &gt; &quot;$BACKLIGHT/brightness&quot;
    done
}

monitor_input &amp;

# 主循环检查超时
while true; do
    now=$(date +%s)
    idle=$((now - last_activity))
    
    if [ &quot;$idle&quot; -gt &quot;$TIMEOUT&quot; ]; then
        # 超时关闭背光（EN 脚拉低）
        echo 0 &gt; &quot;$BACKLIGHT/brightness&quot;
    fi
    
    sleep 1
done

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="系统级集成建议" tabindex="-1"><a class="header-anchor" href="#系统级集成建议"><span>系统级集成建议</span></a></h4><p>创建 /etc/systemd/system/backlight-idle.service</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>[Unit]
Description=Backlight idle dimming service
After=graphical.target

[Service]
Type=simple
ExecStart=/usr/local/bin/backlight-idle.sh
Restart=always

[Install]
WantedBy=multi-user.target
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>systemctl enable backlight-idle systemctl start backlight-idle</p><h4 id="与图形界面集成-如-qt-efl" tabindex="-1"><a class="header-anchor" href="#与图形界面集成-如-qt-efl"><span>与图形界面集成（如 Qt/EFL）</span></a></h4><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>// Qt 示例：检测用户活动
QTimer *idleTimer = new QTimer(this);
idleTimer-&gt;setInterval(300000); // 5 分钟
connect(idleTimer, &amp;QTimer::timeout, this, [](){
    // 设置背光为 0（触发 EN 脚关闭）
    QProcess::execute(&quot;echo 0 &gt; /sys/class/backlight/panel-lvds-pwm-backlight/brightness&quot;);
});
idleTimer-&gt;start();

// 检测鼠标/键盘事件重置计时器
void MainWindow::mousePressEvent(QMouseEvent *event) {
    idleTimer-&gt;stop();
    idleTimer-&gt;start();
    // 恢复背光...
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,17),t=[d];function a(v,r){return e(),n("div",null,t)}const u=i(l,[["render",a],["__file","backlight.html.vue"]]),m=JSON.parse('{"path":"/zh/note/digi/dey/backlight.html","title":"","lang":"zh-CN","frontmatter":{"description":"自动熄屏的正确实现方式 这是一个典型的系统电源管理场景 方案 1：systemd-logind（推荐，最简单） 更好的做法：创建背光管理服务 方案 2：自定义空闲检测脚本 创建 /usr/local/bin/backlight-idle.sh： 方案 3：内核级空闲检测（更底层） 使用 input 子系统的 evtest 检测触摸/按键事件： 系统级集...","head":[["meta",{"property":"og:url","content":"https://peyoot.github.io/zh/note/digi/dey/backlight.html"}],["meta",{"property":"og:description","content":"自动熄屏的正确实现方式 这是一个典型的系统电源管理场景 方案 1：systemd-logind（推荐，最简单） 更好的做法：创建背光管理服务 方案 2：自定义空闲检测脚本 创建 /usr/local/bin/backlight-idle.sh： 方案 3：内核级空闲检测（更底层） 使用 input 子系统的 evtest 检测触摸/按键事件： 系统级集..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[],"git":{},"autoDesc":true,"filePathRelative":"zh/note/digi/dey/backlight.md"}');export{u as comp,m as data};
