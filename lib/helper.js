const { XMLHttpRequest } = require("sdk/net/xhr");
const fileIO = require("sdk/io/file");

function readTextFromFile(filename) {
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
exports.readTextFromFile = readTextFromFile;

function writeTextToFile(text, filename) {
  var TextWriter = fileIO.open(filename, "w");
  if (!TextWriter.closed) {
    TextWriter.write(text);
    TextWriter.close();
  }
}
exports.writeTextToFile = writeTextToFile;


function downloadFile(url,onComplete,onFail)
{
  var req = new XMLHttpRequest();
  req.timeout = 15000;
  req.open("GET", url, true);
  req.onload = onComplete;
  req.ontimeout = onFail;
  req.onabort = onFail;
  req.onerror = onFail;
  req.send();
}
exports.downloadFile = downloadFile;


function datePassedHours(dateTime){
  return ((new Date()).getTime() - dateTime)/3600000;
}
exports.datePassedHours = datePassedHours;