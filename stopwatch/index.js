'use strict';

// Image file paths
const startImage = "./images/start.svg";
const pauseImage = "./images/pause.svg";
const resetImage = "./images/reset.svg";
const lapImage = "./images/lap.svg";

// This function formats milliseconds (integer, #) to HH:MM:SS
function formatMSToTime(t) {
  let h = Math.floor(t / 3600000).toString();
  let m = Math.floor(t % 3600000 / 60000).toString();
  let s = Math.round(t % 60000 / 1000).toString();

  if (s >= 60) {
    s = 0;
    m += 1;
  }

  return `${h.padStart(2, "0")}:${m.padStart(2, "0")}:${s.padStart(2, "0")}`;
}

console.log(JSON.parse(localStorage.getItem("timerRunning")) || false)

// Check if the user has Web Storage
if (typeof(Storage) !== "undefined") {
  // Get timer data from the user's Local Storage
  let timerRunning = JSON.parse(localStorage.getItem("timerRunning")) || false;
  let timeStart = parseInt(localStorage.getItem("timeStart")) || 0; // Time of last start click
  let currentTime = parseInt(localStorage.getItem("currentTime")) || 0; // Time to display
  let lastTime = parseInt(localStorage.getItem("lastTime")) || 0; // Cumulative time
  let laps = JSON.parse(localStorage.getItem("laps")) || [];
  
  // This function updates the timer's text
  function updateTimer() {
    currentTime = lastTime + Date.now() - timeStart;

    const lastLap = laps.length ? laps[laps.length - 1] : 0;
    const lapTime = currentTime - lastLap;

    $("#lap-text").text(formatMSToTime(lapTime));
    $("#timer-text").text(formatMSToTime(currentTime));
  }

  // Timer start/stop interval functions
  let timerInterval = null; // Interval to repeatedly call updateTimer()
  function startTimerInterval() {
    timerInterval = setInterval(updateTimer, 1000);
  }

  function stopTimerInterval() {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  // Timer start/stop functions
  function startTimer() {
    startTimerInterval();
    $("#btn-main img").attr("src", pauseImage);
    $("#btn-secondary img").attr("src", lapImage);

    timeStart = Date.now();
    localStorage.setItem("timeStart", Date.now().toString());

    timerRunning = true;
    localStorage.setItem("timerRunning", JSON.stringify(true));
  }

  function stopTimer() {
    stopTimerInterval();
    $("#btn-main img").attr("src", startImage);
    $("#btn-secondary img").attr("src", resetImage);

    lastTime = currentTime;
    localStorage.setItem("lastTime", (currentTime).toString());

    timerRunning = false;
    localStorage.setItem("timerRunning", JSON.stringify(false));
  }

  // INITIALISATION
  $("#btn-main img").attr("src", startImage);
  $("#btn-secondary img").attr("src", resetImage);

  if (timerRunning) {
    // Timer is running, so call startTimerInterval()
    $("#btn-main img").attr("src", pauseImage);
    $("#btn-secondary img").attr("src", lapImage);
    startTimerInterval();
  } else if (lastTime != 0) {
    // Timer has been paused, so display the current paused time
    $("#timer-text").text(formatMSToTime(lastTime));
  } else {
    // Timer is at 0
    $("#timer-text").text(formatMSToTime(0));
  }

  // Initialise laps
  if (laps.length) {
    for (i in laps) {
      const lastLap = i > 0 ? laps[i - 1] : 0;
      const lapTime = laps[i] - lastLap;
      const lapHTML = `<div class="lap"><span class="highlight">${parseInt(i) + 1}</span> ${formatMSToTime(lapTime)}<div class="lap">`;
      $("#laps").prepend(lapHTML);

      $("#lap-text").text(formatMSToTime(currentTime - laps[laps.length - 1]));
    }
  } else {
    $("#lap-text").text(formatMSToTime(currentTime));
  }

  // SPACE PRESSED EVENT
  $("body").keyup(function(e) {
    if (e.keyCode == 32) {
      e.preventDefault()
      if (timerRunning) {
        // Stop
        stopTimer();
      } else {
        // Start
        startTimer();
      }
    } 
  });

  // BUTTON CLICK EVENTS
  $("#btn-main").click(function () {
    if (timerRunning) {
      // Stop
      stopTimer();
    } else {
      // Start
      startTimer();
    }
  });

  $("#btn-secondary").click(function () {
    if (timerRunning) {
      // Lap
      const lastLap = laps.length ? laps[laps.length - 1] : 0; 
      const lapTime = currentTime - lastLap;
      const lapHTML = `<div class="lap"><span class="highlight">${laps.length + 1}</span> ${formatMSToTime(lapTime)}</div>`;
      laps.push(currentTime);

      localStorage.setItem("laps", JSON.stringify(laps));
      $("#laps").prepend(lapHTML);
      $("#lap-text").text(formatMSToTime(0));
    }
  });

  $("#btn-secondary").dblclick(function() {
    if (!timerRunning) {
      // Reset
      timeStart = 0;
      currentTime = 0;
      lastTime = 0;
      laps = [];
      $("#laps").empty();
      $("#timer-text").text(formatMSToTime(0));
      $("#lap-text").text(formatMSToTime(0));

      localStorage.setItem("timeStart", "0");
      localStorage.setItem("currentTime", "0");
      localStorage.setItem("lastTime", 0);
      localStorage.setItem("laps", JSON.stringify([]));
    }
  });

  window.addEventListener("beforeunload", function(e) {
    localStorage.setItem("currentTime", currentTime);
  });
} else {
  console.error("Sorry, your browser does not support Web Storage");
}

