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
    makeForLoop(text);
  }
}

function makeFunction(text) {
  var indOfArgs = text.indexOf(args);
  if (indOfArgs == -1) {
    indOfArgs = text.indexOf(args1); // heard 'take' instead of 'takes'
  }
  var paramSub = text.substring(indOfArgs);
  var funcName;
  if (indOfArgs > 3) {
    funcName = text.substring(0, indOfArgs); 
  } else {
    funcName = text;
  }

  paramSub = paramSub.split(" ");
  paramSub = paramSub.slice(2);

  funcName = funcName.split(" ");
  funcName = funcName.slice(3); 
  if (funcName.length != 1) {
    console.log("length = " + funcName.length);
    funcName = funcName.join("_");
  }
  editor.insert("def ")
  editor.insert(funcName);
  editor.insert("(");
  if (paramSub > 1) {
    editor.insert(paramSub[0]);
    editor.insert(", ");
    editor.insert(paramSub[2]);
    if (paramSub > 3) {
      editor.insert(paramSub[3]);  
    }
  } else {
    editor.insert(paramSub[0]);
  }
  editor.insert("): \n\t");

  
    //goToLine(5;
  console.log("curr_word(in def): " + text);
}

function makeForLoop(text) {
  editor.insert(text);
  editor.insert(":\n");
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
  var j = 0;
  for (var i=0; i < words.length; i++) {
    if (j >= phraseArray.length) {
      if (currentWord != "") {
        outputPhrase.push(currentWord);
      }
      return outputPhrase;
    } else if (matchesToken(words[i], phraseArray[j])) {
      if (currentWord != "") {
        outputPhrase.push(currentWord);
      }
      outputPhrase.push(words[i]);
      currentWord = "";
      j++;
    } else if (matchesToken(words[i], phraseArray[j + 1])) {
      if (currentWord != "") {
        outputPhrase.push(currentWord);
      }
      outputPhrase.push(words[i]);
      currentWord = "";
      j += 2;
    } else if (phraseArray[j] == null && currentWord != "") {
      outputPhrase.push(currentWord);
      return outputPhrase;
    } else if (phraseArray[j] == null) {
      currentWord += words[i];
    } else {
      return false;
    }
  }
  if (currentWord != "") {
    outputPhrase.push(currentWord);
  }
  return outputPhrase;
}

function isDefine(text) {
  return text.substring(0, define_func.length) === define_func
}

function isForLoop(text) {
  return matches(text, forPhrase);
}

// Globals
var textbox;
var recognition;

// Phrases
var define_func = "define a function";
var args = "that takes";
var args1 = "that take";
var forPhrase = [["for", "4", "four"], null, ["in", "into"], null];
var whilePhrase = [["while"], null];
var ifPhrase = [["if"], null];

// Main function, called on page load
$(document).ready(function() {
  textbox = $('#editor');
  recognition = new webkitSpeechRecognition();
  main();
});
