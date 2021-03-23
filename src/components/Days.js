import React, { useContext } from "react";
import Day from "./Day";
import Timer from "./Timer";
import Stats from "./Stats";
import { capitalize } from "../utils/capitalize";
import Workout from "./Workout";
import { ProgramContext } from "../contexts/ProgramContext";
import { TimerContext } from "../contexts/TimerContext";

const Days = (props) => {
    let days = [...props.days]
    const today = props.today

    let previous_days = days.splice(0, today);
    const current_day = days.splice(0, 1)[0];
    days.push(...previous_days);

    const program = useContext(ProgramContext);
    const timer = useContext(TimerContext);

    return (
        <div className="row" style={{ height: "80%" }}>

            <div className="col-lg-3 pb-3" style={{ height: "100%" }}>

                <Day name={capitalize(current_day)} today={true}>
                    <Workout day={current_day} />
                </Day>

            </div>

            <div className="col-lg-9" style={{ height: "100%" }}>

                <div className="row" style={{ height: "60%" }}>
                    {
                        (timer.counting & timer.active)? <Timer />
                        : (program.showStats ?
                        <Stats /> :
                        days.map((day) => {
                            return (
                                <div className="col pb-3" key={day} style={{ height: "100%" }}>
                                    <Day name={capitalize(day)}>
                                        <Workout day={day} />
                                    </Day>
                                </div>
                            );
                        }))}
                </div>

                <div className="row" style={{ height: "40%" }}>
                    {props.children}
                </div>

            </div>

        </div>
    );
};

export default Days;