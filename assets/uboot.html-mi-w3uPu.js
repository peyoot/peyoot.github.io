import{_ as n,r as l,o as s,c as a,a as t,d as e,e as d,w as o,b as r}from"./app-BqJ8WAA6.js";const c={},u=t("h1",{id:"u-boot优化与定制",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#u-boot优化与定制"},[t("span",null,"U-Boot优化与定制")])],-1),v=t("p",null,"Connectcore不同型号和DEY版本对应有不同的U-Boot版本，meta-digi/meta-digi-arm/recipes-bsp/u-boot目录下有多个uboot版本的配方文件，配方最后COMPATIBLE_MACHINE定义了该版本适配哪个系列的Connectcore。我们可以在meta-custom/recipes-bsp/u-boot下创建一个对应版本的U-Boot配方的bbappend文件，以便实现定制和优化。",-1),m=t("h2",{id:"u-boot的logo定制",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#u-boot的logo定制"},[t("span",null,"U-Boot的Logo定制")])],-1),p=r(`<h2 id="console口抗干扰能力加固" tabindex="-1"><a class="header-anchor" href="#console口抗干扰能力加固"><span>Console口抗干扰能力加固</span></a></h2><p>以CCMP25为例，默认的U-Boot的console口的板级设备树定义是：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>/* Console A35 */
&amp;usart2 {
	pinctrl-names = &quot;default&quot;, &quot;idle&quot;, &quot;sleep&quot;;
	pinctrl-0 = &lt;&amp;usart2_pins_a&gt;;
	pinctrl-1 = &lt;&amp;usart2_idle_pins_a&gt;;
	pinctrl-2 = &lt;&amp;usart2_sleep_pins_a&gt;;
	/delete-property/dmas;
	/delete-property/dma-names;
	status = &quot;okay&quot;;
};

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>而pinctrl定义见arch/arm/dts/ccmp25-dvk-u-boot.dtsi, 其中有</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>&amp;usart2 {
	bootph-all;
};

&amp;usart2_pins_a {
	bootph-all;
	pins1 {
		bootph-all;
	};
	pins2 {
		bootph-all;
	};
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面未涉及引脚上拉偏置，实际的定义在arch/arm/dts/stm32mp25-pinctrl.dtsi中，</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>	usart2_pins_a: usart2-0 {
		pins1 {
			pinmux = &lt;STM32_PINMUX(&#39;A&#39;, 4, AF6)&gt;; /* USART2_TX */
			bias-disable;
			drive-push-pull;
			slew-rate = &lt;0&gt;;
		};
		pins2 {
			pinmux = &lt;STM32_PINMUX(&#39;A&#39;, 8, AF8)&gt;; /* USART2_RX */
			bias-disable;
		};
	};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意上面的RX，默认没有偏置，因此上电时容易收到干扰信号误认为是按下任意键，可以在meta-custom里用自定义的uboot设备树来更改，以peyoot/ccmp25_dt为例，在uboot-dts/ccmp25-dvk.dts中，用下面的方法改：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>/* Console A35 */
&amp;usart2 {
	pinctrl-names = &quot;default&quot;, &quot;idle&quot;, &quot;sleep&quot;;
	- pinctrl-0 = &lt;&amp;usart2_pins_a&gt;;
	- pinctrl-1 = &lt;&amp;usart2_idle_pins_a&gt;;
	+ pinctrl-0 = &lt;&amp;ccmp25_usart2_pins_a&gt;;
	+ pinctrl-1 = &lt;&amp;ccmp25_usart2_idle_pins_a&gt;;
	pinctrl-2 = &lt;&amp;usart2_sleep_pins_a&gt;;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后加上下面定义，主要是RX，通过上拉防止浮空易受干扰。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>
&amp;pinctrl {
	ccmp25_usart2_pins_a: ccmp25-usart2-0 {
		pins1 {
			pinmux = &lt;STM32_PINMUX(&#39;A&#39;, 4, AF6)&gt;; /* USART2_TX */
			bias-disable;
			drive-push-pull;
			slew-rate = &lt;0&gt;;
		};
		pins2 {
			pinmux = &lt;STM32_PINMUX(&#39;A&#39;, 8, AF8)&gt;; /* USART2_RX */
			/* pull-up on rx to avoid floating level */
			bias-pull-up;
		};
	};

	ccmp25_usart2_idle_pins_a: ccmp25-usart2-idle-0 {
		pins1 {
			pinmux = &lt;STM32_PINMUX(&#39;A&#39;, 4, ANALOG)&gt;; /* USART2_TX */
		};
		pins2 {
			pinmux = &lt;STM32_PINMUX(&#39;A&#39;, 8, AF8)&gt;; /* USART2_RX */
			/* pull-up on rx to avoid floating level */
			bias-pull-up;
		};
	};


</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,11);function b(_,g){const i=l("RouteLink");return s(),a("div",null,[u,v,m,t("p",null,[e("参考"),d(i,{to:"/zh/deyaio/wiki/custom_logo.html"},{default:o(()=>[e("U-Boot的logo定制")]),_:1})]),p])}const x=n(c,[["render",b],["__file","uboot.html.vue"]]),A=JSON.parse('{"path":"/zh/deyaio/wiki/uboot.html","title":"U-Boot优化与定制","lang":"zh-CN","frontmatter":{"description":"U-Boot优化与定制 Connectcore不同型号和DEY版本对应有不同的U-Boot版本，meta-digi/meta-digi-arm/recipes-bsp/u-boot目录下有多个uboot版本的配方文件，配方最后COMPATIBLE_MACHINE定义了该版本适配哪个系列的Connectcore。我们可以在meta-custom/reci...","head":[["meta",{"property":"og:url","content":"https://peyoot.github.io/zh/deyaio/wiki/uboot.html"}],["meta",{"property":"og:title","content":"U-Boot优化与定制"}],["meta",{"property":"og:description","content":"U-Boot优化与定制 Connectcore不同型号和DEY版本对应有不同的U-Boot版本，meta-digi/meta-digi-arm/recipes-bsp/u-boot目录下有多个uboot版本的配方文件，配方最后COMPATIBLE_MACHINE定义了该版本适配哪个系列的Connectcore。我们可以在meta-custom/reci..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"U-Boot优化与定制\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[{"level":2,"title":"U-Boot的Logo定制","slug":"u-boot的logo定制","link":"#u-boot的logo定制","children":[]},{"level":2,"title":"Console口抗干扰能力加固","slug":"console口抗干扰能力加固","link":"#console口抗干扰能力加固","children":[]}],"git":{},"autoDesc":true,"filePathRelative":"zh/deyaio/wiki/uboot.md"}');export{x as comp,A as data};
