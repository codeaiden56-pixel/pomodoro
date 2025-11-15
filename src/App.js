import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [running, setRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(1500);
  const [currentCycleIndex, setCurrentCycleIndex] = useState(0);
  const [timeCycleStarted, setTimeCycleStarted] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

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

  function convertSecondsToTime(totalSeconds) {
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  }

  function calculateTimeDifference(currentTime) {
    return (currentTime.getTime() - timeCycleStarted.getTime()) / 1000;
  }

  function setNextStageInCycle() {
    let utterance = new SpeechSynthesisUtterance(
      "Time for " + cycle[(currentCycleIndex + 1) % cycle.length].name
    );
    speechSynthesis.speak(utterance);
    setCurrentCycleIndex((currentCycleIndex + 1) % cycle.length);
    setTimeRemaining(cycle[(currentCycleIndex + 1) % cycle.length].time);
    setTimeCycleStarted(new Date());
  }

  useEffect(() => {
    if (running) {
      const timeoutId = setTimeout(() => {
        setTimeRemaining(
          cycle[currentCycleIndex].time - calculateTimeDifference(new Date())
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
            <p style={{ color: "gray", textAlign: "left" }}>No tasks</p>
          )}
        </div>
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
          color: complete ? "gray" : "black",
        }}
      >
        {task}
      </p>
    </div>
  );
}

export default App;
