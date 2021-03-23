import React, { useState, createContext, useEffect } from 'react';
import { mRound } from "../utils/mRound";


export const ProgramContext = createContext();

const weekDays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

const getBestDay = (weekDays, today, workoutDays) => {
    let best = 0;
    let idx = 0;
    const daysToCheck = [...weekDays.slice(today), ...weekDays.slice(0, today)];
    for (let i = 0; i < daysToCheck.length; i++) {
        idx = workoutDays.indexOf(daysToCheck[i]);
        if (idx !== -1) {
            best = idx;
            break;
        }
    }
    return best;
}

export const ProgramProvider = (props) => {

    const d = new Date();
    const weekday = d.getDay();

    const [program, setProgram] = useState({});
    const [maxes, setMaxes] = useState([]);
    const [repsAchieved, setRepsAchieved] = useState([]);
    const [today, setToday] = useState(null);
    const [activeLift, setActiveLift] = useState(0);
    const [activeSet, setActiveSet] = useState(0);
    const [days, setDays] = useState(["monday"]);
    const [showStats, setShowStats] = useState(false);
    const [loading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [sync, setSync] = useState(false);

    // start by fetching users
    useEffect(() => {
        fetch("/users")
            .then(usrs => usrs.json())
            .then(usrs => {
                setUsers(usrs);
                setUser(usrs[0]);
            }
            )
    },[]);

    // Fetch the program, maxes, and reps achieved for the current user
    useEffect(() => {
        if (user !== null) {
            // do not sync when we update the state from the api. No need to post the new state we just fetched.
            setSync(false);
            Promise.all([
                fetch(`/program/${user}`),
                fetch(`/maxes/${user}`),
                fetch(`/reps/${user}`)
            ])
                .then(([prog, mxs, rps]) => Promise.all([prog.json(), mxs.json(), rps.json()]))
                .then(
                    ([prog, mxs, rps]) => {
                        
                        const exerciseDays = Object.getOwnPropertyNames(prog);
                        const days_ = weekDays.filter((e) => exerciseDays.includes(e));
                        let newDay;
                        if ((today===null) | (!days_.includes(days[today]))) {
                            // we haven't set the current day yet, or the new program doesn't include today
                            newDay = getBestDay(weekDays, weekday, days_);
                        } else {
                            // we have set the day and the new program includes today
                            newDay = days_.indexOf(days[today]);
                        };
                        
                        // clip the lift/set number if the new user doesn't have enough sets/lifts
                        const newNumOfLifts = prog[days_[newDay]].length;
                        if (activeLift >= newNumOfLifts) {
                            setActiveLift(newNumOfLifts - 1);
                            setActiveSet(prog[days_[newDay]][newNumOfLifts - 1].sets.length - 1);
                        } else if (activeSet >= prog[days_[newDay]][activeLift].sets.length) {
                            setActiveSet(prog[days_[newDay]][activeLift].sets.length - 1);
                        };

                        setProgram(prog);
                        setToday(newDay);
                        setDays(days_);
                        setMaxes(mxs);
                        setRepsAchieved(rps);
                        setIsLoading(false);
                        setSync(true);
                    },
                    (error) => {
                        setIsLoading(true);
                        setSync(false);
                        setError(error);
                    }
                )
        };
    }, [user]);

    useEffect(() => {
        if (sync) {
            fetch(`/maxes/${user}`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(maxes)
            })
        }

    }, [maxes])

    useEffect(() => {
        if (sync) {
            fetch(`/reps/${user}`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(repsAchieved)
            })
        }

    }, [repsAchieved])

    const getSet = (day = days[today], lift = activeLift, set = activeSet) => {
        // get a set from the program
        const lift_ = program[day][lift];
        const set_ = lift_.sets[set];
        return {
            name: lift_.name,
            baseLift: lift_.baseLift,
            reps: set_.reps,
            weight: mRound(set_.percentage * maxes.slice(-1)[0][lift_.baseLift], 5),
        };
    };

    const getAllSets = (day = days[today], lift = activeLift) => {
        // get all sets from a certain lift on a certain day
        const lift_ = program[day][lift];
        return lift_.sets.map((set, i) => getSet(day, lift, i));
    }

    const getAllLifts = (day = days[today]) => {
        // get all sets for all lifts today
        const day_ = program[day];
        return day_.map((lift, i) => {
            return { baseLift: lift.baseLift, name: lift.name, sets: getAllSets(day, i) }
        })
    }

    const getAll = () => {
        // get everything in the program
        return days.map((day) => {
            return { day: getAllLifts(day) }
        });
    }

    const numberOfLifts = (day = days[today]) => {
        return program[day].length;
    }

    const numberOfSets = (day = days[today], lift = activeLift) => {
        return program[day][lift].sets.length;
    }

    const resetWorkoutandDay = () => {
        setToday(getBestDay(weekDays, weekday, days));
        setActiveLift(0);
        setActiveSet(0);
    }

    const value = {
        loading: loading,
        error: error,
        program: program,
        maxes: maxes, setMaxes: setMaxes,
        repsAchieved: repsAchieved, setRepsAchieved: setRepsAchieved,
        days: days,
        today: today, setToday: setToday,
        activeLift: activeLift, setActiveLift: setActiveLift,
        activeSet: activeSet, setActiveSet: setActiveSet,
        showStats: showStats, setShowStats: setShowStats,
        user: user, setUser: setUser,
        users: users,
        getSet: getSet,
        getAllSets: getAllSets,
        getAllLifts: getAllLifts,
        getAll: getAll,
        numberOfLifts: numberOfLifts,
        numberOfSets: numberOfSets,
        resetWorkoutandDay: resetWorkoutandDay
    }

    return (
        <ProgramContext.Provider value={value}>
            {props.children}
        </ProgramContext.Provider>
    );
}