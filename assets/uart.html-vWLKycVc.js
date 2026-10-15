import{_ as s,r as l,o as d,c as a,a as e,d as n,e as t,b as r}from"./app-CATYXdwZ.js";const c={},v=e("h2",{id:"connectcore-mp25-uart接口调试",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#connectcore-mp25-uart接口调试"},[e("span",null,"Connectcore MP25 Uart接口调试")])],-1),u={href:"https://docs.digi.com/resources/documentation/digidocs/embedded/dey/5.0/ccmp25/bsp-uart_r_stm.html",target:"_blank",rel:"noopener noreferrer"},o=e("p",null,"其中，开发板具备完整的测试能力来验证UART接口。以工业上常见的RS485为例，在开发板上，RS485使用USART6，接口在J11（位于TF卡槽边上）。",-1),m=e("h3",{id:"rs485设备树",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#rs485设备树"},[e("span",null,"RS485设备树")])],-1),b={href:"https://github.com/digi-embedded/linux/blob/v6.6/stm/dey-5.0/maint/Documentation/devicetree/bindings/serial/st,stm32-uart.yaml",target:"_blank",rel:"noopener noreferrer"},p=r(`<div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>/* RS485 */
&amp;usart6 {
	linux,rs485-enabled-at-boot-time;
	pinctrl-names = &quot;default&quot;, &quot;idle&quot;, &quot;sleep&quot;;
	pinctrl-0 = &lt;&amp;usart6_pins_a&gt;;
	pinctrl-1 = &lt;&amp;usart6_idle_pins_a&gt;;
	pinctrl-2 = &lt;&amp;usart6_sleep_pins_a&gt;;
	uart-has-rtscts;
	status = &quot;okay&quot;;
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="两板卡对发测试" tabindex="-1"><a class="header-anchor" href="#两板卡对发测试"><span>两板卡对发测试</span></a></h3><p>两板卡的 A 接 A、B 接 B，如果需要还可以把GND相连。开发板的J11用来测试，而J10是带有120欧的跳线接口，测试时请合上跳线帽。</p><p>很多人喜欢用stty来测试RS485，这是不对的，简单发少量或单个字符可能没影响。操作如下：</p><p>接收端：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>stty -F /dev/ttySTM3 raw 115200 cs8 -cstopb -parenb -crtscts
cat /dev/ttySTM3
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>发送端：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>stty -F /dev/ttySTM3 raw 115200 cs8 -cstopb -parenb -crtscts
echo &quot;ABCD&quot; &gt; /dev/ttySTM3
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>这种测试在UART波特率设置较高时还可以，低则不行，末尾会出现乱码，这是因为用echo发出数据很快，它打开/dev/ttySTM3，获得fd然后调用write(fd, &quot;ABCD\\n&quot;, 5)。此时内核串口驱动接收到 5 字节，放入 FIFO，启动发送（此时数据可能还在 FIFO 或移位寄存器中，但内核认为“已提交”）。shell中echo命令收到 write() 返回值后，立即调用 close(fd)，会强行终止正在进行的发送，导致后续字节被丢弃或停止位被截断。 这其实是 write + close 序列与 RS485 驱动的发送完成中断时序碰撞。因此一般不要用echo的方式来测试。 把上面115200改成921600，echo模式一次性可发送而不出乱码的字符数会高很多，基本满足测试要求，但对于115200及其以下，能测试的字符数比较少。</p><p>替代的测试方案包括 ：</p><p>1、使用microcom</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>发送或接收都可以： microcom -s 115200 /dev/ttySTM3
如果要发一串字符，发送方用：echo &quot;ABCDEFGH&quot; | microcom -s 115200 /dev/ttySTM3
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>2、发送方用程序，接收方还用stty</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;
#include &lt;errno.h&gt;
#include &lt;termios.h&gt;

int main(int argc, char *argv[])
{
    if (argc &lt; 3) {
        fprintf(stderr, &quot;usage: %s /dev/ttySTM3 \\&quot;string\\&quot;\\n&quot;, argv[0]);
        return 1;
    }

    const char *port = argv[1];
    const char *data = argv[2];

    int fd = open(port, O_RDWR | O_NOCTTY);
    if (fd &lt; 0) {
        perror(&quot;open&quot;);
        return 1;
    }

    struct termios t;
    if (tcgetattr(fd, &amp;t) &lt; 0) {
        perror(&quot;tcgetattr&quot;);
        close(fd);
        return 1;
    }

    /* raw mode：关行规程、关回车转换 */
    cfmakeraw(&amp;t);

    /* 8N1 */
    t.c_cflag &amp;= ~PARENB;
    t.c_cflag &amp;= ~CSTOPB;
    t.c_cflag &amp;= ~CSIZE;
    t.c_cflag |= CS8;
    t.c_cflag |= CLOCAL | CREAD;
    t.c_cflag &amp;= ~CRTSCTS;   /* RS485 时 RTS 归驱动管 */

    cfsetospeed(&amp;t, B115200);
    cfsetispeed(&amp;t, B115200);

    if (tcsetattr(fd, TCSANOW, &amp;t) &lt; 0) {
        perror(&quot;tcsetattr&quot;);
        close(fd);
        return 1;
    }

    /* 关 onlcr（cfmakeraw 已经把 OPOST 关了，这里再显式保险） */
    t.c_oflag &amp;= ~ONLCR;

    /* 发送 */
    size_t len = strlen(data);
    size_t sent = 0;
    while (sent &lt; len) {
        ssize_t n = write(fd, data + sent, len - sent);
        if (n &lt; 0) {
            if (errno == EINTR) continue;
            perror(&quot;write&quot;);
            close(fd);
            return 1;
        }
        sent += n;
    }

    /* 关键：等硬件真正发完再关 */
    tcdrain(fd);

    /* 本地回显 */
    printf(&quot;sent: %s\\n&quot;, data);

    close(fd);
    return 0;
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>测试命令：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>./rs485send /dev/ttySTM3 &quot;ABCDEFGHIJ&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="解决常见问题" tabindex="-1"><a class="header-anchor" href="#解决常见问题"><span>解决常见问题</span></a></h3><p>如上面所述，RS485三线通讯有个使能端，它由内核串口驱动负责发送数据和控制 RTS/DE 引脚。驱动在发送完成后，会通过中断或轮询检测 TX Empty（发送数据寄存器空）​ 标志，然后立即拉低 DE 切换为接收。 TX Empty 只表示数据已经从 FIFO 转移到移位寄存器，并不代表移位寄存器已经将最后一个停止位发送完毕。所以发送完最后一个字节后，如果立即拉低 DE（切换为接收模式），最后一个字节的停止位会被截断，对方收到的数据就会变成乱码。这个行为与上层工具无关，完全由驱动代码和设备树中的 rs485-rts-delay-ns 控制。</p><p>在发送数据后，不要立刻退出或执行下一步操作。需要调用 tcdrain(fd) 等待内核把数据全部送入硬件移位寄存器并发送完毕。如果内核驱动支持，调整设备树中的 rs485-rts-delay-ns（发送后延时），给硬件留出释放总线的余量（例如设为 200 us）。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>&amp;usart6 {
    ...
	/delete-property/dmas;
    /delete-property/dma-names;
    linux,rs485-enabled-at-boot-time;
    uart-has-rtscts;
    rs485-rts-delay-ns = &lt;0 200000&gt;;   // 发送后延迟 200us
    ...
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,20);function h(g,f){const i=l("ExternalLinkIcon");return d(),a("div",null,[v,e("p",null,[n("UART接口根据需要，可以配置成普通双线，三线或四线流控，RS485支持等不同功能。更详细说明见"),e("a",u,[n("官方文档BPS中UART章节"),t(i)])]),o,m,e("p",null,[n("一般而言，RS485只需3线，即TX,RX，DE, 使能端DE一般使用流控线中的RTS。开发板的示例配置已经适用于多数场景，更多功能可参考参考"),e("a",b,[n("设备树绑定文档"),t(i)]),n("。")]),p])}const x=s(c,[["render",h],["__file","uart.html.vue"]]),S=JSON.parse('{"path":"/zh/deyaio/wiki/ccmp25/uart.html","title":"","lang":"zh-CN","frontmatter":{"description":"Connectcore MP25 Uart接口调试 UART接口根据需要，可以配置成普通双线，三线或四线流控，RS485支持等不同功能。更详细说明见官方文档BPS中UART章节 其中，开发板具备完整的测试能力来验证UART接口。以工业上常见的RS485为例，在开发板上，RS485使用USART6，接口在J11（位于TF卡槽边上）。 RS485设备树 一...","head":[["meta",{"property":"og:url","content":"https://peyoot.github.io/zh/deyaio/wiki/ccmp25/uart.html"}],["meta",{"property":"og:description","content":"Connectcore MP25 Uart接口调试 UART接口根据需要，可以配置成普通双线，三线或四线流控，RS485支持等不同功能。更详细说明见官方文档BPS中UART章节 其中，开发板具备完整的测试能力来验证UART接口。以工业上常见的RS485为例，在开发板上，RS485使用USART6，接口在J11（位于TF卡槽边上）。 RS485设备树 一..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[{"level":2,"title":"Connectcore MP25 Uart接口调试","slug":"connectcore-mp25-uart接口调试","link":"#connectcore-mp25-uart接口调试","children":[{"level":3,"title":"RS485设备树","slug":"rs485设备树","link":"#rs485设备树","children":[]},{"level":3,"title":"两板卡对发测试","slug":"两板卡对发测试","link":"#两板卡对发测试","children":[]},{"level":3,"title":"解决常见问题","slug":"解决常见问题","link":"#解决常见问题","children":[]}]}],"git":{},"autoDesc":true,"filePathRelative":"zh/deyaio/wiki/ccmp25/uart.md"}');export{x as comp,S as data};
