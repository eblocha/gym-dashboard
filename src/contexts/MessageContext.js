import React, { useState, createContext } from 'react';

export const MessageContext = createContext();

export const MessageProvider = (props) => {
    const [level,setLevel] = useState("info");
    const [message,setMessage] = useState("");

    const value = {
        level: level,
        setLevel: setLevel,
        message: message,
        setMessage: setMessage
    }

    return (
        <MessageContext.Provider value={value}>
            {props.children}
        </MessageContext.Provider>
    );
}