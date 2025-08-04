import{_ as t,o as e,c as i,b as n}from"./app-B5dVmtHS.js";const a={},o=n(`<h1 id="ccmp25-usb摄像头无线wifi视频流演示固件" tabindex="-1"><a class="header-anchor" href="#ccmp25-usb摄像头无线wifi视频流演示固件"><span>CCMP25 USB摄像头无线WiFi视频流演示固件</span></a></h1><p>通过WiFi来传输视频流是一种越来越常见的应用，可用于工业，安防，医疗等不同领域。CCMP25是一个高性能的ARM核心板，集成有WiFi6无线模块，能够满足不同国家和区域的认证要求。本固件集成有USB摄像头转为HTTP视频流的解决方案，用于演示通过无线来传输高清视频，是一个即插即用，性能可靠的演示程序。</p><h2 id="安装" tabindex="-1"><a class="header-anchor" href="#安装"><span>安装</span></a></h2><p>演示程序集成在嵌入式Linux固件中，使用前请准备好一套Digi ConnectCore MP25固件，或是基于ConnectCore MP25的单板机或自定义板卡，通过TF卡或U盘，将固件刷入到核心板中。</p><pre><code>&lt;style&gt;
    .tab-content {
        display: none;
        padding: 10px;
        border: 1px solid #ddd;
    }

    .tab-content:target {
        display: block;
    }
&lt;/style&gt;
</code></pre><h2>TF卡刷固件</h2><div id="sdcard" class="tab-content"><pre>setenv image-name dey-image-lvgl 
    run install_linux_fw_sd
    </pre></div><h2>U盘刷固件</h2><div id="udisk" class="tab-content"><pre>usb start
     setenv image-name dey-image-lvgl
     run install_linux_fw_usb
     </pre></div>`,9),c=[o];function r(s,p){return e(),i("div",null,c)}const d=t(a,[["render",r],["__file","ccmp25-rtsp.html.vue"]]),h=JSON.parse('{"path":"/zh/deyaio/wiki/rtsp/ccmp25-rtsp.html","title":"CCMP25 USB摄像头无线WiFi视频流演示固件","lang":"zh-CN","frontmatter":{"description":"CCMP25 USB摄像头无线WiFi视频流演示固件 通过WiFi来传输视频流是一种越来越常见的应用，可用于工业，安防，医疗等不同领域。CCMP25是一个高性能的ARM核心板，集成有WiFi6无线模块，能够满足不同国家和区域的认证要求。本固件集成有USB摄像头转为HTTP视频流的解决方案，用于演示通过无线来传输高清视频，是一个即插即用，性能可靠的演示程...","head":[["meta",{"property":"og:url","content":"https://peyoot.github.io/zh/deyaio/wiki/rtsp/ccmp25-rtsp.html"}],["meta",{"property":"og:title","content":"CCMP25 USB摄像头无线WiFi视频流演示固件"}],["meta",{"property":"og:description","content":"CCMP25 USB摄像头无线WiFi视频流演示固件 通过WiFi来传输视频流是一种越来越常见的应用，可用于工业，安防，医疗等不同领域。CCMP25是一个高性能的ARM核心板，集成有WiFi6无线模块，能够满足不同国家和区域的认证要求。本固件集成有USB摄像头转为HTTP视频流的解决方案，用于演示通过无线来传输高清视频，是一个即插即用，性能可靠的演示程..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"CCMP25 USB摄像头无线WiFi视频流演示固件\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[{"level":2,"title":"安装","slug":"安装","link":"#安装","children":[]}],"git":{},"autoDesc":true,"filePathRelative":"zh/deyaio/wiki/rtsp/ccmp25-rtsp.md"}');export{d as comp,h as data};
