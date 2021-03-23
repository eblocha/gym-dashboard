import React from "react";

const VoiceInfo = () => {
    return (
        <React.Fragment>
            <p>Start by clicking the microphone button to activate voice control.
            Then, say "Jarvis".
            The button will turn red to indicate it is waiting for a command.
            </p>
            <h4>Commands</h4>
            <hr></hr>
            <h5>"Sart today's workout"</h5>
            <p>Go to the first set of the first lift for today (or the next workout day)</p>
            <h5>"Next set"</h5>
            <p>Advance to the next set.</p>
            <h5>"Log 5 for bench.", "I got 3 on deadlift."</h5>
            <p>Log the reps you achieved for the peak set of a lift.</p>
            <h5>"Update", "Update weights"</h5>
            <p>Update your maxes based on the reps you achieved this week.</p>
            <h5>"Undo"</h5>
            <p>Undo the last update.</p>
            <h5>"Reset reps"</h5>
            <p>Reset the reps for this week.</p>
            <h5>"Stats"</h5>
            <p>Toggle the stats charts on/off.</p>
        </React.Fragment>
    );
};

export default VoiceInfo;