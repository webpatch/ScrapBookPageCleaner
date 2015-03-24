﻿// ==UserScript==
// @name        Web page cleaner
// @namespace   webpatch@sina.com
// @include     http://www.cocoachina.com/*
// @include     http://www.justinyan.me/post/*
// @include     http://onevcat.com/*
// @include     http://blog.devtang.com/blog/
// @version     1
// @grant       GM_log
// @grant       GM_xmlhttpRequest
// @require     https://code.jquery.com/jquery-1.7.2.min.js
// @downloadURL https://raw.githubusercontent.com/webpatch/Web-Page-Cleaner/master/cleaner.user.js
// @updateURL   https://raw.githubusercontent.com/webpatch/Web-Page-Cleaner/master/cleaner.meta.js
// ==/UserScript==


this.$ = this.jQuery = jQuery.noConflict(true);

function insertCSS (cssText) {
  var a = document.createElement("link");
  a.rel = "stylesheet";
  a.href = "data:text/css,"+encodeURIComponent(cssText);
  document.getElementsByTagName("head")[0].appendChild(a);
}

function cleanTags(tags) {
  for each (i in tags)
  {
    $(i).remove();
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

GM_xmlhttpRequest({
  method: "GET",
  url: "https://raw.githubusercontent.com/webpatch/Web-Page-Cleaner/master/rules.txt",
  onload: function(response) {
    var rules = JSON.parse(response.responseText)
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
  }
});

