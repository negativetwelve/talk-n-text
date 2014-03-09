// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require ace/ace
//= require ace/mode-python.js
//= require_tree .

var editor;
var code = [
  "class Person(object):",
  "",
  "    def __init__(self, name, age):",
  "        self.name = name",
  "        self.age = age",
  "",
  "    def talk(self):",
  "        print('hello')",
  "",
  "",
  "class Child(Person):",
  "",
  "    def __init__(self, name, age, num_child)",
  "        Person.__init__(self, name, age)",
  "        self.num_child = num_child",
  "",
  "    def crawl(self):",
  "        print('I am crawling')",
  "",
  "",
].join("\n");

function getCode() {
  var code = editor.getSession().getValue();
  return code;
}

function getAllLines() {
  var code = getCode();
  var lines = code.split("\n");
  return lines;
}

function getCursorPosition() {
  return editor.getCursorPosition().row;
}

function moveCursorTo(row) {
  editor.moveCursorTo(row);
}

function numLines() {
  return getAllLines().length;
}

function getLine(index) {
  var lines = getAllLines();
  var line = lines[index - 1];
  var text = line.split("    ").join("");
  return text;
}

function goToLine(index) {
  editor.gotoLine(index);
}

function goToTop() {
  goToLine(1);
}

function goToBottom() {
  goToLine(numLines());
}

function find(phrase) {
  editor.find(phrase, {
      backwards: false,
      wrap: true,
      caseSensitive: false,
      wholeWord: false,
      regExp: false
  });
  editor.findNext();
}

function findDefinition(functionName) {
  var phrase = "def "  + functionName;
  find(phrase);
}

function findClass(className) {
  var phrase = "class " + className;
  find(phrase);
}

function replaceAll(text) {
  editor.relaceAll(text);
}

$(document).ready(function() {
  $(".header-link").click(function(event) {
    event.preventDefault();

    $("ul#header-links li").removeClass("active");
    $(this).parent().addClass("active");
    $('html, body').animate({
      scrollTop: $("#" + $(this).data().element).offset().top - 70
    }, 500);
  });
  $(document).keypress(function(event) {
    if (event.charCode == 96) {
      event.preventDefault();
      console.log("KILL SWITCH");
      recognition.stop();
      main();
    }
  });

  var mode = require("ace/mode/python").Mode;
  editor = ace.edit("editor");
  editor.setShowPrintMargin(false);
  editor.getSession().setMode(new mode());
  editor.getSession().setValue(code);
  goToBottom();
});
