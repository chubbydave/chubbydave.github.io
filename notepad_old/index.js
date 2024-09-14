"use strict";

const text = localStorage.getItem("text");
const cursor = parseInt(localStorage.getItem("cursor"));
theme = localStorage.getItem("theme") || "light";

// This function returns the number of words in the string
function countWords(s) {
  s = s.replace(/(^\s*)|(\s*$)/gi, ""); // Exclude  start and end white-space
  s = s.replace(/\n/gi, " "); // Exclude newline with a start spacing
  s = s.replace(/[ ]{2,}/gi, " "); // 2 or more space to 1
  return s.split(' ').filter(str => str != "").length;
}

function countCharacters(s) {
  s = s.replace(/\n/gi, ""); // Remove newlines
  return s.split('').filter(str => str != "").length;
}

$(document).ready(function () {
  function updateCounters() {
    $("#word-count").text(countWords($("#notepad-text").val()) + " words");
    $("#character-count").text(countCharacters($("#notepad-text").val()) + " characters");
  }

  function setTheme(theme) {
    if (theme == "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      $("#btn-theme").text("Dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      $("#btn-theme").text("Light");
    }
  }

  if (text) {
    $("#notepad-text").val(text);
  }
  if (cursor) {
    $("#notepad-text").prop({
      "selectionStart": cursor,
      "selectionEnd": cursor
    });
  }


  updateCounters();
  $("#notepad-text").bind("input propertychange", function () {
    updateCounters();
  });

  // Switch light/dark button
  setTheme(theme);
  $("#btn-theme").click(function (e) {
    if (theme == "light") {
      theme = "dark";
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    } else {
      theme = "light";
      localStorage.setItem("theme", "light");
      setTheme("light");
    }
  });
  
  window.addEventListener("beforeunload", function (e) {
    localStorage.setItem("text", $("#notepad-text").val());
    localStorage.setItem("cursor", ($("#notepad-text").prop("selectionStart")).toString());
  });
});