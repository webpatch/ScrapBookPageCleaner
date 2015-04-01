
const Request = require("sdk/request").Request;
const tabs = require("sdk/tabs");
const self = require("sdk/self");
const fileIO = require("sdk/io/file");
const data = require("sdk/self").data;
const ss = require("sdk/simple-storage");
const events = require("sdk/system/events");
const { MatchPattern } = require("sdk/util/match-pattern");
const panels = require("sdk/panel");
const { Cc, Ci } = require('chrome');
const fileCom = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile);
const process = Cc["@mozilla.org/process/util;1"].createInstance(Ci.nsIProcess);

const profilePath = require('sdk/system').pathFor('ProfD');

const extensionPath = fileIO.join(profilePath,"pageCleaner");
const rulesPath = fileIO.join(extensionPath,"res.json");

const FILTER_LOADED_EVENT = "filter_loaded_event";
const verURL = "https://raw.githubusercontent.com/webpatch/Web-Page-Cleaner/master/version.json";
const rulesURL = "https://raw.githubusercontent.com/webpatch/Web-Page-Cleaner/master/rules.json";
const disableState = "./disable-icon-16.png";
const defaultState = "./icon-16.png";

var isDisable= false;
var tmpVersion = null;
var rulesList = null;

console.log(rulesPath)

fileIO.mkpath(extensionPath);

const { MenuButton } = require('./menu-button');
var button = MenuButton({
  id: 'my-menu-button',
  label: 'My menu-button',
  icon: defaultState,
  disabled: true,
  onClick: click
});
// button.state("window",{"disabled":true})

fileCom.initWithPath("/usr/bin/open");
var args = ["-e",rulesPath];
process.init(fileCom);

function click(state, isMenu,cid) {
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

//get version meta
var versionRequest = Request({
  url: verURL,
  onComplete: function (response) {
    ss.storage.lastUpdateDate = (new Date()).getTime();
    console.log("verURL  " + response.text)
    var obj = response.json;
    tmpVersion = obj.version;
    console.log("ss.storage.version " + ss.storage.version);
    console.log("remote version " + obj.version);
    if (ss.storage.version && ss.storage.version >= obj.version){
      console.log("get rules from file");
      events.emit(FILTER_LOADED_EVENT,readTextFromFile(rulesPath));
    }else{
      console.log("get rules from url");
      rulesFileRequest.get();
    }
  }
});

//get filters
var rulesFileRequest = Request({
  url: rulesURL,
  onComplete: function (response) {
    var txt = response.text;
    console.log("rules " + txt);
    events.emit(FILTER_LOADED_EVENT,txt);
    writeTextToFile(txt,rulesPath);
    if (tmpVersion){
      ss.storage.version = tmpVersion;
    }
  }
});

var jsonObj = null;
function onFilterLoaded (event) {
  console.log("get file complete");
  button.state("window",{"disabled":false})
  jsonObj = JSON.parse(event.data);
  tabs.on('ready', function(tab) {
    if (!isDisable){
      var rs = applyRules(tab.url,jsonObj);
      if (rs.isMatch){
        var worker = tab.attach({
          contentScriptFile: [self.data.url("jquery-1.7.2.min.js"),self.data.url("handler.js")]
        });
        worker.port.emit("drawBorder",rs.obj);
      }
    }
  });
}
events.on(FILTER_LOADED_EVENT,onFilterLoaded);

function applyRules(href,rules)
{
  for each (r in rules)
  {
    var pattern = new MatchPattern(r["site"]);
    if (pattern.test(href))
    {
      return {"isMatch":true,"obj":r};
    }
  }
  return {"isMatch":false,"obj":null};
}

function dateBetweenHours(date){
  return ((new Date()).getTime() - date)/3600000;
}

function readTextFromFile(filename) {
  console.log("read file " + filename);
  var text = null;
  if (fileIO.exists(filename)){
    var TextReader = fileIO.open(filename, "r");
    if (!TextReader.closed) {
      text = TextReader.read();
      TextReader.close();
    }
  }
  return text;
}

function writeTextToFile(text, filename) {
  var TextWriter = fileIO.open(filename, "w");
  if (!TextWriter.closed) {
    TextWriter.write(text);
    TextWriter.close();
  }
}


if (fileIO.exists(rulesPath) && ss.storage.lastUpdateDate !== undefined && dateBetweenHours(ss.storage.lastUpdateDate) <= 6) {
  console.log("read rules file");
  events.emit(FILTER_LOADED_EVENT,readTextFromFile(rulesPath));
}else{
  console.log("get new version meta");
  versionRequest.get();
}