import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { TimerContext } from "../../utils/timerProvider";
import Button from "../generic/Button";
import SetTimes from "../generic/SetTimes";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
// import { TiDelete } from "react-icons/ti";

const Tabata = ({ initialWork, initialRest, initialNumRounds, timerId, timerDesc }) => {
    const [timerRunning, setTimerRunning] = useState(false);
    const [rounds, setRounds] = useState(initialNumRounds || 1);
    const [numRounds, setNumRounds] = useState(1)
    const [workTime, setWorkTime] = useState(initialWork || 0);
    const [restTime, setRestTime] = useState(initialRest || 0);
    const [currentTime, setCurrentTime] = useState(workTime);
    const [isRestPhase, setIsRestPhase] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [tabDesc, setTabDesc] = useState("");
    const [editor, setEditor] = useState(false);

    // get the location to check if the user is on the add timer page
    const location = useLocation();
    const loadIfAdd = location.pathname.includes("add");

    const {
        timerQueue,
        addTimer,
        globalTimerRunning,
        setGlobalTimerRunning,
        activeTimerIndex,
        isReset,
        setIsReset,
        finishCurrentTimer,
        setFinishCurrentTimer,
        nextTimer,
        moveTimer,
        // removeTimer,
        updateTotalTime,
    } = useContext(TimerContext);

    const handleWorkSelect = (e) => {
        const newWork = (parseInt(e.target.value));
        setWorkTime(newWork);
        setCurrentTime(newWork);
    };

    const handleRestSelect = (e) => {
        setRestTime(parseInt(e.target.value));
    };

    const handleRoundSelect = (e) => {
        setRounds(parseInt(e.target.value));
        setNumRounds(parseInt(e.target.value));
    };

    // timer logic useeffect
    useEffect(() => {
        let intervalId;

        if (timerRunning && rounds > 0) {
            intervalId = setInterval(() => {
                if (currentTime > 1) {
                    setCurrentTime(currentTime - 1);
                } else {
                    if (isRestPhase) {
                        setCurrentTime(workTime);
                        setIsRestPhase(false);
                        if (rounds > 0) {
                            setRounds((prevRounds) => {
                                const newRound = prevRounds - 1;
                                if (newRound === 0) setTimerRunning(false);
                                return newRound;
                            });
                        }
                    } else {
                        if (rounds > 0) {
                            setCurrentTime(restTime);
                            setIsRestPhase(true);
                        } else {
                            setIsRestPhase(false);
                            setCurrentTime(workTime);
                            setTimerRunning(false);
                        }
                    }
                }
            }, 1000);
        } else if (!timerRunning && !rounds) {
            setIsFinished(true);
        }

        return () => clearInterval(intervalId);
    }, [timerRunning, rounds, currentTime, workTime, restTime, isRestPhase]);

    // useeffect for running and pausing the timer
    useEffect(() => {
        const startTimer = () => {
            if (!timerRunning) setTimerRunning(true);
        };

        const pauseTimer = () => {
            if (timerRunning) setTimerRunning(false);
        };

        if (timerId === activeTimerIndex) {
            if (globalTimerRunning) {
                if (isFinished) {
                    pauseTimer();
                    nextTimer();
                } else {
                    startTimer();
                };
            } else if (!globalTimerRunning) {
                pauseTimer();
            };
        };
    }, [globalTimerRunning, activeTimerIndex, timerId, isFinished, timerRunning, nextTimer]);

    // useeffect for resetting the timer when the reset button is clicked
    useEffect(() => {
        const resetTimer = () => {
            let timePassed = (initialNumRounds) * (workTime + restTime);
            if (isRestPhase) {
                timePassed += workTime + (restTime - currentTime);
            } else {
                timePassed += (workTime - currentTime);
            }
            updateTotalTime(timePassed);
            setTimerRunning(false);
            setCurrentTime(workTime);
            setIsRestPhase(false);
            setRounds(initialNumRounds || numRounds);
            setIsFinished(false);
        };

        if (isReset) {
            resetTimer();
            setIsReset(false);
        };
    }, [isReset, setIsReset, initialNumRounds, numRounds, workTime, currentTime, isRestPhase, restTime, rounds, updateTotalTime])

    // useeffect for fast forwarding the timer when the fast forward button is clicked
    useEffect(() => {
        const fastForwardTimer = () => {
            let remainingTime = 0;
            if (isRestPhase) {
                remainingTime += restTime;
            } else {
                remainingTime += workTime + restTime;
            };
            remainingTime += (rounds - 1) * (workTime + restTime);
            updateTotalTime(-remainingTime);
            setTimerRunning(false);
            setCurrentTime(0);
            setRounds(0);
            setIsFinished(true);
            nextTimer();
        };

        if ((timerId + 1) === activeTimerIndex && finishCurrentTimer) {
            fastForwardTimer();
            setFinishCurrentTimer(false);
        }
    }, [finishCurrentTimer, setFinishCurrentTimer, timerId, activeTimerIndex, nextTimer, isRestPhase, restTime, rounds, updateTotalTime, workTime])

    // useeffect for stopping the global timer if this is the last timer
    useEffect(() => {
        if (isFinished) {
            if (timerId === timerQueue.length - 1) {
                setGlobalTimerRunning(false);
            }
        }

    }, [isFinished, timerId, timerQueue, setGlobalTimerRunning, nextTimer]);

    return (
        <div id={timerId} className="countdown" style={{
            border: loadIfAdd ? 'none' : timerRunning ? '2px solid green' : isFinished ? '2px solid red' : '2px solid black'
        }}>
            <div className="clockface">
                <span style={{ color: timerRunning ? (isRestPhase ? '#9B7EC9' : 'green') : 'red' }}>
                    {currentTime < 10 ? `0${currentTime}` : currentTime} {isRestPhase ? 'Rest' : isFinished ? '' : 'Work'}
                </span>
                <br />
                Sets Remaining: {rounds}
            </div>
            <div id="text-input" style={{ display: loadIfAdd ? '' : editor ? '' : 'none' }}>
                <input placeholder="Description" onChange={(e) => { setTabDesc(e.target.value) }} />
            </div>
            <div id="description" style={{
                display: loadIfAdd ? 'none' : editor ? 'none' : '',
                fontSize: '8px',
                fontWeight: 'bold'
            }}>
                Timer: {timerDesc || tabDesc}
            </div>
            <div id="set-times" style={{ display: loadIfAdd ? '' : editor ? '' : 'none' }}>
                <SetTimes secId={timerId + "-work-sec"} hideMins={true} work={true} onChangeSec={handleWorkSelect} />
                <SetTimes secId={timerId + "-rest-sec"} hideMins={true} rest={true} onChangeSec={handleRestSelect} />
                <label htmlFor="rounds"># Rounds: </label>
                <select name="rounds" id={timerId + "-rounds"} onChange={handleRoundSelect}>
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
                        setEditor(!editor);
                    }} />
                </div>
            </div>
            <div style={{ display: loadIfAdd ? 'none' : '' }}>
                <Button id={"edit"} value={"Edit Timer"} onClick={() => setEditor(!editor)} />
            </div>
            <div style={{ display: loadIfAdd ? '' : 'none' }}>
                <Button
                    id={"add"}
                    value={"Add Timer"}
                    onClick={() => {
                        addTimer(
                            Tabata,
                            "Tabata",
                            {
                                initialWork: workTime,
                                initialRest: restTime,
                                initialNumRounds: numRounds,
                            },
                            timerDesc
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

export default Tabata;
