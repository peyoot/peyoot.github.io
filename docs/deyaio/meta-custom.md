# What is meta-custom
It's a yocto layer that enable many custom recipes. DEYAIO use meta-custom to compile a variety of feature-rich firmware images. 

# Recipes

## recipes-mine

### homeaddons
This recipe provide a reference to install files to user's home directory. It can be text files or a pre-compiled user application.

### base-files
This recipe provide a reference to override original base-files with your own .profile and .bashrc 

### dummy-service
This recipe provide a reference to run your own systemd service

## recipes-core
Only available in some specific branches.

### images
recipes in this directory provide some feature images like dey-image-qtros.


## recipes-vpn

### pvpn and openvpndns
These recipes add pvpn support to the target images. 

Add the following line to local.conf:
IMAGE_INSTALL:append = “ gawk unzip pvpn openvpn openvpndns stunnel”


Note: you'll also need to modify kernel option:

Enable Device Drivers → Network device support → Universal TUN/TAP device driver support

## recipes-qt

ros2 with qt5 support will need a custom qt5.sh placed on /etc/profile.d. Depending the content user can run ros2 directory after booting into system without the need to manually source environmental script.

To enable ros2 in the image, just checkout the kirkstone-ros branch in dey-aio-manifest.
