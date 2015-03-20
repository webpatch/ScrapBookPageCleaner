// ==UserScript==
// @name        justinyan.me
// @namespace   webpatch@sina.com
// @include     http://www.justinyan.me/post/*
// @version     1
// @grant       GM_log
// @require     https://code.jquery.com/jquery-1.7.2.min.js
// @require     https://raw.githubusercontent.com/webpatch/ScrapBookPageCleaner/master/comm.js
// ==/UserScript==


// The content's css selector that you want extracted it.
// like ".article"
let holdTag = "article"


// The tags selector that you want to remove. 
let removeTags = [
  "footer",
  ".section_separator",
  ".wp-posturl"
];


// Inject custom css style
let css = function(){  
/* 
  #content {
    margin: 0 1em;
    width: auto;
  }
  body{border-top:0;}
*/
};

// start injection
setup();