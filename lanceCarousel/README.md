# LanceCarousel(轮播组件)

> 轮播组件，一直想尝尝，现在终于算是敲了一个，先不论好坏，感觉效果还可以

## Demo
![demo-1](./images/demo-1.png)


## 兼容性

目测兼容IE8+，对于IE老人家不支持的属性加了一些polyfills，存放在polyfills.js中。

## 使用

#### Demo

```js
	var carousel = new LanceCarousel(container);
	carousel.setCarouselItem([
		{imgSrc: "../images/test-1.jpg", toLinkSrc: "http://www.baidu.com", title: "Englist Test", intro: "elList is a HTMLCollection, which is an ordered collection of DOM elements that are children of elementNodeReference. If there are no element children, then elList contains no elements and has a length of 0."},
		{imgSrc: "../images/test-2.jpg", toLinkSrc: "http://www.baidu.com", title: "沙卡拉卡", intro: "跨站脚本（Cross-site scripting，通常简称为XSS）是一种网站应用程序的安全漏洞攻击，是代码注入的一种。它允许恶意用户将代码注入到网页上，其他用户在观看网页时就会受到影响。这类攻击通常包含了HTML以及用户端脚本语言。"},
		{imgSrc: "../images/test-3.jpg", toLinkSrc: "http://www.baidu.com", title: "JavaScript", intro: "Newton's parakeet (Psittacula exsul) is an extinct species of parrot that was endemic to the Mascarene island of Rodrigues in the western Indian Ocean. "},
		{imgSrc: "../images/test-4.jpg", toLinkSrc: "http://www.baidu.com", title: "spider", intro: "Webkit亦使用于Apple iOS、BlackBerry Tablet OS、Tizen及Amazon Kindle的默认浏览器。WebKit的C++应用程序接口提供了一系列的Class以在视窗上显示网页内容，并且实现了一些浏览器的特色，如用户链接点击、管理前后页面列表及近期历史页面等等。"}
	]);
	carousel.setSpeedLevel(3);
	carousel.setTimingFunction("easeIn");
	carousel.start();
```

<br/>

#### 构造函数
	
传入轮播图容器(Node)，需用户自定义此容器的长宽，之后的轮播图将跟随此容器的布局长宽。


#### LanceCarousel.prototypee.setCarouselItem
设置轮播图的轮播项。包含图片src(必须)，图片跳转链接，图片标题，介绍。参数为数组形式，数组的每一项为一个对象字面量，描述对应项的图片src，跳转链接，标题和介绍。

对象字面量描述: 

1. imgSrc: 图片路径
2. toLinkSrc: 跳转链接
3. title: 图片标题
4. intro: 图片介绍

```js
	carousel.setCarouselItem([{imgSrc: "../images/test-1.jpg", toLinkSrc: "http://www.baidu.com", title: "Englist Test", intro: "elList is a HTMLCollection, which is an ordered collection of DOM elements that are children of elementNodeReference. If there are no element children, then elList contains no elements and has a length of 0."}]);
```

#### LanceCarousel.prototypee.setSpeedLevel

设置轮播图过度的速度，参数为数字1，2，3其中的一个，1代表low，慢；2代表middle，速度适中；3代表high，速度快。

```js
	carousel.setSpeedLevel(3);
```

#### LanceCarousel.prototypee.setTimingFunction

设置轮播图过度动画的时间函数，即设置对应缓动公式，本组件提供easeIn, easeOut, easeInOut三种缓动效果。

```js
	carousel.setTimingFunction("easeIn");
```
#### LanceCarousel.prototypee.start
开启自动轮播。

```js
	carousel.start();
```

## 技术

本组件由LanceLou纯手工打造，除了使用了一些polyfills以及参考了Robert Penner大神的缓动公式之外代码全部手写，其实在编写这个组件过程中比较有挑战性的就是JavaScript动画的制作了，每一帧为多久，有哪些变化，都是有考究的，以及相关的缓动公式的使用，我觉得这是我这次收获比较大的一方面，我还特意写了一篇博客，大家可以移步我的博客查看详细。[LanceLou的博客: JavaScript动画以及缓动公式](https://www.lancelou.com/2017/02/21/JavaScript-animate-baisc/)

## LanceLou的web实验室
LanceLou的web前端实验室是我正在搭建的一个个人技术，小项目的实验与展示平台，地址: [weblab.lancelou.com](http://weblab.lancelou.com) 部署在vultr的vps上，使用Node.js作为后台，Nginx做代理，目前正在火速搭建中，敬请期待！

## demo地址

[http://codepen.io/lancelou/full/QdXZKj/](http://codepen.io/lancelou/full/QdXZKj/)


