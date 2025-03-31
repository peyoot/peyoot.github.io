# What is meta-custom
This is a Yocto layer that enables numerous custom recipes. DEY-AIO utilizes meta-custom to compile feature-rich firmware images. By consolidating validated feature sets into a meta-custom branch and using the corresponding XML file in dey-aio-manifest, users can compile DEY functional firmware with one-click compilation.

# Branches
In dey-aio-manifest, different functional firmware compilations are achieved by specifying various meta-custom branches in XML files.

The master branch integrates common recipes while removing board-specific configurations. The dev branch strives to include recipes for multiple boards, as hardware distinctions mainly manifest in kernel device trees. In the dev branch, the default board device tree remains Digi's development board ccmp25-dvk, while specific boards like ccmp25plc will automatically load their dedicated kernel device tree.

# Recipes
Different recipe combinations are organized as various branches in meta-custom. You may also reference individual recipes to implement specific functionalities. Depending on the DEY version, meta-custom maintains corresponding main branches where feature sets are typically reflected in branch name suffixes. Taking "scarthgap-ccmp25plc" as an example, this branch represents DEY 5.0 (scarthgap) firmware implementation for CCMP25-based PLC reference boards.

This section only contains several recipes explanation. For more recipes, please refer to the branch instructions.

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
some platform only support qt5 or qt6 by default. When switch to different version it may need to patch or hack. Recipes here can help in a seamless way.
For example, ros2 with qt5 support will need a custom qt5.sh placed on /etc/profile.d. Depending the content it can recognize right display backend and user can run ros2 directory after booting into system without the need to manually source environmental script.

To enable ros2 in the image, just checkout the ros branch in dey-aio-manifest.
