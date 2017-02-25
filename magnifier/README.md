# Magnifier放大镜实现

> 使用JavaScript或CSS3实现一个放大镜
> 
> 要求:
> 
> 1. 兼容IE8
> 2. 交互效果优美~


这里作者制作了两个，一个使用canvas实现，引入的polyfills，主要针对兼容IE8。

一. IE8兼容版(index.html)

实现原理，主要使用HTML5 canvas, 创建两个画布，一个保存原图，一个保存缩略图，当需要放大时，将原图画布上的对应区域画到缩略图的画布上！

![Kapture 2017-02-24 at 20.22.21.gif](./capture/Kapture 2017-02-24 at 20.22.21.gif)

Demo: [http://codepen.io/lancelou/full/LWELvX/](http://codepen.io/lancelou/full/LWELvX/)


二. CSS3实现版

实现原理，使用两个div，一边放置缩略图，一边为放大之后的显示区域。两边都使用background相关实现来实现背景图片移动与放大。

![Kapture 2017-02-25 at 14.58.58.gif](./capture/Kapture 2017-02-25 at 14.58.58.gif)

Demo: [http://codepen.io/lancelou/full/jBELEm/](http://codepen.io/lancelou/full/jBELEm/)

如有不足，还请各位多多指教！

