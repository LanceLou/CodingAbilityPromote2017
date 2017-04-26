// mask基准高度为54px
var hTitlesObj = [],
	navMask = document.querySelector('.mark-block'),
	curNavId = 0;

var createALi = (function () {
	var id = 0,
		li = null;
	return function (text) {
		li = document.createElement('li');
		li.innerHTML = '<a href="javascript: void(0)" data-at-id = "'+id+'">'+text+'</a>';
		id++;
		return li;
	}
})();

function generateList(hTitles) {
	var fragment = document.createDocumentFragment(),
		curTagLev = hTitles[0].tagName[1] - 0,
		item = null,
		res = null,
		ul = null;
	for (var i = 0; i < hTitles.length; i++) {
		item = hTitles[i];
		if (curTagLev == item.tagName[1]) {
			fragment.appendChild(createALi(item.innerText));
		}else if (curTagLev > item.tagName[1]) {
			return fragment;
		}else {
			//curTagLev < item.tagName[1]
			ul = document.createElement('ul');
			res = generateList(Array.prototype.slice.call(hTitles, i));
			ul.appendChild(res);
			fragment.lastElementChild.appendChild(ul);
			i = i + ul.children.length - 1;
		}
	}
	return fragment;
}

function generateNavList(navListContainer) {
	//第几个item，方便最终浮动模块去定位
	var itemsId = 1,
		scrollY = window.scrollY,
		hTitles = document.querySelectorAll('[class^="at-le-"]');
	
	//既然id是数字，直接以数组下标作为id
	//http://es6.ruanyifeng.com/#docs/iterator#for---of循环
	hTitlesObj = Array.prototype.map.call(hTitles, function (item) {
		//生成内部标题数组方便判断，数组的键即为id
		return {
			dom: item,
			top: item.getBoundingClientRect().top + scrollY
		}
	});
	navListContainer.appendChild(generateList(hTitles));
}

//到达文章的某个位置，通过nav list对应的a标签的data-at-id
function toArticlePart(id) {
	moveNavMask(id);
	window.scrollTo(0, hTitlesObj[id].top)
	curNavId = id;
}

function moveNavMask(id) {
	navMask.style.top = 54 + id * 27 + 'px';
	curNavId = id;
}

function initEventList(navListContainer) {
	var timer = null;
	//目录点击事件监听，文章主题联动
	navListContainer.addEventListener('click', function (event) {
		var target = event.target;
		if (target.tagName !== 'A') return;
		toArticlePart(target.getAttribute('data-at-id'));
		//点击完之后让滚动条动一下，方便documentScrollHandler去调节到底该显示那一块，以防触底影响联动，具体效果可移除下面代码进行测试
		window.scrollTo(0, window.scrollY - 1);
	});

	//文章滚动，目录联动，防抖
	document.addEventListener('scroll', function (event) {
		if (timer) return;
		timer = setTimeout(function () {
			documentScrollHandler();
			timer = null;
		}, 100);
	});
}

function documentScrollHandler() {
	/*根据文章的滚动来联动目录
		solution:
			页面加载完成就获取初始的top, 也可以说是相对于文档的位置，将其存入数组
			数组: [{dom, top}]
	 */
	
	//加20px的缓冲，便于联动，而不误判
	var scrollY = window.scrollY + 20,
		i = 0;
	//找到最后一个比scrolly小的
	for (i = 0; i < hTitlesObj.length; i++) {
		if (hTitlesObj[i].top > scrollY) break;
	}
	//i =0 -> i = 0 else i--
	i = i ? --i : i;
	if (curNavId == i) return;
	moveNavMask(i);
}

function main() {
	var navListContainer = document.querySelector('#at-catalogue').querySelector('ul');
	generateNavList(navListContainer);
	initEventList(navListContainer);
}
window.addEventListener('load', main);