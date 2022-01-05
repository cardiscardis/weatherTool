import React, { memo } from 'react';
import NVD3Chart from 'react-nvd3';

let colors = ['#CD5C5C', '#000000', '#FF0000', '#FFFF00', '#00FF00', '#008000', '#008080', '#FF00FF', '#000080', '#800080', '#DFFF00', '#FFA07A', '#CD5C5C'];

function getDatum(p) {    
    let sin = [];            
        //sin2 = [],
        //cos = [];
    for (var i = 0; i < 10; i++) {
        sin.push({
            'x': i,
            'y': Math.sin(i / 10)
        });
    
        /*
        sin2.push({
            'x': i,
            'y': Math.sin(i / 10) * 0.25 + 0.5
        });
        cos.push({
            'x': i,
            'y': .5 * Math.cos(i / 10)
        });    */
    }    
    

    if (p.monthlyGraphs) {
        return [
            {
                values: p.monthlyGraphs.g_jan,
                key: 'Jan',
                color: '#3383ff',
                area: true
            },
            {
                values: p.monthlyGraphs.g_feb,
                key: 'Feb',
                color: '#FFC300',
                area: true
            },
            {
                values: p.monthlyGraphs.g_mar,
                key: 'Mar',
                color: '#797d7f',
                area: true
            },
            {
                values: p.monthlyGraphs.g_apr,
                key: 'Apr',
                color: '#f4d03f',
                area: true
            },
            {
                values: p.monthlyGraphs.g_may,
                key: 'May',
                color: '#85c1e9',
                area: true
            },
            {
                values: p.monthlyGraphs.g_jun,
                key: 'Jun',
                color: '#58d68d',
                area: true
            },
            {
                values: p.monthlyGraphs.g_jul,
                key: 'Jul',
                color: '#154360',
                area: true
            },
            {
                values: p.monthlyGraphs.g_aug,
                key: 'Aug',
                color: '#c0392b',
                area: true
            },
            {
                values: p.monthlyGraphs.g_sep,
                key: 'Sep',
                color: colors[1],
                area: true
            },
            {
                values: p.monthlyGraphs.g_oct,
                key: 'Oct',
                color: colors[10],
                area: true
            },
            {
                values: p.monthlyGraphs.g_nov,
                key: 'Nov',
                color: colors[8],
                area: true
            },
            {
                values: p.monthlyGraphs.g_dec,
                key: 'Dec',
                color: "#7dcea0",
                area: true
            }
        ];
    } else if (p.oji && p.sji && p.aji) {//data={mainState.lineChartData}
                                        //totalAvg= {annualAvg}
        return [
            {
                values: p.oji,
                key: 'OJ',
                color: '#04a9f5',              
            },
            {
                values: p.sji,
                key: 'SJ',
                color: '#A389D4'                
            },
            {
                values: p.aji,
                key: 'AJ',
                color: colors[1],
            }
        ];
    } else if (p.data && p.totalAvg) {//data={mainState.lineChartData}
        //totalAvg= {annualAvg}
        return [
            {
                values: p.data,
                key: 'Annual',
                color: '#04a9f5',
            },
            {
                values: p.totalAvg,
                key: 'AVG',
                color: '#A389D4'
            }
        ];
    
    } else {
        return [
            {
                values: p.data || sin,
                key: p.m || 'n/a',
                color: '#A389D4'
            }
            /*{
                values: cos,
                key: 'Cosine Wave',
                color: '#04a9f5'
            },
            {
                values: sin2,
                key: 'Another sine wave',
                color: '#1de9b6',
                area: true
            }*/
        ];
    }
}

const LineChart = (props) => {   
    let data = [];
     if (props.obj) {
        let obj = Object.keys(props.obj).map((d, i) => (
            {
                values: props.obj[d],
                key: d,
                color: colors[i],
            }
        ));

        data = [...obj,
            {
                values: props.data,
                key: 'Annual',
                color: '#04a9f5',
            },
            {
                values: props.totalAvg,
                key: 'AVG',
                color: '#A389D4'
            }            
        ];
     } else {
        data = getDatum(props);
     }

    //console.log(data);
    return (
        <div>
            {
                React.createElement(NVD3Chart, {
                    xAxis: {
                        tickFormat: function(d){ return d; },
                        axisLabel: 'Year'
                    },
                    yAxis: {
                        axisLabel: 'Amount',
                        tickFormat: function(d) {return parseFloat(d).toFixed(2); }
                    },
                    type:'lineChart',
                    datum: data,
                    x: 'x',
                    y: 'y',
                    height: 300,
                    renderEnd: function(){
                        console.log('renderEnd');
                    }
                })
            }
        </div>
    )
}

export default memo(LineChart);