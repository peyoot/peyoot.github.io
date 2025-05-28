# Digi ConnectCore Wireless Remote Video Surveillance System
The wireless remote video surveillance system is a comprehensive solution for transmitting video streams via WiFi. It comprises a single-board computer based on the Digi ConnectCore series core module and a USB camera. The ConnectCore series SoC core module integrates Murata's high-performance WiFi 6 module, and the system image includes HTTP and RTSP services, supporting multiple clients to access the camera's high-definition video stream through a browser. It has extensive applications in industrial and medical fields.

This demo image, compiled using the DEYAIO tool for the system image and software tools, is designed to run on Digi ConnectCore series development boards. The system firmware has been thoroughly validated on the ConnectCore MP25.

## Brief Introduction
The wireless video surveillance system, based on the Digi ConnectCore MP25 development board, showcases its core capabilities as a high - performance industrial - grade IoT web wireless gateway, including:
Murata Dual - mode WiFi 6 AP/STA Functionality: Create a local network hotspot via the on - board Murata wireless module for multi - client access.
Real - time Video Stream Transmission: Plug - and - play USB cameras with low - latency encoding.
Multiple Local Video Interfaces: Support for local video interfaces like LVDS and HDMI for synchronized display with web video streams.
Embedded Web Server: Enables direct device control without an external server.
Industrial - grade Reliability: Stable data transmission in complex environments.

## Features
1. Self - organizing Network Capability
The ConnectCore MP25 serves as a wireless AP, integrating Murata WiFi to create an independent hotspot (SSID: ccmp25 - ap).
Supports WiFi 6 and WPA3 enterprise - level encryption for secure data transmission.
Automatic dual - band switching (2.4GHz/5GHz) enhances anti - interference capability.
2. Real - time Video Surveillance System
Connects to UVC - compatible cameras via USB 3.0 (supports 1080P@60fps).
H.264 hardware - accelerated encoding using the GStreamer framework.
Simultaneous display of local streams and remote web access.
Plugin - free playback in browsers.
Measured end - to - end latency under 150ms in local network tests.