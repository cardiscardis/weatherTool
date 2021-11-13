import React from 'react';
import NVD3Chart from 'react-nvd3';

function generateNumber(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min)
}

function getDatum(props) {
    let sin = [],
        sin2 = [],
        sin3 = [],
        sin4 = [];

    const len =  35 + (Math.random() * (70-35));
    for (let i = 0; i < len; i++) {
        sin.push({
            'x': i,
            'y': generateNumber(0, 60)
        });
        sin2.push({
            'x': i,
            'y': generateNumber(0, 100)
        });
        sin3.push({
            'x': i,
            'y': generateNumber(0, 30)
        });
        sin4.push({
            'x': i,
            'y': i
        });
    }
   if (props.q1) {
    return [
        {
            values: props.q1,
            key: 'Q1',
            color: '#A389D4'
        },
        {
            values: props.q2,
            key: 'Q2',
            color: '#04a9f5'
        },
        {
            values: props.q3,
            key: 'Q3',
            color: '#1de9b6',          
        },
        {
            values: props.q4,
            key: 'Q4',
            color: '#1de9b6',
            area: true
        }
    ];
} else if (props.h1) {
        return [
            {
                values: props.h1,
                key: 'H1',
                color: '#A389D4'
            },
            {
                values: props.h2,
                key: 'H2',
                color: '#04a9f5'
            }            
        ];
    }  else {
            return [
            {
                values: sin,
                key: 'sin',
                color: '#A389D4'
            },
            {
                values: sin2,
                key: 'sin2',
                color: '#04a9f5'
            },
            {
                values: sin3,
                key: 'sin3',
                color: '#1de9b6',          
            },
            {
                values: sin4,
                key: 'sin4',
                color: '#1de9b6',
                area: true
            }
        ];
    }
}



const MultiBarChart = (props) => {    
        const data = getDatum(props);
        return (data.length) ? <NVD3Chart type="multiBarChart" datum={data} x="x" y="y" height={300} showValues groupSpacing={0.2} />: null;
}

export default MultiBarChart;