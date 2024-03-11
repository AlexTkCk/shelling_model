import {useState} from "react";
import ColorsEnum from "./ColorsEnum";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import Model from "./Model";

function App() {
    const [isShowModel, setIsShowModel] = useState(false);
    const [modelSettings, setModelSettings] = useState({
        agentsTypesAmount: 2,
        agentsSatisfactionPercentages: Array(5).fill(0),
        agentsAmount: Array(5).fill(0),
        fieldSize: 10,
        radius: 0,
        delay: 0
    })

    return (
        <div className="App h-screen relative">
            {
                isShowModel ?
                    <Model modelSettings={modelSettings}/>
                    :
                    <div className={'flex items-center h-full'}>
                        <div className={'absolute right-5 top-2 border border-black px-2 py-4 rounded-sm shadow-md shadow-blue-400'}>
                            <h1 className={'text-xl font-bold'}>Model settings</h1>
                            <h2>Agents types amount: {modelSettings.agentsTypesAmount}</h2>
                            <h2>Agents amount: </h2>
                            <ul className={'list-disc list-inside'}>
                                {modelSettings.agentsAmount.slice(0, modelSettings.agentsTypesAmount).map((value, index) => <li key={index}>Type {index+1}: {value}</li>)}
                            </ul>
                            <h2>Agents satisfaction percentages: </h2>
                            <ul className={'list-disc list-inside'}>
                                {modelSettings.agentsSatisfactionPercentages.slice(0, modelSettings.agentsTypesAmount).map((value, index) => <li key={index}>Type {index+1}: {value}</li>)}
                            </ul>
                            <h2>Field size: {modelSettings.fieldSize}x{modelSettings.fieldSize}</h2>
                            <h2>Cells in total: {modelSettings.fieldSize * modelSettings.fieldSize}</h2>
                            <h2>Radius: {modelSettings.radius}</h2>
                            <h2>Auto-step delay: {modelSettings.delay} ms</h2>
                        </div>
                        <div className={'flex justify-between w-3/5 ml-10 py-5'}>
                            <div>
                                {[...Array(modelSettings.agentsTypesAmount).keys()].map((_, index) => {
                                    return <div key={index} className={'flex items-end'}>
                                        <div className={'flex flex-col items-center'}>
                                            <h1 className={'mx-2 my-auto text-xl'}>Agent type {index+1}</h1>
                                            <div className={`rounded-full w-10 h-10 border border-black ${ColorsEnum[index]} my-auto`}></div>
                                        </div>
                                        <br/>
                                        <label className={'flex flex-col ml-2'}>
                                            Satisfaction percentage
                                            <input
                                                className={'border border-black px-1 py-2 text-lg'}
                                                type="number"
                                                onChange={({target: {value}}) => {
                                                    const t = [...modelSettings.agentsSatisfactionPercentages];
                                                    t[index] = +value;
                                                    setModelSettings(prev => ({...prev, agentsSatisfactionPercentages: t}))
                                                }}/>
                                        </label>
                                        <label className={'flex flex-col ml-5'}>
                                            Agents amount
                                            <input
                                                className={'border border-black px-1 py-2 text-lg'}
                                                type="number"
                                                onChange={({target: {value}}) => {
                                                    const t = [...modelSettings.agentsAmount];
                                                    t[index] = +value;
                                                    setModelSettings(prev => ({...prev, agentsAmount: t}))
                                                }}/>
                                        </label>


                                        {
                                            (index === modelSettings.agentsTypesAmount - 1 && index > 1)
                                            &&
                                            <button
                                                className={`text-red-800 ml-5 text-5xl w-fit h-fit`}
                                                onClick={() => setModelSettings(prev =>({...prev, agentsTypesAmount: prev.agentsTypesAmount - 1}))}>
                                                <CiCircleMinus/>
                                            </button>
                                        }
                                    </div>
                                })}
                                <button
                                    className={`text-blue-800 text-7xl my-5 block mx-auto disabled:text-blue-200 w-fit`}
                                    disabled={modelSettings.agentsTypesAmount === 5}
                                    onClick={() => setModelSettings(prev => ({...prev, agentsTypesAmount: prev.agentsTypesAmount + 1}))}>
                                    <CiCirclePlus/>
                                </button>
                            </div>
                            <div className={'flex flex-col'}>
                                <h1 className={'text-xl'}>Field size</h1>
                                <label className={'text-lg'}>
                                    <input className={'mr-3'} type="radio" name={'grid_size'} defaultChecked={true} onClick={() => setModelSettings(prev => ({...prev, fieldSize: 10}))}/>
                                    10 x 10
                                </label>
                                <label className={'text-lg'}>
                                    <input className={'mr-3'} type="radio" name={'grid_size'} onClick={() => setModelSettings(prev => ({...prev, fieldSize: 50}))}/>
                                    50 x 50
                                </label>

                                <h1 className={'text-xl my-2'}>Satisfaction radius</h1>
                                <input type="number" className={'w-fit border border-black px-1 py-2 text-lg'} onChange={({target: {value}}) => setModelSettings(prev => ({...prev, radius: +value}))}/>

                                <h1 className={'text-xl my-2'}>Delay</h1>
                                <input type="number" className={'w-fit border border-black px-1 py-2 text-lg'} onChange={({target: {value}}) => setModelSettings(prev => ({...prev, delay: +value}))}/>

                                <button className={'w-fit px-2 mt-5 py-4 border-2 text-3xl text-green-800 mx-auto border-green-800'} onClick={() => setIsShowModel(true)}>Show model</button>
                            </div>

                        </div>
                    </div>
            }
        </div>
    );
}

export default App;
