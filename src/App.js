import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [running, setRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(1500);
  const [currentCycleIndex, setCurrentCycleIndex] = useState(0);

  const cycle = [
    {
      name: "Pomodoro",
      time: 1500,
    },
    {
      name: "5-min Break",
      time: 300,
    },
    {
      name: "5-min Break",
      time: 300,
    },
    {
      name: "5-min Break",
      time: 300,
    },
    {
      name: "15-min Break",
      time: 900,
    },
  ];

  function convertSecondsToTime(totalSeconds) {
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  }

  function setNextStageInCycle() {
    let utterance = new SpeechSynthesisUtterance(
      cycle[(currentCycleIndex + 1) % cycle.length].name
    );
    speechSynthesis.speak(utterance);
    setCurrentCycleIndex((currentCycleIndex + 1) % cycle.length);
    setTimeRemaining(cycle[(currentCycleIndex + 1) % cycle.length].time);
  }

  useEffect(() => {
    if (running) {
      const timeoutId = setTimeout(
        () => setTimeRemaining(timeRemaining - 1),
        1000
      );
      if (timeRemaining <= 0) {
        setCurrentCycleIndex();
      }
      return () => clearTimeout(timeoutId);
    }
  });

  return (
    <div className="App">
      <div>
        <h3>{cycle[currentCycleIndex].name}</h3>
        <h1>{convertSecondsToTime(timeRemaining)}</h1>
        <p>Next: {cycle[(currentCycleIndex + 1) % cycle.length].name}</p>
        <button onClick={() => setRunning(!running)}>
          {running ? "Pause" : "Start"}
        </button>
        <button
          onClick={() => {
            setRunning(false);
            setCurrentCycleIndex(0);
            setTimeRemaining(cycle[0].time);
          }}
        >
          Reset
        </button>
        <button
          onClick={() => {
            setNextStageInCycle();
          }}
        >
          Skip
        </button>
      </div>
    </div>
  );
}

export default App;
