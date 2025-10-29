# 集成Wifi和不带Wifi型号的区别

CCMP25带Wifi型号，在设计文件中的区别包括：
1、型号参数，01是带WiFi,02不带Wifi
```
<platform_variant>0x01</platform_variant>
<template_id>ccmp25_0x01</template_id>
```
2、WiFi接口，使用了SDMMC1资源，因此在设备树中多了
```
        <component id="sdmmc">
            <label>Wireless</label>
            <visible>false</visible>
            <enabled>true</enabled>
            <removable>false</removable>
            <resource>SDMMC1</resource>
            <resource_locked>true</resource_locked>
            <template>sdmmc_1</template>
            <template_locked>true</template_locked>
            <timestamp>0</timestamp>
            <ignore_compatibility>false</ignore_compatibility>
            <settings>
                <setting id="mode">
                    <value>mmc</value>
                    <visible>true</visible>
                    <enabled>true</enabled>
                </setting>
                <setting id="bus_width">
                    <value>4</value>
                    <visible>true</visible>
                    <enabled>true</enabled>
                </setting>
            </settings>
            <iomuxes>
                <iomux id="clk">
                    <pad>C_7</pad>
                    <value>AF10-M:2-P:0-S:3</value>
                    <locked>true</locked>
                </iomux>
                <iomux id="cmd">
                    <pad>D_7</pad>
                    <value>AF10-M:2-P:0-S:2</value>
                    <locked>true</locked>
                </iomux>
                <iomux id="d0">
                    <pad>D_8</pad>
                    <value>AF10-M:2-P:0-S:2</value>
                    <locked>false</locked>
                </iomux>
                <iomux id="d1">
                    <pad>C_8</pad>
                    <value>AF10-M:2-P:0-S:2</value>
                    <locked>true</locked>
                </iomux>
                <iomux id="d2">
                    <pad>D_9</pad>
                    <value>AF10-M:2-P:0-S:2</value>
                    <locked>true</locked>
                </iomux>
                <iomux id="d3">
                    <pad>C_9</pad>
                    <value>AF10-M:2-P:0-S:2</value>
                    <locked>true</locked>
                </iomux>
            </iomuxes>
        </component>
        <component id="usart">
            <label>Bluetooth</label>
            <visible>false</visible>
            <enabled>true</enabled>
            <removable>false</removable>
            <resource>USART1</resource>
            <resource_locked>true</resource_locked>
            <template>usart1</template>
            <template_locked>true</template_locked>
            <timestamp>0</timestamp>
            <ignore_compatibility>false</ignore_compatibility>
            <settings>
                <setting id="mode">
                    <value>asynchronous</value>
                    <visible>true</visible>
                    <enabled>true</enabled>
                </setting>
                <setting id="flow_control">
                    <value>cts_rts</value>
                    <visible>true</visible>
                    <enabled>true</enabled>
                </setting>
                <setting id="flow_control_485">
                    <value>false</value>
                    <visible>true</visible>
                    <enabled>false</enabled>
                </setting>
                <setting id="slave_select">
                    <value>disable</value>
                    <visible>true</visible>
                    <enabled>false</enabled>
                </setting>
            </settings>
            <iomuxes>
                <iomux id="tx">
                    <pad>C_5</pad>
                    <value>AF6-M:2-P:0-S:0</value>
                    <locked>true</locked>
                </iomux>
                <iomux id="rx">
                    <pad>C_6</pad>
                    <value>AF6-M:0-P:0</value>
                    <locked>true</locked>
                </iomux>
                <iomux id="rts">
                    <pad>D_5</pad>
                    <value>AF6-M:2-P:0-S:0</value>
                    <locked>true</locked>
                </iomux>
                <iomux id="cts">
                    <pad>D_6</pad>
                    <value>AF6-M:0-P:0</value>
                    <locked>true</locked>
                </iomux>
            </iomuxes>
        </component>
        <component id="gpio">
            <label>BT_REG_EN</label>
            <visible>false</visible>
            <enabled>true</enabled>
            <removable>false</removable>
            <resource>BT_REG_EN/PZ5</resource>
            <resource_locked>true</resource_locked>
            <template>bt_reg_en/pz5</template>
            <template_locked>true</template_locked>
            <timestamp>0</timestamp>
            <ignore_compatibility>false</ignore_compatibility>
            <iomuxes>
                <iomux id="gpio">
                    <pad>D_4</pad>
                    <value>GPIO-M:2-P:2-S:0</value>
                    <locked>true</locked>
                </iomux>
            </iomuxes>
        </component>
        <component id="gpio">
            <label>WL_REG_EN</label>
            <visible>false</visible>
            <enabled>true</enabled>
            <removable>false</removable>
            <resource>WL_REG_EN/PI7</resource>
            <resource_locked>true</resource_locked>
            <template>wl_reg_en/pi7</template>
            <template_locked>true</template_locked>
            <timestamp>0</timestamp>
            <ignore_compatibility>false</ignore_compatibility>
            <iomuxes>
                <iomux id="gpio">
                    <pad>C_4</pad>
                    <value>GPIO-M:2-P:2-S:0</value>
                    <locked>true</locked>
                </iomux>
            </iomuxes>
        </component>
```

上面资源表明，SDMCC1用了：PE3，PE2，PE4，PE5，PE0，PE1这几个处理器引脚，而蓝牙用了usart1四线：PG14,PG15,PB9,PB11，另有开关信号：BT_REG_EN用了PZ5,WL_REG_EN用了PI7，如果有用到冲突资源，又希望不同型号模块可混用，最好避开这些资源。