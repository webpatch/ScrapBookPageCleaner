
var Request = require("sdk/request").Request;
var tabs = require("sdk/tabs");
var self = require("sdk/self");
var fileIO = require("sdk/io/file");
var data = require("sdk/self").data;
var ss = require("sdk/simple-storage");
var events = require("sdk/system/events");

var profilePath = require('sdk/system').pathFor('ProfD');

var rulesPath = profilePath + "/res.json"
var isDisable= false;

var tmpVersion = null;
var rulesList = null;

var FILTER_LOADED_EVENT = "filter_loaded_event";

const verURL = "https://raw.githubusercontent.com/webpatch/Web-Page-Cleaner/master/version.json";
const rulesURL = "https://raw.githubusercontent.com/webpatch/Web-Page-Cleaner/master/rules.json";
// console.log(rulesPath)

const disableState = "./disable-icon-16.png";
const defaultState = "./icon-16.png";

var { ActionButton } = require("sdk/ui/button/action");

var button = ActionButton({
  id: "default-label",
  label: "default label",
  icon: defaultState,
  onClick: function(state) {
    isDisable = !isDisable;
    button.icon = isDisable ? disableState : defaultState;
    tabs.activeTab.reload();
  }
});

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


function onFilterLoaded (event) {
  tabs.on('ready', function(tab) {
    if (!isDisable){
      var worker = tab.attach({
        contentScriptFile: [self.data.url("jquery-1.7.2.min.js"),self.data.url("handler.js")]
      });
      worker.port.emit("drawBorder",JSON.parse(event.data));
    }
  });
}
events.on(FILTER_LOADED_EVENT,onFilterLoaded);

Request({
  url: verURL,
  onComplete: function (response) {
    var obj = response.json;
    tmpVersion = obj.version;
    if (ss.storage.version == undefined)
    {
      rulesFileRequest.get();
    }else{
      if (ss.storage.version < obj.version){
        rulesFileRequest.get();
      }else{
        events.emit(FILTER_LOADED_EVENT,readTextFromFile(rulesPath));
      }
    }
  }
}).get();

function readTextFromFile(filename) {
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