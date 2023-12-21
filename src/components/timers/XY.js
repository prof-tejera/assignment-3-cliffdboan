import { useState, useEffect, useContext } from 'react';
import { useLocation } from "react-router-dom";
import { useRunTimers } from "../../utils/useRunTimers.js";
import { TimerContext } from "../../utils/timerProvider";
import Button from "../generic/Button";
import SetTimes from "../generic/SetTimes";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
// import { TiDelete } from "react-icons/ti";

const XY = ({ initialMinutes, initialSeconds, initialNumRounds, timerId, timerDesc }) => {
    const [xyMin, setXyMin] = useState(0);
    const [xySec, setXySec] = useState(0);
    const [xyRnd, setXyRnd] = useState(initialNumRounds || 1);
    const [xyDesc, setXyDesc] = useState("");
    const [editor, setEditor] = useState(false);

    // get the location to check if the user is on the add timer page
    const location = useLocation();
    const loadIfAdd = location.pathname.includes("add");

    const {
        addTimer,
        updateInitialTimes,
        globalTimerRunning,
        isReset,
        timerQueue,
        activeTimerIndex,
        setIsReset,
        finishCurrentTimer,
        setFinishCurrentTimer,
        setGlobalTimerRunning,
        moveTimer,
        // removeTimer,
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
        startTimer,
        pauseTimer,
        resetTimer,
        fastForwardTimer,
        selectedMinute,
        selectedSecond,
        currentRound,
        isFinished,
    } = useRunTimers({
        timerType: "xy",
        initialMinutes,
        initialSeconds,
        initialNumRounds,
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

    return (
        <div id={timerId} className="countdown" style={{
            border: loadIfAdd ? 'none' : timerRunning ? '2px solid green' : isFinished ? '2px solid red' : '2px solid black'
        }}>
            <div className="clockface">
                <span style={{ color: !timerRunning ? 'red' : 'green' }}>
                    {selectedMinute < 10 ? `0${selectedMinute}` : selectedMinute}
                    :{selectedSecond < 10 ? `0${selectedSecond}` : selectedSecond}
                </span>
                <br />
                <span>
                    Round: {currentRound} of {xyRnd}
                </span>
            </div>
            <div id="text-input" style={{ display: loadIfAdd ? '' : editor ? '' : 'none' }}>
                <input placeholder="Description" onChange={(e) => { setXyDesc(e.target.value) }} />
            </div>
            <div id="description" style={{
                display: loadIfAdd ? 'none' : editor ? 'none' : '',
                fontSize: '8px',
                fontWeight: 'bold'
            }}>
                Timer: {timerDesc || xyDesc}
            </div>
            <div id="set-times" style={{ display: loadIfAdd ? '' : editor ? '' : 'none' }}>
                <SetTimes
                    onChangeMin={(e) => setXyMin(parseInt(e.target.value))}
                    onChangeSec={(e) => setXySec(parseInt(e.target.value))}
                />
            </div>
            <div style={{ display: loadIfAdd ? '' : editor ? '' : 'none' }}>
                <label htmlFor="rnds"># Rounds: </label>
                <select name="rnds" id={timerId + "-xy-rnds"} onChange={(e) => setXyRnd(parseInt(e.target.value))
                }
                >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                    <option value={6}>6</option>
                    <option value={7}>7</option>
                    <option value={8}>8</option>
                    <option value={9}>9</option>
                    <option value={10}>10</option>
                </select>
                <div style={{ display: loadIfAdd ? 'none' : '' }}>
                    <Button id={"setter"} value={"Set Time"} disabled={globalTimerRunning} onClick={() => {
                        updateInitialTimes(timerId, xyMin, xySec, xyRnd);
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
                            XY,
                            "XY",
                            {
                                initialMinutes: xyMin,
                                initialSeconds: xySec,
                                initialNumRounds: xyRnd,
                            },
                            xyDesc,
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
    )
};

export default XY;
