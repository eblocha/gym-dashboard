import React, { createContext, useContext } from "react";
import { ProgramContext } from "./ProgramContext";
import { MessageContext } from "./MessageContext";
import { TimerContext } from "./TimerContext";
import { capitalize } from "../utils/capitalize";

export const IntentContext = createContext();

export const IntentProvider = (props) => {
    const program = useContext(ProgramContext);
    const messaging = useContext(MessageContext);
    const timer = useContext(TimerContext);

    const nextSet = (props) => {
        if (
            (program.activeLift + 1 === program.numberOfLifts()) &
            (program.activeSet + 1 === program.numberOfSets())
        ) {
            messaging.setMessage("Workout is complete.");
            messaging.setLevel("info");
            return;
        } else if (program.activeSet + 1 === program.numberOfSets()) {
            program.setActiveSet(0);
            program.setActiveLift(program.activeLift + 1);
        } else {
            program.setActiveSet(program.activeSet + 1);
        }
        messaging.setMessage("Next set.");
        messaging.setLevel("success");
        timer.setSeconds(180);
        timer.setCounting(true);
    }

    const logReps = (props) => {
        let repsAchieved = [...program.repsAchieved]
        const tmpRepsAchieved = repsAchieved.splice(-1, 1)[0];
        let currRepsAchieved = { ...tmpRepsAchieved }
        currRepsAchieved[props.type] = parseInt(props.reps);
        program.setRepsAchieved([...repsAchieved, currRepsAchieved]);
        messaging.setMessage(`Logged ${props.reps} for ${capitalize(props.type)}.`);
        messaging.setLevel("success");
    }

    const updateWeights = (props) => {
        let maxes = [...program.maxes];
        const tmpMaxes = maxes.splice(-1, 1)[0];
        let currMaxes = { ...tmpMaxes };
        let repsAchieved = {};
        let i = 0;
        const names = Object.getOwnPropertyNames(program.repsAchieved.slice(-1)[0]);
        names.forEach(liftName => {
            const reps = program.repsAchieved.slice(-1)[0][liftName];
            if (reps === null) {

            } else if (reps === 0) {
                i++
            } else if ((reps < 3) & (reps > 1)) {
                currMaxes[liftName] += 5
                i++
            } else if (reps < 6) {
                currMaxes[liftName] += 10
                i++
            } else {
                currMaxes[liftName] += 15
                i++
            }
            repsAchieved[liftName] = null;
        })
        if (i === 0) {
            messaging.setMessage("No changes.");
            messaging.setLevel("warning");
        } else {
            program.setMaxes([...program.maxes, currMaxes]);
            program.setRepsAchieved([...program.repsAchieved, repsAchieved]);
            messaging.setMessage("Maxes updated.");
            messaging.setLevel("success");
        }
    }

    const undoUpdate = (props) => {
        const repsAchieved = program.repsAchieved.slice(-1)[0];
        const names = Object.getOwnPropertyNames(repsAchieved);
        let i = 0;
        names.forEach(liftName => {
            if (repsAchieved[liftName] !== null) {
                i++;
            }
        });
        if ((i === 0) & (program.repsAchieved.length > 1)) {
            program.setMaxes(program.maxes.slice(0, -1));
            program.setRepsAchieved(program.repsAchieved.slice(0, -1));
            messaging.setMessage("Switched to previous maxes.");
            messaging.setLevel("success");
        } else {
            messaging.setMessage("Nothing to undo.");
            messaging.setLevel("warning");
        }
    };

    const resetReps = (props) => {
        let repsAchieved = { ...program.repsAchieved.slice(-1)[0] };
        const names = Object.getOwnPropertyNames(repsAchieved);
        names.forEach(liftName => {
            repsAchieved[liftName] = null
        });
        program.setRepsAchieved([...program.repsAchieved.slice(0, -1), repsAchieved]);
        messaging.setMessage("Rep counts reset.");
        messaging.setLevel("success")
    };

    const goTo = (props) => {
        const place = parseInt(props.place.slice(0, 1));
        const type = props.type;
        if (type === "set") {
            if (place <= program.numberOfSets()) {
                program.setActiveSet(place - 1);
                messaging.setMessage(`Switched to set ${place}`);
                messaging.setLevel("success");
            } else {
                messaging.setMessage(`Cannot go to set ${place}. There are only ${program.numberOfSets()} sets.`);
                messaging.setLevel("danger");
            }
        } else if (place <= program.numberOfLifts()) {
            program.setActiveSet(0);
            program.setActiveLift(place - 1);
            messaging.setMessage(`Switched to lift ${place}`);
            messaging.setLevel("success")
        } else {
            messaging.setMessage(`Cannot go to lift ${place}. There are only ${program.numberOfLifts()} lifts.`);
            messaging.setLevel("danger");
        }

    };

    const startWorkout = (props) => {
        program.resetWorkoutandDay();
        messaging.setMessage("Started Workout.");
        messaging.setLevel("success");
    };

    const exitWorkout = (props) => {
        startWorkout();
        messaging.setMessage("Stopping Workout.");
        messaging.setLevel("info");
    };

    const status = (props) => {
        program.setShowStats(!program.showStats);
        messaging.setMessage(`Switching stats ${program.showStats?"off":"on"}.`);
        messaging.setLevel("info");
    }

    const changeMax = (props) => {
        let maxes = [...program.maxes];
        const tmpMaxes = maxes.splice(-1, 1)[0];
        let currMaxes = { ...tmpMaxes };
        let direction = ""
        if (props.direction==="increase") {
            currMaxes[props.type] += parseInt(props.weight);
            direction = "Increasing"
        } else {
            currMaxes[props.type] -= parseInt(props.weight);
            direction = "Decreasing"
        }
        program.setMaxes([...maxes, currMaxes]);


        messaging.setMessage(`${direction} ${capitalize(props.type)} by ${props.weight}`);
        messaging.setLevel("info");
    }

    const value = {
        nextSet: nextSet,
        logReps: logReps,
        updateWeights: updateWeights,
        undoUpdate: undoUpdate,
        resetReps: resetReps,
        goTo: goTo,
        startWorkout: startWorkout,
        exitWorkout: exitWorkout,
        status: status,
        changeMax: changeMax
    }

    return (
        <IntentContext.Provider value={value}>
            {props.children}
        </IntentContext.Provider>
    );
}