
const Request = require("sdk/request").Request;
const tabs = require("sdk/tabs");
const self = require("sdk/self");
const fileIO = require("sdk/io/file");
const data = require("sdk/self").data;
const {storage} = require("sdk/simple-storage");
const events = require("sdk/system/events");
const { MatchPattern } = require("sdk/util/match-pattern");
const panels = require("sdk/panel");
const { Cc, Ci } = require('chrome');
const fileCom = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile);
const process = Cc["@mozilla.org/process/util;1"].createInstance(Ci.nsIProcess);
//
const helper = require("./helper.js");

// path
const profilePath = require('sdk/system').pathFor('ProfD');
const extensionPath = fileIO.join(profilePath,"pageCleaner");
const rulesPath = fileIO.join(extensionPath,"res.json");

const RULES_LOADED_COMPLETE = "rules_loaded_complete";
const rulesURL = "https://raw.githubusercontent.com/webpatch/Web-Page-Cleaner/master/rules.json";
const verURL = "https://raw.githubusercontent.com/webpatch/Web-Page-Cleaner/master/version.json";

const disableState = "./disable-icon-16.png";
const defaultState = "./icon-16.png";

var isDisable= false;
var tmpVersion = null;
var rulesList = null;

fileCom.initWithPath("/usr/bin/open");
var args = ["-e",rulesPath];
process.init(fileCom);
fileIO.mkpath(extensionPath);

console.log(rulesPath)

const { MenuButton } = require('./menu-button');
var button = MenuButton({
  id: 'my-menu-button',
  label: 'My menu-button',
  icon: defaultState,
  disabled: true,
  onClick: onClick
});

function onClick(state, isMenu,cid) {
  if (state.disabled) return;
  if (isMenu) {
    if (cid !== undefined)
    {
      process.run(false,args,args.length);
    }
  } else {
    isDisable = !isDisable;
    button.icon = isDisable ? disableState : defaultState;
    tabs.activeTab.reload();
  }
}

function loadRulesFromRemote()
{
  helper.downloadFile(rulesURL,function(){
    storage.lastUpdateDate = (new Date()).getTime();
    console.log("remote load success \n",this.responseText);
    events.emit(RULES_LOADED_COMPLETE,this.responseText);
    helper.writeTextToFile(txt,rulesPath);
  },function(){
    console.log("remote load fail");
    loadRulesFromLocal()
  })
}

function loadRulesFromLocal(onFail)
{
  if(fileIO.exists(rulesPath))
  {
    events.emit(RULES_LOADED_COMPLETE,helper.readTextFromFile(rulesPath));
  }else{
    if (onFail){
      onFail();
    }else{
      throw new Error("load local rules file error!")
    }
  }
}

function getMatchRules(href,rules)
{
  for each (r in rules)
  {
    var pattern = new MatchPattern(r["site"]);
    if (pattern.test(href))
    {
      return r;
    }
  }
  return null;
}

// var jsonObj = null;
function onRulesLoaded (event) {
  console.log("get file complete");
  button.state("window",{"disabled":false})
  var jsonObj = JSON.parse(event.data);
  tabs.on('ready', function(tab) {
    if (!isDisable){
      var rs = getMatchRules(tab.url,jsonObj.rules);
      if (rs !== null){
        var worker = tab.attach({
          contentScriptFile: [self.data.url("jquery-1.7.2.min.js"),self.data.url("handler.js")]
        });
        worker.port.emit("drawBorder",rs.obj);
      }
    }
  });
}
events.on(RULES_LOADED_COMPLETE,onRulesLoaded);

function trace(obj)
{
  console.log(obj)
}

trace(storage.lastUpdateDate)

if (storage.lastUpdateDate && helper.datePassedHours(storage.lastUpdateDate) <= 6) {
  loadRulesFromLocal(function(){
    loadRulesFromRemote();
  });
}else{
  loadRulesFromRemote();
}