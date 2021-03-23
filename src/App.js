import React, { useState, useEffect, useContext } from "react";
import NSunsManager from "./picovoice/nsuns_manager";
import "@picovoice/web-voice-processor/src/web_voice_processor";
import Program from "./components/Program";
import CurrentInstruction from "./components/CurrentInstruction";
import Message from "./components/Message";
import { IntentContext } from "./contexts/IntentContext";

import { library } from '@fortawesome/fontawesome-svg-core';
import { 
    faMicrophone, 
    faChartBar, 
    faUser, 
    faInfo, 
    faSyncAlt, 
    faUndoAlt, 
    faForward, 
    faHourglassHalf 
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./scss/App.scss";
import Equalizer from "./components/Equalizer";
import { MessageContext } from "./contexts/MessageContext";
import { ProgramContext } from "./contexts/ProgramContext";
import { useIdleTimer } from 'react-idle-timer';

library.add(faMicrophone, faChartBar, faUser, faInfo, faSyncAlt, faUndoAlt, faForward, faHourglassHalf);



const MESSAGE_TIMEOUT_MS = 5000;

const manager = new NSunsManager();

const App = () => {
    const intents = useContext(IntentContext);
    const messaging = useContext(MessageContext);
    const program = useContext(ProgramContext);

    const [initialized, setInitialized] = useState(false);
    const [loading, setLoading] = useState(false);

    const [wakePhrase, setWakePhrase] = useState(false);
    const [listening, setListening] = useState(false);
    const [, setIntentFailed] = useState(false);
    const [msgVisible, setMsgVisible] = useState(false);

    const [message, setMessage] = useState("");

    const [mouseActive, setMouseActive] = useState(true);

    const displayMessage = () => {
        setMsgVisible(true);
        setTimeout(() => {
            setMsgVisible(false);
        }, 3000);
    }

    const initCallback = event => {
        setInitialized(true)
        setLoading(false)
    };

    const ppnCallback = event => {
        setWakePhrase(true)
        setIntentFailed(false)
        console.log("Listening")
    };

    const rhnCallback = (information) => {
        setWakePhrase(false);
        if (information.isUnderstood === false) {
            setIntentFailed(true);
            messaging.setMessage("I didn't understand.")
            messaging.setLevel("danger");
            displayMessage();
        } else {
            setIntentFailed(false);
            const intent = information.intent;
            const slots = information.slots;
            if (typeof intents[intent] === "function") {
                intents[intent](slots);
                displayMessage();
            } else {
                messaging.setMessage(`Command "${intent}" understood but not programmed.`)
                messaging.setLevel("warning");
                displayMessage();
            }

        }
    };

    useEffect(() => {
        manager.refresh(initCallback, ppnCallback, rhnCallback)
    });

    useEffect(() => {
        if (message !== "") {
            setTimeout(() => {
                setMessage("");
            }, MESSAGE_TIMEOUT_MS);
        }
    }, [message]);

    useIdleTimer({
        timeout: 5000,
        onIdle: () => setMouseActive(false),
        onActive: () => setMouseActive(true),
        onAction: () => setMouseActive(true),
        debounce: 200
    })

    const toggleListening = () => {
        if (listening) {
            stopListening()
        } else {
            startListening()
        }
    };

    const stopListening = () => {
        manager.stop()
        setListening(false)
        setWakePhrase(false)
    };

    const startListening = () => {
        manager.start(initCallback, ppnCallback, rhnCallback)
        setListening(true)
        setWakePhrase(false)
        setIntentFailed(false)

        if (!initialized) {
            setInitialized(true)
            setLoading(true)
        }
    };

    return (
        program.loading ?
            <div class="spinner-grow text-primary" role="status" style={{
                position: "fixed",
                left: "50%",
                top: "50%"
            }}>
                <span class="sr-only">Loading...</span>
            </div> :
            <div className="container-fluid" style={{ height: "100vh", overflow: "hidden", cursor: `${mouseActive ? "auto" : "none"}` }}>
                <div className="row pb-2" style={{ minHeight: "20%" }}>
                    <div className="col-9">
                        <CurrentInstruction />
                    </div>
                    <div className="col-3">
                        <div className="row">
                            <div className="col my-3 d-flex align-items-center">
                                {/* {wakePhrase ? null : (msg !== null ? <Message msg={msg} /> : null)} */}
                                <Equalizer record={wakePhrase} color={"#e74c3c"} />
                            </div>
                            <div className="col">
                                <button
                                    disabled={loading}
                                    type="button"
                                    className={`
                                    btn float-right rounded-circle m-3 
                                    ${wakePhrase ? "btn-danger" : (listening ? "btn-primary" : "btn-secondary")}`
                                    }
                                    onClick={() => { toggleListening() }}
                                    style={{ width: "8rem", height: "8rem" }}
                                >
                                    {loading ?
                                        <div className="spinner-border" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div> :
                                        <FontAwesomeIcon icon="microphone" size="4x" />
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <Program />
                <div style={{ position: "absolute", right: 0, bottom: 0, width: "50rem", overflow: "hidden" }}>
                    <Message visible={msgVisible} destroy={() => { setMsgVisible(false) }} />
                </div>
            </div>
    );
};

export default App;