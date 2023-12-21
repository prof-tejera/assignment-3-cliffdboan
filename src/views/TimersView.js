import React, { useContext } from "react";
import styled from "styled-components";
import { TimerContext } from "../utils/timerProvider";
import Button from "../components/generic/Button";
import { secToClock } from "../utils/helpers";
import { TiDelete } from "react-icons/ti";

const TimersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const TimersView = () => {
    const {
        timerQueue,
        startGlobalTimer,
        pauseGlobalTimer,
        resetGlobalTimer,
        fastForwardGlobalTimer,
        totalTime,
        removeLast,
        globalTimerRunning,
    } = useContext(TimerContext);


    return (
        <TimersContainer>
            <h2>Timer Queue | Total Time Remaining: {secToClock(totalTime)}</h2>
            <div id="button-grid">
                <Button
                    id="start"
                    value="Start"
                    disabled={timerQueue.length === 0}
                    onClick={startGlobalTimer}
                />
                <Button
                    id="pause"
                    value="Pause"
                    disabled={timerQueue.length === 0 || !globalTimerRunning}
                    onClick={pauseGlobalTimer}
                />
                <Button
                    id="reset"
                    value="Reset"
                    disabled={timerQueue.length === 0}
                    onClick={resetGlobalTimer}
                />
                <Button
                    id="ff"
                    value="FF"
                    disabled={timerQueue.length === 0}
                    onClick={fastForwardGlobalTimer}
                />
            </div>
            <div>
                {timerQueue.map((timer) => (
                    <div key={timer.id}>
                        <b>{timer.title}</b>
                        {timer.C}
                    </div>

                ))}
            </div>
            <Button onClick={removeLast} id={'delete'} value={<TiDelete />} />
        </TimersContainer>
    );
};

export default TimersView
