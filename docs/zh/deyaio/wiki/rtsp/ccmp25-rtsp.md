# CCMP25 USB摄像头无线WiFi视频流演示固件
通过WiFi来传输视频流是一种越来越常见的应用，可用于工业，安防，医疗等不同领域。CCMP25是一个高性能的ARM核心板，集成有WiFi6无线模块，能够满足不同国家和区域的认证要求。本固件集成有USB摄像头转为HTTP视频流的解决方案，用于演示通过无线来传输高清视频，是一个即插即用，性能可靠的演示程序。

## 安装
演示程序集成在嵌入式Linux固件中，使用前请准备好一套Digi ConnectCore MP25固件，或是基于ConnectCore MP25的单板机或自定义板卡，通过TF卡或U盘，将固件刷入到核心板中。

    <style>
        .tab-content {
            display: none;
            padding: 10px;
            border: 1px solid #ddd;
        }

        .tab-content:target {
            display: block;
        }
    </style>

<h2>TF卡刷固件</h2>
<div id="sdcard" class="tab-content">
    <pre>setenv image-name dey-image-lvgl 
    run install_linux_fw_sd
    </pre>
</div>

<h2>U盘刷固件</h2>
<div id="udisk" class="tab-content">
    <pre>usb start
     setenv image-name dey-image-lvgl
     run install_linux_fw_usb
     </pre>
</div>
