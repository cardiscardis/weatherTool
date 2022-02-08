import React from 'react';
//import NVD3Chart from 'react-nvd3';
import {
    ComposedChart,
    Line,    
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer    
  } from "recharts";

//import * as d3 from 'd3';
//import $ from 'jquery';
//import './linePlusBar.css';

const LinePlusBarChart = (props) => {    
    
    //******************************************** */
    //$(element+' rect.discreteBar').attr('transform', 'translate(17)').attr('width', 20)
//$(element+' .nv-axis g text').attr('transform', 'translate(0, 5)')
//********************************************************* */

  /**
   * const data = [
    {
      name: "Page A",
      uv: 590,
      pv: 800,
      amt: 1400,
      cnt: 490
    },
    {
      name: "Page B",
      uv: 868,
      pv: 967,
      amt: 1506,
      cnt: 590
    },
    {
      name: "Page C",
      uv: 1397,
      pv: 1098,
      amt: 989,
      cnt: 350
    },
    {
      name: "Page D",
      uv: 1480,
      pv: 1200,
      amt: 1228,
      cnt: 480
    },
    {
      name: "Page E",
      uv: 1520,
      pv: 1108,
      amt: 1100,
      cnt: 460
    },
    {
      name: "Page F",
      uv: 1400,
      pv: 680,
      amt: 1700,
      cnt: 380
    }
  ];
   */
  
  /*
    let testdata = [];
    testdata = [
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
    ].map(function(series) {
            series.values = [...series.values]//.map(function(d) { return {x: d[0], y: d[1] } });
            return series;
    });
    */
    //console.log([testdata]);

    /**
     * 
     *   $('.nv-chart').attr('id', 'nvc');
    let chartData = d3.select('#nvc svg').datum(testdata);
    chartData.transition().duration(500)//.call(chart);

    //nv.utils.windowResize(chart.update);

    //.load(window.location.href+" #nvc>*","");//import d3 from 'd3';
     */
  
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
    
    /**
     * (
        React.createElement(NVD3Chart, {
            xAxis: {
                tickFormat: function(d){ return d; },
                axisLabel: 'Year'
            },
            yAxis: {
                axisLabel: 'Amount',
                tickFormat: function(d) {return parseFloat(d).toFixed(2); }
            },
            type:'linePlusBarChart',
            datum: testdata,
            x: 'x',
            y: 'y',
            height: 300,
            focusEnable:false,
            renderEnd: function(){
                console.log('renderEnd');
            }
        })  
    );
     */
    const data = props.testSelectGraphData;
    console.log(data);
    return (
        <ResponsiveContainer width="100%" height={400}>
        <ComposedChart          
          data={data}
          margin={{
            top: 20,
            right: 5,
            bottom: 20,
            left: 0
          }}
        >
          <CartesianGrid stroke="#d3d3d3" strokeDasharray="5 5"/>
          <XAxis dataKey="x" />
          <YAxis />
          <Tooltip />
          <Legend />
          {/*<Area type="monotone" dataKey="amt" fill="#8884d8" stroke="#8884d8" />*/}
          <Bar dataKey="Selected_OJ_Vs_LTA" barSize={20} fill="red" />
          <Line type="monotone" dataKey="OJ" stroke="blue" />
          {/*<Scatter dataKey="cnt" fill="red" />*/}
        </ComposedChart>
        </ResponsiveContainer>
      );//    return <NVD3Chart type="linePlusBarChart" id={'lpbc'} datum={testdata} x="x" y="y" height={300} focusEnable={false} update={true} />;
}

export default LinePlusBarChart;