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
