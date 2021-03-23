import React, { useContext } from "react";
import { TimerContext } from "../contexts/TimerContext";

const Timer = props => {
    const timer = useContext(TimerContext);
    return (
        <h1 className="display-1 p-3" style={{fontSize:"200px"}}>
            {Math.floor(timer.seconds / 60)}:{(timer.seconds % 60).toString().padStart(2, "0")}
        </h1>
    );
};

export default Timer;