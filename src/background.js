let timerInterval = null;
let isRunning = false;
let currentPhase = "work";
let workDuration = 25 * 60;
let breakDuration = 5 * 60; 
let timer = workDuration;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ timer, isRunning, currentPhase, workDuration });
});

function startTimer() {
  if (isRunning) return;

  isRunning = true;
  chrome.storage.local.set({ isRunning });

  timerInterval = setInterval(() => {
    timer--;
    if (timer < 0) {
      if (currentPhase === "work") {
        currentPhase = "break";
        timer = breakDuration;
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icon.png",
          title: "Pomodoro Timer",
          message: "Work session ended. Take a 5-minute break!",
        });
        playNotificationSound();
      } else {
        currentPhase = "work";
        timer = workDuration;
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icon.png",
          title: "Pomodoro Timer",
          message: "Break ended. Start a new work session!",
        });
        playNotificationSound();
      }
    }

    chrome.storage.local.set({ timer, currentPhase });
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  chrome.storage.local.set({ isRunning });
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  currentPhase = "work";
  timer = workDuration;
  chrome.storage.local.set({ timer, isRunning, currentPhase });
}

function playNotificationSound() {
  const notificationSound = new Audio("assets/not.wav");
  notificationSound.play();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "START_TIMER") {
    startTimer();
    sendResponse({ status: "Timer started" });
  } else if (message.type === "STOP_TIMER") {
    stopTimer();
    sendResponse({ status: "Timer stopped" });
  } else if (message.type === "RESET_TIMER") {
    resetTimer();
    sendResponse({ status: "Timer reset" });
  } else if (message.type === "GET_TIMER_STATE") {
    chrome.storage.local.get(["timer", "isRunning", "currentPhase"], (res) => {
      sendResponse(res);
    });
    return true;
  } else if (message.type === "SET_WORK_DURATION") {
    workDuration = message.duration;
    timer = workDuration;
    chrome.storage.local.set({ workDuration, timer });
    sendResponse({ status: "Work duration updated", workDuration });
  }
});
