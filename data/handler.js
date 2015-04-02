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
  if(e == undefined) return ;
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

self.port.on("drawBorder", function(rules) {
	applyRules(rules);
});

function applyRules(r)
{
  cleanTagsExclude(r["hold"])
  insertCSS(r["css"])
  cleanTags(r["delete"])
}

function killErrors() {
  return true;
}
window.onerror = killErrors; 