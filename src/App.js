import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [running, setRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(1500);
  const [currentCycleIndex, setCurrentCycleIndex] = useState(0);
  const [timeCycleStarted, setTimeCycleStarted] = useState(null);
  const [timePomodoroStarted, setTimePomodoroStarted] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [narration, setNarration] = useState(true);

  const cycle = [
    { name: "Focus", time: 1500 },
    { name: "Short Break", time: 300 },
    { name: "Focus", time: 1500 },
    { name: "Short Break", time: 300 },
    { name: "Focus", time: 1500 },
    { name: "Short Break", time: 300 },
    { name: "Focus", time: 1500 },
    { name: "Long Break", time: 1800 },
  ];

  function convertSecondsToTime(totalSeconds, showHours = false) {
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const hours = Math.floor(totalSeconds / 3600);

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    const formattedHours =  String(hours).padStart(2, "0");

    return `${showHours ? formattedHours + ":" : ""}${formattedMinutes}:${formattedSeconds}`;
  }

  function calculateTimeDifference(currentTime, startTime) {
    return (currentTime.getTime() - startTime.getTime()) / 1000;
  }

  function setNextStageInCycle() {
    if (narration) {
    let utterance = new SpeechSynthesisUtterance(
        "Time for " + cycle[(currentCycleIndex + 1) % cycle.length].name
      );
      speechSynthesis.speak(utterance);
    }
    setCurrentCycleIndex((currentCycleIndex + 1) % cycle.length);
    setTimeRemaining(cycle[(currentCycleIndex + 1) % cycle.length].time);
    setTimeCycleStarted(new Date());
  }

  useEffect(() => {
    if (running) {
      const timeoutId = setTimeout(() => {
        setTimeRemaining(
          cycle[currentCycleIndex].time - calculateTimeDifference(new Date(), timeCycleStarted)
        );
      }, 100);
      if (timeRemaining <= 0) {
        setNextStageInCycle();
      }
      return () => clearTimeout(timeoutId);
    }
  });

  return (
    <div className="App">
      <div className="Pomodoro">
        <h3 className="Stage">{cycle[currentCycleIndex].name}</h3>
        <h1 className="Timer">
          {convertSecondsToTime(Math.ceil(timeRemaining))}
        </h1>
        <p>Next: {cycle[(currentCycleIndex + 1) % cycle.length].name}</p>
        <div className="Button-bar">
          <button
            onClick={() => {
              setRunning(!running);
              setCurrentCycleIndex(0);
              setTimeCycleStarted(new Date());
              setTimePomodoroStarted(new Date());
            }}
          >
            {running ? "End" : "Start"}
          </button>
          {running ? (
            <button
              onClick={() => {
                setNextStageInCycle();
              }}
            >
              Skip
            </button>
          ) : null}
        </div>
        {timePomodoroStarted ? (
          <p className="Total-focus-time">Total Focus Time: {convertSecondsToTime(Math.ceil(calculateTimeDifference(new Date(), timePomodoroStarted)), true)}</p>
        ) : null}
        <button className="Narration-toggle-button" onClick={() => setNarration(!narration)}>
          Voice: {narration ? "On" : "Off"}
        </button>
      </div>

      <div className="Task-container">
        <div className="Task-container-header-container">
          <h2 className="Task-container-header">
            Focus Tasks ({tasks.length})
          </h2>
        </div>
        <div className="Task-container-input-bar">
          <input
            placeholder="Create Task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button
            onClick={() => {
              if (newTask !== "") {
                setTasks([...tasks, newTask]);
                setNewTask("");
              }
            }}
          >
            Add
          </button>
        </div>
        <div className="Task-container-main">
          {tasks.length > 0 ? (
            tasks.map((task, index) => <TaskCard key={index} task={task} />)
          ) : (
            <p style={{ color: "#A0AEC0", textAlign: "left", paddingLeft: "8px"}}>No tasks</p>
          )}
        </div>
        <button className="Reset-tasks-button" onClick={() => setTasks([])}>
          Reset Tasks
        </button>
      </div>
    </div>
  );
}
function TaskCard({ task }) {
  const [complete, setComplete] = useState(false);
  return (
    <div className="Taskcard">
      <div
        className={complete ? "Checkbox-complete" : "Checkbox"}
        onClick={() => {
          setComplete(!complete);
        }}
      />
      <p
        style={{
          textDecorationLine: complete ? "line-through" : "",
          color: complete ? "#718096" : "#2D3748",
        }}
      >
        {task}
      </p>
    </div>
  );
}

export default App;
