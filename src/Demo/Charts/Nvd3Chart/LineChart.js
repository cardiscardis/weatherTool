import React from 'react';
import NVD3Chart from 'react-nvd3';

function getDatum(p) {
    let sin = [];
        //sin2 = [],
        //cos = [];
    for (var i = 0; i < 10; i++) {
        sin.push({
            'x': i,
            'y': Math.sin(i / 10)
        });/*
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
                color: '#04a9f5',
                area: true
            },
            {
                values: p.monthlyGraphs.g_feb,
                key: 'Feb',
                color: '#A389D4',
                area: true
            },
            {
                values: p.monthlyGraphs.g_mar,
                key: 'Mar',
                color: '#04a9f5',
                area: true
            },
            {
                values: p.monthlyGraphs.g_apr,
                key: 'Apr',
                color: '#A389D4',
                area: true
            },
            {
                values: p.monthlyGraphs.g_may,
                key: 'May',
                color: '#04a9f5',
                area: true
            },
            {
                values: p.monthlyGraphs.g_jun,
                key: 'Jun',
                color: '#A389D4',
                area: true
            },
            {
                values: p.monthlyGraphs.g_jul,
                key: 'Jul',
                color: '#04a9f5',
                area: true
            },
            {
                values: p.monthlyGraphs.g_aug,
                key: 'Aug',
                color: '#A389D4',
                area: true
            },
            {
                values: p.monthlyGraphs.g_sep,
                key: 'Sep',
                color: '#04a9f5',
                area: true
            },
            {
                values: p.monthlyGraphs.g_oct,
                key: 'Oct',
                color: '#A389D4',
                area: true
            },
            {
                values: p.monthlyGraphs.g_nov,
                key: 'Nov',
                color: '#04a9f5',
                area: true
            },
            {
                values: p.monthlyGraphs.g_dec,
                key: 'Dec',
                color: '#A389D4',
                area: true
            }
        ];
    } else if (p.oji && p.sji && p.aji) {
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
                color: '#04a9f5'                
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
    const data = getDatum(props);    
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

export default LineChart;