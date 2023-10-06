import { Helmet } from "react-helmet";
import "./App.css";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import countDownAudio from "./audio/countdown.mp3";
import alertAudio from "./audio/alert.wav";
import $ from "jquery";
function App() {
  const [time, setTime] = useState(null);
  const [sessionLength, setSessionLength] = useState(1);
  const [sessionTime, setSessionTime] = useState(null);
  const [breakLength, setBreakLength] = useState(5);
  const [breakTime, setBreakTime] = useState(null);
  const [myInterval, setMyInterval] = useState(null);
  const [mode, setMode] = useState("Session");
  let timeInterval;
  let countDown = document.getElementById("countDown");
  let alert = document.getElementById("alertAudio");
  function updateBreakLength(Length) {
    setBreakLength(Length);
    setBreakTime("0" + Length + ":00");
  }
  function updateSessionLength(Length) {
    setSessionLength(Length);
    setSessionTime("0" + Length + ":00");
  }
  useEffect(() => {
    setSessionTime("0" + sessionLength + ":00");
    setTime("0" + sessionLength + ":00");
    setBreakTime("0" + breakLength + ":00");
  }, []);
  function start(time, mode) {
    let min = time.split(":")[0];
    let sec = time.split(":")[1];
    timeInterval = setInterval(() => {
      if (sec == "00" || sec <= 0) {
        sec = 59;
        min--;
      }
      sec--;
      let minStr = min < 10 ? "0" + min : min;
      let secStr = sec < 10 ? "0" + sec : sec;
      setTime(minStr + ":" + secStr);
      if (min == 0 && sec <= 10) {
        $(".timer h1").css({ color: "red" });
        countDown.play();
      } else {
        $(".timer h1").css({ color: "white" });
      }
      if (min == 0 && sec == 0) {
        clearInterval(timeInterval);
          alert.play();
        if (mode != "break") {
          setMode("Break");
          breakStart();
        }
      }
    }, 1000);

    setMyInterval(timeInterval);
  }
  function breakStart() {
    toast("Break Started", {
      position: "top-center",
      icon: "▶️",
      duration: 800,
    });
    setMode("Break");
    setSessionTime(breakTime);
    console.log("break", breakTime);
    start(breakTime, "break");
  }
  function pause() {
    countDown.pause();
    toast("Timer Paused", {
      position: "top-center",
      icon: "⏸️",
      duration: 800,
    });
    setSessionTime(sessionTime);
    clearInterval(myInterval);
  }
  function restart() {
    toast("Timer Reset", {
      position: "top-center",
      icon: "🔁",
      duration: 800,
    });
    setSessionTime(sessionLength + ":00");
  }
  return (
    <>
      <Helmet>
        <title>25 + 5 Clock</title>
        <link
          rel="shortcut icon"
          href={require("./imgs/logo.png")}
          type="image/x-icon"
        />
      </Helmet>
      <Toaster />
      <main
        className="vh-100 d-flex justify-content-center"
        style={{ backgroundColor: "#1f555d" }}
      >
        <div className="container d-flex justify-content-center text-white">
          <div className="inner d-flex flex-column justify-content-center align-items-center">
            <div className="title mb-4">
              <h1 className="mb-0">
                25 <i className="fa-solid fa-plus fa-xs fw-normal"></i> 5 Clock
              </h1>
            </div>
            <div className="options d-flex gap-5 justify-content-between align-items-center mb-4">
              <div className="break text-center">
                <h3 className="mb-0">Break Length</h3>
                <i
                  onClick={() => {
                    breakLength > 1
                      ? updateBreakLength(breakLength - 1)
                      : updateBreakLength(breakLength);
                  }}
                  className="fa-solid fa-arrow-down fs-3 fw-bolder cursorPointer"
                ></i>
                <span className="fs-1 mx-3">{breakLength}</span>
                <i
                  onClick={() => {
                    breakLength < 60
                      ? updateBreakLength(breakLength + 1)
                      : updateBreakLength(breakLength);
                  }}
                  className="fa-solid fa-arrow-up fs-3 fw-bolder cursorPointer"
                ></i>
              </div>

              <div className="session text-center">
                <h3 className="mb-0">Session Length</h3>
                <i
                  onClick={() => {
                    sessionLength > 1
                      ? updateSessionLength(sessionLength - 1)
                      : updateSessionLength(sessionLength);
                  }}
                  className="fa-solid fa-arrow-down fs-3 fw-bolder cursorPointer"
                ></i>
                <span className="fs-1 mx-3">{sessionLength}</span>
                <i
                  onClick={() => {
                    sessionLength < 60
                      ? updateSessionLength(sessionLength + 1)
                      : updateSessionLength(sessionLength);
                  }}
                  className="fa-solid fa-arrow-up fs-3 fw-bolder cursorPointer"
                ></i>
              </div>
            </div>
            <div className="timer mb-4 d-flex justify-content-center align-items-center flex-column border border-2 rounded-5 py-3 px-5">
              <h4 className="head fs-2">{mode}</h4>
              <h1 className="sevenSegmentFont">{time}</h1>
            </div>
            <div className="controls d-flex gap-4 justify-content-between align-items-center">
              <i
                onClick={() => {
                  toast("Timer Started", {
                    position: "top-center",
                    icon: "▶️",
                    duration: 800,
                  });
                  start(time);
                }}
                className="fa-solid fa-play fs-4 cursorPointer"
              ></i>
              <i
                onClick={pause}
                className="fa-solid fa-pause fs-4 cursorPointer"
              ></i>
              <i
                onClick={restart}
                className="fa-solid fa-arrows-rotate fs-4 cursorPointer"
              ></i>
            </div>
            <div className="audio" style={{ display: "none" }}>
              <audio
                id="countDown"
                type="audio/mp3"
                src={countDownAudio}
              ></audio>
              <audio id="alertAudio" type="audio/wav" src={alertAudio}></audio>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
export default App;
