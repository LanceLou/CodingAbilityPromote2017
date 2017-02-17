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
	本页面(无刷新)，一次选择关闭提示，在下次载入前都不会提示了 ------>>>>>> 全部变量保存flag

2: 键盘选择功能
	监听用户输入(input)的同事，监听键盘上下键以及确认键

3: 各个@optimize
 */

var container = null;
var isShowRemender = true;

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

var HTMLClassNameHandlerUtil = (function () {
	function checkIsElement(element) {
		if (!element instanceof Node) 
			throw new TypeTypeError("params Error: element must a Node or it's sub class");
	}
	function throwParamsMissingException(excepNum) {
		throw new Error("params missing error: excep "+ excepNum +" params");
	}
	return {
		addClassName: function (element, className) {
			checkIsElement(element);
			if (className === undefined) 
				throwParamsMissingException();

			var oldClassName = element.className.trim();
			if (oldClassName.length === 0) 
				element.className = className;
			else
				if (oldClassName.indexOf(className) < 0) 
					element.className = oldClassName + " " + className;
				else //已存在，无法添加
					return false;
			return true;
		},
		removeClassName: function (element, className) {
			checkIsElement(element);
			if (className === undefined) 
				throwParamsMissingException();
			var oldClassName = element.className;
			if (oldClassName.indexOf(className) < 0) 
				return false;
			element.className = oldClassName.replace(className, "");
			return true;
		},
		includeClassName: function (element, className) {
			checkIsElement(element);
			if (className === undefined) 
				throwParamsMissingException();
			return element.className.indexOf(className) >= 0;
		}
	}
}());

function keyDownUpHandler(operate) {
	var localConatiner = container,
		li = keyDownUpHandler.curLi;
	if (operate === "down") {
		if (!li) {
			li = localConatiner.querySelector("li");
			if (!li) 
				return;
			else{
				HTMLClassNameHandlerUtil.addClassName(li, "selected");
				keyDownUpHandler.curLi = li;
				return;
			}
		}
		if (li.nextElementSibling === null) 
			return;
		HTMLClassNameHandlerUtil.removeClassName(li, "selected");
		li = li.nextElementSibling;
		HTMLClassNameHandlerUtil.addClassName(li, "selected");
		keyDownUpHandler.curLi = li;
	}
	if (operate === "up") {
		if (!li || li.previousElementSibling === null) 
			return;
		else{
			HTMLClassNameHandlerUtil.removeClassName(li, "selected");
			li = li.previousElementSibling;
			HTMLClassNameHandlerUtil.addClassName(li, "selected");
			keyDownUpHandler.curLi = li;
		}
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
		listContainerUl = input.nextElementSibling,
		lastInValue = null;
	container = input.parentNode;
	var localConatiner = container;

	EventUtil.addEventListener(input, "keyup", function (event) {
		if (!isShowRemender)  //用户选择关闭提示功能
			return;

		if (event.keyCode === 38)  //上下选择提示键
			keyDownUpHandler("up");
		else if (event.keyCode === 40) 
			keyDownUpHandler("down");

		if (event.keyCode === 13 && keyDownUpHandler.curLi) {  //确认键确认选择
			input.value = keyDownUpHandler.curLi.innerHTML;
			localConatiner.className = "container";
			return;
		}

		if (lastInValue !== null && lastInValue === input.value) //功能键输入不管
			return;
		else
			lastInValue = input.value;

		//解除引用，重画
		keyDownUpHandler.curLi = null;
		renderRemender(getRemenderListByUserIn(input.value));
	});
	EventUtil.addEventListener(container, "click", function (event) {
		var target = event.target;
		if (target.tagName === "LI") {
			input.value = target.innerHTML;
			HTMLClassNameHandlerUtil.removeClassName(localConatiner, "showRemenderList");
		}
		if (target.tagName === "A" && target.getAttribute("data-operate") === "close") {
			HTMLClassNameHandlerUtil.removeClassName(localConatiner, "showRemenderList");
			isShowRemender = false;
		}
	});
}
function main() {
	getRemenderListByUserIn.resultList = ["aaa", "bbb", "ccc", "abb", "aab"];
	initEventLis();
}
main();