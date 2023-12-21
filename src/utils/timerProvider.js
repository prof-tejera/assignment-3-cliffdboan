import React, { useEffect } from "react";
import { useState } from "react";

import Stopwatch from "../components/timers/Stopwatch";
import Countdown from "../components/timers/Countdown";
import Tabata from "../components/timers/Tabata";
import XY from "../components/timers/XY";

export const TimerContext = React.createContext({});

export const TimerProvider = ({ children }) => {
    const [timerQueue, setTimerQueue] = useState([]);
    const [globalTimerRunning, setGlobalTimerRunning] = useState(false);
    const [activeTimerIndex, setActiveTimerIndex] = useState(0);
    const [isReset, setIsReset] = useState(false);
    const [totalTime, setTotalTime] = useState(0);
    const [finishCurrentTimer, setFinishCurrentTimer] = useState(false);

    // update initial times when 'set time' button is clicked in editor
    const updateInitialTimes = (timerId, newMinutes, newSeconds, newRounds) => {
        const timerToUpdate = timerQueue[timerId];
        let Comp;
        const timerType = timerToUpdate.title;

        if (timerType === "Stopwatch") {
            Comp = Stopwatch;
        } else if (timerType === 'Countdown') {
            Comp = Countdown;
        } else if (timerType === "Tabata") {
            Comp = Tabata;
        } else if (timerType === "XY") {
            Comp = XY;
        };
        timerToUpdate.C = (
            <Comp
                initialMinutes={newMinutes}
                initialSeconds={newSeconds}
                initialNumRounds={newRounds}
                timerId={timerId}
                timerDesc={timerToUpdate.timerDesc}
            />
        );

        timerQueue[timerId] = timerToUpdate;
        setTimerQueue(timerQueue);
        setActiveTimerIndex(0);
        setIsReset(true);
    };

    // take in a new index and swap component places in the queue
    const moveTimer = (timerId, newIndex) => {
        if (newIndex > timerId) {
            const timerToMoveForward = timerQueue[timerId];
            const timerForwardType = timerQueue[timerId].title;
            let Comp;
            // using timer title, determine the component type
            if (timerForwardType === "Stopwatch") {
                Comp = Stopwatch;
            } else if (timerForwardType === "Countdown") {
                Comp = Countdown;
            } else if (timerForwardType === "Tabata") {
                Comp = Tabata;
            } else if (timerForwardType === "XY") {
                Comp = XY;
            };
            timerToMoveForward.C = <Comp
                initialMinutes={timerToMoveForward.initialMinutes}
                initialSeconds={timerToMoveForward.initialSeconds}
                initialWork={timerToMoveForward.initialWork}
                initialRest={timerToMoveForward.initialRest}
                initialNumRounds={timerToMoveForward.initialNumRounds}
                timerId={newIndex}
                timerDesc={timerToMoveForward.timerDesc} />;

            const timerToMoveBack = timerQueue[newIndex];
            const timerBackType = timerQueue[newIndex].title;
            let BackComp;

            if (timerBackType === "Stopwatch") {
                BackComp = Stopwatch;
            } else if (timerBackType === "Countdown") {
                BackComp = Countdown;
            } else if (timerBackType === "Tabata") {
                BackComp = Tabata;
            } else if (timerBackType === "XY") {
                BackComp = XY;
            };
            timerToMoveBack.C = <BackComp
                initialMinutes={timerToMoveBack.initialMinutes}
                initialSeconds={timerToMoveBack.initialSeconds}
                initialWork={timerToMoveBack.initialWork}
                initialRest={timerToMoveBack.initialRest}
                initialNumRounds={timerToMoveBack.initialNumRounds}
                timerId={timerId}
                timerDesc={timerToMoveBack.timerDesc} />;

            // assign the new indexes their respective timers and set the queue
            timerQueue[newIndex] = timerToMoveForward;
            timerQueue[timerId] = timerToMoveBack;
            setTimerQueue(timerQueue);
            setIsReset(true);
        }

        // write the same thing in reverse when the timer is moving backwards
        if (newIndex < timerId) {
            const timerToMoveBack = timerQueue[timerId];
            const timerForwardType = timerQueue[timerId].title;

            let BackwardComp;
            // using timer title, determine the component type
            if (timerForwardType === "Stopwatch") {
                BackwardComp = Stopwatch;
            } else if (timerForwardType === "Countdown") {
                BackwardComp = Countdown;
            } else if (timerForwardType === "Tabata") {
                BackwardComp = Tabata;
            } else if (timerForwardType === "XY") {
                BackwardComp = XY;
            };
            timerToMoveBack.C = <BackwardComp
                initialMinutes={timerToMoveBack.initialMinutes}
                initialSeconds={timerToMoveBack.initialSeconds}
                initialWork={timerToMoveBack.initialWork}
                initialRest={timerToMoveBack.initialRest}
                initialNumRounds={timerToMoveBack.initialNumRounds}
                timerId={newIndex}
                timerDesc={timerToMoveBack.timerDesc} />;

            let ForwardComp;
            if (timerForwardType === "Stopwatch") {
                ForwardComp = Stopwatch;
            } else if (timerForwardType === "Countdown") {
                ForwardComp = Countdown;
            } else if (timerForwardType === "Tabata") {
                ForwardComp = Tabata;
            } else if (timerForwardType === "XY") {
                ForwardComp = XY;
            };
            const timerToMoveForward = timerQueue[newIndex];
            timerToMoveForward.C = <ForwardComp
                initialMinutes={timerToMoveForward.initialMinutes}
                initialSeconds={timerToMoveForward.initialSeconds}
                initialWork={timerToMoveForward.initialWork}
                initialRest={timerToMoveForward.initialRest}
                initialNumRounds={timerToMoveForward.initialNumRounds}
                timerId={timerId}
                timerDesc={timerToMoveForward.timerDesc} />;

            timerQueue[newIndex] = timerToMoveBack;
            timerQueue[timerId] = timerToMoveForward;
            setTimerQueue(timerQueue);
            setIsReset(true);
        }
    }

    // add a new timer to the queue with its title, description, and time/rounds (time in an object)
    const addTimer = (TimerComponent, title, initialTime, timerDesc) => {

        const newTimer = <TimerComponent
            initialMinutes={initialTime.initialMinutes}
            initialSeconds={initialTime.initialSeconds}
            initialWork={initialTime.initialWork}
            initialRest={initialTime.initialRest}
            initialNumRounds={initialTime.initialNumRounds}
            timerId={timerQueue.length}
            timerDesc={timerDesc}
        />

        setTimerQueue((prevQueue) => [
            ...prevQueue,
            {
                timerId: timerQueue.length,
                C: newTimer,
                title: title,
                timerDesc: timerDesc,
                initialMinutes: initialTime.initialMinutes,
                initialSeconds: initialTime.initialSeconds,
                initialWork: initialTime.initialWork,
                initialRest: initialTime.initialRest,
                initialNumRounds: initialTime.initialNumRounds,
            }
        ]);
        // alert(`${title} timer added to Timers Queue!`)
        setActiveTimerIndex(0);
        setGlobalTimerRunning(false);
    };

    // remove the last timer from the queue
    const removeTimer = (id) => {
        // if (timerQueue.length >= 1 && window.confirm(`Remove this ${timerQueue[id].title} timer?`)) {
        // filter out the timer using its id
        const updatedQueue = timerQueue.filter((timer) => timer.timerId !== id);
        setTimerQueue(updatedQueue);
        setIsReset(true);
        // }
    };

    // start timers
    const startGlobalTimer = () => {
        if (!globalTimerRunning && timerQueue.length > 0) {
            setGlobalTimerRunning(true);
            setIsReset(false);
        }
    };

    // pause timers
    const pauseGlobalTimer = () => {
        if (globalTimerRunning) setGlobalTimerRunning(false);
    };

    // manually go to the next timer in the queue
    const fastForwardGlobalTimer = () => {
        setFinishCurrentTimer(true);
        setActiveTimerIndex(activeTimerIndex + 1);
    };

    // go back to the beginning, resetting all timers
    const resetGlobalTimer = () => {
        setActiveTimerIndex(0);
        setGlobalTimerRunning(false);
        setIsReset(true);
    };

    // automatically iterate to the next timer in the queue
    const nextTimer = () => {
        if (finishCurrentTimer === true) {
            setFinishCurrentTimer(false);
            setActiveTimerIndex((prevIndex) => prevIndex + 1);
        } else if (!finishCurrentTimer) {
            setActiveTimerIndex((prevIndex) => prevIndex + 1);
        }
    };

    // remove the last timer in the queue
    const removeLast = () => {
        setTimerQueue((prevQueue) => prevQueue.slice(0, -1));
    };

    // function to help keep track of total time
    const updateTotalTime = (timeChange) => {
        setTotalTime((prevTime) => prevTime + timeChange);
    }

    // add up total time
    useEffect(() => {
        let timerTimes = 0;

        timerQueue.forEach((timer) => {
            if (timer.title === "Stopwatch") {
                timerTimes += timer.initialMinutes * 60 + timer.initialSeconds;
            } else if (timer.title === "Countdown") {
                timerTimes += timer.initialMinutes * 60 + timer.initialSeconds;
            } else if (timer.title === "Tabata") {
                timerTimes += (timer.initialWork + timer.initialRest) * timer.initialNumRounds;
            } else if (timer.title === "XY") {
                timerTimes += (timer.initialMinutes * 60 + timer.initialSeconds) * timer.initialNumRounds;
            }
        });

        setTotalTime(timerTimes);
    }, [timerQueue]);

    // update total time if global timer is running
    useEffect(() => {
        let intervalId;
        if (globalTimerRunning && totalTime > 0) {
            intervalId = setInterval(() => {
                setTotalTime((prevTime) => prevTime - 1)
            }, 1000);
        } else {
            clearInterval(intervalId)
        }

        return () => clearInterval(intervalId)
    }, [totalTime, timerQueue, activeTimerIndex, globalTimerRunning, finishCurrentTimer])

    return (
        <TimerContext.Provider
            value={{
                addTimer,
                removeTimer,
                timerQueue,
                startGlobalTimer,
                pauseGlobalTimer,
                resetGlobalTimer,
                fastForwardGlobalTimer,
                globalTimerRunning,
                setGlobalTimerRunning,
                activeTimerIndex,
                totalTime,
                nextTimer,
                isReset,
                moveTimer,
                setTimerQueue,
                finishCurrentTimer,
                setFinishCurrentTimer,
                updateInitialTimes,
                setIsReset,
                removeLast,
                updateTotalTime,
            }}
        >
            {children}
        </TimerContext.Provider>
    );
};

export default TimerProvider;
