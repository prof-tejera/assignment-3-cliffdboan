import Button from "../generic/Button";
import SetTimes from "../generic/SetTimes";
import { useRunTimers } from "../../utils/useRunTimers.js";
import { useContext, useEffect, useState } from "react";
import { TimerContext } from "../../utils/timerProvider";
import { useLocation } from "react-router-dom";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
// import { TiDelete } from "react-icons/ti";

const Stopwatch = ({ initialMinutes, initialSeconds, timerId, timerDesc }) => {
    const [swMin, setSwMin] = useState(0);
    const [swSec, setSwSec] = useState(0);
    const [swDesc, setSwDesc] = useState("");
    const [editor, setEditor] = useState(false);
    // get the location to check if the user is on the add timer page
    const location = useLocation();
    const loadIfAdd = location.pathname.includes("add");

    const { addTimer,
        activeTimerIndex,
        globalTimerRunning,
        setGlobalTimerRunning,
        timerQueue,
        isReset,
        setIsReset,
        moveTimer,
        updateInitialTimes,
        finishCurrentTimer,
        setFinishCurrentTimer,
        // removeTimer,
    } = useContext(TimerContext);
    /*
    * extract the returned functions and stated values from the custom hook this way
    * the functions can be called within the onClick prop and the state values can be
    * called in the clockface div
    *
    * also, identify the type of timer and the ids within the timers to
    * properly set the values in the custom hook
    * */
    const {
        timerRunning,
        startTimer,
        pauseTimer,
        resetTimer,
        fastForwardTimer,
        selectedMinute,
        selectedSecond,
        isFinished,
    } = useRunTimers({
        timerType: "stopwatch",
        initialMinutes,
        initialSeconds
    });

    useEffect(() => {
        if (timerId === activeTimerIndex) {
            if (globalTimerRunning) {
                startTimer()
            } else if (!globalTimerRunning) {
                pauseTimer();
            };
        };
    }, [globalTimerRunning, activeTimerIndex, pauseTimer, startTimer, timerId]);

    useEffect(() => {
        if (isReset) {
            resetTimer();
            setIsReset(false);
            setGlobalTimerRunning(false);
        };
    }, [isReset, resetTimer, setIsReset, setGlobalTimerRunning])

    // useeffect for fast forwarding the timer when the fast forward button is clicked
    useEffect(() => {
        if ((timerId + 1) === activeTimerIndex && finishCurrentTimer) {
            fastForwardTimer();
            setFinishCurrentTimer(false);
        }
    }, [finishCurrentTimer, fastForwardTimer, setFinishCurrentTimer, timerId, activeTimerIndex])

    // useeffect for stopping the global timer if this is the last timer
    useEffect(() => {
        if (isFinished) {
            if (timerId === timerQueue.length - 1) {
                setGlobalTimerRunning(false);
            }
        }
    }, [isFinished, timerId, timerQueue, setGlobalTimerRunning]);

    return (
        <div className="stopwatch" style={{
            border: loadIfAdd ? 'none' : timerRunning ? '2px solid green' : isFinished ? '2px solid red' : '2px solid black'
        }}>
            <div className="clockface">
                <span style={{ color: !timerRunning ? 'red' : 'green' }}>
                    {selectedMinute < 10 ? `0${selectedMinute}` : selectedMinute}:{selectedSecond < 10 ? `0${selectedSecond}` : selectedSecond}
                </span>
            </div>
            <div id="text-input" style={{ display: loadIfAdd ? '' : editor ? '' : 'none' }}>
                <input placeholder="Description" onChange={(e) => { setSwDesc(e.target.value) }} />
            </div>
            <div id="description" style={{
                display: loadIfAdd ? 'none' : editor ? 'none' : '',
                fontSize: '8px',
                fontWeight: 'bold'
            }}>
                Timer: {timerDesc || swDesc}
            </div>
            <div id="set-times" style={{ display: loadIfAdd ? '' : editor ? '' : 'none' }}>
                <SetTimes
                    onChangeMin={(e) => setSwMin(parseInt(e.target.value))}
                    onChangeSec={(e) => setSwSec(parseInt(e.target.value))}
                />
                <div style={{ display: loadIfAdd ? 'none' : '' }}>
                    <Button id={"setter"} value={"Set Time"} onClick={() => {
                        updateInitialTimes(timerId, swMin, swSec);
                        setEditor(!editor);
                    }} />
                </div>
            </div>
            <div id="queue-buttons">
                <div style={{ display: loadIfAdd ? 'none' : '' }}>
                    <Button id={"edit"} value={"Edit Timer"} onClick={() => setEditor(!editor)} />
                </div>
                <div style={{ display: loadIfAdd ? '' : 'none' }}>
                    <Button
                        id={"add"}
                        value={"Add Timer"}
                        onClick={() => {
                            addTimer(
                                Stopwatch,
                                "Stopwatch",
                                { initialMinutes: swMin, initialSeconds: swSec },
                                timerDesc || swDesc,
                            )
                        }} />
                </div>
                <div id="move-buttons" style={{ display: loadIfAdd ? "none" : "flex" }}>
                    <Button
                        id={"moveUp"}
                        value={<FaArrowUp />}
                        disabled={timerId === 0}
                        onClick={() => moveTimer(timerId, timerId - 1)} />
                    <Button
                        id={"moveDown"}
                        value={<FaArrowDown />}
                        disabled={timerId === timerQueue.length - 1}
                        onClick={() => moveTimer(timerId, timerId + 1)} />
                    {/* <Button id={"delete"} value={<TiDelete />} onClick={() => removeTimer(timerId)} /> */}
                </div>
            </div>
        </div>
    );
};

export default Stopwatch;
