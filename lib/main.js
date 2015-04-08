const tabs = require("sdk/tabs");
const self = require("sdk/self");
const fileIO = require("sdk/io/file");
const data = require("sdk/self").data;
const {storage} = require("sdk/simple-storage");
const events = require("sdk/system/events");
const { MatchPattern } = require("sdk/util/match-pattern");

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

const disableState = "./broom_disable.png";
const defaultState = "./broom.png";
var isExDisable= false;

var program = "/usr/bin/open";
if(runtime.OS == "WINNT")
{
  program = "c:\\windows\\notepad.exe";
}
fileCom.initWithPath(program);
process.init(fileCom);
fileIO.mkpath(extensionPath);

const { MenuButton } = require('./menu-button');
const button = MenuButton({
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
      if (cid == "edit_custom_rules")
      {
        if (!fileIO.exists(customRulesPath)){
          wirteDefaultCustomToFile();
        }else{
            if(helper.readTextFromFile(customRulesPath) == ""){
              wirteDefaultCustomToFile();
            }
        }
        var args = [customRulesPath];
        process.run(false,args,args.length);
      }else if(cid == "view_default_rules"){
        var args = [rulesPath];
        process.run(false,args,args.length);
      }
    }
  } else {
    isExDisable = !isExDisable;
    storage.isExDisable = isExDisable;
    button.icon = isExDisable ? disableState : defaultState;
    tabs.activeTab.reload();
  }
}

//load button manual disable state
if (storage.isExDisable != undefined )
{
  isExDisable = storage.isExDisable;
  button.icon = isExDisable ? disableState : defaultState;
}

function wirteDefaultCustomToFile()
{
  const defaultText = '[\n\t{\n\t\t"site":"http://sample.com/*",\n\t\t"hold":".post",\n\t\t"delete":[\n\t\t\t"#deleteTags1",\n\t\t\t".deleteTags2"\n\t\t],\n\t\t"css":"body{backgroud-color:#fff;}"\n\t}\n]';
  helper.writeTextToFile(defaultText,customRulesPath);
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
      console.log("load local rules file error!");
    }
  }
}

function getMatchRules(href,rules)
{
  for each (rule in rules)
  {
    const matchSite = rule["site"];
    const reg = matchSite.charAt(0) != "^" ? matchSite : (new RegExp(matchSite));
    const pattern = new MatchPattern(reg);
    if (pattern.test(href))
    {
      return rule;
    }
  }
  return null;
}

function combineRules(defaultRules)
{
  var rules = defaultRules;
  try{
    const customTxt = helper.readTextFromFile(customRulesPath);
    var customArr = JSON.parse(customTxt);
    rules = customArr.concat(rules);
  }catch(e){
    console.log(" load custom file error");
  }
  return rules;
}

events.on(RULES_LOADED_COMPLETE,onRulesLoaded);
function onRulesLoaded (event) {
  // enable button
  button.state("window",{"disabled":false});
  // add js to tab
  var jsonObj = JSON.parse(event.data);
  tabs.on('ready', function(tab) {
    if (!isExDisable){
      var rules = combineRules(jsonObj["rules"]);
      var rs = getMatchRules(tab.url,rules);
      if (rs !== null){
        var worker = tab.attach({
          contentScriptFile: [self.data.url("jquery-1.7.2.min.js"),self.data.url("handler.js")]
        });
        worker.port.emit("APPLY_RULES",rs);
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