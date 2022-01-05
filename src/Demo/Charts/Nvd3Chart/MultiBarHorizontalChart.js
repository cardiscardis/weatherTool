import React from 'react';
import NVD3Chart from 'react-nvd3';

function generateNumber(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min)
}


function getDatum(props) {
    /* 
        dryDays={hdnodYear}
        wetDays={hnodYear}
        nwd25={nwd25Year}
        nwd15={nwd15Year}
        nwd10={nwd10Year}
    */
    let sin = [];        

    const len =  35 + (Math.random() * (70-35));
    for (let i = 0; i < len; i++) {
        sin.push({
            'x': i,
            'y': generateNumber(0, 60)
        });        
    }
   
    return [
        {
            values: [
                {x: 'Highest No. Consecutive Wet Days', y: props.wetDays}, 
                {x: 'Highest No. Consecutive Dry Days', y: props.dryDays},
                {x: 'No. Wet Days > 10', y: props.nwd10},
                {x: 'No. Wet Days > 15', y: props.nwd15},
                {x: 'No. Wet Days > 25', y: props.nwd25}
            ] || sin,       
            key: 'Hover Over the Chart to View its Tooltip',     
            color: '#A389D4'            
        }
    ];       
}




const MultiBarHorizontalChart = (props) => {        
    const data = getDatum(props);
    return (data.length) ? 
    <div className="pl-5 mr-5">
        <NVD3Chart type="multiBarHorizontalChart" datum={data} x="x" y="y" height={400} showValues groupSpacing={0.2} />
    </div>: null;
}

export default MultiBarHorizontalChart;