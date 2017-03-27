var animateFunctionTween = {
	easeIn: function(t,b,c,d){
        return c*(t/=d)*t + b;
      },
      easeOut: function(t,b,c,d){
        return -c *(t/=d)*(t-2) + b;
      },
      easeInOut: function(t,b,c,d){
        if ((t/=d/2) < 1) return c/2*t*t + b;
        return -c/2 * ((--t)*(t-2) - 1) + b;
      }
}
function getViewportSize(w) {
	//使用指定窗口，如不带参赛则使用当前窗口
	w = w || window;

	if (w.innerHeight != null) return {w: w.innerWidth, h: w.innerHeight};

	var d = w.document;
	if (document.compatMode == "CSS1Compat") //标准模式下IE
		return {
			w: d.documentElement.clientWidth,
			h: d.documentElement.clientHeight
		};

	//怪异模式下
	return {w: d.body.clientWidth, h: d.body.clientHeight};
}

function BackToTop(element) {
	this.element = document.querySelector(element);
	this.isInit = false;
	this.isShow = false;
	this._init();
}

BackToTop.prototype = (function () {
	function _hiddenBackTop() {
		if (!this.isShow) return;
		this.element.style.display = "none";
		this.isShow = false;
	}
	function _showBackTop() {
		if (this.isShow) return;
		this.element.style.display = "block";
		this.isShow = true;
	}
	function _initEventLis(){
		var self = this,
			halfWinHeight = getViewportSize().h / 2;
		window.addEventListener("scroll", function(event){ //计划部署函数防抖/节流
			//滑动了大于半个窗体就显示backToTop空间
			if (window.pageYOffset > halfWinHeight) _showBackTop.call(self);
			else _hiddenBackTop.call(self);
		});
		this.element.addEventListener("click", function(event){
			self.toTop();
		});
	}
	return {
		_init: function () {
			if (this.isInit) return;
			this.isInit = true;
			_initEventLis.call(this);
		},
		toTop: function () {
			var begin = window.pageYOffset,
				end = 0,
				duration = 500,
				change = - begin,
				startTime = new Date().getTime();

			function animateFunc() {
				var curTime = new Date().getTime(),
					timeStamp = curTime - startTime;
				window.scroll(0, animateFunctionTween.easeInOut(timeStamp, begin, change, duration));
				if (duration <= timeStamp) {
					window.scroll(0, end);
				}else{
					setTimeout(animateFunc, 25);
				}
			}
			setTimeout(animateFunc, 25);
		}
	}
}());