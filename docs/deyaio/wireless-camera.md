# **Digi ConnectCore Wireless Remote Video Surveillance System**
The wireless remote video surveillance system is a complete solution for transmitting video streams via WiFi. The system consists of a single-board computer and camera based on Digi's ConnectCore series core modules. The ConnectCore System-on-Chip core modules integrate a high-performance WiFi 6 module, and the system image comes pre-loaded with HTTP and RTSP services. This enables multi-device access to high-definition camera streams through web browsers, making it widely applicable in industrial and medical scenarios.

This demo image is compiled using the DEYAIO tool for system imaging and software utilities, designed to run on Digi ConnectCore series development boards. The system firmware has been thoroughly validated on core boards such as ConnectCore MP25.

## Introduction
The wireless video surveillance system, based on Digi ConnectCore MP25 development boards, demonstrates its core capabilities as a **high-performance industrial-grade IoT web wireless gateway**, including:
- **WiFi 6 AP/STA/WiFi Direct functionality**: Quickly establish local network hotspots through the integrated wireless module on the core board, supporting multi-device access, or creating stable transceiver links via WiFi Direct.
- **Real-time video streaming**: Plug-and-play auto-detection and low-latency encoding for USB/MIPI cameras.
- **Multiple local video interfaces**: Supports LVDS, HDMI, and other local video interfaces for synchronized display with web video streams.
- **Embedded web server**: Enables direct device control without external servers.
- **Industrial-grade reliability**: Ensures stable data transmission in complex environments.

## **Features**
### 1. Autonomous Networking Capability
- ConnectCore MP25 integrates a WiFi 6E module supporting AP hotspots or WiFi Direct access.
- Supports WiFi 6 and WPA3 enterprise-grade encryption with automatic channel selection for secure transmission.
- Tri-band auto-switching (2.4GHz/5GHz) with strong anti-interference capability.

### 2. Real-Time Video Surveillance System
- Supports UVC-compatible cameras via USB 3.0 interface (up to 1080P@60fps).
- Supports MIPI cameras through MIPI interface.
- H.264 hardware-accelerated encoding based on GStreamer framework.
- Simultaneous display of local video streams and remote web access.
- Browser playback without plugins.
- Field-tested end-to-end latency under 150ms (in actual network environments).

## **Usage**
This demo automatically detects cameras and configures optimal resolutions by priority, typically requiring no manual user intervention.

#### Debugging
Different camera manufacturers support varying formats. For debugging, stop the service and run the program manually with custom commands.

First, stop the service:
```
systemctl stop mjpg_streamer
```
Manually specify resolution:
```
mjpg_streamer -i "input_uvc.so -d /dev/video2 -r 800x800 -f 15" -o "output_http.so -p 80 -w /srv/mjpg_streamer/www"
```
To enable web access while simultaneously outputting video to a local display:
```
mjpg_streamer -i "input_uvc.so -d /dev/video2 -r 800x800 -f 15" -o "output_viewer.so -i0 -w800 -h800 -f15" -o "output_http.so -p 80 -w /srv/mjpg_streamer/www"
```

## **Compiling Demo-Enabled Images**
Use deyaio to compile full-featured firmware images. Complete steps:

```
cd
mkdir deyaio-rtsp
repo init -u https://github.com/peyoot/dey-aio-manifest.git -b main -m rtsp.xml
repo sync
cd dey5.0
mkdir ccmp25rtsp
cd ccmp25rtsp
source ../../mkproject.sh -p ccmp25-dvk
bitbake tf-a-stm32mp
bitbake fip-stm32mp
bitbake dey-image-lvgl
```
After compilation, publish the image package:

```
cd ~/deyaio-rtsp/dey5.0
./publish
```

Note: Select `dey-image-lvgl` when prompted. Press Enter for other options. Compiled images and flashable packages are located in `~/deyaio-rtsp/dey5.0/releash/ccmp25rtsp`.

## **Additional Features**
MIPI Camera Support (under development...)


