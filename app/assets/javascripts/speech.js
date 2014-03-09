function main() {
  if (!('webkitSpeechRecognition' in window)) {
    upgrade();
  } else {
    recognition.continuous = true; // speech pause stops recording
    recognition.interimResults = true; //access to interim text
    recognition.lang = "en";

    recognition.start();

    recognition.onstart = function(event) {
      console.log("on start");
    }

    /* the input */
    recognition.onresult = function (event) {
      console.log("entered result");
      var results = event.results;
      var final_tran = "";
      var interim_tran = "";
      //var define_func = ["define", "a", "function"];
      for (var i=event.resultIndex; i < results.length; i++) {
        var curr_word_obj = event.results[i];
        if (curr_word_obj.isFinal) {
          var curr_word = curr_word_obj[0].transcript;
          parseText(curr_word);
        }
      }
    }
    recognition.stop();
  }
}

function parseText(text) {
  console.log(text);

  if (isDefine(text)) {
    makeFunction(text);
  } else if (isForLoop(text)) {
    
  }
}

function makeFunction(text) {
  var args = ["that", "takes", "in"];
  editor.insert("def ")
  editor.insert(text.substring(define_func.length + 1, text.indexOf(" ", define_func.length + 1)));
  editor.insert("(");

    //goToLine(5;
  console.log("curr_word(in def): " + text);
}

// Functions that check if it is a valid token
function isDefine(text) {
  var define_func = "define a function";
  return text.substring(0, define_func.length) === define_func)
}

function isForLoop(text) {

}

var textbox;
var recognition;

$(document).ready(function() {
  textbox = $('#editor');
  recognition = new webkitSpeechRecognition();
  main();
});
