## Connectcore MP25 Uart接口调试
UART接口根据需要，可以配置成普通双线，三线或四线流控，RS485支持等不同功能。更详细说明见[官方文档BPS中UART章节](https://docs.digi.com/resources/documentation/digidocs/embedded/dey/5.0/ccmp25/bsp-uart_r_stm.html)

其中，开发板具备完整的测试能力来验证UART接口。以工业上常见的RS485为例，在开发板上，RS485使用USART6，接口在J11（位于TF卡槽边上）。

### RS485设备树
一般而言，RS485只需3线，即TX,RX，DE, 使能端DE一般使用流控线中的RTS。开发板的示例配置已经适用于多数场景，更多功能可参考参考[设备树绑定文档](https://github.com/digi-embedded/linux/blob/v6.6/stm/dey-5.0/maint/Documentation/devicetree/bindings/serial/st,stm32-uart.yaml)。
```
/* RS485 */
&usart6 {
	linux,rs485-enabled-at-boot-time;
	pinctrl-names = "default", "idle", "sleep";
	pinctrl-0 = <&usart6_pins_a>;
	pinctrl-1 = <&usart6_idle_pins_a>;
	pinctrl-2 = <&usart6_sleep_pins_a>;
	uart-has-rtscts;
	status = "okay";
};
```

### 两板卡对发测试
两板卡的 A 接 A、B 接 B，如果需要还可以把GND相连。开发板的J11用来测试，而J10是带有120欧的跳线接口，测试时请合上跳线帽。

很多人喜欢用stty来测试RS485，这是不对的，简单发少量或单个字符可能没影响。操作如下：

接收端：
```
stty -F /dev/ttySTM3 raw 115200 cs8 -cstopb -parenb -crtscts
cat /dev/ttySTM3
```

发送端：
```
stty -F /dev/ttySTM3 raw 115200 cs8 -cstopb -parenb -crtscts
echo "ABCD" > /dev/ttySTM3
```
这种测试在UART波特率设置较高时还可以，低则不行，末尾会出现乱码，这是因为用echo发出数据很快，它打开/dev/ttySTM3，获得fd然后调用write(fd, "ABCD\n", 5)。此时内核串口驱动接收到 5 字节，放入 FIFO，启动发送（此时数据可能还在 FIFO 或移位寄存器中，但内核认为“已提交”）。shell中echo命令收到 write() 返回值后，立即调用 close(fd)，会强行终止正在进行的发送，导致后续字节被丢弃或停止位被截断。
这其实是 write + close 序列与 RS485 驱动的发送完成中断时序碰撞。因此一般不要用echo的方式来测试。
把上面115200改成921600，echo模式一次性可发送而不出乱码的字符数会高很多，基本满足测试要求，但对于115200及其以下，能测试的字符数比较少。

替代的测试方案包括 ：

1、使用microcom
```
发送或接收都可以： microcom -s 115200 /dev/ttySTM3
如果要发一串字符，发送方用：echo "ABCDEFGH" | microcom -s 115200 /dev/ttySTM3
```
2、发送方用程序，接收方还用stty
```
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <fcntl.h>
#include <unistd.h>
#include <errno.h>
#include <termios.h>

int main(int argc, char *argv[])
{
    if (argc < 3) {
        fprintf(stderr, "usage: %s /dev/ttySTM3 \"string\"\n", argv[0]);
        return 1;
    }

    const char *port = argv[1];
    const char *data = argv[2];

    int fd = open(port, O_RDWR | O_NOCTTY);
    if (fd < 0) {
        perror("open");
        return 1;
    }

    struct termios t;
    if (tcgetattr(fd, &t) < 0) {
        perror("tcgetattr");
        close(fd);
        return 1;
    }

    /* raw mode：关行规程、关回车转换 */
    cfmakeraw(&t);

    /* 8N1 */
    t.c_cflag &= ~PARENB;
    t.c_cflag &= ~CSTOPB;
    t.c_cflag &= ~CSIZE;
    t.c_cflag |= CS8;
    t.c_cflag |= CLOCAL | CREAD;
    t.c_cflag &= ~CRTSCTS;   /* RS485 时 RTS 归驱动管 */

    cfsetospeed(&t, B115200);
    cfsetispeed(&t, B115200);

    if (tcsetattr(fd, TCSANOW, &t) < 0) {
        perror("tcsetattr");
        close(fd);
        return 1;
    }

    /* 关 onlcr（cfmakeraw 已经把 OPOST 关了，这里再显式保险） */
    t.c_oflag &= ~ONLCR;

    /* 发送 */
    size_t len = strlen(data);
    size_t sent = 0;
    while (sent < len) {
        ssize_t n = write(fd, data + sent, len - sent);
        if (n < 0) {
            if (errno == EINTR) continue;
            perror("write");
            close(fd);
            return 1;
        }
        sent += n;
    }

    /* 关键：等硬件真正发完再关 */
    tcdrain(fd);

    /* 本地回显 */
    printf("sent: %s\n", data);

    close(fd);
    return 0;
}

```
测试命令：
```
./rs485send /dev/ttySTM3 "ABCDEFGHIJ"
```


### 解决常见问题

如上面所述，RS485三线通讯有个使能端，它由内核串口驱动负责发送数据和控制 RTS/DE 引脚。驱动在发送完成后，会通过中断或轮询检测 TX Empty（发送数据寄存器空）​ 标志，然后立即拉低 DE 切换为接收。
TX Empty 只表示数据已经从 FIFO 转移到移位寄存器，并不代表移位寄存器已经将最后一个停止位发送完毕。所以发送完最后一个字节后，如果立即拉低 DE（切换为接收模式），最后一个字节的停止位会被截断，对方收到的数据就会变成乱码。这个行为与上层工具无关，完全由驱动代码和设备树中的 rs485-rts-delay-ns 控制。

在发送数据后，不要立刻退出或执行下一步操作。需要调用 tcdrain(fd) 等待内核把数据全部送入硬件移位寄存器并发送完毕。如果内核驱动支持，调整设备树中的 rs485-rts-delay-ns（发送后延时），给硬件留出释放总线的余量（例如设为 200 us）。

```
&usart6 {
    ...
	/delete-property/dmas;
    /delete-property/dma-names;
    linux,rs485-enabled-at-boot-time;
    uart-has-rtscts;
    rs485-rts-delay-ns = <0 200000>;   // 发送后延迟 200us
    ...
};
```



