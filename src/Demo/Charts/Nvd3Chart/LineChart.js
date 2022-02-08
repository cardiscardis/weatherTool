import React from 'react';
import NVD3Chart from 'react-nvd3';
import $ from 'jquery'

let mouseleave = (event, d) => {
    $('.nvtooltip').hide();
}
$('.nv-bar').on("mouseleave", mouseleave);

let colors = [
        '#CD5C5C', '#000000', '#FF0000', '#FFFF00', '#00FF00', '#008000', '#008080', '#FF00FF', '#000080', '#800080', '#DFFF00', '#FFA07A', 
        '#CD5C5C', '#000066', '#66FF99', '#9900CC', '#FF0066', '#9999CC', '#669900', '#CC0000', '#CCFF00', '#996600', '#00838f', '#ff5722'];

function getDatum(p) {    
    let sin = [];        
    for (var i = 0; i < 10; i++) {
        sin.push({
            'x': i,
            'y': Math.sin(i / 10)
        });
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
    } else if (p.filterControl === 'Cool and Warm' && p.coolAndWarm_chart3 && Object.keys(p.coolAndWarm_chart3).length) {
       // console.log(p.coolAndWarm_chart3);
        return [
            {
                values: p.coolAndWarm_chart3.coolAndWarm_jan,
                key: 'Jan',
                color: "7dcea0"
                //area: true
            },
            {
                values: p.coolAndWarm_chart3.coolAndWarm_feb,
                key: 'Feb',
                color: colors[0]
                //area: true
            },
            {
                values: p.coolAndWarm_chart3.coolAndWarm_mar,
                key: 'Mar',
                color: colors[1]
                //area: true
            },
            {
                values: p.coolAndWarm_chart3.coolAndWarm_apr,
                key: 'Apr',
                color: colors[2]
                //area: true
            },
            {
                values: p.coolAndWarm_chart3.coolAndWarm_may,
                key: 'May',
                color: colors[3]
                //area: true
            },
            {
                values: p.coolAndWarm_chart3.coolAndWarm_jun,
                key: 'Jun',
                color: colors[4]
                //area: true
            },
            {
                values: p.coolAndWarm_chart3.coolAndWarm_jul,
                key: 'Jul',
                color: colors[5]
                //area: true
            },
            {
                values: p.coolAndWarm_chart3.coolAndWarm_aug,
                key: 'Aug',
                color: colors[6]
                //area: true
            },
            {
                values: p.coolAndWarm_chart3.coolAndWarm_sep,
                key: 'Sep',
                color: colors[7]
                //area: true
            },
            {
                values: p.coolAndWarm_chart3.coolAndWarm_oct,
                key: 'Oct',
                color: colors[8]
                //area: true
            },
            {
                values: p.coolAndWarm_chart3.coolAndWarm_nov,
                key: 'Nov',
                color: colors[9]
                //area: true
            },
            {
                values: p.coolAndWarm_chart3.coolAndWarm_dec,
                key: 'Dec',
                color: colors[10]
                //area: true
            },
            {
                values: p.coolAndWarm_chart3.coolAndWarm_annual,
                key: 'Annual',
                color: colors[11]
                //area: true
            },
            {
                values: p.coolAndWarm_chart3.coolAndWarm_cool,
                key: 'Cool',
                color: colors[12]
                //area: true
            },
            {
                values: p.coolAndWarm_chart3.coolAndWarm_warm,
                key: 'Warm',
                color: colors[13]
                //area: true
            }
        ]
    } else if (p.filterControl === 'Cool and Warm' && p.coolAndWarm_chart2 && Object.keys(p.coolAndWarm_chart2).length) {
        return [
            {
                values: p.coolAndWarm_chart2.coolAndWarm_coolAvg_10,
                key: 'Cool 10',
                color: "7dcea0"
                //area: true
            },
            {
                values: p.coolAndWarm_chart2.coolAndWarm_coolAvg_20,
                key: 'Cool 20',
                color: colors[0]
                //area: true
            },
            {
                values: p.coolAndWarm_chart2.coolAndWarm_coolAvg_30,
                key: 'Cool 30',
                color: colors[1]
                //area: true
            },
            {
                values: p.coolAndWarm_chart2.coolAndWarm_coolAvg_40,
                key: 'Cool 40',
                color: colors[2]
                //area: true
            },
            {
                values: p.coolAndWarm_chart2.coolAndWarm_coolAvg_50,
                key: 'Cool 50',
                color: colors[3]
                //area: true
            },
            {
                values: p.coolAndWarm_chart2.coolAndWarm_coolAvg_60,
                key: 'Cool 60',
                color: colors[4]
                //area: true
            },
            {
                values: p.coolAndWarm_chart2.coolAndWarm_warmAvg_10,
                key: 'Warm 10',
                color: colors[5]
                //area: true
            },
            {
                values: p.coolAndWarm_chart2.coolAndWarm_warmAvg_20,
                key: 'Warm 20',
                color: colors[6]
                //area: true
            },
            {
                values: p.coolAndWarm_chart2.coolAndWarm_warmAvg_30,
                key: 'Warm 30',
                color: colors[7]
                //area: true
            },
            {
                values: p.coolAndWarm_chart2.coolAndWarm_warmAvg_40,
                key: 'Warm 40',
                color: colors[8]
                //area: true
            },
            {
                values: p.coolAndWarm_chart2.coolAndWarm_warmAvg_50,
                key: 'Warm 50',
                color: colors[9]
                //area: true
            },
            {
                values: p.coolAndWarm_chart2.coolAndWarm_warmAvg_60,
                key: 'Warm 60',
                color: colors[10]
                //area: true
            },
            {
                values: p.coolAndWarm_chart2.coolAndWarm_annualAvg_10,
                key: 'Annual 10',
                color: colors[11]
                //area: true
            },
            {
                values: p.coolAndWarm_chart2.coolAndWarm_annualAvg_20,
                key: 'Annual 20',
                color: colors[12]
                //area: true
            },
            {
                values: p.coolAndWarm_chart2.coolAndWarm_annualAvg_30,
                key: 'Annual 30',
                color: colors[13]
                //area: true
            },
            {
                values: p.coolAndWarm_chart2.coolAndWarm_annualAvg_40,
                key: 'Annual 40',
                color: colors[14]
                //area: true
            },
            {
                values: p.coolAndWarm_chart2.coolAndWarm_annualAvg_50,
                key: 'Annual 50',
                color: colors[15]
                //area: true
            },
            {
                values: p.coolAndWarm_chart2.coolAndWarm_annualAvg_60,
                key: 'Annual 60',
                color: colors[16]
                //area: true
            }
        ]
    } else if (p.filterControl === 'Cool and Warm' && p.coolAndWarm_chart1 && Object.keys(p.coolAndWarm_chart1).length) {
        return [
            {
                values: p.coolAndWarm_chart1.coolAndWarm_coolAvg_10,
                key: 'Cool 10',
                color: "7dcea0"
                //area: true
            },
            {
                values: p.coolAndWarm_chart1.coolAndWarm_coolAvg_20,
                key: 'Cool 20',
                color: colors[0]
                //area: true
            },
            {
                values: p.coolAndWarm_chart1.coolAndWarm_coolAvg_30,
                key: 'Cool 30',
                color: colors[1]
                //area: true
            },
            {
                values: p.coolAndWarm_chart1.coolAndWarm_coolAvg_40,
                key: 'Cool 40',
                color: colors[2]
                //area: true
            },
            {
                values: p.coolAndWarm_chart1.coolAndWarm_coolAvg_50,
                key: 'Cool 50',
                color: colors[3]
                //area: true
            },
            {
                values: p.coolAndWarm_chart1.coolAndWarm_coolAvg_60,
                key: 'Cool 60',
                color: "#7dcea0"
                //area: true
            }
        ]
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
    } else if (p.l_data) {
        return [
            {
                values: p.l_data,
                key: p.m,
                color: '#04a9f5'
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
    
    } else if (p.data) {
        
        return [
            {
                values: p.data,
                key: p.m,
                color: '#A389D4'
            }            
        ];
    } else {       
        return [
            {
                values: sin,
                key: 'n/a',
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
    //console.log(props.coolAndWarm_chart1) ;
    //console.log(props.coolAndWarm_chart2);
    
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
        data && data.length && <div>
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