# Installation

In order to properly install and use DEY AIO, you need to install the dependencies required by the yocto development environment, and if you want to use docker for development, you also need to install docker and docker-compose. The following installation process takes Ubuntu 22.04 as an example, and also applies to Ubuntu 20.04. Other Linux distributor can take reference as well.

If you need to develop projects of different DEY version at the same time then it's better to develop legacy DEY versions in docker mode.  Follow the instruction and install DEY AIO into you host with the support of DEY-4.0 native development method. You can use docker method both in DEY 4.0 and DEY 3.2.

## Dependencies Preparing

Login as normal user and install necessary packages before

```
sudo apt update
sudo apt install gawk wget file git diffstat file unzip texinfo gcc build-essential chrpath socat cpio python3 python3-pip python3-pexpect xz-utils debianutils iputils-ping python3-git python3-jinja2 libegl1-mesa-dev libsdl1.2-dev pylint xterm python3-subunit mesa-common-dev zstd liblz4-tool
sudo apt install python-is-python3
```

## Install repo and configure git
```
sudo apt install repo
git config --global user.name  “yourname”
git config --global user.email "you@email.com“
```
## Install docker and docker-compose
This is an option. Install this part if you would like to have multiple version of DEY in one host PC. You can ignore this section if you're new to DEY.

```
sudo apt install docker.io docker-compose  
sudo gpasswd -a $USER docker   
newgrp docker   
reboot       #some linux distribution will need reboot to make docker work.
docker ps    #after reboot, you can test if docker can work with this command
```

## Install DEY AIO toolset with repo

Install a general DEY AIO toolset
```
cd
mkdir dey-aio
cd dey-aio
repo init -u https://github.com/peyoot/dey-aio-manifest.git -b main
repo sync
```

Now DEY AIO toolset is ready to work! you can switch featured function set by repo command.  

or you can specify the featured function set at the begining of installation. Take ccmp25plc as an example:
```
cd 
mkdir deyaio-ccmp25plc
repo init -u https://github.com/peyoot/dey-aio-manifest.git -b main -m ccmp25plc.xml
repo sync

```

# Usage

DEY AIO folder structure:

```
/
├── aio
│   ├── gatesgarth
│   ├── kirkstone
├── dey4.0
│   ├── docker-compose.yml
│   ├── mkproject.sh
│   ├── publish.sh
│   ├── sources
│   ├── workspace
├── dey3.2
│   ├──docker-compose.yml
│   ├── mkproject.sh
│   ├── publish.sh
│   ├── sources
│   ├── workspace
| ...
├── release
│   ├── dey4.0
│        ├── ...
│
│   ├── dey3.2
│        ├── ...
│   └ …
└── README.md
```

To do project development, you need to go into the desired DEY version of the project and then create the project . You can use docker-compose to create a project, or you can create a project directly using the official native method under workspace sub-folder. Both ways can share workspace as the project directory.

To better manage multiple projects, please use tmux to create a new terminal session for every project. 

### Native DEY development method

The dey-aio toolset automatically pulls the DEY source code when it is being installed. And you can create a project in the workspace folder and compile it directly. This method is no different from the official one, except that it install DEY in the sources folder of currentdirectory.  we need to enter the corresponding workspace folder to create the new project.  dey-aio has made some optimizations for different projects to share the download folder and sstate cache, which are stored in the project_shared under workspace. Take the creation of the cc93 project as an example:

```
cd workspace
mkdir cc93
cd cc93
source ../../mkproject.sh -l
source ../../mkproject.sh -p ccimx93-dvk
bitbake dey-image-qt
```

More documents  will comming soon. You can also refer to Digi official document web portal for help.


### docker-compose

docker-compose can quickly create a dey development environment container and it is isolated from the host. To create a new docker container for development, you can use: `docker-compose run dey<version>`

ere the version number can be 3.2 or 4.0, the container defaults to peyoot/dey as the DEY image, you can also modify docker-compose.yml, use the official digidotcom/dey image. Example:

```
cd dey4.0
docker-compose run dey4.0
```

This automatically opens the container and prompts you to create a project or continue development using the original project:

```
 +------------------------------------------------------------------------------------+
 |                                                                                    |
 |                                                                                    |
 |                   Welcome to Digi Embedded Yocto Docker container                  |
 |                                                                                    |
 |  This Docker image is a ready to use system based on Digi Embedded Yocto (DEY) to  |
 |  build custom images for the Digi platforms. DEY is an open source and freely      |
 |  available Yocto Project (TM) based embedded Linux distribution.                   |
 |                                                                                    |
 |                                                                                    |
 +------------------------------------------------------------------------------------+
 Do you wish to create a new platform project [Y/N]?
```

 when you input “Y”, it will let you choose which som platform you're working with can create the project based on your choice. And then you can start to build the firmwares.

To continue with previous project, simply input "N". Please source dey-setup-environment first when you need to continue your previous work.

You can type "exit" in the dey docker container to quit. Use "docker-compose down" to close the container. 


