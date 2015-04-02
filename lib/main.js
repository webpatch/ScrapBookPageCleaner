
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
const runtime = require("sdk/system/runtime");
const fileCom = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile);
const process = Cc["@mozilla.org/process/util;1"].createInstance(Ci.nsIProcess);
//
const helper = require("./helper.js");
// path
const profilePath = require('sdk/system').pathFor('ProfD');
const extensionPath = fileIO.join(profilePath,"pageCleaner");
const rulesPath = fileIO.join(extensionPath,"default.json");
const customRulesPath = fileIO.join(extensionPath,"custom.json");

const RULES_LOADED_COMPLETE = "rules_loaded_complete";
const rulesURL = "https://raw.githubusercontent.com/webpatch/Web-Page-Cleaner/master/rules.json";

const disableState = "./disable-icon-16.png";
const defaultState = "./icon-16.png";

var isDisable= false;
var tmpVersion = null;
var rulesList = null;

var args = [customRulesPath];

var program = "/usr/bin/open";
if(runtime.OS == "WINNT")
{
  program = "c:\windows\notepad.exe";
}

fileCom.initWithPath(program);
process.init(fileCom);
fileIO.mkpath(extensionPath);

const { MenuButton } = require('./menu-button');
var button = MenuButton({
  id: 'page-cleaner',
  label: 'Page cleaner',
  icon: defaultState,
  disabled: true,
  onClick: onClick
});

function onClick(state, isMenu,cid) {
  if (state.disabled) return;
  if (isMenu) {
    if (cid !== undefined)
    {
      if (!fileIO.exists(customRulesPath)){
        helper.writeTextToFile("",customRulesPath);
      }
      process.run(false,args,args.length);
    }
  } else {
    isDisable = !isDisable;
    button.icon = isDisable ? disableState : defaultState;
    tabs.activeTab.reload();
  }
}

function loadRulesFromRemote(isSkipLocal)
{
  helper.downloadFile(rulesURL,function(){
    storage.lastUpdateDate = (new Date()).getTime();
    console.log("remote load success \n");
    events.emit(RULES_LOADED_COMPLETE,this.responseText);
    helper.writeTextToFile(this.responseText,rulesPath);
  },function(){
    console.log("remote load fail");
    if (!isSkipLocal) loadRulesFromLocal();
  })
}

function loadRulesFromLocal(onFail)
{
  if(fileIO.exists(rulesPath))
  {
    console.log("read from local");
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
  console.log("rules  "+ rules);
  for each (rule in rules)
  {
    var pattern = new MatchPattern(rule["site"]);
    if (pattern.test(href))
    {
      return rule;
    }
  }
  return null;
}

events.on(RULES_LOADED_COMPLETE,onRulesLoaded);
function onRulesLoaded (event) {
  // enable button
  button.state("window",{"disabled":false})
  // add js to tab
  var jsonObj = JSON.parse(event.data);
  tabs.on('ready', function(tab) {
    if (!isDisable){
      var rules = jsonObj["rules"];
      try{
        var customTxt = helper.readTextFromFile(customRulesPath);
        console.log("custom:  "+ customTxt);
        var customArr = JSON.parse(customTxt);
        rules = customArr.concat(rules);
      }catch(e){
        console.log(" load custom file error");
      }
      var rs = getMatchRules(tab.url,rules);
      if (rs !== null){
        var worker = tab.attach({
          contentScriptFile: [self.data.url("jquery-1.7.2.min.js"),self.data.url("handler.js")]
        });
        worker.port.emit("drawBorder",rs);
      }
    }
  });
}

if (storage.lastUpdateDate && helper.datePassedHours(storage.lastUpdateDate) <= 6) {
  loadRulesFromLocal(function(){
    loadRulesFromRemote(true);
  });
}else{
  loadRulesFromRemote(false);
}