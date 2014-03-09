function main() {
  recognition = new webkitSpeechRecognition();
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
      Pace.restart();
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
    editor.insert("\n" + indentation("\t", -1));
  } else if (matches(text, printCommand)) {
    editor.insert("print(");
    if ((text.indexOf("the string") > -1) || (text.indexOf("the stream") > -1) || (text.indexOf("the screen") > -1)) {
        editor.insert("\"");
        if (text.indexOf("the string") > -1) {
            editor.insert(text.substring(text.indexOf("the string") + 11).trim());
        } else if (text.indexOf("the stream") > -1) {
            editor.insert(text.substring(text.indexOf("the stream") + 11).trim());
        } else if (text.indexOf("the screen") > -1) {
            editor.insert(text.substring(text.indexOf("the screen") + 11).trim());
        }
        editor.insert("\")\n" + indentation("\t", 0));
    } else {
        editor.insert(text.substring(6));
        editor.insert(")\n" + indentation("\t", 0));
    }

  } else if (isIfStatement(text)) {
    makeIfStatement(text);

  } else if (isGoToStatement(text)) {
    parseGoToText(text);
  } else if (isFindFunction(text)) {
    callFindFunction(text);
  } else if (isFindClass(text)) {
    callFindClass(text);
  } else if (isDeleteLine(text)) {
    callDeleteLine(text);
  } else if (isDeletePreviousLine(text)) {
    callDeletePreviousLine(text);
  } else if (isTab(text)) {
    callTab();
  } else if (isUnTab(text)) {
    callUnTab();
  }
}

function indentation(string, indent) {
  console.log(indentationLevel);
  indentationLevel += indent;
  return Array(indentationLevel + 1).join(string);
}

function isGoToStatement(text) {
  return matches(text, goToPhrase) || matches(text, goToPhrase2) || matches(text, goToTop) || matches(text, goToBottom);
}

function parseGoToText(text) {
  console.log("called go to");
  var place = text.split(" ");
  place = place[place.length - 1];
  console.log(place);
  if (place == "top") {
    goToTop();
  } else if (place == "bottom") {
    goToBottom();
  } else {
    goToLine(place);
  }
}

function isDeletePreviousLine(text) {
  return matches(text, undoPhrase);
}

function isUndo(text) {
  return matches(text, undoPhrase);
}

function isRedo(text) {
  return matches(text, redoPhrase);
}

function undo() {
  editor.undo();
}

function redo() {
  editor.redo();
}

function callDeletePreviousLine(text) {
  console.log("call delete previous line");

  var code = getAllLines();
  var row = getCursorPosition();
  code.splice(row - 1, 1);
  editor.getSession().setValue(code.join("\n"));
  moveCursorTo(row - 1);
}

function isDeleteLine(text) {
  return matches(text, deleteCurrentLinePhrase);
}

function callDeleteLine(text) {
  console.log("call delete current line");

  var code = getAllLines();
  var row = getCursorPosition();
  code.splice(row, 1);
  editor.getSession().setValue(code.join("\n"));
  moveCursorTo(row);
}

function isTab(text) {
  return matches(text, tabPhrase);
}

function callTab() {
  indentationLevel++;
  editor.insert("\t");
}

function isUnTab(text) {
  indentationLevel--;
  return matches(text, untabPhrase);
}

function callUnTab() {
  editor.navigateLineStart();
  editor.remove("    ");
  editor.navigateLineEnd();
}

function isFindFunction(text) {
  return matches(text, findFunctionPhrase);
}

function callFindFunction(text) {
  console.log("called find function");
  var functionName = text.split(" ");
  functionName = functionName[functionName.length - 1];
  console.log(functionName);
  findDefinition(functionName);
}

function isFindClass(text) {
  return matches(text, findClassPhrase);
}

function callFindClass(text) {
  console.log("called find class");
  var className = text.split(" ");
  className = className[className.length - 1];
  findClass(className);
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
  editor.insert(":\n" + indentation("\t", 1));
}

function makeIfStatement(text) {
  editor.insert("if (");
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
      if (outputPhrase.length == 0) {
        return false;
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
  return matches(text, forPhrase);
}

function isWhileLoop(text) {
  return matches(text, whilePhrase);
}

function isIfStatement(text) {
  return matches(text, ifPhrase);
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
var forPhrase = [["for", "4", "four", "Ford"], null, ["in", "into"], null];
var ret = "return";
var whilePhrase = [["while"], null];
var ifPhrase = [["if", "is"], null];
var printCommand = [["print", "Prince"], null];
var lt = [null,["<", "less"], ["than", "then"], null];
var gt = [null, [">", "greater"], ["than", "then"], null];
var equal = [["=", "equal", "equals", "Eagle"], ["equal", "equals"]];

var goToPhrase = [["go"], ["to"], ["line"], null];
var goToPhrase2 = [["goto"], ["line"], null];
var goToTop = [["goto", "go"], ["top"]];
var goToBottom = [["goto", "go"], ["bottom"]];

var findFunctionPhrase = [["find"], ["function"], null];
var findClassPhrase = [["find"], ["class"], null];

var deleteCurrentLinePhrase = [["delete", "Elite"], ["line", "lines", "vine"]];
var deletePreviousLinePhrase = [["delete", "Elite"], ["previous"], ["line", "lines", "vine"]];

var undoPhrase = ["undo"];
var redoPhrase = ["redo"];

var tabPhrase = [["mountain", "Mountain"]];
var untabPhrase = [["valley", "Valley"]];


// Main function, called on page load
$(document).ready(function() {
  indentationLevel = 0;
  textbox = $('#editor');
  main();
});
