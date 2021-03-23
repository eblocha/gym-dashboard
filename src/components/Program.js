import React, { useContext } from "react";
import { ProgramContext } from "../contexts/ProgramContext";
import Days from "./Days";
import Maxes from "./Maxes";
import RepsAchieved from "./RepsAchieved";
import Controls from "./controls/Controls";

const Program = () => {
    const program = useContext(ProgramContext);
    return (
        <Days days={program.days} today={program.today}>
            <div className="col-12" style={{ height: "100%" }}>
                <div className="row" style={{ height: "78%" }}>
                    <div className="col-6" style={{ height: "100%" }}>
                        <Maxes />
                    </div>
                    <div className="col-6" style={{ height: "100%" }}>
                        <RepsAchieved />
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-12">
                        <Controls />
                    </div>
                </div>
            </div>

        </Days>
    );
};

export default Program;