import React, { memo } from 'react';
import NVD3Chart from 'react-nvd3';

const da = [
    {key: "One", y: 29, color: "#ff8a65"},
    {key: "Two", y: 0, color: "#f4c22b"},
    {key: "Three", y: 32, color: "#04a9f5"},
    {key: "Four", y: 196, color: "#3ebfea"},
    {key: "Five", y: 2, color: "#4F5467"},
    {key: "Six", y: 98, color: "#1de9b6"},
    {key: "Seven", y: 13, color: "#a389d4"},
    {key: "Eight", y: 5, color: "#FE8A7D"}
];

const PieBasicChart = (props) => {
    
    let dry = '', wet = '', datum = '';        
    if (props.q && props.dry && props.wet) {        
        dry = props.dry.find((d) => {
            return d.year === props.q;
        });
        wet = props.wet.find((d) => {
            return d.year === props.q;
        });

        let wetYear = Object.values(wet.r) ? Object.values(wet.r).reduce(function(a, b) {
            return a + b;
        }) : 'n/a';

        let dryYear = Object.values(dry.r) ? Object.values(dry.r).reduce(function(a, b) {
            return a + b;
        }) : 'n/a';        

        datum = [
            {key: 'No. of Wet Days', values: 'Wet', y: wetYear, color: "#ff8a65"},
            {key: 'No. of Dry Days', values: 'Dry', y: dryYear, color: "#f4c22b"}
        ];
    } else {
        datum = da;
    }
    
    return <NVD3Chart               
                id="chart" 
                height={300} 
                type="pieChart" 
                datum={datum} 
                x="key" 
                y="y"    
                showLabels={true}             
                labelType={'value'}
                labelThreshold={0.05}
            />
    
}

export default memo(PieBasicChart);