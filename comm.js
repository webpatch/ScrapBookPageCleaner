Function.prototype.getMultilines = function () {  
  var lines = new String(this);  
  lines = lines.substring(lines.indexOf("/*")+3, lines.lastIndexOf("*/"));  
  return lines;  
} 

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

function cleanTagsExclude(tagStr){
  var e = $(tagStr)
  if (e.parent()[0].tagName != "BODY")  {
    e.parent().siblings().each(
      function(){
        if (this.tagName != "SCRIPT" && this.tagName != "LINK")
        {
          $(this).remove()
        }
      }
    )
    
    cleanTagsExclude(e.parent())
  }
}

function setup()
{
  cleanTagsExclude(holdTag);
  cleanTags(removeTags);
  insertCSS(css.getMultilines());
}
