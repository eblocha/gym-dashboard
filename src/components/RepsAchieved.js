import React, { useContext } from "react";
import { ProgramContext } from "../contexts/ProgramContext";
import { capitalize } from "../utils/capitalize";

const RepsAchieved = () => {
    const program = useContext(ProgramContext);
    const repsAchieved = program.repsAchieved.slice(-1)[0];

    const changeReps = (lift, value) => {
        let repsAchieved = [...program.repsAchieved]
        const tmpRepsAchieved = repsAchieved.splice(-1, 1)[0];
        let currRepsAchieved = { ...tmpRepsAchieved }
        const newValue = value!==""?parseInt(value):null;
        if (newValue!==currRepsAchieved[lift]) {
            currRepsAchieved[lift] = newValue;
            program.setRepsAchieved([...repsAchieved, currRepsAchieved]);
        }
        
    }

    return (
        <React.Fragment>
            <h4>Reps Achieved</h4>
            <div className="card-group" style={{ height: "80%" }}>
                {Object.getOwnPropertyNames(repsAchieved).map((prop) => {
                    return (
                        <div className="card text-center" key={prop}>
                            <div className="card-header">
                                <h4>{capitalize(prop)}</h4>
                            </div>
                            <div className="card-body">
                                <h6
                                    className="display-4"
                                    contentEditable
                                    onBlur={(e) => { changeReps(prop, e.currentTarget.textContent) }}
                                >
                                    {repsAchieved[prop]}
                                </h6>
                            </div>
                        </div>
                    );
                })}
            </div>
        </React.Fragment>
    );
}

export default RepsAchieved;