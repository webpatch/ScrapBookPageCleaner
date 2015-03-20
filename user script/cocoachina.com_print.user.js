// ==UserScript==
// @name        cocoachina.com print
// @namespace   webpatch@sina.com
// @include     /^http://www\.cocoachina\.com/\S+/\d+/.*/
// @version     1
// @grant       GM_log
// @require     http://cdn.cocimg.com/cms/templets/js/jquery-1.7.2.min.js
// @require     https://raw.githubusercontent.com/webpatch/ScrapBookPageCleaner/master/comm.js
// ==/UserScript==

// 
var holdTag = ".detail-main";

//
var removeTags = [
        "#comiframe",
        ".part-wrap",
        ".wx_article",
        ".crumbs",
        ".tgbox",
        ".article-prev",
        ".article-next",
        "#zanbox"
      ];

//
var css = function(){
          /* 
            .middle,.detail-left{width: auto !important;}
            .float-l{float: inherit}
            .info-detail, .detail-left{padding: 0;}
            .detail-left .detail-main{background-color: #fff;border: none}
          */
      };

setup()
