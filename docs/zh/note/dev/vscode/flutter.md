## 使用vscode开发flutter跨平台应用

### 安装插件和Flutter SDK
创建项目前检查和安装必备插件：Flutter 与 Dart。VS Code 本身不具备 Dart/Flutter 的任何支持能力，所有语言服务、调试器、热重载、设备识别都依赖于这两个插件。
安装顺序：
  * 先安装 Dart 插件（发布者：Dart-Code），等右下角状态栏显示 “Dart” 语言模式后再继续
  * 再安装 Flutter 插件（同一发布者），它会自动拉取 Dart 依赖但不会覆盖已有 Dart 设置
  * 关闭所有 VSCode 窗口（macOS 用 Cmd+Q，Windows 右键任务栏图标退出），彻底杀进程，再重新打开
  * 打开任意 .dart 文件，确认右下角显示设备名（如 Chrome 或 iPhone 15）而非 “Plain Text”


VS Code 的 Flutter 插件默认在本地（Windows）寻找 SDK，而不是在你远程连接的服务器上。所以，你不需要先打开远程目录再创建项目，但必须在Linux服务器上安装好 Flutter SDK，并告诉 VS Code 去哪里找到它。

```
sudo apt install -y curl git unzip xz-utils zip libglu1-mesa
cd ~

1. 获取最新稳定版的版本号
FLUTTER_VERSION=$(curl -s https://storage.googleapis.com/flutter_infra_release/releases/releases_linux.json | jq -r '.current_release.stable as $stable | .releases[] | select(.hash == $stable) | .version')

2. 拼接下载 URL 并下载
wget -O flutter_linux_stable.tar.xz "https://storage.googleapis.com/flutter_infra_release/releases/stable/linux/flutter_linux_${FLUTTER_VERSION}-stable.tar.xz"

或者知道版本号的话，直接下载某个稳定版本：
wget -O flutter_linux_stable.tar.xz https://storage.googleapis.com/flutter_infra_release/releases/stable/linux/flutter_linux_3.47.5-stable.tar.xz


3. 解压到合适位置（例如 ~/development/）
mkdir -p ~/development
tar -xf flutter_linux_stable.tar.xz -C ~/development/

4. 将 Flutter 添加到 PATH（编辑 ~/.bashrc）
echo 'export PATH="$PATH:$HOME/development/flutter/bin"' >> ~/.bashrc
source ~/.bashrc

5. 验证安装
flutter --version
```

这样就安装好SDK，接下来要在 VS Code 中配置 SDK 路径


用 VS Code 通过 Remote-SSH 连接到 Ubuntu 服务器。
打开命令面板：按 Ctrl+Shift+P。
打开用户设置：输入并选择 Preferences: Open User Settings (JSON)。
添加配置：在打开的 settings.json 文件中，添加以下内容（注意路径应指向你的Flutter SDK根目录，不要包含 /bin）：

```
json
{
    "remote.SSH.remotePlatform": {
        "10.10.8.249": "linux"
    },
    "dart.flutterSdkPath": "/home/robin/development/flutter"
}
```
保存并重启：保存文件，然后完全关闭并重新打开VS Code窗口，让配置生效。VS Code应该就能正确识别Flutter SDK了。你可以按 Ctrl+Shift+P 输入 Flutter: Run Flutter Doctor ，或直接SSH登陆服务器运行flutter doctor来验证是否配置成功。
注意，有时需要重启服务器，才能让上面添加的Flutter/Dart在PATH生效。

检查配置一般也会提示其它缺失，下面就可以安装这些缺失：


1、Android toolchain 缺失
你的目标是跨平台（Android/iOS/HarmonyOS），Android 是必须的。两种方案：方案 A：装完整的 Android Studio（需图形界面配置,不推荐），方案 B：只装 Android SDK 命令行工具。

```
# 安装依赖
sudo apt install openjdk-17-jdk

# 下载命令行工具
mkdir -p ~/development/android-sdk/cmdline-tools
cd ~/Downloads
wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
unzip commandlinetools-linux-11076708_latest.zip -d ~/development/android-sdk/cmdline-tools/
mv ~/development/android-sdk/cmdline-tools/cmdline-tools ~/development/android-sdk/cmdline-tools/latest

# 配置环境变量
echo 'export ANDROID_HOME="$HOME/development/android-sdk"' >> ~/.bashrc
echo 'export PATH="$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools"' >> ~/.bashrc
source ~/.bashrc

# 安装必要的 SDK 组件
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"
sdkmanager "platforms;android-36" "build-tools;28.0.3"

# 接受许可
sdkmanager --licenses

# 告诉 Flutter SDK 在哪里
flutter config --android-sdk ~/development/android-sdk
```

2、Linux toolchain 缺失

```
sudo apt install clang cmake ninja-build libgtk-3-dev mesa-utils
```

对于Chrome 缺失环境的缺失，可先不管它，因为本地windows有浏览器，可以后续在项目中配置launch.json实现一键调试。
接下来可以先创建 Flutter 项目，把 Android 端框架跑通，再处理鸿蒙 HAP 的事。理由很明确：你 80% 的工作量在 Dart 共享层（状态机、题库、UI），这部分和平台完全无关，越早开始写越好。鸿蒙环境搭建涉及的 DevEco Studio 和 Flutter-OH 版本管理，可以等项目骨架稳定后再介入。

```
# 创建一个名为 screen_time_manager 的 Flutter 项目
flutter create screen_time_manager

# 同在 GitHub 上创建仓库：在 GitHub 官网点击 "New" 创建空仓库，不要勾选 "Add a README file" 等初始化选项

# 进入项目目录，推送本地项目
cd screen_time_manager
git init
git add .
git commit -m "initial commit: Flutter project struct"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git remote add origin https://github.com/peyoot/screen_time_manager.git
git branch -M main
git push -u origin main

# 在 Linux 桌面端运行，快速验证环境
flutter run -d Linux

```





