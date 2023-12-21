import Button from "../generic/Button.js"
import SetTimes from "../generic/SetTimes.js";
import { useRunTimers } from "../../utils/useRunTimers.js";
import { useContext, useState, useEffect } from "react";
import { TimerContext } from "../../utils/timerProvider.js";
import { useLocation } from "react-router-dom";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
// import { TiDelete } from "react-icons/ti";

const Countdown = ({ initialMinutes, initialSeconds, timerId, timerDesc }) => {
    const [cdMin, setCdMin] = useState(0);
    const [cdSec, setCdSec] = useState(0);
    const [cdDesc, setCdDesc] = useState("");
    const [editor, setEditor] = useState(false);
    // get the location and check if the user is on the add timer page
    const location = useLocation();
    const loadIfAdd = location.pathname.includes("add");

    const {
        timerQueue,
        addTimer,
        moveTimer,
        activeTimerIndex,
        globalTimerRunning,
        setGlobalTimerRunning,
        isReset,
        setIsReset,
        updateInitialTimes,
        // removeTimer,
        finishCurrentTimer,
        setFinishCurrentTimer,
    } = useContext(TimerContext);

    /**
    * extract the returned functions and stated values from the custom hook this way
    * the functions can be called within the onClick prop and the state values can be
    * called in the clockface div
    *
    * also, identify the type of timer and the ids within the timers to
    * properly set the values in the custom hook
    * */
    const {
        timerRunning,
        selectedMinute,
        selectedSecond,
        isFinished,
        startTimer,
        pauseTimer,
        resetTimer,
        fastForwardTimer,
    } = useRunTimers({
        timerType: "countdown",
        initialSeconds,
        initialMinutes
    });

    // useeffect for running and pausing the timer
    useEffect(() => {
        if (timerId === activeTimerIndex) {
            if (globalTimerRunning) {
                if (isFinished) {
                    pauseTimer();
                } else {
                    startTimer();
                };
            } else if (!globalTimerRunning) {
                pauseTimer();
            };
        };
    }, [globalTimerRunning, activeTimerIndex, pauseTimer, startTimer, timerId, isFinished]);

    // useeffect for resetting the timer when the reset button is clicked
    useEffect(() => {
        if (isReset) {
            resetTimer();
            setIsReset(false);
        };
    }, [isReset, resetTimer, setIsReset])

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

    // return the countdown timer. if the timer is running, the numbers are green,
    // otherwise, they stay red while not running.
    return (
        <div id={timerId} className="countdown" style={{
            border: loadIfAdd ? 'none' : timerRunning ? '2px solid green' : isFinished ? '2px solid red' : '2px solid black'
        }}>
            <div className="clockface">
                <span style={{ color: timerRunning ? 'green' : 'red' }}>
                    {selectedMinute < 10 ? `0${selectedMinute}` : selectedMinute}
                    :{selectedSecond < 10 ? `0${selectedSecond}` : selectedSecond}
                </span>
            </div>
            <div id="text-input" style={{ display: loadIfAdd ? '' : editor ? '' : 'none' }}>
                <input placeholder="Description" onChange={(e) => { setCdDesc(e.target.value) }} />
            </div>
            <div id="description" style={{
                display: loadIfAdd ? 'none' : editor ? 'none' : '',
                fontSize: '8px',
                fontWeight: 'bold'
            }}>
                Timer: {timerDesc || cdDesc}
            </div>
            <div id="set-times" style={{ display: loadIfAdd ? '' : editor ? '' : 'none' }}>
                <SetTimes
                    onChangeMin={(e) => setCdMin(parseInt(e.target.value))}
                    onChangeSec={(e) => setCdSec(parseInt(e.target.value))}
                />
                <div style={{ display: loadIfAdd ? 'none' : '' }}>
                    <Button id={"setter"} value={"Set Time"} onClick={() => {
                        updateInitialTimes(timerId, cdMin, cdSec);
                        setEditor(!editor);
                    }} />
                </div>
            </div>
            <div style={{ display: loadIfAdd ? 'none' : '' }}>
                <Button id={"edit"} value={"Edit Timer"} disabled={globalTimerRunning} onClick={() => setEditor(!editor)} />
            </div>
            <div style={{ display: loadIfAdd ? '' : 'none' }}>
                <Button
                    id={"add"}
                    value={"Add Timer"}
                    onClick={() => {
                        addTimer(
                            Countdown,
                            'Countdown',
                            { initialMinutes: cdMin, initialSeconds: cdSec },
                            timerDesc || cdDesc
                        )
                    }
                    } />
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
    )
};

export default Countdown;
