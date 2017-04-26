# CodingAbilityPromote2017


> 针对近期参见面试的一些回馈，发现自己确实在编码方面还有一些不足和缺陷，经验的积累严重不足，像兼容问题，一些细节的问题没有体会。遂提出CodingAbilityPromote2017计划，希望就此计划，对自己的编码能力和动手能力有一些提升。

初衷
---
通过前后大概10至20个编码的小项目，也类似于面试中的编程题，来实现编码能力的提升。此次编码能力提升计划只针对项目，具体使用场景，并非从技术点出发。

同时，我也会将部分小项目的心得同步到我的个人Blog，欢迎各路英雄好汉指导。

CodingProjectList
---

一. 搜索框自动完成功能

> 写代码用原生JS实现一个类似百度搜索框的自动完成控件，比如候选结果集arr=['aaa', 'abc', 'acc', 'dda',...]; 用户输入'a',下拉列表会出现以字母a开头的项'aaa', 'abc', 'acc'。
> 
> 要求：
> 
> 1. 鼠标或键盘可以选中候选结果到输入框> 2. 兼容IE8+/chrome> 3. 做题时间45分钟

源码地址: [https://github.com/LanceLou/CodingAbilityPromote2017/tree/master/autoCompleteInSearch](https://github.com/LanceLou/CodingAbilityPromote2017/tree/master/autoCompleteInSearch)

二. Carousel Model(轮播组件)

> 使用原生JS实现一个轮播组件。
> 
> 要求:
> 
> 1. 鼠标进入，停止轮播
> 2. 自动轮播加上下按钮
> 4. 兼容IE8+/Chrome
>

源码地址: [https://github.com/LanceLou/CodingAbilityPromote2017/tree/master/lanceCarousel](https://github.com/LanceLou/CodingAbilityPromote2017/tree/master/lanceCarousel)

三. Magnifier放大镜实现

> 使用JavaScript或CSS3实现一个放大镜
> 
> 要求:
> 
> 1. 兼容IE8
> 2. 交互效果优美

源码地址: [https://github.com/LanceLou/CodingAbilityPromote2017/tree/master/magnifier](https://github.com/LanceLou/CodingAbilityPromote2017/tree/master/magnifier)

四. backToTop组件

> 实现一个backToTop组件，点击按钮，回调顶端
> 
> 要求:
> 
> 1. 兼容IE8+
> 2. 交互优
> 

源码地址: [https://github.com/LanceLou/CodingAbilityPromote2017/tree/master/backToTop](https://github.com/LanceLou/CodingAbilityPromote2017/tree/master/backToTop/)


五. 实现一个类似segmentfault文章目录滚动显示组件

>
>实现如图
>
![demo](./demoImgs/article-list.png)
>
>要求
>
> 1. 位置在页面右边固定
> 2. 文章移动的时候目录列表跟随变化到对应的item
> 3. 点击目录列表时候文章内容跟随移动
>

源码地址: [https://github.com/LanceLou/CodingAbilityPromote2017/tree/master/articleHeaderIndex](https://github.com/LanceLou/CodingAbilityPromote2017/tree/master/articleHeaderIndex)

六. LazyMan

> 实现一个LazyMan，可以按照以下方式调用
> 
> LazyMan("Hank")，可以按照以下方式输出: Hi! This is Hank!
> 
> LazyMan("Hank").sleep(10).eat("dinner")输出: Hi! This is Hank!，等待10s，Wake up after 10; Eat dinner!
> 
> LazyMan("Hank").sleep(10).eat("dinner")输出: Hi! This is Hank! Eat dinner~ Eat supper~
>
> LazyMan("Hank").sleepFirst(5).eat("supper")输出: Wake up after 5， Hi This is Hank! Eat supper
> 
> 以此类推




预备: backToTop，随机洗牌程序。


