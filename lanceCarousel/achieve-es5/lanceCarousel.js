/*
效果要求:
	鼠标进入时停止轮播。
	鼠标进入时如果有简介显示简介，没有就不显示
	鼠标可调节前后加载
	显示当前加载为第几页(显示图片页数)

使用要求:
	创建对象，使用对象添加图片。
 */
var Utils = {};
Utils.HtmlElementClassNameHandler = (function () {
	function checkElement(element) {
		if (!element instanceof Node) 
			throw new TypeError("Params Error: element, expect a Node or it's sub Class");
	}
	return {
		addClassName: function (element, className) {
			checkElement(element);
			if (!className) throw new TypeError("Params error: expect 2");
			var oldClass = element.className.trim();
			if (oldClass.indexOf(className) >= 0) return false;
			else if (oldClass === "") element.className = className;
			else element.className = oldClass + " " + className;
			return true;
		},
		removeClassName: function (element, className) {
			checkElement(element);
			if (!className) throw new TypeError("Params error: expect 2");
			var oldClass = element.className.trim();
			if (oldClass.indexOf(className) < 0) return false;
			element.className = oldClass.replace(className, "");
		},
		include: function (element, className) {
			checkElement();
			if (!className) throw new TypeError("Params error: expect 2");
			return element.className.indexOf(className) >= 0;
		}
	}
}());


function LanceCarousel(carouselContainer) {
	if (!(carouselContainer instanceof Node)) 
		throw new TypeError("params Error: carouselContainer, expect a Node or it's subClass");
	this.carouselContainer = carouselContainer;
	this.imageItemList = [];  //{dom, caption(如果有intro，就给出caption)}
	this.lanceCarouselContainer = null;
	this.itemContainer = null;
	this.itemSequenceNumC = null;
	this.curItem = null;
	this.autoCarouselTimer = null;  //自动轮播定时器，方便关闭(停止)
	this._init();
}

LanceCarousel.prototype = (function () {
	var itemPxWidth = 0,
		itemNumSequenceSelectedItem = null;
	var transitionTimingFunction = {
		easeInOut: function (t,b,c,d) {
			if ((t/=d/2) < 1) return c/2*t*t + b;
        	return -c/2 * ((--t)*(t-2) - 1) + b;
		},
		easeIn: function (t,b,c,d) {
			return c*(t/=d)*t + b;
		},
		easeOut: function (t,b,c,d) {
			return -c *(t/=d)*(t-2) + b;
		}
	}

	function getElementWidth(element) {
		var rect = element.getBoundingClientRect();
		if (rect.width === undefined) 
			rect.width = rect.right - rect.left;
		return rect.width;
	}

	/**
	 * show imageItem detail info(if exist)
	 * @param  {imageItem} imgItem item from imageItemList
	 */
	function _showImageItemIntro(imgItemList, imgItem) {
		if (imgItemList.indexOf(imgItem) === 0 && imgItem.caption) {
			_showImageItemIntro([], {caption: imgItem.dom.parentNode.lastElementChild.firstElementChild});
		}
		if (imgItemList.length > 0 && imgItemList.indexOf(imgItem) === imgItemList.length - 1 && imgItem.caption) {
			_showImageItemIntro([], {caption: imgItem.dom.parentNode.firstElementChild.firstElementChild});
		}
		if (imgItem.caption) 
			Utils.HtmlElementClassNameHandler.addClassName(imgItem.caption, "showDetail");

	}

	/**
	 * hidden imageItem detail info(if exist)
	 * @param  {imageItem} imgItem item from imageItemList
	 */
	function _hiddenImageItemIntro(imgItemList, imgItem) {
		if (imgItemList.indexOf(imgItem) === 0 && imgItem.caption) {
			_hiddenImageItemIntro([], {caption: imgItem.dom.parentNode.lastElementChild.firstElementChild});
		}
		if (imgItemList.length > 0 && imgItemList.indexOf(imgItem) === imgItemList.length - 1 && imgItem.caption) {
			_hiddenImageItemIntro([], {caption: imgItem.dom.parentNode.firstElementChild.firstElementChild});
		}
		if (imgItem.caption) 
			Utils.HtmlElementClassNameHandler.removeClassName(imgItem.caption, "showDetail");
	}

	/**
	 * 右边: 从左往右 ->
	 * transition a imageItem(left or right)
	 * @param  {Object}  self    the context
	 * @param  {Boolean} isRight true: transite to right a item; false: transite to left a item
	 */
	function _animateAItem(self, isRight) {
		var allItemLen = self.imageItemList.length + 2,
			curLeft = self.itemContainer.style.left,
			duration = 1000,
			end = 0,
			change = 0,
			timingFunc = transitionTimingFunction[self.timingFuncName] ? transitionTimingFunction[self.timingFuncName] : transitionTimingFunction.easeInOut,
			startTime = new Date().getTime();
		curLeft = Math.abs(curLeft.slice(0, curLeft.length - 2));

		change = isRight ? -itemPxWidth : itemPxWidth;
		end = isRight ? curLeft - itemPxWidth : curLeft + itemPxWidth;
		function animateFunc() {
			var newTime = new Date().getTime(),
				timestamp = newTime - startTime;
			self.itemContainer.style.left = "-"+timingFunc(timestamp, curLeft, change, duration) + "px";
			if (duration <= timestamp) {
				//触底检测，过度
				if (end <= 0 && isRight)
					self.itemContainer.style.left = "-"+ itemPxWidth * (self.imageItemList.length) +"px";
				else if (end >= itemPxWidth * (self.imageItemList.length + 1)) 
					self.itemContainer.style.left = "-"+ itemPxWidth +"px";
				else
					self.itemContainer.style.left = "-" + end + "px";
			}else{
				setTimeout(arguments.callee, 25);
			}
		}
		setTimeout(animateFunc, 25);
	}

	/**
	 * transition some imageItem(left or right)
	 * @param  {Object}  self    context
	 * @param  {Number}  num     the number of imageItem want to transite
	 * @param  {Boolean} isRight is righr or left(false)
	 */
	function _animateSomeItem(self, num, isRight) {
		itemPxWidth = num * itemPxWidth;
		_animateAItem(self, isRight);
		itemPxWidth = itemPxWidth / num;
		for (var i = 0; i < num; i++) {
			if (isRight) 
				_prevNumSequence();
			else
				_nextNumSequence();
		}
	}

	/**
	 * start the auto Carousel animate
	 * @param  {Object} self context
	 */
	function _startAnimate(self) {
		if (self.imageItemList.length === 1) return;
		if(self.autoCarouselTimer !== null)
			return;
		var transiteSpeed = self.transiteSpeed?self.transiteSpeed:3000;
		console.log(transiteSpeed);
		function autoCarouselFunc() {
			_manualNextItem(self);
			self.autoCarouselTimer = setTimeout(autoCarouselFunc, 3000);
		}
		self.autoCarouselTimer = setTimeout(autoCarouselFunc, 3000);
	}
	
	/**
	 * end the auto Carousel animate
	 * @param  {Object} self context
	 */
	function _endAnimate(self) {
		clearTimeout(self.autoCarouselTimer);
		self.autoCarouselTimer = null;
	}

	/**
	 * manual next imageItem handler(click)
	 * @param  {Object} self context
	 */
	function _manualNextItem(self) {
		var res = _animateAItem(self, false);
		_hiddenImageItemIntro(self.imageItemList, self.curItem);
		_nextNumSequence();

		self.curItem = self.imageItemList.indexOf(self.curItem) + 1;
		self.curItem = self.curItem >= self.imageItemList.length?self.imageItemList[0]:self.imageItemList[self.curItem];
	}

	/**
	 * manual prev imageItem handler(click)
	 * @param  {Object} self context
	 */
	function _manualPrevItem(self) {
		var res = _animateAItem(self, true);
		_hiddenImageItemIntro(self.imageItemList, self.curItem);
		_prevNumSequence();

		self.curItem = self.imageItemList.indexOf(self.curItem) - 1;
		self.curItem = self.curItem < 0?self.imageItemList[self.imageItemList.length-1]:self.imageItemList[self.curItem];
	}

	/**
	 * manual to a item(click the sequence num)
	 * @param  {Object} self context
	 * @param  {Number} num  the index of the col
	 */
	function _manualToItem(self, num) {
		var curItemNum = self.imageItemList.indexOf(self.curItem) + 1,
			isRight = true;
		if (curItemNum === num || num <= 0 || num > self.imageItemList.length) 
			return;
		if (num > curItemNum) 
			isRight = false;
		_animateSomeItem(self, Math.abs(num - curItemNum), isRight);
		self.curItem = self.imageItemList[num - 1];
	}

	/**
	 * render the numSequence to next num
	 */
	function _prevNumSequence() {
		var item = itemNumSequenceSelectedItem;
		Utils.HtmlElementClassNameHandler.removeClassName(item, "imageSequenceNum-curNum");
		if (!item.previousElementSibling) 
			item = item.parentNode.lastElementChild;
		else
			item = item.previousElementSibling;
		Utils.HtmlElementClassNameHandler.addClassName(item, "imageSequenceNum-curNum");
		itemNumSequenceSelectedItem = item;
	}

	/**
	 * render the numSequence to previous num
	 */
	function _nextNumSequence() {
		var item = itemNumSequenceSelectedItem;
		Utils.HtmlElementClassNameHandler.removeClassName(item, "imageSequenceNum-curNum");
		if (!item.nextElementSibling) 
			item = item.parentNode.firstElementChild;
		else
			item = item.nextElementSibling;
		Utils.HtmlElementClassNameHandler.addClassName(item, "imageSequenceNum-curNum");
		itemNumSequenceSelectedItem = item;
	}

	/**
	 * render the num sequence
	 * @param  {Object} self     context
	 * @param  {Number} totalNum the total num
	 * @return {Element}          cur selected Element
	 */
	function _renderNumSequenceDom(self, totalNum) {
		if (totalNum === 1) return;
		var container = self.itemSequenceNumC,
			a = null,
			fragment = document.createDocumentFragment();
		container.innerHTML = "";
		for (var i = 1; i <= totalNum; i++) {
			a = document.createElement("a");
			a.href = "javascript: void(0)";
			a.innerHTML = i;
			if (i === 1) {
				a.className = "imageSequenceNum-curNum";
				itemNumSequenceSelectedItem = a;
			}
			a.setAttribute("data-num", i);
			fragment.appendChild(a);
		}
		container.appendChild(fragment);
	}

	/**
	 * update all image item each width
	 * @param  {self} self  context
	 * @param  {Number} width the percent width of each items
	 */
	function _updateAllImageItemWidth(self, width) {
		var children = self.itemContainer.children;
		for (var i = 0; i < children.length; i++) {
			if (children[i].tagName !== "DIV") continue;
			children[i].style.width = width + "%";
		}
	}

	/**
	 * create a image item
	 * @param  {Object} itemInfo a Array item from user set(imgInfos)
	 * @param  {Number} width    the image item width with px
	 */
	function _createAImageItem(itemInfo, width) {
		var itemDom = null,
				captionDom = null,
				item = {};
			//itemDom operate
			itemDom = document.createElement("div");
			itemDom.className = "carouseItem";
			itemDom.style.backgroundImage = "url("+itemInfo.imgSrc+")";
			itemDom.style.width = width + "%";

			//caption Dom operate
			captionDom = document.createElement("div");
			captionDom.className = "carouseItem-intro";
			itemInfo.toLinkSrc = itemInfo.toLinkSrc?itemInfo.toLinkSrc:'javascript: void(0)';
			itemInfo.title = itemInfo.title?itemInfo.title:'';
			itemInfo.intro = itemInfo.intro?itemInfo.intro:'';

			captionDom.innerHTML = "<a href="+itemInfo.toLinkSrc+ ">" +
			"<h3>"+itemInfo.title+"</h3></a>" +
			"<p>"+itemInfo.intro+"</p>";

			itemDom.appendChild(captionDom);

			//item
			item.dom = itemDom;
			item.caption = itemInfo.intro?captionDom:null;

			return item;
	}

	var proto = {
		constructor: LanceCarousel,

		/**
		 * add images into the carousel (propose: 尽量一次性将所有图片及其标题和简介添加完毕)
		 * @param {Array} imgInfos [{imgSrc, toLinkSrc, title, intro}...]
		 * 
		 */
		setCarouselItem: function (imgInfos) {
			//param check
			if (Object.prototype.toString.call(imgInfos).indexOf("Array") < 0) 
				throw new TypeError("params error: imgInfos, expect a Array");
			if (imgInfos.length === 0) 
				return;

			var item = null,
				totalNum = 0,
				itemWidth = 0,
				containerWidth = 0,
				itemContainer = this.itemContainer,
				imageItemList = this.imageItemList,
				fragment = document.createDocumentFragment(),
				isAdd = false,
				i;

			//clear before and after
			if (imageItemList.length > 1) {
				itemContainer.removeChild(itemContainer.firstElementChild);
				isAdd = true;
			}

			totalNum = imageItemList.length + imgInfos.length;
			totalNum += totalNum > 1 ? 2 : 0; //add 2 ext(before and after)
			itemWidth = (100 / (totalNum)).toString().slice(0, 9);
			containerWidth = (totalNum) * 100;

			//render num list
			_renderNumSequenceDom(this, imageItemList.length + imgInfos.length);

			//update old item width
			_updateAllImageItemWidth(this, itemWidth);
			for (i = 0; i < imgInfos.length; i++) {
				item = _createAImageItem(imgInfos[i], itemWidth);
				//add
				fragment.appendChild(item.dom);
				imageItemList.push(item);
			}

			this.curItem = imageItemList[0];

			//add image before and after
			if (!isAdd && totalNum > 1){
				fragment.insertBefore(_createAImageItem(imgInfos[imgInfos.length-1], itemWidth).dom, fragment.firstElementChild);
				fragment.insertBefore(_createAImageItem(imgInfos[0], itemWidth).dom, null);
			}

			//add all
			if (isAdd) {
				itemContainer.insertBefore(_createAImageItem(imgInfos[imgInfos.length-1], itemWidth).dom, itemContainer.firstElementChild);
				itemContainer.insertBefore(fragment, itemContainer.lastElementChild);
			}
			else
				itemContainer.appendChild(fragment);

			itemPxWidth = totalNum > 1 ? itemPxWidth : 0;
			//set Container
			itemContainer.style.width = containerWidth + "%";
			itemContainer.style.left = "-"+itemPxWidth+"px";
		},

		_initEventLis: function () {
			var self = this;
			//click handler
			this.lanceCarouselContainer.addEventListener("click", function (event) {
				var target = event.target,
					className = "",
					sequenceNum = "";
				if (target.tagName !== "A" || self.imageItemList.length <= 1) 
					return;
				className = target.className;
				sequenceNum = target.getAttribute("data-num");
				if (className && className.indexOf("carousel-ctl") >= 0) {
					if (className.indexOf("carousel-pre") >= 0) {
						_manualPrevItem(self);
					}else{
						_manualNextItem(self);
					}
					return;
				}
				if (sequenceNum) {
					_manualToItem(self, Number(sequenceNum));
				}
			});

			//mouseEnter
			this.lanceCarouselContainer.addEventListener("mouseenter", function (event) {
				_endAnimate(self);
				_showImageItemIntro(self.imageItemList, self.curItem);
			});

			//mouseLeave
			this.lanceCarouselContainer.addEventListener("mouseleave", function (event) {
				_startAnimate(self);
				_hiddenImageItemIntro(self.imageItemList, self.curItem);
			});

		},

		/**
		 * set timing function(means the transition type of the animation)
		 * @param {String} timingFuncName name of the timingFunction
		 */
		setTimingFunction: function (timingFuncName) {
			this.timingFuncName = timingFuncName;
		},

		/**
		 * set the animation speed level(high: 3s, middle: 4s, low: 5s)
		 * @param {Number} level the level Number 1: low, 2: middle, 3: hight
		 */
		setSpeedLevel: function (level) {
			var speed = 6 - parseInt(level);
			if (speed.toFixed && speed > 2 && speed < 6) 
				this.transiteSpeed = speed * 1000;
			else
				this.transiteSpeed = 4000;
		},

		_init: function () {
			this.carouselContainer.innerHTML = "<div id='lanceCarouselContainer'>"
				+ "<a href='javascript: void(0)' class='carousel-ctl carousel-pre'>&lt;</a>"
				+ "<div class='lanceCarouse-imgContainer' style=''></div>"
				+ "<div class='lanceCarouse-imageSequenceNum'>"
				+ "</div>"
				+ "<a href='javascript: void(0)' class='carousel-ctl carousel-next'>&gt;</a>"
			+ "</div>";
			this.lanceCarouselContainer = this.carouselContainer.firstElementChild;
			this.itemContainer = this.lanceCarouselContainer.querySelector(".lanceCarouse-imgContainer");
			this.itemSequenceNumC = this.itemContainer.nextElementSibling;
			itemPxWidth = getElementWidth(this.lanceCarouselContainer);
			this._initEventLis();
		},

		start: function () {
			_startAnimate(this);
		}
	}
	return proto;
}());