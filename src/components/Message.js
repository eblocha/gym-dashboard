import React, { useContext } from "react";
import { MessageContext } from "../contexts/MessageContext";

const Message = (props) => {
    const messaging = useContext(MessageContext);

    return (
        <div className={`alert alert-${messaging.level} m-2 ${props.visible ? "msg-visible" : "msg-hidden"}`} role="alert">
            <span style={{fontSize:"1.5rem"}}>{messaging.message}</span>
            <button type="button" className="close float-right" aria-label="Close" onClick={props.destroy}>
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    );
};

export default Message;