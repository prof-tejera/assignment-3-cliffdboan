import { useState, useEffect, useContext } from "react";
import { TimerContext } from "./timerProvider";

export function useRunTimers({ timerType, initialMinutes, initialSeconds, initialNumRounds, initialRound }) {
    /**
     * set the values of minutes, seconds, and rounds with the timer 'off'
     * if the timer has an initial value (like when in its array), use that value as 'initial,'
     * otherwise, set the timer to 00:00. If the timer counts up from 0, begin it at 00:00 rather than the initial values
     */
    const [selectedMinute, setSelectedMinute] = useState(timerType === 'stopwatch' ? 0 : initialMinutes || 0);
    const [selectedSecond, setSelectedSecond] = useState(timerType === 'stopwatch' ? 0 : initialSeconds || 0);
    const [timerRunning, setTimerRunning] = useState(false);
    const [numRounds, setNumRounds] = useState(initialNumRounds || 1);
    const [currentRound, setCurrentRound] = useState(initialRound || 1);
    const [isFinished, setIsFinished] = useState(false);

    const {
        timerQueue,
        nextTimer,
        updateTotalTime,
    } = useContext(TimerContext);

    // functions to set the timer to running or not
    const startTimer = () => {
        if (!timerRunning) setTimerRunning(true);
    };

    const pauseTimer = () => {
        if (timerRunning) setTimerRunning(false);
    };

    // reset the timer to its proper zero/start position based on the timer type
    // add the time back to total time keeper
    const resetTimer = () => {
        setTimerRunning(false);
        if (timerType === "countdown") {
            setSelectedMinute(initialMinutes);
            setSelectedSecond(initialSeconds);
            let timeReset = (initialMinutes * 60 + initialSeconds) - (selectedMinute * 60 + selectedSecond);
            updateTotalTime(timeReset);
        } else if (timerType === "xy") {
            setSelectedMinute(initialMinutes);
            setSelectedSecond(initialSeconds);
            let timePerRound = initialMinutes * 60 + initialSeconds;
            let timeReset = (currentRound - 1) * timePerRound + (timePerRound - (selectedMinute * 60 + selectedSecond));
            updateTotalTime(timeReset);
        } else if (timerType === "stopwatch") {
            let timeReset = selectedMinute * 60 + selectedSecond;
            updateTotalTime(timeReset);
            setSelectedMinute(0);
            setSelectedSecond(0);
        };
        setCurrentRound(1);
        setIsFinished(false);
    };

    // set the timer to its "end position" and set the total time keeper as such
    const fastForwardTimer = () => {
        setTimerRunning(false);
        if (timerType === "countdown") {
            let timeReset = (selectedMinute * 60 + selectedSecond)
            updateTotalTime(-timeReset);
            setSelectedMinute(0);
            setSelectedSecond(0);
        } else if (timerType === "xy") {
            let timeLeftInRound = selectedMinute * 60 + selectedSecond;
            let timeReset = (initialNumRounds - currentRound) * (initialMinutes * 60 + initialSeconds) + timeLeftInRound
            updateTotalTime(-timeReset);
            setSelectedMinute(0);
            setSelectedSecond(0);
            setCurrentRound(numRounds);
        } else if (timerType === "stopwatch") {
            let timeReset = (initialMinutes - selectedMinute) * 60 + (initialSeconds - selectedSecond);
            updateTotalTime(-timeReset);
            setSelectedMinute(initialMinutes);
            setSelectedSecond(initialSeconds);
        }
        setIsFinished(true);
    };

    // timer logic for both countdown and countup timers
    useEffect(() => {
        let intervalId;

        const runCountdownTimer = () => {
                intervalId = setInterval(() => {
                    if (selectedSecond > 0) {
                        setSelectedSecond(selectedSecond - 1);
                    } else if (selectedMinute > 0) {
                        setSelectedMinute(selectedMinute - 1);
                        setSelectedSecond(59);
                    } else {
                        clearInterval(intervalId);
                        setTimerRunning(false);
                        setIsFinished(true);
                    }
                }, 1000);
        };

        const runXyTimer = () => {
            if (currentRound < initialNumRounds) {
                if (selectedMinute === 0 && selectedSecond === 1) {
                    intervalId = setInterval(() => {
                        setCurrentRound(currentRound + 1);
                        setSelectedMinute(initialMinutes);
                        setSelectedSecond(initialSeconds);
                    }, 1000);

                    return () => {
                        clearInterval(intervalId)
                    }
                }
            };

            intervalId = setInterval(() => {
                if (selectedSecond >= 1) {
                    setSelectedSecond(selectedSecond - 1);
                } else if (selectedMinute > 0) {
                    setSelectedMinute(selectedMinute - 1);
                    setSelectedSecond(59);
                } else {
                    clearInterval(intervalId);
                    setTimerRunning(false);
                    setIsFinished(true);
                }
            }, 1000);
        };

        const runCountUpTimer = () => {
            intervalId = setInterval(() => {
                if (selectedSecond < 59) {
                    setSelectedSecond(selectedSecond + 1);
                } else if (selectedMinute < initialMinutes) {
                    setSelectedMinute(selectedMinute + 1);
                    setSelectedSecond(0);
                } else {
                    setTimerRunning(false);
                    clearInterval(intervalId);
                }
            }, 1000);
        };

        if (timerType === "countdown") {
            if (timerRunning && (selectedMinute > 0 || selectedSecond > 0)) {
                runCountdownTimer();
            } else if (timerRunning && (selectedMinute === 0 && selectedSecond === 0)) {
                setTimerRunning(false);
                setIsFinished(true);
                nextTimer();
                clearInterval(intervalId);
            } else {
                setTimerRunning(false);
                clearInterval(intervalId);
            }

            return () => {
                clearInterval(intervalId);
            };
        } else if (timerType === "stopwatch") {
            if (timerRunning && (selectedMinute < initialMinutes || selectedSecond < initialSeconds)) {
                runCountUpTimer();
            } else if (timerRunning && (selectedMinute === initialMinutes && selectedSecond === initialSeconds)) {
                setTimerRunning(false);
                setIsFinished(true);
                nextTimer();
                clearInterval(intervalId);
            } else {
                setTimerRunning(false);
                clearInterval(intervalId);
            }

            return () => {
                clearInterval(intervalId);
            };
        } else if (timerType === "xy") {
            if (timerRunning) {
                runXyTimer();
            } else if (currentRound === numRounds && (selectedMinute === 0 && selectedSecond === 0)) {
                setTimerRunning(false);
                setIsFinished(true);
                // nextTimer();
                clearInterval(intervalId);
            } else {
                setTimerRunning(false);
                clearInterval(intervalId);
            }

            return () => {
                clearInterval(intervalId);
            };
        };

        if (isFinished) {
            setTimerRunning(false);
        }


    }, [timerRunning, selectedMinute, selectedSecond, numRounds, currentRound,
        initialMinutes, initialSeconds, initialNumRounds, timerType, nextTimer,
        isFinished, setIsFinished, setTimerRunning, setCurrentRound, setNumRounds, setSelectedMinute, setSelectedSecond,
    ]);

    return {
        timerRunning: timerRunning,
        selectedMinute: selectedMinute,
        startTimer,
        pauseTimer,
        resetTimer,
        fastForwardTimer,
        setSelectedMinute,
        setSelectedSecond,
        selectedSecond: selectedSecond,
        currentRound: currentRound,
        setNumRounds,
        numRounds: numRounds,
        isFinished,
        setIsFinished,
        timerQueue,
    };
};
