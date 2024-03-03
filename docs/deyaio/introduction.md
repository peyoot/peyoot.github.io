# Introduction

DEY AIO stands for DEY All In One. It's a tool set that help user quickly setup Yocto system development environment for Digi's embedded products(SOM,SBC and DVK).

Features includes:

- DEY system development docker-compose tool. support all dey version in single folder (start from dey 3.2).
- docker-compose and native development way share same workspace and tools.
- meta-custom example to build firmwares that contains app,configs,drivers in the rootfs images.
- Share downloads and sstate-cache accross projects to save disk space
- Customer’s repo and Digi repo maintain seperately while work together to build.
- quickly copy the necessary images to release folder and pack installer zip file.
- Can also choose to publish to local TFTP server folder or scp to remote server for share.


## How It Works

It integrates the official docker development method and native development method in a single toolset, provides a custom meta-custom layer to achieve file system customization, facilitates users to manage system images or custom device tree in their git repositories, and provide publish tools to help users quickly move/pack the firmwares or device tree files to the release folder. or upload to TFTP server or server after compile for quick testing and debugging.

The dey-aio project consists of two parts: dey-aio and dey-aio-manifest. dey-aio provide the docker-compose methods to develop DEY projects,  and provides meta-custom and publish tools. The dey-aio-manifest is a repo way to integrate dey-aio and DEY's official system development tools to form a complete toolset. Users can choose either docker-compose or official native development which share the same publishing tools.

The native development method of dey-aio use Digi official repositories. And the official source code tree of Digi and the customer's own design can be managed separately by different git repositories. And it is convenient for both parts to be maintained seperately while can work together and co-compile to build the final products' firmwares.
