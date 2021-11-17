import React from 'react';
import NVD3Chart from 'react-nvd3';

function generateNumber(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min)
}

function getDatum(props) {
    let sin = [];        

    const len =  35 + (Math.random() * (70-35));
    for (let i = 0; i < len; i++) {
        sin.push({
            'x': i,
            'y': generateNumber(0, 60)
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
    }  else if (props.winterPerYear) {
        return [
            {
                values: props.winterPerYear,
                key: 'Winter',
                color: '#A389D4'
            },
            {
                values: props.springPerYear,
                key: 'Spring',
                color: '#04a9f5'
            },            
            {
                values: props.summerPerYear,
                key: 'Summer',
                color: '#A389D4'
            },
            {
                values: props.autumnPerYear,
                key: 'Autumn',
                color: '#04a9f5'
            }            
        ];
    }  else if (props.monthlyGraphs) {
        return [
            {
                values: props.monthlyGraphs.g_jan,
                key: 'Jan',
                color: '#A389D4'
            },
            {
                values: props.monthlyGraphs.g_feb,
                key: 'Feb',
                color: '#04a9f5'
            },            
            {
                values: props.monthlyGraphs.g_mar,
                key: 'Mar',
                color: '#A389D4'
            },

            {
                values: props.monthlyGraphs.g_apr,
                key: 'Apr',
                color: '#04a9f5'
            },
            {
                values: props.monthlyGraphs.g_may,
                key: 'May',
                color: '#04a9f5'
            },            
            {
                values: props.monthlyGraphs.g_jun,
                key: 'Jun',
                color: '#A389D4'
            },
            {
                values: props.monthlyGraphs.g_jul,
                key: 'Jul',
                color: '#04a9f5'
            },            
            {
                values: props.monthlyGraphs.g_aug,
                key: 'Aug',
                color: '#A389D4'
            },
            {
                values: props.monthlyGraphs.g_sep,
                key: 'Sep',
                color: '#04a9f5'
            },            
            {
                values: props.monthlyGraphs.g_oct,
                key: 'Oct',
                color: '#A389D4'
            },            
            {
                values: props.monthlyGraphs.g_nov,
                key: 'Nov',
                color: '#04a9f5'
            },            
            {
                values: props.monthlyGraphs.g_dec,
                key: 'Dec',
                color: '#A389D4'
            }
        ];
    }  else if (props.winter) {
        return [
            {
                values: props.winter,
                key: 'Winter',
                color: '#A389D4'
            }
        ]
    }  else if (props.spring) {
        return [
            {
                values: props.spring,
                key: 'Spring',
                color: '#A389D4'
            }
        ]
    }  else if (props.summer) {
        return [
            {
                values: props.summer,
                key: 'Summer',
                color: '#A389D4'
            }
        ]
    }  else if (props.autumn) {
        return [
            {
                values: props.autumn,
                key: 'Autumn',
                color: '#A389D4'
            }
        ]
    }   else {
            return [
            {
                values: props.data || sin,
                key: props.m || 'n/a',
                color: '#A389D4'
            }            
        ];
    }
}



const MultiBarChart = (props) => {    
        const data = getDatum(props);
        return (data.length) ? <NVD3Chart type="multiBarChart" datum={data} x="x" y="y" height={300} showValues groupSpacing={0.2} />: null;
}

export default MultiBarChart;