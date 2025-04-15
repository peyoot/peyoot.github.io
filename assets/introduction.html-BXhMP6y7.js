import{_ as e,o as t,c as o,b as a}from"./app-D0aTEsZS.js";const i={},s=a('<h1 id="introduction" tabindex="-1"><a class="header-anchor" href="#introduction"><span>Introduction</span></a></h1><p>DEY All In One(deyaio) is a system development toolset for Digi&#39;s embedded products(som,sbc/dvk).It&#39;s a toolset that help user quickly setup Yocto system development environment and facilitate user to tailor and customize firmwares and device trees.</p><h2 id="features" tabindex="-1"><a class="header-anchor" href="#features"><span>Features</span></a></h2><p>Features includes:</p><ul><li>DEY system development docker-compose tool. support all dey version in single folder (start from dey 3.2).</li><li>docker-compose and native development way share same workspace and tools.</li><li>meta-custom example to build firmwares that contains app,configs,drivers in the rootfs images.</li><li>Share downloads and sstate-cache accross projects to save disk space</li><li>Customer’s repo and Digi repo maintain seperately while work together to build.</li><li>quickly copy the necessary images to release folder and pack installer zip file.</li><li>Can also choose to publish to local TFTP server folder or scp to remote server for share.</li></ul><h2 id="how-it-works" tabindex="-1"><a class="header-anchor" href="#how-it-works"><span>How It Works</span></a></h2><p>deyaio consists of three parts: dey-aio, meta-custom and dey-aio-manifest. It contain DEY official layers and a meta-custom layer. It also contain specific layers like ros in its branch. It contain scripts to enable the support of these layers out of box. It also have a publish script to copy compiled output to release directory or FTP/NFS path and pack it into SD card installer.</p><p>deyaio integrates docker development method and native development method in a single toolset. You can run different DEY version in the same host simultaneously. User can use meta-custom layer as a template to tailor the rootfs image of their own.</p><p>The dey-aio-manifest is a repo way to integrate dey-aio and DEY&#39;s official system development tools to form a complete toolset. Users can choose either docker-compose or official native development which share the same publishing tools.</p><p>The native development method of dey-aio use Digi official repositories. And the official source code tree of Digi and the customer&#39;s own design can be managed separately by different git repositories. And it is convenient for both parts to be maintained seperately while can work together and co-compile to build the final products&#39; firmwares.</p>',10),n=[s];function r(l,c){return t(),o("div",null,n)}const p=e(i,[["render",r],["__file","introduction.html.vue"]]),h=JSON.parse(`{"path":"/deyaio/introduction.html","title":"Introduction","lang":"en-US","frontmatter":{"description":"Introduction DEY All In One(deyaio) is a system development toolset for Digi's embedded products(som,sbc/dvk).It's a toolset that help user quickly setup Yocto system developmen...","head":[["link",{"rel":"alternate","hreflang":"zh-cn","href":"https://peyoot.github.io/zh/deyaio/introduction.html"}],["meta",{"property":"og:url","content":"https://peyoot.github.io/deyaio/introduction.html"}],["meta",{"property":"og:title","content":"Introduction"}],["meta",{"property":"og:description","content":"Introduction DEY All In One(deyaio) is a system development toolset for Digi's embedded products(som,sbc/dvk).It's a toolset that help user quickly setup Yocto system developmen..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:locale:alternate","content":"zh-CN"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Introduction\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[{"level":2,"title":"Features","slug":"features","link":"#features","children":[]},{"level":2,"title":"How It Works","slug":"how-it-works","link":"#how-it-works","children":[]}],"git":{},"autoDesc":true,"filePathRelative":"deyaio/introduction.md"}`);export{p as comp,h as data};
