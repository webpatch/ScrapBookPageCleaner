// ==UserScript==
// @name        Web page cleaner
// @namespace   webpatch@sina.com
// @include     http://www.cocoachina.com/*
// @include     http://www.justinyan.me/post/*
// @include     http://onevcat.com/*
// @include     http://blog.devtang.com/blog/
// @version     1
// @grant       none
// @require     https://code.jquery.com/jquery-1.7.2.min.js
// @downloadURL https://raw.githubusercontent.com/webpatch/Web-Page-Cleaner/master/cleaner.user.js
// @updateURL   https://raw.githubusercontent.com/webpatch/Web-Page-Cleaner/master/cleaner.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);

function insertCSS (cssText) {
  var a = document.createElement("link");
  a.rel = "stylesheet";
  a.href = "data:text/css,"+encodeURIComponent(cssText)
  document.getElementsByTagName("head")[0].appendChild(a)
}

function cleanTags(tags) {
  for each (i in tags)
  {
    $(i).remove()
  }
}

function cleanTagsExclude(e){
  var tag = $(e);
  if (tag[0].tagName == "BODY") return; 
  tag.siblings().each(
    function(){
      var name = this.tagName;
      if (name != "SCRIPT" && name != "LINK")
      {
        $(this).remove();
      }
    }
  )
  cleanTagsExclude(tag.parent());
}


var rules = [
  {
    "site":"http://www.cocoachina.com/*",
    "hold":".detail-main",
    "delete":["#comiframe",".part-wrap",".wx_article",".crumbs",".tgbox",".article-prev",".article-next","#zanbox"],
    "css":".middle,.detail-left{width: auto !important;}.float-l{float: inherit}.info-detail, .detail-left{padding: 0;}.detail-left .detail-main{background-color:#fff;border: none}"
  },
  {
    "site":"http://www.justinyan.me/post/*",
    "hold":"article",
    "delete":["footer",".section_separator",".wp-posturl"],
    "css":"#content{margin: 0 1em;width: auto;} body{border-top:0;}"
  },
  {
    "site":"http://onevcat.com/*",
    "hold":"article",
    "delete":[".post-comments",".post-meta"],
    "css":".content-wrapper{margin-left: 0;width: auto;}.content-wrapper__inner{margin:1em;padding:0;}"
  },
  {
    "site":"http://blog.devtang.com/blog/*",
    "hold":"article.hentry",
    "delete":["footer"],
    "css":"#content{margin:0}body{max-width:inherit}body > header, body > nav, body > footer, body #content > article, body #content > div > article, body #content > div > section{padding:2em}"
  },
  {
    "site":"^http://www\.raywenderlich\.com/\d+/\S+",
    "hold":"article",
    "delete":[".social-links"],
    "css":"article{border:0;}html{background:#fff}#main{padding:0}.wrapper{max-width:inherit;width:auto;}article:hover, .rw-module:hover{box-shadow:none;}#primary-container,#primary{margin:0;float:none;}"
  }
]

var href = window.location.href;
for each (r in rules)
{
  var reg = new RegExp(r["site"])
  if (reg.test(href) !== false)
  {
    cleanTagsExclude(r["hold"])
    insertCSS(r["css"])
    cleanTags(r["delete"])
    break;
  }
}