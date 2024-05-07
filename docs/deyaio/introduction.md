# Introduction

DEY All In One(deyaio) is a system development toolset for Digi's embedded products(som,sbc/dvk).It's a toolset that help user quickly setup Yocto system development environment and facilitate user to tailor and customize firmwares and device trees.

## Features

Features includes:

- DEY system development docker-compose tool. support all dey version in single folder (start from dey 3.2).
- docker-compose and native development way share same workspace and tools.
- meta-custom example to build firmwares that contains app,configs,drivers in the rootfs images.
- Share downloads and sstate-cache accross projects to save disk space
- Customer’s repo and Digi repo maintain seperately while work together to build.
- quickly copy the necessary images to release folder and pack installer zip file.
- Can also choose to publish to local TFTP server folder or scp to remote server for share.

## How It Works

deyaio consists of three parts: dey-aio, meta-custom and dey-aio-manifest. It contain DEY official layers and a meta-custom layer. It also contain specific layers like ros in its branch.
It contain scripts to enable the support of these layers out of box. It also have a publish script to copy compiled output to release directory or FTP/NFS path and pack it into SD card installer.

deyaio integrates docker development method and native development method in a single toolset. You can run different DEY version in the same host simultaneously. 
User can use meta-custom layer as a template to tailor the rootfs image of their own. 


The dey-aio-manifest is a repo way to integrate dey-aio and DEY's official system development tools to form a complete toolset. Users can choose either docker-compose or official native development which share the same publishing tools.

The native development method of dey-aio use Digi official repositories. And the official source code tree of Digi and the customer's own design can be managed separately by different git repositories. And it is convenient for both parts to be maintained seperately while can work together and co-compile to build the final products' firmwares.
