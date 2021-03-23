import React, { useContext, useEffect, useRef, useState } from "react";
import { ProgramContext } from "../contexts/ProgramContext";

const Workout = (props) => {
    const program = useContext(ProgramContext);
    const lifts = program.getAllLifts(props.day);
    const isToday = program.days[program.today] === props.day;
    return (
        lifts.map((lift, i) =>
            <LiftSets
                sets={lift.sets}
                name={lift.name}
                key={i}
                isToday={isToday}
                liftIndex={i}
                day={program.days.indexOf(props.day)}
            />
        )
    );
};

const LiftSets = (props) => {
    const program = useContext(ProgramContext);

    const [refs] = useState(props.sets.map(set=>{
        return React.createRef();
    }));

    const setActiveSet = (day,lift,set) => {
        program.setActiveSet(set);
        program.setActiveLift(lift);
        program.setToday(day);
    };

    useEffect(() => {
        if (props.isToday & program.activeLift === props.liftIndex) {
            refs[program.activeSet].current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: "nearest"
            });
        }
    }, [program.today,program.activeLift,program.activeSet]);

    return (
        <div className="mb-3">
            <h5>{props.name}</h5>
            <div className="list-group list-group-flush">
                {props.sets.map((set, i) => {
                    
                    return (
                        <button 
                            type="button" 
                            className={`list-group-item list-group-item-action rounded-lg 
                                ${(props.isToday & (program.activeSet === i) & (program.activeLift === props.liftIndex)) ? "active" : ""}`
                            }
                            key={i}
                            onClick={()=>setActiveSet(props.day,props.liftIndex,i)}
                        >
                            <span style={{fontSize:18}}>{set.weight} for {set.reps} {set.reps===1?"Rep":"Reps"}</span>
                            <div 
                                style={{
                                    position: "absolute",
                                    bottom: "-120%",
                                    height: "340%"
                                }}
                                ref={refs[i]}
                            ></div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default Workout;