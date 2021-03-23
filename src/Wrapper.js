import React from "react";
import { ProgramProvider } from "./contexts/ProgramContext";
import { IntentProvider } from "./contexts/IntentContext";
import { MessageProvider } from "./contexts/MessageContext";
import { TimerProvider } from "./contexts/TimerContext";
import App from "./App";

const Wrapper = () => {
    return (
        <ProgramProvider>
            <MessageProvider>
                <TimerProvider>
                    <IntentProvider>
                        <App />
                    </IntentProvider>
                </TimerProvider>
            </MessageProvider>
        </ProgramProvider>
    );
};

export default Wrapper;