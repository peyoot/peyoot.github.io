import{_ as l,r as s,o as d,c as a,a as t,d as e,e as r,b as i}from"./app-BHelgGZi.js";const o={},u=i(`<h2 id="使用vscode开发flutter跨平台应用" tabindex="-1"><a class="header-anchor" href="#使用vscode开发flutter跨平台应用"><span>使用vscode开发flutter跨平台应用</span></a></h2><h3 id="安装插件和flutter-sdk" tabindex="-1"><a class="header-anchor" href="#安装插件和flutter-sdk"><span>安装插件和Flutter SDK</span></a></h3><p>创建项目前检查和安装必备插件：Flutter 与 Dart。VS Code 本身不具备 Dart/Flutter 的任何支持能力，所有语言服务、调试器、热重载、设备识别都依赖于这两个插件。 安装顺序：</p><ul><li>先安装 Dart 插件（发布者：Dart-Code），等右下角状态栏显示 “Dart” 语言模式后再继续</li><li>再安装 Flutter 插件（同一发布者），它会自动拉取 Dart 依赖但不会覆盖已有 Dart 设置</li><li>关闭所有 VSCode 窗口（macOS 用 Cmd+Q，Windows 右键任务栏图标退出），彻底杀进程，再重新打开</li><li>打开任意 .dart 文件，确认右下角显示设备名（如 Chrome 或 iPhone 15）而非 “Plain Text”</li></ul><p>VS Code 的 Flutter 插件默认在本地（Windows）寻找 SDK，而不是在你远程连接的服务器上。所以，你不需要先打开远程目录再创建项目，但必须在Linux服务器上安装好 Flutter SDK，并告诉 VS Code 去哪里找到它。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>sudo apt install -y curl git unzip xz-utils zip libglu1-mesa
cd ~

1. 获取最新稳定版的版本号
FLUTTER_VERSION=$(curl -s https://storage.googleapis.com/flutter_infra_release/releases/releases_linux.json | jq -r &#39;.current_release.stable as $stable | .releases[] | select(.hash == $stable) | .version&#39;)

2. 拼接下载 URL 并下载
wget -O flutter_linux_stable.tar.xz &quot;https://storage.googleapis.com/flutter_infra_release/releases/stable/linux/flutter_linux_\${FLUTTER_VERSION}-stable.tar.xz&quot;

或者知道版本号的话，直接下载某个稳定版本：
wget -O flutter_linux_stable.tar.xz https://storage.googleapis.com/flutter_infra_release/releases/stable/linux/flutter_linux_3.47.5-stable.tar.xz


3. 解压到合适位置（例如 ~/development/）
mkdir -p ~/development
tar -xf flutter_linux_stable.tar.xz -C ~/development/

4. 将 Flutter 添加到 PATH（编辑 ~/.bashrc）
echo &#39;export PATH=&quot;$PATH:$HOME/development/flutter/bin&quot;&#39; &gt;&gt; ~/.bashrc
source ~/.bashrc

5. 验证安装
flutter --version
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样就安装好SDK，接下来要在 VS Code 中配置 SDK 路径</p><p>用 VS Code 通过 Remote-SSH 连接到 Ubuntu 服务器。 打开命令面板：按 Ctrl+Shift+P。 打开用户设置：输入并选择 Preferences: Open User Settings (JSON)。 添加配置：在打开的 settings.json 文件中，添加以下内容（注意路径应指向你的Flutter SDK根目录，不要包含 /bin）：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>json
{
    &quot;remote.SSH.remotePlatform&quot;: {
        &quot;10.10.8.249&quot;: &quot;linux&quot;
    },
    &quot;dart.flutterSdkPath&quot;: &quot;/home/robin/development/flutter&quot;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>保存并重启：保存文件，然后完全关闭并重新打开VS Code窗口，让配置生效。VS Code应该就能正确识别Flutter SDK了。你可以按 Ctrl+Shift+P 输入 Flutter: Run Flutter Doctor ，或直接SSH登陆服务器运行flutter doctor来验证是否配置成功。 注意，有时需要重启服务器，才能让上面添加的Flutter/Dart在PATH生效。</p><p>检查配置一般也会提示其它缺失，下面就可以安装这些缺失：</p><p>1、Android toolchain 缺失 你的目标是跨平台（Android/iOS/HarmonyOS），Android 是必须的。两种方案：方案 A：装完整的 Android Studio（需图形界面配置,不推荐），方案 B：只装 Android SDK 命令行工具。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 安装依赖
sudo apt install openjdk-17-jdk

# 下载命令行工具
mkdir -p ~/development/android-sdk/cmdline-tools
cd ~/Downloads
wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
unzip commandlinetools-linux-11076708_latest.zip -d ~/development/android-sdk/cmdline-tools/
mv ~/development/android-sdk/cmdline-tools/cmdline-tools ~/development/android-sdk/cmdline-tools/latest

# 配置环境变量
echo &#39;export ANDROID_HOME=&quot;$HOME/development/android-sdk&quot;&#39; &gt;&gt; ~/.bashrc
echo &#39;export PATH=&quot;$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools&quot;&#39; &gt;&gt; ~/.bashrc
source ~/.bashrc

# 安装必要的 SDK 组件
sdkmanager &quot;platform-tools&quot; &quot;platforms;android-34&quot; &quot;build-tools;34.0.0&quot;
sdkmanager &quot;platforms;android-36&quot; &quot;build-tools;28.0.3&quot;

# 接受许可
sdkmanager --licenses

# 告诉 Flutter SDK 在哪里
flutter config --android-sdk ~/development/android-sdk
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2、Linux toolchain 缺失</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>sudo apt install clang cmake ninja-build libgtk-3-dev mesa-utils
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>对于Chrome 缺失环境的缺失，可先不管它，因为本地windows有浏览器，可以后续在项目中配置launch.json实现一键调试。 接下来可以先创建 Flutter 项目，把 Android 端框架跑通，再处理鸿蒙 HAP 的事。理由很明确：你 80% 的工作量在 Dart 共享层（状态机、题库、UI），这部分和平台完全无关，越早开始写越好。鸿蒙环境搭建涉及的 DevEco Studio 和 Flutter-OH 版本管理，可以等项目骨架稳定后再介入。</p><h3 id="创建flutter项目" tabindex="-1"><a class="header-anchor" href="#创建flutter项目"><span>创建Flutter项目</span></a></h3><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 创建一个名为 screen_time_manager 的 Flutter 项目
flutter create screen_time_manager

# 同在 GitHub 上创建仓库：在 GitHub 官网点击 &quot;New&quot; 创建空仓库，不要勾选 &quot;Add a README file&quot; 等初始化选项

# 进入项目目录，推送本地项目
cd screen_time_manager
git init
git add .
git commit -m &quot;initial commit: Flutter project struct&quot;
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git remote add origin https://github.com/peyoot/screen_time_manager.git
git branch -M main
git push -u origin main

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="配置flutter调试环境" tabindex="-1"><a class="header-anchor" href="#配置flutter调试环境"><span>配置Flutter调试环境</span></a></h3>`,19),c={href:"https://sourceforge.net/projects/vcxsrv/",target:"_blank",rel:"noopener noreferrer"},v=i(`<div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>[System.Environment]::SetEnvironmentVariable(&quot;DISPLAY&quot;, &quot;localhost:0.0&quot;, [System.EnvironmentVariableTarget]::User)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>二、在 VS Code 的 Remote-SSH 配置中启用 X11 转发 按 Ctrl+Shift+P 打开命令面板，输入并选择 Remote-SSH: Open SSH Configuration File... 或是在Remote SSH的Remote Explorer下右击SSH，选择你用于连接服务器的 SSH 配置文件（通常是 C:\\Users\\你的用户名.ssh\\config）； 在对应的 Host 配置块中，添加以下三行：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>Host 10.10.8.249
    HostName 10.10.8.249
    User robin
        IdentityFile C:\\Users\\rtu\\.ssh\\id_ed25519
    ForwardAgent yes
    ForwardX11 yes
    ForwardX11Trusted yes
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>三、配置远程 Ubuntu 服务器的 SSH 服务 远程服务器的 SSH 服务也需要允许 X11 转发，配置/etc/ssh/sshd_config，确保以下三行存在且没有被注释掉</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>X11Forwarding yes
X11UseLocalhost no
AllowTcpForwarding yes
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后用sudo systemctl restart sshd 重启服务。重新连接成功后，测试命令echo $DISPLAY，它应该输出 localhost:10.0 或类似的值。 还可用xclock测试，</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>sudo apt install x11-apps
xclock
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>成功在windows显示出界面后，就说明转发设置成功。接下来的步骤就是进入 Flutter 项目目录，运行</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>flutter run -d linux
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>应用的窗口就会显示在你的 Windows 桌面上了。</p>`,10);function m(b,p){const n=s("ExternalLinkIcon");return d(),a("div",null,[u,t("p",null,[e("一、windows开发机上配置并启动X Server 在 Linux 桌面端本可运行flutter run -d Linux，可快速验证环境，不过我们在服务器上并没显示器，所以实时查看和操作Flutter应用的UI，X11转发是比安装完整桌面环境更轻量的选择， 1、下载并安装"),t("a",c,[e("VcXsrv"),r(n)]),e(' 2、 启动 X Server： 安装后，运行 XLaunch，在配置向导中，务必取消勾选 "Native opengl"，并勾选 "Disable access control"。其他选项保持默认，一路点击“下一步”直到完成。 3、设置 DISPLAY 环境变量： 在 Windows PowerShell 中执行以下命令，将 DISPLAY 变量设置为')]),v])}const h=l(o,[["render",m],["__file","flutter.html.vue"]]),x=JSON.parse('{"path":"/zh/note/dev/vscode/flutter.html","title":"","lang":"zh-CN","frontmatter":{"description":"使用vscode开发flutter跨平台应用 安装插件和Flutter SDK 创建项目前检查和安装必备插件：Flutter 与 Dart。VS Code 本身不具备 Dart/Flutter 的任何支持能力，所有语言服务、调试器、热重载、设备识别都依赖于这两个插件。 安装顺序： 先安装 Dart 插件（发布者：Dart-Code），等右下角状态栏显示...","head":[["meta",{"property":"og:url","content":"https://peyoot.github.io/zh/note/dev/vscode/flutter.html"}],["meta",{"property":"og:description","content":"使用vscode开发flutter跨平台应用 安装插件和Flutter SDK 创建项目前检查和安装必备插件：Flutter 与 Dart。VS Code 本身不具备 Dart/Flutter 的任何支持能力，所有语言服务、调试器、热重载、设备识别都依赖于这两个插件。 安装顺序： 先安装 Dart 插件（发布者：Dart-Code），等右下角状态栏显示..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[{"level":2,"title":"使用vscode开发flutter跨平台应用","slug":"使用vscode开发flutter跨平台应用","link":"#使用vscode开发flutter跨平台应用","children":[{"level":3,"title":"安装插件和Flutter SDK","slug":"安装插件和flutter-sdk","link":"#安装插件和flutter-sdk","children":[]},{"level":3,"title":"创建Flutter项目","slug":"创建flutter项目","link":"#创建flutter项目","children":[]},{"level":3,"title":"配置Flutter调试环境","slug":"配置flutter调试环境","link":"#配置flutter调试环境","children":[]}]}],"git":{},"autoDesc":true,"filePathRelative":"zh/note/dev/vscode/flutter.md"}');export{h as comp,x as data};
