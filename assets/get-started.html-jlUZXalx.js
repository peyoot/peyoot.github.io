import{_ as e,o as n,c as t,b as i}from"./app-oTA4_50g.js";const o={},a=i(`<h1 id="installation" tabindex="-1"><a class="header-anchor" href="#installation"><span>Installation</span></a></h1><p>In order to properly install and use DEY AIO, you need to install the dependencies required by the yocto development environment, and if you want to use docker for development, you also need to install docker and docker-compose. The following installation process takes Ubuntu 22.04 as an example, and also applies to Ubuntu 20.04. Other Linux distributor can take reference as well.</p><p>If you need to develop projects of different DEY version at the same time then it&#39;s better to develop legacy DEY versions in docker mode. Follow the instruction and install DEY AIO into you host with the support of DEY-4.0 native development method. You can use docker method both in DEY 4.0 and DEY 3.2.</p><h2 id="dependencies-preparing" tabindex="-1"><a class="header-anchor" href="#dependencies-preparing"><span>Dependencies Preparing</span></a></h2><p>Login as normal user and install necessary packages before</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>sudo apt update
sudo apt install gawk wget file git diffstat file unzip texinfo gcc build-essential chrpath socat cpio python3 python3-pip python3-pexpect xz-utils debianutils iputils-ping python3-git python3-jinja2 libegl1-mesa-dev libsdl1.2-dev pylint xterm python3-subunit mesa-common-dev zstd liblz4-tool
sudo apt install python-is-python3
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="install-repo-and-configure-git" tabindex="-1"><a class="header-anchor" href="#install-repo-and-configure-git"><span>Install repo and configure git</span></a></h2><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>sudo apt install repo
git config --global user.name  “yourname”
git config --global user.email &quot;you@email.com“
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="install-docker-and-docker-compose" tabindex="-1"><a class="header-anchor" href="#install-docker-and-docker-compose"><span>Install docker and docker-compose</span></a></h2><p>This is an option. Install this part if you would like to have multiple version of DEY in one host PC. You can ignore this section if you&#39;re new to DEY.</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>sudo apt install docker.io docker-compose  
sudo gpasswd -a $USER docker   
newgrp docker   
reboot       #some linux distribution will need reboot to make docker work.
docker ps    #after reboot, you can test if docker can work with this command
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="install-dey-aio-toolset-with-repo" tabindex="-1"><a class="header-anchor" href="#install-dey-aio-toolset-with-repo"><span>Install DEY AIO toolset with repo</span></a></h2><p>Install a general DEY AIO toolset</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>cd
mkdir dey-aio
cd dey-aio
repo init -u https://github.com/peyoot/dey-aio-manifest.git -b main
repo sync
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Now DEY AIO toolset is ready to work! you can switch featured function set by repo command.</p><p>or you can specify the featured function set at the begining of installation. Take ccmp25plc as an example:</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>cd 
mkdir deyaio-ccmp25plc
repo init -u https://github.com/peyoot/dey-aio-manifest.git -b main -m ccmp25plc.xml
repo sync

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="usage" tabindex="-1"><a class="header-anchor" href="#usage"><span>Usage</span></a></h1><p>DEY AIO folder structure:</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>/
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>To do project development, you need to go into the desired DEY version of the project and then create the project . You can use docker-compose to create a project, or you can create a project directly using the official native method under workspace sub-folder. Both ways can share workspace as the project directory.</p><p>To better manage multiple projects, please use tmux to create a new terminal session for every project.</p><h3 id="native-dey-development-method" tabindex="-1"><a class="header-anchor" href="#native-dey-development-method"><span>Native DEY development method</span></a></h3><p>The dey-aio toolset automatically pulls the DEY source code when it is being installed. And you can create a project in the workspace folder and compile it directly. This method is no different from the official one, except that it install DEY in the sources folder of currentdirectory. we need to enter the corresponding workspace folder to create the new project. dey-aio has made some optimizations for different projects to share the download folder and sstate cache, which are stored in the project_shared under workspace. Take the creation of the cc93 project as an example:</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>cd workspace
mkdir cc93
cd cc93
source ../../mkproject.sh -l
source ../../mkproject.sh -p ccimx93-dvk
bitbake dey-image-qt
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>More documents will comming soon. You can also refer to Digi official document web portal for help.</p><h3 id="docker-compose" tabindex="-1"><a class="header-anchor" href="#docker-compose"><span>docker-compose</span></a></h3><p>docker-compose can quickly create a dey development environment container and it is isolated from the host. To create a new docker container for development, you can use: <code>docker-compose run dey&lt;version&gt;</code></p><p>ere the version number can be 3.2 or 4.0, the container defaults to peyoot/dey as the DEY image, you can also modify docker-compose.yml, use the official digidotcom/dey image. Example:</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>cd dey4.0
docker-compose run dey4.0
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>This automatically opens the container and prompts you to create a project or continue development using the original project:</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code> +------------------------------------------------------------------------------------+
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>when you input “Y”, it will let you choose which som platform you&#39;re working with can create the project based on your choice. And then you can start to build the firmwares.</p><p>To continue with previous project, simply input &quot;N&quot;. Please source dey-setup-environment first when you need to continue your previous work.</p><p>You can type &quot;exit&quot; in the dey docker container to quit. Use &quot;docker-compose down&quot; to close the container.</p>`,35),s=[a];function d(l,r){return n(),t("div",null,s)}const p=e(o,[["render",d],["__file","get-started.html.vue"]]),u=JSON.parse('{"path":"/deyaio/get-started.html","title":"Installation","lang":"en-US","frontmatter":{"description":"Installation In order to properly install and use DEY AIO, you need to install the dependencies required by the yocto development environment, and if you want to use docker for ...","head":[["link",{"rel":"alternate","hreflang":"zh-cn","href":"https://peyoot.github.io/zh/deyaio/get-started.html"}],["meta",{"property":"og:url","content":"https://peyoot.github.io/deyaio/get-started.html"}],["meta",{"property":"og:title","content":"Installation"}],["meta",{"property":"og:description","content":"Installation In order to properly install and use DEY AIO, you need to install the dependencies required by the yocto development environment, and if you want to use docker for ..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:locale:alternate","content":"zh-CN"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Installation\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[{"level":2,"title":"Dependencies Preparing","slug":"dependencies-preparing","link":"#dependencies-preparing","children":[]},{"level":2,"title":"Install repo and configure git","slug":"install-repo-and-configure-git","link":"#install-repo-and-configure-git","children":[]},{"level":2,"title":"Install docker and docker-compose","slug":"install-docker-and-docker-compose","link":"#install-docker-and-docker-compose","children":[]},{"level":2,"title":"Install DEY AIO toolset with repo","slug":"install-dey-aio-toolset-with-repo","link":"#install-dey-aio-toolset-with-repo","children":[{"level":3,"title":"Native DEY development method","slug":"native-dey-development-method","link":"#native-dey-development-method","children":[]},{"level":3,"title":"docker-compose","slug":"docker-compose","link":"#docker-compose","children":[]}]}],"git":{},"autoDesc":true,"filePathRelative":"deyaio/get-started.md"}');export{p as comp,u as data};
