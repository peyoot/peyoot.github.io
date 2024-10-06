# DEY Application Development

DEY application Development can be very flexible. You can use Makefile in console or Digi ADE (a custom IDE based on Eclipse) or Vscode, QT Creator, Crank software for application development. Digi provides an SDK to install the cross-compilation toolchain that required to develop your application, and you will need to download the appropriate SDK installation based on your ConnectCore hardware platform.

Digi’s official documentation provides detailed explanations of various methods for application development. This document serves as a supplement to the official documentation, using VSCODE for application development as an example.


## Prepare DEY app development environment

1. Prerequsites

<code>
sudo apt update
sudo apt install ibus ibus-pinyin build-essential gdb gdb-multiarch
</code>

To use IDE to development DEY app, you'll need desktop environment. Follow the following command to install Ubuntu desktop if you haven't got it.
<code>
sudo apt update
sudo apt install --no-install-recommends ubuntu-desktop
</code>
And you probably would like to install your own language package if Engilish is not your expected one. For example, Chinese language pack and input method need following package:

<code>
sudo apt install language-pack-zh-hans
sudo apt install language-pack-gnome-zh-hans fonts-arphic-ukai fonts-noto-cjk ibus-libpinyin fonts-noto-cjk-extra fonts-arphic-uming
</code>

2. Download and Install SDK and IDE
