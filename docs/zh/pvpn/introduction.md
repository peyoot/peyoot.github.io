# 简介

PVPN是一种VPN工具，可帮助您自动设置IPSEC隧道或OpenVPN连接。VPN是帮助您访问被美国，中国或印度等国家禁止或阻止的资源的关键工具。例如，如果您想下载或访问微信、美国的 Tiktok 或 Inida，您可以使用 VPN 在您的手机/Pad/PC 与您当前地区以外的 VPS 之间设置加密隧道。您不会被阻止，因为服务提供商会看到您的设备，因为它位于 VPS 所在的区域。

它支持：openvpn 和 IPSec

对于 openvpn，它将使用 stunnel4 将 VPN 隧道隐藏到 ssl 中，这样它就不会被政府防火墙阻止。
对于 strongswan，它可以帮助您配置服务器模式（使用公共 IP）和客户端模式（初始连接器）。

## 它是如何工作的
这非常简单，因为您可以在几分钟内完成它，而无需任何 PC 技能。基本上，您需要先设置一个VPN服务器。脚本将帮助您在 VPN 服务器中生成 CA/密钥/认证，并生成一个临时网页，供您下载设备的客户端认证。

按照说明选择服务器/客户端模式和 VPN 类型。您需要输入VPN服务器的公共IP。然后选择是安装 VPN 服务器（VPN 响应端）还是 VPN 客户端（VPN 发起端）。

这些脚本被设计为交互式脚本。但大多数时候你只需要按Enter键。

## 它可以跨平台工作吗？

是的，在 Linux 中，您可以运行脚本来自动设置 VPN 服务器和客户端。对于其他操作系统，您可以从服务器下载证书和配置，并应用于 Windows、Android 或 MacOS 中的相应应用程序。

