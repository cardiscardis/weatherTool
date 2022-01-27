import React from 'react';
import NVD3Chart from 'react-nvd3';
//import * as d3 from 'd3';
//import './linePlusBar.css';

const LinePlusBarChart = (props) => {    
    
    //******************************************** */
    //$(element+' rect.discreteBar').attr('transform', 'translate(17)').attr('width', 20)
//$(element+' .nv-axis g text').attr('transform', 'translate(0, 5)')
//********************************************************* */

    var testdata = [
        {
            "key" : "Selected OJ Vs. LTA",
            "bar": true,
            "color": "red",
            "values" : props.testSelectGraphData
        },
        {
            "key" : "OJ" ,
            "values" : props.ojiSelect
        }
    ]/*.map(function(series) {
            series.values = series.values.map(function(d) { return {x: d[0], y: d[1] } });
            return series;
    });*/
    console.log([testdata]);
/*
    useEffect(() => {
        let chart = '';
        const createChart = async () => {
            await nv.addGraph(function() {
                chart = nv.models.linePlusBarChart()
                    .margin({top: 50, right: 80, bottom: 30, left: 80})
                    .legendRightAxisHint(' [Using Right Axis]')
                    .color(d3.scale.category10().range());
            
                chart.xAxis.tickFormat(function(d) {
                    return d3.time.format('%x')(new Date(d))
                }).showMaxMin(false);
            
                chart.y2Axis.tickFormat(function(d) { return '$' + d3.format(',f')(d) });
                chart.bars.forceY([0]).padData(false);
            
                chart.x2Axis.tickFormat(function(d) {
                    return d3.time.format('%x')(new Date(d))
                }).showMaxMin(false);
            
                d3.select('#linePlusBarContainer')
                    .append('svg')
                    .datum(testdata)
                    .transition().duration(500).call(chart);
            
                nv.utils.windowResize(chart.update);
            
                chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
                return chart; 
            });
            return chart; 
        }

        createChart();
    })
    */
    
    return <NVD3Chart type="linePlusBarChart" datum={testdata} x="x" y="y" height={300} focusEnable={false} />;
}

export default LinePlusBarChart;