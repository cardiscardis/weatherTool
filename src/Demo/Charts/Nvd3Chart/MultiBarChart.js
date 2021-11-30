import React, {memo} from 'react';
import NVD3Chart from 'react-nvd3';
/** */
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
   if (props.winterAvg && props.winterAvg.length && props.springAvg.length && props.summerAvg && props.autumnAvg.length) {
    return [
        {
            values: props.winterAvg,
            key: 'Winter',
            color: '#A389D4'
        },
        {
            values: props.springAvg,
            key: 'Spring',
            color: '#04a9f5'
        },
        {
            values: props.summerAvg,
            key: 'Summer',
            color: '#1de9b6',          
        },
        {
            values: props.autumnAvg,
            key: 'Autumn',
            color: '#1de9b6',
            area: true
        }
    ];//
    } else if (props.hAvg && Object.keys(props.hAvg).length) {
        let hObjs = Object.keys(props.hAvg).map((d) => ({
            values: props.hAvg[d],
            key: d,
            color: '#A389D4'            
        }));        
        return hObjs;
    } else if (props.qAvg && Object.keys(props.qAvg).length) {
        let qObjs = Object.keys(props.qAvg).map((d) => ({
            values: props.qAvg[d],
            key: d,                    
            color: '#A389D4'            
        }));
        return qObjs;
    } else if (props.avgAnnual && Object.keys(props.avgAnnual).length) {
        let annualObjs = Object.keys(props.avgAnnual).map((d) => ({
            values: [props.avgAnnual[d]],
            key: d,
            color: '#A389D4'            
        }));        
        return annualObjs;
    } else if (props.janAvg && props.janAvg.length) {                

        return [
            {
                values: props.janAvg,
                key: 'Jan',
                color: '#04a9f5'
            },
            {
                values: props.febAvg,
                key: 'Feb',
                color: '#04a9f5'
            },
            {
                values: props.marAvg,
                key: 'Mar',
                color: '#1de9b6',          
            },
            {
                values: props.aprAvg,
                key: 'Apr',
                color: '#A389D4'
            },
            {
                values: props.mayAvg,
                key: 'May',
                color: '#04a9f5'
            },
            {
                values: props.junAvg,
                key: 'Jun',
                color: '#1de9b6',          
            },
            {
                values: props.julAvg,
                key: 'Jul',
                color: '#A389D4'
            },
            {
                values: props.augAvg,
                key: 'Aug',
                color: '#04a9f5'
            },
            {
                values: props.sepAvg,
                key: 'Sep',
                color: '#1de9b6',          
            },
            {
                values: props.octAvg,
                key: 'Oct',
                color: '#A389D4'
            },
            {
                values: props.novAvg,
                key: 'Nov',
                color: '#04a9f5'
            },            
            {
                values: props.decAvg,
                key: 'Dec',
                color: '#1de9b6',
                area: true
            }
        ];
        } else if (props.q1 && props.q1.length) {
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
        } else if (props.h1 && props.h1.length) {
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
    }  else if (props.winterPerYear && props.winterPerYear.length) {
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
    }  else if (props.monthlyGraphs && Object.keys(props.monthlyGraphs).length) {
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
    }  else if (props.winter && props.winter.length) {
        return [
            {
                values: props.winter,
                key: 'Winter',
                color: '#A389D4'
            }
        ]
    }  else if (props.spring && props.spring.length) {
        return [
            {
                values: props.spring,
                key: 'Spring',
                color: '#A389D4'
            }
        ]
    }  else if (props.summer && props.summer.length) {
        return [
            {
                values: props.summer,
                key: 'Summer',
                color: '#A389D4'
            }
        ]
    }  else if (props.autumn && props.autumn.length) {
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
        return (data && data.length) ? <NVD3Chart type="multiBarChart" datum={data} x="x" y="y" height={300} showValues groupSpacing={0.2} />: null;
}

export default memo(MultiBarChart);