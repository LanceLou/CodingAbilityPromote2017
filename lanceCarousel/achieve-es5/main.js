/*
效果要求:
	鼠标进入时停止轮播。
	鼠标进入时如果有简介显示简介，没有就不显示
	鼠标可调节前后加载
	显示当前加载为第几页(显示图片页数)

使用要求:
	创建对象，使用对象添加图片。
 */
function main() {
	var container = document.querySelector(".carouselContainer");
	var carousel = new LanceCarousel(container);
	carousel.setCarouselItem([
		{imgSrc: "../images/test-1.jpg", toLinkSrc: "www.baidu.com", title: "Englist Test", intro: "elList is a HTMLCollection, which is an ordered collection of DOM elements that are children of elementNodeReference. If there are no element children, then elList contains no elements and has a length of 0."},
		{imgSrc: "../images/test-2.jpg", toLinkSrc: "www.baidu.com", title: "沙卡拉卡", intro: "跨站脚本（Cross-site scripting，通常简称为XSS）是一种网站应用程序的安全漏洞攻击，是代码注入的一种。它允许恶意用户将代码注入到网页上，其他用户在观看网页时就会受到影响。这类攻击通常包含了HTML以及用户端脚本语言。"},
		{imgSrc: "../images/test-3.jpg", toLinkSrc: "www.baidu.com", title: "JavaScript", intro: "Newton's parakeet (Psittacula exsul) is an extinct species of parrot that was endemic to the Mascarene island of Rodrigues in the western Indian Ocean. "},
		{imgSrc: "../images/test-4.jpg", toLinkSrc: "www.baidu.com", title: "spider", intro: "Webkit亦使用于Apple iOS、BlackBerry Tablet OS、Tizen及Amazon Kindle的默认浏览器。WebKit的C++应用程序接口提供了一系列的Class以在视窗上显示网页内容，并且实现了一些浏览器的特色，如用户链接点击、管理前后页面列表及近期历史页面等等。"}
	]);
	carousel.setSpeedLevel(3);
	carousel.setTimingFunction("easeIn");
	carousel.start();
	console.log(carousel);
}
main();
