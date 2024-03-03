# Introduction

PVPN is a VPN tool which help you setup IPSEC tunnel or OpenVPN connection automatically. VPN is a critical tool to help you access resources that is banned or blocked by country like US,China or India. For example, If you want to download or access Wechat, Tiktok in US or Inida, you may use VPN to set up encrypted tunnels between your Mobile/Pad/PC to a VPS outside of your current region. You won't be blocked as the service providers would see your devices as it was in the region that VPS located.

It support: openvpn and IPSec

For openvpn it will use stunnel4 to hide the VPN tunnel into ssl so that it won't be blocked by government firewall.
For strongswan, it help you configure server mode (with public IP) and client mode (initial connector).

## How It Works
It's very simple as you can finish it in several minutes without any PC skills. Basically, You'll need to set up a VPN server first. Scripts will help you generate CA/Key/Certifications in the VPN server and also generate a temporary webpage for you to download the client certifications for your devices.

Follow the instruction to select server/client mode and VPN type. You'll need to input public IP of VPN server. And then choose if you're installing VPN server (VPN Responder) or VPN client(VPN Initiator).

The scripts was designed as interactive one. But most of the time you only need to press Enter key.

## Can it work cross platform?

Yes, In Linux, you can run the scripts to setup both VPN server and client automatically. for other OS, you can download certs and config from server and apply into the coresponding app in Windows, Android or MacOS.
