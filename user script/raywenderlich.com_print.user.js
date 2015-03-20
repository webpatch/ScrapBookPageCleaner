// ==UserScript==
// @name        raywenderlich.com print
// @namespace   webpatch@sina.com
// @include     /^http://www\.raywenderlich\.com/\d+/\S+/
// @version     1
// @grant       GM_log
// @require     http://cdn.cocimg.com/cms/templets/js/jquery-1.7.2.min.js
// @require     https://raw.githubusercontent.com/webpatch/ScrapBookPageCleaner/master/comm.js
// ==/UserScript==

// The content's css selector that you want extracted it.
// like ".article"
let holdTag = "article"

// The tags selector that you want to remove. 
let removeTags = [
  ".social-links"
];


// Inject custom css style
let css = function(){  
/* 
  article{border:0;}
  html{background:#fff}
  #main{padding:0}
  .wrapper{max-width:inherit;width:auto;}
  article:hover, .rw-module:hover{box-shadow:none;}
  #primary-container,#primary{margin:0;float:none;}
*/
};

// start injection
setup();
