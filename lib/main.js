
var Request = require("sdk/request").Request;
var tabs = require("sdk/tabs");
var self = require("sdk/self");
var fileIO = require("sdk/io/file");
var data = require("sdk/self").data;
var ss = require("sdk/simple-storage");
var events = require("sdk/system/events");
var { MatchPattern } = require("sdk/util/match-pattern");
var panels = require("sdk/panel");

var profilePath = require('sdk/system').pathFor('ProfD');

var rulesPath = profilePath + "/res.json"
var isDisable= false;

var tmpVersion = null;
var rulesList = null;

var FILTER_LOADED_EVENT = "filter_loaded_event";

const verURL = "https://raw.githubusercontent.com/webpatch/Web-Page-Cleaner/master/version.json";
const rulesURL = "https://raw.githubusercontent.com/webpatch/Web-Page-Cleaner/master/rules.json";
console.log(rulesPath)

const disableState = "./disable-icon-16.png";
const defaultState = "./icon-16.png";


const { MenuButton } = require('./menu-button');
var button = MenuButton({
  id: 'my-menu-button',
  label: 'My menu-button',
  icon: defaultState,
  onClick: click
});

function click(state, isMenu,cid) {
  if (isMenu) {
    if (cid !== undefined)
    {
      console.log("menu click "+ cid)
    }
  } else {
    isDisable = !isDisable;
    button.icon = isDisable ? disableState : defaultState;
    tabs.activeTab.reload();
  }
}

var panel = panels.Panel({
  contentURL: self.data.url("panel.html")
});

// function handleHide() {
//   button.state('window', {checked: false});
// }

// var { ActionButton } = require("sdk/ui/button/action");

// var button = ActionButton({
//   id: "default-label",
//   label: "default label",
//   icon: defaultState,
//   onClick: function(state) {
//     isDisable = !isDisable;
//     button.icon = isDisable ? disableState : defaultState;
//     tabs.activeTab.reload();
//   }
// });

//get version meta
var versionRequest = Request({
  url: verURL,
  onComplete: function (response) {
    ss.storage.lastUpdateDate = (new Date()).getTime();
    console.log("verURL  " + response.text)
    var obj = response.json;
    tmpVersion = obj.version;
    console.log("ss.storage.version " + ss.storage.version);
    if (ss.storage.version == undefined)
    {
      console.log("version none");
      rulesFileRequest.get();
    }else{
      if (ss.storage.version < obj.version){
        console.log("get rules from url");
        rulesFileRequest.get();
      }else{
        console.log("get rules from file");
        events.emit(FILTER_LOADED_EVENT,readTextFromFile(rulesPath));
      }
    }
  }
});

//get filters
var rulesFileRequest = Request({
  url: rulesURL,
  onComplete: function (response) {
    var txt = response.text;
    events.emit(FILTER_LOADED_EVENT,txt)
    writeTextToFile(txt,rulesPath);
    if (tmpVersion != null){
      ss.storage.version = tmpVersion;
    }
  }
});

var jsonObj = null;
function onFilterLoaded (event) {
  jsonObj = JSON.parse(event.data);
  tabs.on('ready', function(tab) {
    if (!isDisable){
      var rs = applyRules(tab.url,jsonObj)
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

if (ss.storage.lastUpdateDate !== undefined)
{
  if (dateBetweenHours(ss.storage.lastUpdateDate) > 6)
  {
    console.log("> 6h get new version meta")
    versionRequest.get();
  }else{
    console.log("<= 6h read file")
    events.emit(FILTER_LOADED_EVENT,readTextFromFile(rulesPath));
  }
}else{
  console.log("> 6h get new version meta")
  versionRequest.get();
}

function dateBetweenHours(date){
  return ((new Date()).getTime() - date)/3600000
}

function readTextFromFile(filename) {
  console.log("read file " + filename);
  var text = null;
  if (fileIO.exists(filename)) {
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