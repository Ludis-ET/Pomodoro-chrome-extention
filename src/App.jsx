import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [time, setTime] = useState("25:00");
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState("work");
  const [workDuration, setWorkDuration] = useState(25);

  useEffect(() => {
    const interval = setInterval(() => {
      chrome.runtime.sendMessage({ type: "GET_TIMER_STATE" }, (response) => {
        if (response) {
          const minutes = `${Math.floor(response.timer / 60)}`.padStart(2, "0");
          const seconds = `${response.timer % 60}`.padStart(2, "0");
          setTime(`${minutes}:${seconds}`);
          setIsRunning(response.isRunning);
          setCurrentPhase(response.currentPhase);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const startTimer = () => {
    chrome.runtime.sendMessage({ type: "START_TIMER" });
  };

  const stopTimer = () => {
    chrome.runtime.sendMessage({ type: "STOP_TIMER" });
  };

  const resetTimer = () => {
    chrome.runtime.sendMessage({ type: "RESET_TIMER" });
  };

  const handleWorkDurationChange = (event) => {
    const duration = parseInt(event.target.value);
    setWorkDuration(duration);
    chrome.runtime.sendMessage({
      type: "SET_WORK_DURATION",
      duration: duration * 60,
    });
  };

  return (
    <div className="card">
      <h1>Pomodoro Timer</h1>
      <div className="tim">
        <p className="timer">{time}</p>
        <p className={currentPhase}>{currentPhase}</p>
      </div>
      <div className="in">
        <input
          type="number"
          min="1"
          max="60"
          className="input"
          placeholder="Change timer"
          onChange={handleWorkDurationChange}
          disabled={isRunning}
          value={workDuration}
        />
      </div>
      <div className="but">
        <button onClick={startTimer} disabled={isRunning}>
          Start
        </button>
        <button onClick={stopTimer} disabled={!isRunning}>
          Pause
        </button>
        <button onClick={resetTimer}>Reset</button>
      </div>
      <div className="last">
        <div className="button-icon">
          <div className="icon">
            <svg viewBox="0 0 24 24">
              <path
                d="M12 0.296997C5.37 0.296997 0 5.67 0 12.297C0 17.6 3.438 22.097 8.205 23.682C8.805 23.795 9.025 23.424 9.025 23.105C9.025 22.82 9.015 22.065 9.01 21.065C5.672 21.789 4.968 19.455 4.968 19.455C4.422 18.07 3.633 17.7 3.633 17.7C2.546 16.956 3.717 16.971 3.717 16.971C4.922 17.055 5.555 18.207 5.555 18.207C6.625 20.042 8.364 19.512 9.05 19.205C9.158 18.429 9.467 17.9 9.81 17.6C7.145 17.3 4.344 16.268 4.344 11.67C4.344 10.36 4.809 9.29 5.579 8.45C5.444 8.147 5.039 6.927 5.684 5.274C5.684 5.274 6.689 4.952 8.984 6.504C9.944 6.237 10.964 6.105 11.984 6.099C13.004 6.105 14.024 6.237 14.984 6.504C17.264 4.952 18.269 5.274 18.269 5.274C18.914 6.927 18.509 8.147 18.389 8.45C19.154 9.29 19.619 10.36 19.619 11.67C19.619 16.28 16.814 17.295 14.144 17.59C14.564 17.95 14.954 18.686 14.954 19.81C14.954 21.416 14.939 22.706 14.939 23.096C14.939 23.411 15.149 23.786 15.764 23.666C20.565 22.092 24 17.592 24 12.297C24 5.67 18.627 0.296997 12 0.296997Z"
                fill="#222229"
              ></path>
            </svg>
          </div>
          <a
          target="_blank"
            href="https://github.com/Ludis-ET/Pomodoro-chrome-extention"
            className="cube"
          >
            <span className="side front">Made by Ludis</span>
            <span className="side top">Check it on GitHub</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
