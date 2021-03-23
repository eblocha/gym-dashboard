import React, { useState, createContext, useEffect } from 'react';

export const TimerContext = createContext();

export const TimerProvider = props => {
    const [seconds, setSeconds] = useState(0);
    const [counting, setCounting] = useState(false);
    const [active, setActive] = useState(false);

    useEffect(() => {
        if (counting) {
            const timer = setTimeout(() => {
                setSeconds(Math.max(seconds - 1,0));
            }, 1000);
            return () => clearInterval(timer);
        };
    },[counting,seconds]);


    const value = {
        seconds: seconds, setSeconds: setSeconds,
        counting: counting, setCounting: setCounting,
        active: active, setActive: setActive
    };
    return (
        <TimerContext.Provider value={value}>
            {props.children}
        </TimerContext.Provider>
    );
};