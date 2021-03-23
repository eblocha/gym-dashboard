import React, { useContext } from "react";
import { ProgramContext } from "../contexts/ProgramContext";

const CurrentInstruction = () => {
    const program = useContext(ProgramContext);
    const set = program.getSet();
    return (
        <h1 className="display-1 mb-1">{set.name} {set.weight}: {set.reps} {set.reps===1?"Rep":"Reps"}</h1>
    );
};

export default CurrentInstruction;