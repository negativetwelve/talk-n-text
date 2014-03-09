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
      for (var i=event.resultIndex; i < results.length; i++) {
        var curr_word_obj = event.results[i];
        if (curr_word_obj.isFinal) {
          var curr_word = curr_word_obj[0].transcript;
          parseText(curr_word);
        }
      }
    }
    //recognition.stop();
  }
}

function parseText(text) {
  text = text.trim();
  console.log("in parse text: " + text);

  if (isDefine(text)) {
    makeFunction(text);
  } else if (isForLoop(text)) {
    makeForLoop(text);
  } else if (isReturn(text)) {
    editor.insert(text.toLowerCase());
    editor.insert("\n\b");
  } else if (matches(text, printCommand)) {
    editor.insert("print(");
    if (text.indexOf("the string") != -1) {
        editor.insert("\"");
        text = text.split(" ");
        editor.insert(text.slice(3));
        editor.insert("\")\n");
    } else {
        text = text.split(" ");
        editor.insert(text.slice(1, 2));
        editor.insert(")\n");
    }

  }
}

function makeFunction(text) {
  text = text.toLowerCase();
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
  if (indOfArgs != -1) {
    paramSub = paramSub.split(" ");
    paramSub = paramSub.slice(2);
  }

  funcName = funcName.split(" ");
  funcName = funcName.slice(3); 
  if (funcName.length > 1) {
    funcName = funcName.join("_");
    if (funcName.charAt(funcName.length - 1) == "_") {
      funcName = funcName.substring(0, funcName.length - 1);
    }
  }
  editor.insert("def ")
  editor.insert(funcName);
  editor.insert("(");
  if (indOfArgs != -1) {
    editor.insert(paramSub[0]);
    if (paramSub.length > 1) {
      editor.insert(", ");
      editor.insert(paramSub[2]);
      if (paramSub.length > 3) {
        editor.insert(", ");
        editor.insert(paramSub[3]);  
      }
    } 
  }
  editor.insert("): \n\t");

  
    //goToLine(5;
  console.log("curr_word(in def): " + text);
}

function makeForLoop(text) {
  text = text.split(" ");
  var inIndex = text.indexOf("in");
  var variable = text.slice(1, inIndex);
  if (variable instanceof Array) {
    variable = variable.join("_");
  }
  var iterable = text.slice(inIndex + 1);
  if (iterable instanceof Array) {
    iterable = iterable.join("_");
  }
  editor.insert("for " + variable + " in " + iterable);
  indentationLevel++;
  editor.insert(":\n" + Array(indentationLevel + 1).join("\t"));
}

function makeIfStatement(text) {
  editor.insert(text);
  editor.insert(":\n\t");
}

function makeWhileStatement(text) {
  editor.insert(text);
  editor.insert(":\n\t");
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
      if (phraseArray[j] instanceof Array) {
        outputPhrase.push(phraseArray[j][0]);
      } else {
        outputPhrase.push(phraseArray[j]);
      }
      currentWord = "";
      j++;
    } else if (matchesToken(words[i], phraseArray[j + 1])) {
      if (currentWord != "") {
        outputPhrase.push(currentWord);
      }
      if (phraseArray[j] instanceof Array) {
        outputPhrase.push(phraseArray[j][0]);
      } else {
        outputPhrase.push(phraseArray[j]);
      }
      currentWord = "";
      j += 2;
    } else if (phraseArray[j] == null && j == phraseArray.length - 1) {
      if (currentWord != "") {
        outputPhrase.push(currentWord);
      }
      outputPhrase.push.apply(outputPhrase, words.slice(i));
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
  text = text.split(" ");
  return matches(text, forPhrase);
}

function isWhileLoop(text) {
  return matches(text, ifPhrase);
}

function isIfStatement(text) {
  return matches(text, whilePhrase);
}

function isReturn(text) {
  text = text.trim();
  text = text.toLowerCase();
//  console.log("hey: " + (text.startsWith(ret)));
  return text.substring(0, ret.length) === ret;
}

// Globals
var textbox;
var recognition;
var indentationLevel;

// Phrases
var define_func = "define a function";
var args = "that takes";
var args1 = "that take";
var forPhrase = [["for", "4", "four"], null, ["in", "into"], null];
var ret = "return";
var whilePhrase = [["while"], null];
var ifPhrase = [["if"], null];
var printCommand = [["print", "Prince"], null];

// Main function, called on page load
$(document).ready(function() {
  indentationLevel = 0;
  textbox = $('#editor');
  recognition = new webkitSpeechRecognition();
  main();
});
