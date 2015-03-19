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

function cleanTagsExclude(e){
  if (e[0].tagName == "BODY") return; 
  e.siblings().each(
    function(){
      var name = this.tagName
      if (name != "SCRIPT" && name != "LINK")
      {
        $(this).remove()
      }
    }
  )
  cleanTagsExclude(e.parent())
}

function setup()
{
  cleanTagsExclude($(holdTag));
  cleanTags(removeTags);
  insertCSS(css.getMultilines());
}
