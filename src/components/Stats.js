import React, { useContext } from "react";
import { ProgramContext } from "../contexts/ProgramContext";
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveBar } from  "@nivo/bar";
import theme from "./charts/theme.json";
import legend from "./charts/legend.json";
import { capitalize } from "../utils/capitalize";

const transformData = (store) => {
    let data = [];
    let lifts = [];
    // get all the lift names over all weeks
    store.forEach(week => {
        Object.getOwnPropertyNames(week).forEach(val => {
            if (!lifts.includes(val)) {
                lifts.push(val);
            }
        });
    });
    lifts.forEach(lift => {
        const dataThisLift = store.map((week, i) => {
            return { y: week[lift] === undefined ? null : week[lift], x: i + 1 };
        });
        data.push({
            id: capitalize(lift),
            color: "#0d6efd",
            data: dataThisLift
        });
    })
    return data;
}

const transformReps = (reps) => {
    let allKeys = [];
    const tReps = reps.map((week,i)=>{
        const keys = Object.getOwnPropertyNames(week);
        let modifiedWeek = {};
        keys.forEach(key=>{
            const capitalizedKey = capitalize(key);
            if (!allKeys.includes(capitalizedKey)) {
                allKeys.push(capitalizedKey);
            }
            modifiedWeek[capitalizedKey] = week[key];
        });
        return {...modifiedWeek, week:i+1};
    });
    return [tReps, allKeys]
};

const Stats = () => {
    const program = useContext(ProgramContext);
    const maxes = transformData(program.maxes);
    const [reps,repKeys] = transformReps(program.repsAchieved);
    return (
        <React.Fragment>
            <div className="col-6">
                <ResponsiveLine
                    data={maxes}
                    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                    theme={theme}
                    enableGridX={false}
                    enableGridY={false}
                    isInteractive={false}
                    legends={[legend]}
                    colors={{scheme:"dark2"}}
                    lineWidth={4}
                    pointSize={14}
                    pointColor={{ theme: 'background' }}
                    pointBorderWidth={4}
                    pointBorderColor={{ from: 'serieColor' }}
                    useMesh={true}
                    axisLeft={{tickValues:[0,100,200,300,400,500,600,700,800,900,1000]}}
                />
            </div>
            <div className="col-6">
            <ResponsiveBar
                    data={reps}
                    keys={repKeys}
                    indexBy="week"
                    groupMode="grouped"
                    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                    theme={theme}
                    enableGridX={false}
                    enableGridY={false}
                    isInteractive={false}
                    legends={[legend]}
                    colors={{scheme:"dark2"}}
                    labelTextColor="white"
                    useMesh={true}
                    axisLeft={{tickValues:[0,2,4,6]}}
                />
            </div>
        </React.Fragment>
    );
};

export default Stats;