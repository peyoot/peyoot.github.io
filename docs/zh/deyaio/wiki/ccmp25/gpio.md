# gpio有效电平定义

GPIO究竟是高电平有效，还是低电平有效，主要看宏定义，而宏定义对应的是逻辑有效值，而非实际物理电平，通常GPIO_ACTIVE代表的是有效电平的宏，它的具体值在gpio.h中有定义：

/* Bit 0 express polarity */
#define GPIO_ACTIVE_HIGH 0
#define GPIO_ACTIVE_LOW 1

因此反编译出来的0其实是代表GPIO_ACTIVE_HIGH（高电平有效）,1是代表GPIO_ACTIVE_LOW(低电平有效)
