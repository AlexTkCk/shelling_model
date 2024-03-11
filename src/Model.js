import React, {useEffect, useRef, useState} from 'react';
import ColorsEnum from "./ColorsEnum";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const getNeighbours = (radius, grid, x, y) => {
    const bound = grid.length;

    const left = x - radius >= 0 ? x - radius : 0;
    const top = y - radius >= 0 ? y - radius : 0;
    const right = x + radius < bound ? x + radius : bound - 1;
    const bottom = y + radius < bound ? y + radius : bound - 1;

    const nbs = [];

    for (let i = top; i <= bottom; i++) {
        for (let j = left; j <= right; j++) {
            if (!(i === y && j === x)) {
                nbs.push(grid[i][j].value);
            }
        }
    }

    return nbs;
}

const calculateSatisfaction = (agent, nbs) => {
    const percentageByAgent = 100 / (nbs.length + 1);
    return percentageByAgent * (nbs.filter(x => x === agent).length + 1)
}

const getAverageSatisfaction = (grid, modelSettings) => {
    return grid.reduce((acc, curr, i) => {
        return acc + curr.reduce((innerAcc, innerCurr, j) => {
            if (innerCurr !== 0) {
                return innerAcc + calculateSatisfaction(innerCurr, getNeighbours(modelSettings.radius, grid, j, i));
            } else return innerAcc;
        }, 0)
    },0) / modelSettings.agentsAmount.slice(0, modelSettings.agentsTypesAmount).reduce((acc, curr) => acc + curr, 0)
}

const makeStep = (grid, modelSettings, setGrid) => {
    const gridCopy = JSON.parse(JSON.stringify(grid));
    const visitedCells = [];
    for (let i = 0; i < modelSettings.fieldSize; i++){
        for (let j = 0; j < modelSettings.fieldSize; j++) {
            const agent = gridCopy[i][j].value;
            if (visitedCells.filter(([x, y]) =>  x === j && y === i).length) continue;
            if (agent !== 0) {

                const satisfaction = calculateSatisfaction(agent, getNeighbours(modelSettings.radius, gridCopy, j, i));
                if (satisfaction < modelSettings.agentsSatisfactionPercentages[agent - 1]) {
                    const availableCells = gridCopy.map((row, i) => row.map(({value}, j) => {
                        if (value === 0) return [i, j];
                    }).filter(item => item)).filter(row => row.length).flat()


                    const [newY, newX] = availableCells
                        .map(([y, x]) => [calculateSatisfaction(agent, getNeighbours(modelSettings.radius, gridCopy, x, y)), [y, x]])
                        .sort((a, b) => {
                            if (b[0] > a[0]) return 1;
                            if (b[0] < a[0]) return -1;
                            return 0;
                        })
                        .shift()[1];


                    [gridCopy[i][j], gridCopy[newY][newX]] = [gridCopy[newY][newX], gridCopy[i][j]];
                    gridCopy[newY][newX].satisfactionGraphData.push(calculateSatisfaction(agent, getNeighbours(modelSettings.radius, gridCopy, newX, newY)))
                    visitedCells.push([newX, newY]);
                }
            }
        }
    }
    setGrid(gridCopy);
}

const Model = ({modelSettings}) => {
    const [grid, setGrid] = useState([]);
    const [autoInterval, setAutoInterval] = useState(null);
    const buttonRef = useRef(null);
    const [graphData, setGraphData] = useState([]);

    useEffect(() => {
        const agents = [];
        for (let i=0; i<modelSettings.agentsTypesAmount ; i++) {
            const row = Array(modelSettings.agentsAmount[i]).fill({value: i+1, satisfactionGraphData: [modelSettings.agentsSatisfactionPercentages[i]]});
            agents.push(...row)
        }

        agents.push(...Array(modelSettings.fieldSize * modelSettings.fieldSize - modelSettings.agentsAmount.slice(0, modelSettings.agentsTypesAmount).reduce((acc, curr) => acc + curr, 0)).fill({value: 0, satisfactionGraphData: []}));
        agents.sort(() => Math.random() > 0.5 ? -1 : 1)
        const tGrid = [];
        while(agents.length) tGrid.push(agents.splice(0,modelSettings.fieldSize));
        setGrid(tGrid);
    }, [])

    return (
        <div className={'border-black flex h-screen'}>
            <div className={'h-full w-3/5 px-5 py-5'}>
                <div className={`h-full aspect-square border border-black grid  ${'grid-rows-' + modelSettings.fieldSize} ${'grid-cols-' + modelSettings.fieldSize}`}>

                    {grid.map((row, i) => {
                        return row.map(({value, satisfactionGraphData}, j) => {
                            const index = value - 1;
                            const color = ColorsEnum[index];

                            const data = satisfactionGraphData.map((item, index) => {
                                return {
                                    step: 'Step ' + index,
                                    percent: item,
                                }
                            })
                            return <div key={`${i}_${j}`} onClick={() => setGraphData(data)} className={'border border-black'}>
                                <div className={`w-full aspect-square rounded-full hover:scale-105 cursor-pointer ${color}`}></div>
                            </div>
                        })
                    })}
                </div>
            </div>
            <div className={'w-2/5 flex flex-col items-center justify-center border border-black'}>
                <ResponsiveContainer width="90%" height="90%" className={'mt-5'}>
                    <LineChart
                        data={graphData}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="step" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="percent" stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
                <button
                    className={'w-fit px-2 py-4 border-2 text-3xl text-green-800 mt-2 mx-auto border-green-800'}
                    onClick={() => {
                        const interval = setInterval(() => {
                                buttonRef.current.click()
                            }, 1000)
                            setAutoInterval(interval);
                        }
                    }>Run auto</button>
                <button
                    className={'w-fit px-2 py-4 border-2 text-3xl text-red-800 my-5 mx-auto border-red-800'}
                    onClick={() => {
                        clearInterval(autoInterval);
                    }
                    }>Stop auto</button>
                <button
                    className={'w-fit px-2 py-4 border-2 text-3xl text-green-800 my-5 mx-auto border-green-800'}
                    ref={buttonRef}
                    onClick={() => {
                        makeStep(grid, modelSettings, setGrid);
                    }}>Make step</button>
            </div>
        </div>
    );
};

export default Model;