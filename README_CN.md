# 网文清理工
清除网页中多余的元素，只保留文章的主要内容，并通过自定义样式获得更佳的阅读体验。

![enter image description here](https://raw.githubusercontent.com/webpatch/Web-Page-Cleaner/master/screenshot/preview.gif)

##需要
软件：Firefox浏览器 、Greasemonkey 插件  
技能：HTML、CSS基础知识

##主要功能

1. 智能剔除网页中非主要内容的HTML标签
2. 可指定需要批量删除的HTML标签
3. 可自定义添加网页样式(CSS)

##如何使用？
###安装 Greasemonkey 插件
https://addons.mozilla.org/zh-cn/firefox/addon/greasemonkey/

###安装脚本

我已经制作了一些脚本例子，并且会持续添加、更新。如果找不到你所需要的脚本，你可自己动手制作。很简单，仅需几分钟就能完成一个。具体请参考：**“添加其它站点支持”**

下载下列脚本, 拖拽已下载完成的js文件至火狐浏览器内，点击安装!

[ 下载用户脚本](https://github.com/webpatch/Web-Page-Cleaner/tree/master/user%20script)

> 新装、激活、取消激活脚本时，记得重新加载下页面，方可生效！
###添加其它站点支持
####设置脚本模板
点击Greasemonkey图标 -> Greasemonkey选项 

![enter image description here](https://raw.githubusercontent.com/webpatch/Web-Page-Cleaner/master/screenshot/1.png)

修改“新建脚本模板”内容

![enter image description here](https://raw.githubusercontent.com/webpatch/Web-Page-Cleaner/master/screenshot/3.png)

粘贴入下面代码，确定
```
// ==UserScript==
// @name        %name%
// @namespace   %namespace%
// @description %description%
// @include     %include%
// @exclude     %exclude%
// @version     1
// @grant       GM_log
// @require     https://code.jquery.com/jquery-1.7.2.min.js
// @require     https://raw.githubusercontent.com/webpatch/ScrapBookPageCleaner/master/comm.js
// ==/UserScript==

// 需要提取内容容器的css选择器
// 如 ".article"
let holdTag = ""

// 需要删除的容器的css选择器
let removeTags = [
  
];

// 需要注入的自定义css代码
// /* 及 */ 不可删除
let css = function(){  
/* 
  
*/
};

// 开始注入
setup();
```
####新建脚本
点击Greasemonkey图标 -> 新建用户脚本

![enter image description here](https://raw.githubusercontent.com/webpatch/Web-Page-Cleaner/master/screenshot/1.png)

填入名称 (任意)，修改“脚本应用到（每条一行）”，设置需要应用该脚本的页面。可使用通配符`*`，及正则表达式

![enter image description here](https://raw.githubusercontent.com/webpatch/Web-Page-Cleaner/master/screenshot/4.png)

####修改脚本变量
根据需要修改`holdTag`、`removeTags`、`css`变量，可任意组合。

![enter image description here](https://raw.githubusercontent.com/webpatch/Web-Page-Cleaner/master/screenshot/2.png)

#####变量说明

|变量|变量类型|说明|
|---|---|---|
|`holdTag`|字符串类型|需要提取内容的容器选择器|
|`removeTags`|字符串数组|需要删除的容器选择器|
|`css`|多行文本|自定义的css文本，注意不能删除`/* */`注释符|

> 以上选择器都基于jQuery

#####例子
```
let holdTag = ".article"
let removeTags = [
  ".footer",
  "#nav"
];
let css = function(){  
/* 
  .article{padding:0;margin:0;background-color:#fff;}
  .post{width:auto;}
*/
};
```
保存，然后刷新当前网页


