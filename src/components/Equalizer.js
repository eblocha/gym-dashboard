import React from "react";
import { ReactMic } from "react-mic";

const Equalizer = (props) => {

    return (
        <div style={{overflow:"hidden", width:"200px"}}>
            <ReactMic
                record={props.record}
                className="sound-wave"
                strokeColor={props.color}
                backgroundColor="#222"
                visualSetting="frequencyBars"
                onStop={()=>{}}
            />
        </div>
    );
};

export default Equalizer;