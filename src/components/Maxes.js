import React, { useContext } from "react";
import { ProgramContext } from "../contexts/ProgramContext";
import { capitalize } from "../utils/capitalize";

const Maxes = (props) => {
    const program = useContext(ProgramContext);
    const maxes = program.maxes.slice(-1)[0];

    const changeMax = (lift, value) => {
        let maxes = [...program.maxes];
        const tmpMaxes = maxes.splice(-1, 1)[0];
        let currMaxes = { ...tmpMaxes };
        const newValue = value!==""?parseInt(value):0;
        if (newValue!==currMaxes[lift]) {
            currMaxes[lift] = newValue;
            program.setMaxes([...maxes, currMaxes]);
        };
    }

    return (
        <React.Fragment>
            <h4>Maxes</h4>
            <div className="card-group" style={{ height: "80%" }}>
                {Object.getOwnPropertyNames(maxes).map((prop) => {
                    return (
                        <div className="card text-center" key={prop}>
                            <div className="card-header">
                                <h4>{capitalize(prop)}</h4>
                            </div>
                            <div className="card-body">
                                <h6
                                    className="display-4"
                                    contentEditable
                                    onBlur={(e) => { changeMax(prop, e.currentTarget.textContent) }}
                                >
                                    {maxes[prop]}
                                </h6>
                            </div>
                        </div>
                    );
                })}
            </div>
        </React.Fragment>
    );
}

export default Maxes;