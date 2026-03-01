import{_ as t,r as s,o as l,c as o,a as e,d as n,e as a,b as d}from"./app-oTA4_50g.js";const r={},c=e("h1",{id:"console引脚浮空串扰问题",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#console引脚浮空串扰问题"},[e("span",null,"Console引脚浮空串扰问题")])],-1),u=e("p",null,"使用Digi ConnectCore SOM设计板卡，有时会出现如果没连接console口，会很容易停在uboot界面而无法进入系统，这通常是因为console口引脚浮空引发的串扰。 本文以CCMP2为例来解释这个问题，其它平台如有类似问题，也可以参考。",-1),p=e("h2",{id:"uboot中console口的定义",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#uboot中console口的定义"},[e("span",null,"uboot中console口的定义")])],-1),v={href:"https://github.com/digi-embedded/u-boot/blob/v2023.10/maint/arch/arm/dts/ccmp25-dvk.dts",target:"_blank",rel:"noopener noreferrer"},m=d(`<div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>/* Console A35 */
&amp;usart2 {
	pinctrl-names = &quot;default&quot;, &quot;idle&quot;, &quot;sleep&quot;;
	pinctrl-0 = &lt;&amp;usart2_pins_a&gt;;
	pinctrl-1 = &lt;&amp;usart2_idle_pins_a&gt;;
	pinctrl-2 = &lt;&amp;usart2_sleep_pins_a&gt;;
	/delete-property/dmas;
	/delete-property/dma-names;
	status = &quot;okay&quot;;
};

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其中usart2_pins_a，我们可以换成自己的定义</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>/* 覆盖或新定义usart2_pins_a，添加pull-up */
    usart2_pins_a: usart2-0 {
        pins1 {  /* TX引脚，不加pull-up */
            pinmux = &lt;STM32_PINMUX(&#39;G&#39;, 0, AF6)&gt;;  /* 示例: USART2_TX on PG0, AF6 - 确认你的引脚 */
            bias-disable;  /* 默认无bias */
            drive-push-pull;
            slew-rate = &lt;0&gt;;
        };
        pins2 {  /* RX引脚，加pull-up */
            pinmux = &lt;STM32_PINMUX(&#39;G&#39;, 1, AF6)&gt;;  /* 示例: USART2_RX on PG1, AF6 - 确认你的引脚 */
            bias-pull-up;  /* 启用内部pull-up */
            slew-rate = &lt;0&gt;;
        };
    };

    /* 如果有idle/sleep状态，也类似覆盖 */
    usart2_idle_pins_a: usart2-idle-0 {
        /* 类似pins1/pins2配置，添加bias-pull-up到RX */
    };

    usart2_sleep_pins_a: usart2-sleep-0 {
        /* 类似配置 */
    };
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,3);function b(_,h){const i=s("ExternalLinkIcon");return l(),o("div",null,[c,u,p,e("p",null,[n("CCMP25使用的是USART2作为console口，在"),e("a",v,[n("uboot板级设备树"),a(i)]),n("中它是这样定义的：")]),m])}const C=t(r,[["render",b],["__file","console-interference.html.vue"]]),x=JSON.parse('{"path":"/zh/note/digi/dey/console-interference.html","title":"Console引脚浮空串扰问题","lang":"zh-CN","frontmatter":{"description":"Console引脚浮空串扰问题 使用Digi ConnectCore SOM设计板卡，有时会出现如果没连接console口，会很容易停在uboot界面而无法进入系统，这通常是因为console口引脚浮空引发的串扰。 本文以CCMP2为例来解释这个问题，其它平台如有类似问题，也可以参考。 uboot中console口的定义 CCMP25使用的是USART...","head":[["meta",{"property":"og:url","content":"https://peyoot.github.io/zh/note/digi/dey/console-interference.html"}],["meta",{"property":"og:title","content":"Console引脚浮空串扰问题"}],["meta",{"property":"og:description","content":"Console引脚浮空串扰问题 使用Digi ConnectCore SOM设计板卡，有时会出现如果没连接console口，会很容易停在uboot界面而无法进入系统，这通常是因为console口引脚浮空引发的串扰。 本文以CCMP2为例来解释这个问题，其它平台如有类似问题，也可以参考。 uboot中console口的定义 CCMP25使用的是USART..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Console引脚浮空串扰问题\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[{"level":2,"title":"uboot中console口的定义","slug":"uboot中console口的定义","link":"#uboot中console口的定义","children":[]}],"git":{},"autoDesc":true,"filePathRelative":"zh/note/digi/dey/console-interference.md"}');export{C as comp,x as data};
