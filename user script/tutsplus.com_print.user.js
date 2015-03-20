// ==UserScript==
// @name        tutsplus.com print
// @namespace   webpatch@sina.com
// @include     /^http://.*\.tutsplus\.com/.*/
// @version     1
// @grant       GM_log
// @require     https://code.jquery.com/jquery-1.7.2.min.js
// @require     https://raw.githubusercontent.com/webpatch/ScrapBookPageCleaner/master/comm.js
// ==/UserScript==


// The content's css selector that you want extracted it.
// like ".article"
let holdTag = "main .layout__offset-content-with-sidebar--post"


// The tags selector that you want to remove. 
let removeTags = [
  ".content-header__social-share-links",
  ".content-header__category"
];


// Inject custom css style
let css = function(){  
/* 
  .post-body,.post__header {
     max-width: inherit;
   }
   article{padding:1em;}
   .content{
     max-width: inherit;
   }
   .content-header{margin:0}
   .content{margin:0 auto;}
   .post{margin:0}
   .layout__offset-content-with-sidebar {
     float: none;
     width: auto;
    }
*/
};

// start injection
setup();