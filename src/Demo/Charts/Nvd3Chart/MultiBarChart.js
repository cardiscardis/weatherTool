import React, {memo} from 'react';
import NVD3Chart from 'react-nvd3';
/** */
let colors = ['#CD5C5C', '#000000', '#FF0000', '#FFFF00', '#00FF00', '#008000', '#008080', '#FF00FF', '#000080', '#800080', '#DFFF00', '#FFA07A', '#CD5C5C'];

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
            color: colors[0]
        },
        {
            values: props.autumnAvg,
            key: 'Autumn',
            color: '#1de9b6',
            area: true
        }
    ];//
    } else if (props.hAvg && Object.keys(props.hAvg).length) {
        let hObjs = Object.keys(props.hAvg).map((d, i) => ({
            values: props.hAvg[d],
            key: d,
            color: colors[i]
        }));        
        return hObjs;
    } else if (props.qAvg && Object.keys(props.qAvg).length) {
        let qObjs = Object.keys(props.qAvg).map((d, i) => ({
            values: props.qAvg[d],
            key: d,                    
            color: colors[i]
        }));
        return qObjs;
    } else if (props.avgAnnual && Object.keys(props.avgAnnual).length) {
        let annualObjs = Object.keys(props.avgAnnual).map((d, i) => ({
            values: [props.avgAnnual[d]],
            key: d,
            color: colors[i]
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
                color: colors[0]
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
                color: colors[1]
            },
            {
                values: props.junAvg,
                key: 'Jun',
                color: colors[2]
            },
            {
                values: props.julAvg,
                key: 'Jul',
                color: colors[3]
            },
            {
                values: props.augAvg,
                key: 'Aug',
                color: colors[4]
            },
            {
                values: props.sepAvg,
                key: 'Sep',
                color: colors[5]
            },
            {
                values: props.octAvg,
                key: 'Oct',
                color: colors[6]
            },
            {
                values: props.novAvg,
                key: 'Nov',
                color: colors[7]
            },            
            {
                values: props.decAvg,
                key: 'Dec',
                color: colors[8],
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
                    color: colors[0],
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
                color: colors[0]
            },
            {
                values: props.autumnPerYear,
                key: 'Autumn',
                color: colors[1]
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
                color: colors[0]
            },

            {
                values: props.monthlyGraphs.g_apr,
                key: 'Apr',
                color: colors[1]
            },
            {
                values: props.monthlyGraphs.g_may,
                key: 'May',
                color: colors[2]
            },            
            {
                values: props.monthlyGraphs.g_jun,
                key: 'Jun',
                color: colors[3]
            },
            {
                values: props.monthlyGraphs.g_jul,
                key: 'Jul',
                color: colors[4]
            },            
            {
                values: props.monthlyGraphs.g_aug,
                key: 'Aug',
                color: colors[5]
            },
            {
                values: props.monthlyGraphs.g_sep,
                key: 'Sep',
                color: colors[6]
            },            
            {
                values: props.monthlyGraphs.g_oct,
                key: 'Oct',
                color: colors[7]
            },            
            {
                values: props.monthlyGraphs.g_nov,
                key: 'Nov',
                color: colors[8]
            },            
            {
                values: props.monthlyGraphs.g_dec,
                key: 'Dec',
                color: colors[9]
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
                color: colors[0]
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