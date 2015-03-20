# Web Page Cleaner  [中文介绍](https://github.com/webpatch/Web-Page-Cleaner/blob/master/README_CN.md)
Clear extra HTML elements, leaving only the main contents of the article, and through custom CSS style for better reading experience.

![enter image description here](https://raw.githubusercontent.com/webpatch/Web-Page-Cleaner/master/screenshot/e_preview.gif)

##Require

Software: `Firefox`,`Greasemonkey` addon

Skill: `HTML`,`CSS`

##Main feature

1. Automatic remove redundant HTML tags by assigned the hold tag
2. Batch remove the assigned HTML tags
3. Inject custom CSS

##How to use？
###Install Greasemonkey
https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/

###Set script template
Click Greasemonkey Icon -> Greasemonkey options 

![enter image description here](https://raw.githubusercontent.com/webpatch/Web-Page-Cleaner/master/screenshot/e_1.png)

modify the content of “New script template” 

![enter image description here](https://raw.githubusercontent.com/webpatch/Web-Page-Cleaner/master/screenshot/e_3.png)

Paste the following code. Confirm
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


// The content's css selector that you want extracted it.
// like ".article"
let holdTag = ""


// The tags selector that you want to remove. 
let removeTags = [
  
];


// Inject custom css style
let css = function(){  
/* 
  
*/
};

// start injection
setup();
```
###Create new script
Click the Greasemonkey Icon -> new user script

![enter image description here](https://raw.githubusercontent.com/webpatch/Web-Page-Cleaner/master/screenshot/e_1.png)

Input the name ,modify "includes" - that's which pages you want this script to apply . You can use wildcard `*` or regular expression.

![enter image description here](https://raw.githubusercontent.com/webpatch/Web-Page-Cleaner/master/screenshot/e_4.png)

###Modify variables 

![enter image description here](https://raw.githubusercontent.com/webpatch/Web-Page-Cleaner/master/screenshot/e_2.png)

####Variables description
All you have to do is modify the three variables, and it will change the page's appearance.

|variables|type|description|
|---|---|---|
|`holdTag`|string|The article's container tag selector|
|`removeTags`|string array|The container's tag selectors that need to be removed|
|`css`|multi-line string|custom css text <br><b>Warning: Don't delete `/* */`<b>|

> All tag selector based on jQuery

####Example

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
Save, and reload the web page.

