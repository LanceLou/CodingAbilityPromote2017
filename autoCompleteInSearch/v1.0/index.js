/*
用户访问流程:
输出关键字 -> 提示 -> 选中关键字(提示关闭&搜索框内容为选中内容) -> 点击搜索
									   -> 修改关键字(重复)



逻辑处理过程: 
1: 监听搜索框输入(change? keyup?)
   同时监听ul点击事件(事件委托)

2: 输入完成，获取用户输入的text， 根据text获取提示数组
	-> 当前text是否改变，记录原text
	-> 提示数组如果只是减少，那么是否可以从上一次的基础上进行操作(减少搜索范围) (优化后于实现)

3: 结果绘制，对ul下的list进行增删
	-> 直接对list进行重绘


改进：
1: 提供关闭提示框的按钮选择
2: 键盘选择功能
3: 各个@optimize
 */

var container = null; //@optimize
var EventUtil = {
	addEventListener: function (element, type, handler) {
		if (!element instanceof Node) 
			throw new TypeTypeError("params Error: element must a Node or it's sub class");
		if (type === undefined || handler === undefined) 
			throw new Error("params error: excep 3 params");
		if (element.addEventListener)
			element.addEventListener(type, handler);
		else if (element.attachEvent) 
			element.attachEvent("on" + type, handler);
		else
			element["on"+type] = handler;
	},
	removeEventListener: function (element, type, handler) {
		if (!element instanceof Node) 
			throw new TypeTypeError("params Error: element must a Node or it's sub class");
		if (type === undefined || handler === undefined) 
			throw new Error("params error: excep 3 params");
		if (element.removeEventListener) 
			element.removeEventListener(type, handler);
		else if (element.detachEvent) 
			element.detachEvent("on"+type, handler);
		else
			element["on"+type] = handler;
	}
}

function renderRemender(remenderList) {
	var localConatiner = container,
		listContainerUl = localConatiner.querySelector("ul#remenderList"),
		fragment = document.createDocumentFragment();
		li = null,
		i = 0;
	listContainerUl.innerHTML = "";
	for (i = 0; i < remenderList.length; i++){
		li = document.createElement("li");
		li.innerHTML = remenderList[i];
		fragment.appendChild(li);
	}
	listContainerUl.appendChild(fragment);
	if (localConatiner.className.indexOf("showRemenderList") < 0) 
		localConatiner.className = localConatiner.className + " showRemenderList";
}
function getRemenderListByUserIn(userInput) {
	if (userInput.trim().length === 0) 
		return [];
	var resultList = getRemenderListByUserIn.resultList,
		remenderList = [];
	for (var i = 0, len = resultList.length; i < len; i++){
		if (resultList[i].indexOf(userInput) === 0) 
			remenderList.push(resultList[i]);
	}
	return remenderList;
}
function initEventLis() {
	var input = document.querySelector("#searchIn"),
		listContainerUl = input.nextElementSibling;
	container = input.parentNode;
	var localConatiner = container;
	EventUtil.addEventListener(input, "keyup", function (event) {
		renderRemender(getRemenderListByUserIn(input.value));
	});
	EventUtil.addEventListener(listContainerUl, "click", function (event) {
		var target = event.target;
		if (target.tagName !== "LI") 
			return;
		input.value = target.innerHTML;
		localConatiner.className = "container"; //@optimize
	});
}
function main() {
	getRemenderListByUserIn.resultList = ["aaa", "bbb", "ccc", "abb", "aab"];
	initEventLis();
}
main();