# yocto中的电源驱动
相关参数要参考：
https://github.com/digi-embedded/linux/blob/v6.6/stm/dey-5.0/maint/Documentation/devicetree/bindings/regulator/regulator.yaml

# 常见型态
1、无负载开关
这种情况下，电源默认就有，需加上：
```
regulator-always-on;
```
