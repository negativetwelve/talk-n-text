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
//= require ace/mode-java.js
//= require_tree .

var editor;
var code = [
  "class Person {",
  "    public Person(int age) {",
  "        this.age = age;",
  "    }",
  "}",
].join("\n");

$(document).ready(function() {
  var JavaMode = require("ace/mode/java").Mode;
  editor = ace.edit("editor");
  editor.getSession().setMode(new JavaMode());
  editor.getSession().setValue(code);
});

function getCode() {
  var code = editor.getSession().getValue();
  return code;
}

function getAllLines() {
  var code = getCode();
  var lines = code.split("\n");
  return lines;
}

function getLine(index) {
  var lines = getAllLines();
  var line = lines[index - 1];
  var text = line.split("    ").join("");
  return text;
}
