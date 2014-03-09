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
function matchesToken(word, arrayItem) {
  if (arrayItem instanceof Array) {
    return arrayItem.contains(word);
  } else {
    return arrayItem == word;
  }
}

function matches(text, phraseArray) {
  var words = text.split(" ");
  var outputPhrase = [];
  var currentWord = "";
  var j=0;
  for (var i=0; i < words.length; i++) {
    if (j >= phraseArray.length) {
      return;
    } else if (matchesToken(words[i], phraseArray[j])) {
      if (currentWord != "") {
        outputPhrase.push(currentWord);
        currentWord = "";
      }
      j++;
    } else if (phraseArray[i] == null) {
      currentWord += words[i];
    } else {
      return false;
    }
  }
  return outputPhrase;
}

function isDefine(text) {
  return text.substring(0, define_func.length) === define_func
}

function isForLoop(text) {
  console.log(matches(text, forPhrase));
  return matches(text, forPhrase);
}

// Globals
var textbox;
var recognition;

// Phrases
var define_func = "define a function";
var forPhrase = [["for", "4", "four"], null, ["in", "into"], null];

// Main function, called on page load
$(document).ready(function() {
  textbox = $('#editor');
  recognition = new webkitSpeechRecognition();
  main();
});
