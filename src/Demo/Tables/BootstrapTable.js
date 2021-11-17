import React from 'react';
import {Row, Col, Card, Table} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";

const BootstrapTable = (props) => {

    let monthly = props.monthly || [];
    let data = props.data || [];
    let annual = props.annual || [];
    let annualSort = props.annualSort || [];
    let annualAvg = props.annualAvg || '';
    let mon = props.mon || [];
    let averages = props.averages || [];
    let oj = props.oj || [];
    let hq = props.hq || [];
    let hqSort = props.hqSort || [];
    let seasonal = props.seasonal || [];
    let seasonalSort = props.seasonalSort || [];

    let forDataAnalysis = props.forDailyAnalysis || [];
    let analysisYear = props.q || '';

    let analysisData = '';
    if (analysisYear && forDataAnalysis) {
        analysisData = forDataAnalysis.find((d) => {
            return d.year === analysisYear;
        });
    }

    let a = '';
    if (analysisData) {
        a = analysisData.rainfall_amount;
    }

    console.log(a);
    

    /*forDailyAnalysis.push({year: year1[i], rainfall_amount: {twenty_2, twenty_3, twenty_4, twenty_5, twenty_6, twenty_7, twenty_8,
                            twenty_9, thirties, thirty_1, ones, twos, threes, fours, fives, sixes, sevens, eights, nines, tens, elevens, twelves,
                            thirteens, fourteens, fifteens, sixteens, eighteens, nineteens, twenties, seveenteens, twenty_1}}); */
    
    

    return (
        annualSort.length ?
        <Aux>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Annual Sort Raw Data</Card.Title>
                            <span className="d-block m-t-5"><code>-1</code> means <code>no data recorded</code></span>
                        </Card.Header>
                        <Card.Body>
                            <Table striped responsive>
                                <thead>
                                <tr>
                                    <th>#</th>                                    
                                    <th>Year</th>                                    
                                    <th>Monthly Precipitation Total (millimetres)</th>                                                                        
                                    <th>AVG</th>
                                </tr>
                                </thead>
                                <tbody>
                                {annualSort.map((d, i) => (<tr key={i}>
                                    <th scope="row">{i + 1}</th>
                                    <td>{d.year}</td>
                                    <td>{d.rainfall_amount}</td>
                                    <td>{annualAvg}</td>
                                </tr>))}                                
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Aux>
        : Object.keys(analysisData).length ? 
        <Aux>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Data Analysis</Card.Title>
                            <span className="d-block m-t-5"><code>-1</code> means <code>no data recorded</code></span>
                        </Card.Header>
                        <Card.Body>
                            <Table striped responsive>
                                <thead>
                                <tr>
                                    <th>{analysisData.year}</th>                                    
                                    <th>Jan</th>
                                    <th>Feb</th>
                                    <th>Mar</th>                                    
                                    <th>Apr</th>                                    
                                    <th>May</th>
                                    <th>Jun</th>
                                    <th>Jul</th>
                                    <th>Aug</th>
                                    <th>Sep</th>
                                    <th>Oct</th>
                                    <th>Nov</th>
                                    <th>Dec</th>                                    
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <th scope="row">{1}</th>                                                                                                            
                                    <td>{a.ones.Jan ? a.ones.Jan : a.ones.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.ones.Feb ? a.ones.Feb : a.ones.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.ones.Mar ? a.ones.Mar : a.ones.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.ones.Apr ? a.ones.Apr : a.ones.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.ones.May ? a.ones.May : a.ones.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.ones.Jun ? a.ones.Jun : a.ones.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.ones.Jul ? a.ones.Jul : a.ones.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.ones.Aug ? a.ones.Aug : a.ones.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.ones.Sep ? a.ones.Sep : a.ones.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.ones.Oct ? a.ones.Oct : a.ones.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.ones.Nov ? a.ones.Nov : a.ones.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.ones.Dec ? a.ones.Dec : a.ones.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                </tr>
                                <tr>
                                    <th scope="row">{2}</th>                                                                                                            
                                    <td>{a.twos.Jan ? a.twos.Jan : a.twos.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twos.Feb ? a.twos.Feb : a.twos.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twos.Mar ? a.twos.Mar : a.twos.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twos.Apr ? a.twos.Apr : a.twos.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twos.May ? a.twos.May : a.twos.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twos.Jun ? a.twos.Jun : a.twos.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twos.Jul ? a.twos.Jul : a.twos.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twos.Aug ? a.twos.Aug : a.twos.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twos.Sep ? a.twos.Sep : a.twos.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twos.Oct ? a.twos.Oct : a.twos.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twos.Nov ? a.twos.Nov : a.twos.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twos.Dec ? a.twos.Dec : a.twos.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                </tr>                                
                                <tr>
                                    <th scope="row">{3}</th>                                                                                                            
                                    <td>{a.threes.Jan ? a.threes.Jan : a.threes.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.threes.Feb ? a.threes.Feb : a.threes.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.threes.Mar ? a.threes.Mar : a.threes.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.threes.Apr ? a.threes.Apr : a.threes.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.threes.May ? a.threes.May : a.threes.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.threes.Jun ? a.threes.Jun : a.threes.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.threes.Jul ? a.threes.Jul : a.threes.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.threes.Aug ? a.threes.Aug : a.threes.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.threes.Sep ? a.threes.Sep : a.threes.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.threes.Oct ? a.threes.Oct : a.threes.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.threes.Nov ? a.threes.Nov : a.threes.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.threes.Dec ? a.threes.Dec : a.threes.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                </tr>
                                <tr>
                                    <th scope="row">{4}</th>                                                                                                            
                                    <td>{a.fours.Jan ? a.fours.Jan : a.fours.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fours.Feb ? a.fours.Feb : a.fours.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fours.Mar ? a.fours.Mar : a.fours.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fours.Apr ? a.fours.Apr : a.fours.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fours.May ? a.fours.May : a.fours.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fours.Jun ? a.fours.Jun : a.fours.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fours.Jul ? a.fours.Jul : a.fours.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fours.Aug ? a.fours.Aug : a.fours.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fours.Sep ? a.fours.Sep : a.fours.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fours.Oct ? a.fours.Oct : a.fours.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fours.Nov ? a.fours.Nov : a.fours.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fours.Dec ? a.fours.Dec : a.fours.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                </tr>  
                                <tr>
                                    <th scope="row">{5}</th>                                                                                                            
                                    <td>{a.fives.Jan ? a.fives.Jan : a.fives.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fives.Feb ? a.fives.Feb : a.fives.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fives.Mar ? a.fives.Mar : a.fives.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fives.Apr ? a.fives.Apr : a.fives.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fives.May ? a.fives.May : a.fives.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fives.Jun ? a.fives.Jun : a.fives.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fives.Jul ? a.fives.Jul : a.fives.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fives.Aug ? a.fives.Aug : a.fives.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fives.Sep ? a.fives.Sep : a.fives.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fives.Oct ? a.fives.Oct : a.fives.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fives.Nov ? a.fives.Nov : a.fives.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fives.Dec ? a.fives.Dec : a.fives.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                </tr>
                                <tr>
                                    <th scope="row">{6}</th>                                                                                                            
                                    <td>{a.sixes.Jan ? a.sixes.Jan : a.sixes.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.sixes.Feb ? a.sixes.Feb : a.sixes.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.sixes.Mar ? a.sixes.Mar : a.sixes.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.sixes.Apr ? a.sixes.Apr : a.sixes.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.sixes.May ? a.sixes.May : a.sixes.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.sixes.Jun ? a.sixes.Jun : a.sixes.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.sixes.Jul ? a.sixes.Jul : a.sixes.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.sixes.Aug ? a.sixes.Aug : a.sixes.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.sixes.Sep ? a.sixes.Sep : a.sixes.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.sixes.Oct ? a.sixes.Oct : a.sixes.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.sixes.Nov ? a.sixes.Nov : a.sixes.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.sixes.Dec ? a.sixes.Dec : a.sixes.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                </tr>
                                <tr>
                                    <th scope="row">{7}</th>                                                                                                            
                                    <td>{a.sevens.Jan ? a.sevens.Jan : a.sevens.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.sevens.Feb ? a.sevens.Feb : a.sevens.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.sevens.Mar ? a.sevens.Mar : a.sevens.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.sevens.Apr ? a.sevens.Apr : a.sevens.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.sevens.May ? a.sevens.May : a.sevens.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.sevens.Jun ? a.sevens.Jun : a.sevens.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.sevens.Jul ? a.sevens.Jul : a.sevens.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.sevens.Aug ? a.sevens.Aug : a.sevens.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.sevens.Sep ? a.sevens.Sep : a.sevens.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.sevens.Oct ? a.sevens.Oct : a.sevens.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.sevens.Nov ? a.sevens.Nov : a.sevens.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.sevens.Dec ? a.sevens.Dec : a.sevens.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                </tr> 
                                <tr>
                                    <th scope="row">{8}</th>                                                                                                            
                                    <td>{a.eights.Jan ? a.eights.Jan : a.eights.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.eights.Feb ? a.eights.Feb : a.eights.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.eights.Mar ? a.eights.Mar : a.eights.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.eights.Apr ? a.eights.Apr : a.eights.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.eights.May ? a.eights.May : a.eights.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.eights.Jun ? a.eights.Jun : a.eights.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.eights.Jul ? a.eights.Jul : a.eights.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.eights.Aug ? a.eights.Aug : a.eights.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.eights.Sep ? a.eights.Sep : a.eights.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.eights.Oct ? a.eights.Oct : a.eights.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.eights.Nov ? a.eights.Nov : a.eights.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.eights.Dec ? a.eights.Dec : a.eights.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                </tr>
                                <tr>
                                    <th scope="row">{9}</th>                                                                                                            
                                    <td>{a.nines.Jan ? a.nines.Jan : a.nines.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.nines.Feb ? a.nines.Feb : a.nines.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.nines.Mar ? a.nines.Mar : a.nines.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.nines.Apr ? a.nines.Apr : a.nines.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.nines.May ? a.nines.May : a.nines.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.nines.Jun ? a.nines.Jun : a.nines.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.nines.Jul ? a.nines.Jul : a.nines.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.nines.Aug ? a.nines.Aug : a.nines.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.nines.Sep ? a.nines.Sep : a.nines.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.nines.Oct ? a.nines.Oct : a.nines.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.nines.Nov ? a.nines.Nov : a.nines.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.nines.Dec ? a.nines.Dec : a.nines.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                </tr>
                                <tr>
                                    <th scope="row">{10}</th>                                                                                                            
                                    <td>{a.tens.Jan ? a.tens.Jan : a.tens.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.tens.Feb ? a.tens.Feb : a.tens.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.tens.Mar ? a.tens.Mar : a.tens.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.tens.Apr ? a.tens.Apr : a.tens.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.tens.May ? a.tens.May : a.tens.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.tens.Jun ? a.tens.Jun : a.tens.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.tens.Jul ? a.tens.Jul : a.tens.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.tens.Aug ? a.tens.Aug : a.tens.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.tens.Sep ? a.tens.Sep : a.tens.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.tens.Oct ? a.tens.Oct : a.tens.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.tens.Nov ? a.tens.Nov : a.tens.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.tens.Dec ? a.tens.Dec : a.tens.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                </tr>
                                <tr>
                                    <th scope="row">{11}</th>                                                                                                            
                                    <td>{a.elevens.Jan ? a.elevens.Jan : a.elevens.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.elevens.Feb ? a.elevens.Feb : a.elevens.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.elevens.Mar ? a.elevens.Mar : a.elevens.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.elevens.Apr ? a.elevens.Apr : a.elevens.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.elevens.May ? a.elevens.May : a.elevens.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.elevens.Jun ? a.elevens.Jun : a.elevens.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.elevens.Jul ? a.elevens.Jul : a.elevens.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.elevens.Aug ? a.elevens.Aug : a.elevens.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.elevens.Sep ? a.elevens.Sep : a.elevens.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.elevens.Oct ? a.elevens.Oct : a.elevens.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.elevens.Nov ? a.elevens.Nov : a.elevens.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.elevens.Dec ? a.elevens.Dec : a.elevens.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                </tr> 
                                <tr>
                                    <th scope="row">{12}</th>                                                                                                            
                                    <td>{a.twelves.Jan ? a.twelves.Jan : a.twelves.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twelves.Feb ? a.twelves.Feb : a.twelves.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twelves.Mar ? a.twelves.Mar : a.twelves.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twelves.Apr ? a.twelves.Apr : a.twelves.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twelves.May ? a.twelves.May : a.twelves.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twelves.Jun ? a.twelves.Jun : a.twelves.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twelves.Jul ? a.twelves.Jul : a.twelves.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twelves.Aug ? a.twelves.Aug : a.twelves.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twelves.Sep ? a.twelves.Sep : a.twelves.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twelves.Oct ? a.twelves.Oct : a.twelves.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twelves.Nov ? a.twelves.Nov : a.twelves.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twelves.Dec ? a.twelves.Dec : a.twelves.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                </tr>  
                                <tr>
                                    <th scope="row">{13}</th>                                                                                                            
                                    <td>{a.thirteens.Jan ? a.thirteens.Jan : a.thirteens.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.thirteens.Feb ? a.thirteens.Feb : a.thirteens.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.thirteens.Mar ? a.thirteens.Mar : a.thirteens.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.thirteens.Apr ? a.thirteens.Apr : a.thirteens.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.thirteens.May ? a.thirteens.May : a.thirteens.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.thirteens.Jun ? a.thirteens.Jun : a.thirteens.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.thirteens.Jul ? a.thirteens.Jul : a.thirteens.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.thirteens.Aug ? a.thirteens.Aug : a.thirteens.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.thirteens.Sep ? a.thirteens.Sep : a.thirteens.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.thirteens.Oct ? a.thirteens.Oct : a.thirteens.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.thirteens.Nov ? a.thirteens.Nov : a.thirteens.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.thirteens.Dec ? a.thirteens.Dec : a.thirteens.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                </tr> 
                                <tr>
                                    <th scope="row">{14}</th>                                                                                                            
                                    <td>{a.fourteens.Jan ? a.fourteens.Jan : a.fourteens.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fourteens.Feb ? a.fourteens.Feb : a.fourteens.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fourteens.Mar ? a.fourteens.Mar : a.fourteens.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fourteens.Apr ? a.fourteens.Apr : a.fourteens.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fourteens.May ? a.fourteens.May : a.fourteens.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fourteens.Jun ? a.fourteens.Jun : a.fourteens.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fourteens.Jul ? a.fourteens.Jul : a.fourteens.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fourteens.Aug ? a.fourteens.Aug : a.fourteens.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fourteens.Sep ? a.fourteens.Sep : a.fourteens.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fourteens.Oct ? a.fourteens.Oct : a.fourteens.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fourteens.Nov ? a.fourteens.Nov : a.fourteens.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fourteens.Dec ? a.fourteens.Dec : a.fourteens.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                </tr>                                
                                <tr>
                                    <th scope="row">{15}</th>                                                                                                            
                                    <td>{a.fifteens.Jan ? a.fifteens.Jan : a.fifteens.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fifteens.Feb ? a.fifteens.Feb : a.fifteens.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fifteens.Mar ? a.fifteens.Mar : a.fifteens.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fifteens.Apr ? a.fifteens.Apr : a.fifteens.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fifteens.May ? a.fifteens.May : a.fifteens.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fifteens.Jun ? a.fifteens.Jun : a.fifteens.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fifteens.Jul ? a.fifteens.Jul : a.fifteens.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fifteens.Aug ? a.fifteens.Aug : a.fifteens.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fifteens.Sep ? a.fifteens.Sep : a.fifteens.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fifteens.Oct ? a.fifteens.Oct : a.fifteens.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fifteens.Nov ? a.fifteens.Nov : a.fifteens.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.fifteens.Dec ? a.fifteens.Dec : a.fifteens.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                </tr>
                                <tr>
                                    <th scope="row">{16}</th>                                                                                                            
                                    <td>{a.sixteens.Jan ? a.sixteens.Jan : a.sixteens.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.sixteens.Feb ? a.sixteens.Feb : a.sixteens.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.sixteens.Mar ? a.sixteens.Mar : a.sixteens.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.sixteens.Apr ? a.sixteens.Apr : a.sixteens.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.sixteens.May ? a.sixteens.May : a.sixteens.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.sixteens.Jun ? a.sixteens.Jun : a.sixteens.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.sixteens.Jul ? a.sixteens.Jul : a.sixteens.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.sixteens.Aug ? a.sixteens.Aug : a.sixteens.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.sixteens.Sep ? a.sixteens.Sep : a.sixteens.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.sixteens.Oct ? a.sixteens.Oct : a.sixteens.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.sixteens.Nov ? a.sixteens.Nov : a.sixteens.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.sixteens.Dec ? a.sixteens.Dec : a.sixteens.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                </tr> 
                                <tr>
                                    <th scope="row">{17}</th>                                                                                                            
                                    <td>{a.seveenteens.Jan ? a.seveenteens.Jan : a.seveenteens.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.seveenteens.Feb ? a.seveenteens.Feb : a.seveenteens.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.seveenteens.Mar ? a.seveenteens.Mar : a.seveenteens.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.seveenteens.Apr ? a.seveenteens.Apr : a.seveenteens.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.seveenteens.May ? a.seveenteens.May : a.seveenteens.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.seveenteens.Jun ? a.seveenteens.Jun : a.seveenteens.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.seveenteens.Jul ? a.seveenteens.Jul : a.seveenteens.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.seveenteens.Aug ? a.seveenteens.Aug : a.seveenteens.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.seveenteens.Sep ? a.seveenteens.Sep : a.seveenteens.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.seveenteens.Oct ? a.seveenteens.Oct : a.seveenteens.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.seveenteens.Nov ? a.seveenteens.Nov : a.seveenteens.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.seveenteens.Dec ? a.seveenteens.Dec : a.seveenteens.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                </tr> 
                                <tr>
                                    <th scope="row">{18}</th>                                                                                                            
                                    <td>{a.eighteens.Jan ? a.eighteens.Jan : a.eighteens.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.eighteens.Feb ? a.eighteens.Feb : a.eighteens.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.eighteens.Mar ? a.eighteens.Mar : a.eighteens.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.eighteens.Apr ? a.eighteens.Apr : a.eighteens.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.eighteens.May ? a.eighteens.May : a.eighteens.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.eighteens.Jun ? a.eighteens.Jun : a.eighteens.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.eighteens.Jul ? a.eighteens.Jul : a.eighteens.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.eighteens.Aug ? a.eighteens.Aug : a.eighteens.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.eighteens.Sep ? a.eighteens.Sep : a.eighteens.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.eighteens.Oct ? a.eighteens.Oct : a.eighteens.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.eighteens.Nov ? a.eighteens.Nov : a.eighteens.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.eighteens.Dec ? a.eighteens.Dec : a.eighteens.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                </tr>
                                <tr>
                                    <th scope="row">{19}</th>                                                                                                            
                                    <td>{a.nineteens.Jan ? a.nineteens.Jan : a.nineteens.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.nineteens.Feb ? a.nineteens.Feb : a.nineteens.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.nineteens.Mar ? a.nineteens.Mar : a.nineteens.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.nineteens.Apr ? a.nineteens.Apr : a.nineteens.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.nineteens.May ? a.nineteens.May : a.nineteens.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.nineteens.Jun ? a.nineteens.Jun : a.nineteens.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.nineteens.Jul ? a.nineteens.Jul : a.nineteens.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.nineteens.Aug ? a.nineteens.Aug : a.nineteens.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.nineteens.Sep ? a.nineteens.Sep : a.nineteens.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.nineteens.Oct ? a.nineteens.Oct : a.nineteens.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.nineteens.Nov ? a.nineteens.Nov : a.nineteens.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.nineteens.Dec ? a.nineteens.Dec : a.nineteens.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                </tr>
                                <tr>
                                    <th scope="row">{20}</th>                                                                                                            
                                    <td>{a.twenties.Jan ? a.twenties.Jan : a.twenties.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenties.Feb ? a.twenties.Feb : a.twenties.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenties.Mar ? a.twenties.Mar : a.twenties.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenties.Apr ? a.twenties.Apr : a.twenties.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenties.May ? a.twenties.May : a.twenties.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenties.Jun ? a.twenties.Jun : a.twenties.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenties.Jul ? a.twenties.Jul : a.twenties.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenties.Aug ? a.twenties.Aug : a.twenties.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenties.Sep ? a.twenties.Sep : a.twenties.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenties.Oct ? a.twenties.Oct : a.twenties.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenties.Nov ? a.twenties.Nov : a.twenties.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenties.Dec ? a.twenties.Dec : a.twenties.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                </tr> 
                                <tr>
                                    <th scope="row">{21}</th>                                                                                                            
                                    <td>{a.twenty_1.Jan ? a.twenty_1.Jan : a.twenty_1.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_1.Feb ? a.twenty_1.Feb : a.twenty_1.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_1.Mar ? a.twenty_1.Mar : a.twenty_1.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_1.Apr ? a.twenty_1.Apr : a.twenty_1.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_1.May ? a.twenty_1.May : a.twenty_1.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_1.Jun ? a.twenty_1.Jun : a.twenty_1.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_1.Jul ? a.twenty_1.Jul : a.twenty_1.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_1.Aug ? a.twenty_1.Aug : a.twenty_1.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_1.Sep ? a.twenty_1.Sep : a.twenty_1.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_1.Oct ? a.twenty_1.Oct : a.twenty_1.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_1.Nov ? a.twenty_1.Nov : a.twenty_1.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_1.Dec ? a.twenty_1.Dec : a.twenty_1.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                </tr>
                                <tr>
                                    <th scope="row">{22}</th>                                                                                                            
                                    <td>{a.twenty_2.Jan ? a.twenty_2.Jan : a.twenty_2.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_2.Feb ? a.twenty_2.Feb : a.twenty_2.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_2.Mar ? a.twenty_2.Mar : a.twenty_2.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_2.Apr ? a.twenty_2.Apr : a.twenty_2.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_2.May ? a.twenty_2.May : a.twenty_2.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_2.Jun ? a.twenty_2.Jun : a.twenty_2.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_2.Jul ? a.twenty_2.Jul : a.twenty_2.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_2.Aug ? a.twenty_2.Aug : a.twenty_2.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_2.Sep ? a.twenty_2.Sep : a.twenty_2.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_2.Oct ? a.twenty_2.Oct : a.twenty_2.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_2.Nov ? a.twenty_2.Nov : a.twenty_2.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_2.Dec ? a.twenty_2.Dec : a.twenty_2.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                </tr> 
                                <tr>
                                    <th scope="row">{23}</th>                                                                                                            
                                    <td>{a.twenty_3.Jan ? a.twenty_3.Jan : a.twenty_3.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_3.Feb ? a.twenty_3.Feb : a.twenty_3.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_3.Mar ? a.twenty_3.Mar : a.twenty_3.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_3.Apr ? a.twenty_3.Apr : a.twenty_3.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_3.May ? a.twenty_3.May : a.twenty_3.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_3.Jun ? a.twenty_3.Jun : a.twenty_3.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_3.Jul ? a.twenty_3.Jul : a.twenty_3.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_3.Aug ? a.twenty_3.Aug : a.twenty_3.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_3.Sep ? a.twenty_3.Sep : a.twenty_3.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_3.Oct ? a.twenty_3.Oct : a.twenty_3.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_3.Nov ? a.twenty_3.Nov : a.twenty_3.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_3.Dec ? a.twenty_3.Dec : a.twenty_3.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                </tr>
                                <tr>
                                    <th scope="row">{24}</th>                                                                                                            
                                    <td>{a.twenty_4.Jan ? a.twenty_4.Jan : a.twenty_4.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_4.Feb ? a.twenty_4.Feb : a.twenty_4.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_4.Mar ? a.twenty_4.Mar : a.twenty_4.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_4.Apr ? a.twenty_4.Apr : a.twenty_4.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_4.May ? a.twenty_4.May : a.twenty_4.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_4.Jun ? a.twenty_4.Jun : a.twenty_4.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_4.Jul ? a.twenty_4.Jul : a.twenty_4.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_4.Aug ? a.twenty_4.Aug : a.twenty_4.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_4.Sep ? a.twenty_4.Sep : a.twenty_4.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_4.Oct ? a.twenty_4.Oct : a.twenty_4.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_4.Nov ? a.twenty_4.Nov : a.twenty_4.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_4.Dec ? a.twenty_4.Dec : a.twenty_4.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                </tr> 
                                <tr>
                                    <th scope="row">{25}</th>                                                                                                            
                                    <td>{a.twenty_5.Jan ? a.twenty_5.Jan : a.twenty_5.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_5.Feb ? a.twenty_5.Feb : a.twenty_5.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_5.Mar ? a.twenty_5.Mar : a.twenty_5.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_5.Apr ? a.twenty_5.Apr : a.twenty_5.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_5.May ? a.twenty_5.May : a.twenty_5.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_5.Jun ? a.twenty_5.Jun : a.twenty_5.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_5.Jul ? a.twenty_5.Jul : a.twenty_5.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_5.Aug ? a.twenty_5.Aug : a.twenty_5.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_5.Sep ? a.twenty_5.Sep : a.twenty_5.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_5.Oct ? a.twenty_5.Oct : a.twenty_5.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_5.Nov ? a.twenty_5.Nov : a.twenty_5.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_5.Dec ? a.twenty_5.Dec : a.twenty_5.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                </tr> 
                                <tr>
                                    <th scope="row">{26}</th>                                                                                                            
                                    <td>{a.twenty_6.Jan ? a.twenty_6.Jan : a.twenty_6.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_6.Feb ? a.twenty_6.Feb : a.twenty_6.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_6.Mar ? a.twenty_6.Mar : a.twenty_6.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_6.Apr ? a.twenty_6.Apr : a.twenty_6.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_6.May ? a.twenty_6.May : a.twenty_6.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_6.Jun ? a.twenty_6.Jun : a.twenty_6.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_6.Jul ? a.twenty_6.Jul : a.twenty_6.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_6.Aug ? a.twenty_6.Aug : a.twenty_6.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_6.Sep ? a.twenty_6.Sep : a.twenty_6.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_6.Oct ? a.twenty_6.Oct : a.twenty_6.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_6.Nov ? a.twenty_6.Nov : a.twenty_6.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_6.Dec ? a.twenty_6.Dec : a.twenty_6.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                </tr>
                                <tr>
                                    <th scope="row">{27}</th>                                                                                                            
                                    <td>{a.twenty_7.Jan ? a.twenty_7.Jan : a.twenty_7.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_7.Feb ? a.twenty_7.Feb : a.twenty_7.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_7.Mar ? a.twenty_7.Mar : a.twenty_7.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_7.Apr ? a.twenty_7.Apr : a.twenty_7.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_7.May ? a.twenty_7.May : a.twenty_7.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_7.Jun ? a.twenty_7.Jun : a.twenty_7.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_7.Jul ? a.twenty_7.Jul : a.twenty_7.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_7.Aug ? a.twenty_7.Aug : a.twenty_7.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_7.Sep ? a.twenty_7.Sep : a.twenty_7.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_7.Oct ? a.twenty_7.Oct : a.twenty_7.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_7.Nov ? a.twenty_7.Nov : a.twenty_7.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_7.Dec ? a.twenty_7.Dec : a.twenty_7.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                </tr>
                                <tr>
                                    <th scope="row">{28}</th>                                                                                                            
                                    <td>{a.twenty_8.Jan ? a.twenty_8.Jan : a.twenty_8.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_8.Feb ? a.twenty_8.Feb : a.twenty_8.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_8.Mar ? a.twenty_8.Mar : a.twenty_8.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_8.Apr ? a.twenty_8.Apr : a.twenty_8.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_8.May ? a.twenty_8.May : a.twenty_8.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_8.Jun ? a.twenty_8.Jun : a.twenty_8.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_8.Jul ? a.twenty_8.Jul : a.twenty_8.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_8.Aug ? a.twenty_8.Aug : a.twenty_8.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_8.Sep ? a.twenty_8.Sep : a.twenty_8.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_8.Oct ? a.twenty_8.Oct : a.twenty_8.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_8.Nov ? a.twenty_8.Nov : a.twenty_8.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_8.Dec ? a.twenty_8.Dec : a.twenty_8.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                </tr> 
                                <tr>
                                    <th scope="row">{29}</th>                                                                                                            
                                    <td>{a.twenty_9.Jan ? a.twenty_9.Jan : a.twenty_9.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_9.Feb ? a.twenty_9.Feb : a.twenty_9.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_9.Mar ? a.twenty_9.Mar : a.twenty_9.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_9.Apr ? a.twenty_9.Apr : a.twenty_9.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_9.May ? a.twenty_9.May : a.twenty_9.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_9.Jun ? a.twenty_9.Jun : a.twenty_9.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_9.Jul ? a.twenty_9.Jul : a.twenty_9.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_9.Aug ? a.twenty_9.Aug : a.twenty_9.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_9.Sep ? a.twenty_9.Sep : a.twenty_9.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_9.Oct ? a.twenty_9.Oct : a.twenty_9.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_9.Nov ? a.twenty_9.Nov : a.twenty_9.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_9.Dec ? a.twenty_9.Dec : a.twenty_9.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                </tr> 
                                <tr>
                                    <th scope="row">{30}</th>                                                                                                            
                                    <td>{a.thirties.Jan ? a.thirties.Jan : a.thirties.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.thirties.Feb ? a.thirties.Feb : a.thirties.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.thirties.Mar ? a.thirties.Mar : a.thirties.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.thirties.Apr ? a.thirties.Apr : a.thirties.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.thirties.May ? a.thirties.May : a.thirties.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.thirties.Jun ? a.thirties.Jun : a.thirties.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.thirties.Jul ? a.thirties.Jul : a.thirties.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.thirties.Aug ? a.thirties.Aug : a.thirties.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.thirties.Sep ? a.thirties.Sep : a.thirties.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.thirties.Oct ? a.thirties.Oct : a.thirties.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.thirties.Nov ? a.thirties.Nov : a.thirties.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.thirties.Dec ? a.thirties.Dec : a.thirties.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                </tr> 
                                <tr>
                                    <th scope="row">{29}</th>                                                                                                            
                                    <td>{a.twenty_9.Jan ? a.twenty_9.Jan : a.twenty_9.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_9.Feb ? a.twenty_9.Feb : a.twenty_9.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_9.Mar ? a.twenty_9.Mar : a.twenty_9.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_9.Apr ? a.twenty_9.Apr : a.twenty_9.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_9.May ? a.twenty_9.May : a.twenty_9.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_9.Jun ? a.twenty_9.Jun : a.twenty_9.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_9.Jul ? a.twenty_9.Jul : a.twenty_9.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_9.Aug ? a.twenty_9.Aug : a.twenty_9.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_9.Sep ? a.twenty_9.Sep : a.twenty_9.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_9.Oct ? a.twenty_9.Oct : a.twenty_9.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_9.Nov ? a.twenty_9.Nov : a.twenty_9.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.twenty_9.Dec ? a.twenty_9.Dec : a.twenty_9.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                </tr> 
                                <tr>
                                    <th scope="row">{31}</th>                                                                                                            
                                    <td>{a.thirty_1.Jan ? a.thirty_1.Jan : a.thirty_1.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.thirty_1.Feb ? a.thirty_1.Feb : a.thirty_1.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.thirty_1.Mar ? a.thirty_1.Mar : a.thirty_1.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.thirty_1.Apr ? a.thirty_1.Apr : a.thirty_1.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.thirty_1.May ? a.thirty_1.May : a.thirty_1.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.thirty_1.Jun ? a.thirty_1.Jun : a.thirty_1.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.thirty_1.Jul ? a.thirty_1.Jul : a.thirty_1.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.thirty_1.Aug ? a.thirty_1.Aug : a.thirty_1.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.thirty_1.Sep ? a.thirty_1.Sep : a.thirty_1.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.thirty_1.Oct ? a.thirty_1.Oct : a.thirty_1.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.thirty_1.Nov ? a.thirty_1.Nov : a.thirty_1.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{a.thirty_1.Dec ? a.thirty_1.Dec : a.thirty_1.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                </tr>                                 
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Aux>
         : seasonal.length ? 
         <Aux>
             <Row>
                 <Col>
                     <Card>
                         <Card.Header>
                             <Card.Title as="h5">Seasonal</Card.Title>
                             <span className="d-block m-t-5"><code>-1</code> means <code>no data recorded</code></span>
                         </Card.Header>
                         <Card.Body>
                             <Table striped responsive>
                                 <thead>
                                 <tr>
                                     <th>#</th>
                                     <th>Year</th>
                                     <th>Jan</th>
                                     <th>Feb</th>
                                     <th>Mar</th>                                    
                                     <th>Apr</th>                                    
                                     <th>May</th>
                                     <th>Jun</th>
                                     <th>Jul</th>
                                     <th>Aug</th>
                                     <th>Sep</th>
                                     <th>Oct</th>
                                     <th>Nov</th>
                                     <th>Dec</th>
                                     <th>Annual</th>
                                     <th>From</th>
                                     <th>To</th>
                                     <th>Q1</th>
                                     <th>Q2</th>
                                     <th>Q3</th>
                                     <th>Q4</th>
                                     <th>H1</th>
                                     <th>H2</th>
                                     <th>Winter</th>
                                     <th>Spring</th>
                                     <th>Summer</th>
                                     <th>Autumn</th>                                     
                                 </tr>
                                 </thead>
                                 <tbody>
                                 {seasonal.map((d, i) => (<tr key={i}>
                                     <th scope="row">{i + 1}</th>
                                     <td>{d.year}</td>
                                     <td>{d.jan}</td>
                                     <td>{d.feb}</td>
                                     <td>{d.mar}</td>                                    
                                     <td>{d.apr}</td>                                    
                                     <td>{d.may}</td>
                                     <td>{d.jun}</td>
                                     <td>{d.jul}</td>
                                     <td>{d.aug}</td>
                                     <td>{d.sep}</td>
                                     <td>{d.oct}</td>
                                     <td>{d.nov}</td>
                                     <td>{d.dec}</td>
                                     <td>{d.annual}</td>
                                     <td>{d.from}</td>
                                     <td>{d.to}</td>
                                     <td>{d.q1}</td>
                                     <td>{d.q2}</td>
                                     <td>{d.q3}</td>
                                     <td>{d.q4}</td>
                                     <td>{d.h1}</td>
                                     <td>{d.h2}</td>
                                     <td>{d.winter}</td>
                                     <td>{d.spring}</td>
                                     <td>{d.summer}</td>
                                     <td>{d.autumn}</td>                                     
                                 </tr>))}                                
                                 </tbody>
                             </Table>
                         </Card.Body>
                     </Card>
                 </Col>
             </Row>
         </Aux>
          : seasonalSort.length ? 
          <Aux>
              <Row>
                  <Col>
                      <Card>
                          <Card.Header>
                              <Card.Title as="h5">Seasonal Sort</Card.Title>
                              <span className="d-block m-t-5"><code>-1</code> means <code>no data recorded</code></span>
                          </Card.Header>
                          <Card.Body>
                              <Table striped responsive>
                                  <thead>
                                  <tr>
                                      <th>#</th>
                                      <th>From</th>
                                      <th>To</th>
                                      <th>Winter</th>
                                      <th>Spring</th>
                                      <th>Summer</th>
                                      <th>Autumn</th>                                     
                                  </tr>
                                  </thead>
                                  <tbody>
                                  {seasonalSort.map((d, i) => (<tr key={i}>
                                      <th scope="row">{i + 1}</th>
                                      <td>{d.from}</td>
                                      <td>{d.to}</td>                                      
                                      <td>{d.winter}</td>
                                      <td>{d.spring}</td>
                                      <td>{d.summer}</td>
                                      <td>{d.autumn}</td>                                     
                                  </tr>))}                                
                                  </tbody>
                              </Table>
                          </Card.Body>
                      </Card>
                  </Col>
              </Row>
          </Aux>
        : oj.length ? 
        <Aux>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">OJ Index</Card.Title>
                            <span className="d-block m-t-5"><code>-1</code> means <code>no data recorded</code></span>
                        </Card.Header>
                        <Card.Body>
                            <Table striped responsive>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>From</th>                                   
                                    <th>AJ</th>
                                    <th>SJ</th>                                    
                                    <th>OJ</th>                                    
                                   {props.cutOff === true && <th>OJ Cutoff</th>}                                    
                                </tr>
                                </thead>
                                <tbody>
                                {oj.map((d, i) => (<tr key={i}>
                                    <th scope="row">{i + 1}</th>
                                    <td>{d.yearFrom}</td>                                    
                                    <td>{d.aj}</td>
                                    <td>{d.sj}</td>                                    
                                    <td>{d.oj}</td>                                    
                                    <td>{80}</td>
                                </tr>))}                                
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Aux>
        : hqSort.length ? 
        <Aux>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">H1H2Q1Q4 Sort</Card.Title>
                            <span className="d-block m-t-5"><code>-1</code> means <code>no data recorded</code></span>
                        </Card.Header>
                        <Card.Body>
                            <Table striped responsive>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Year</th>                                    
                                    <th>Q1</th>
                                    <th>Q2</th>
                                    <th>Q3</th>
                                    <th>Q4</th>
                                    <th>H1</th>
                                    <th>H2</th>
                                    <th>Annual</th>                            
                                </tr>
                                </thead>
                                <tbody>
                                {hqSort.map((d, i) => (<tr key={i}>
                                    <th scope="row">{i + 1}</th>
                                    <td>{d.year}</td>                                                                        
                                    <td>{d.q1}</td>
                                    <td>{d.q2}</td>
                                    <td>{d.q3}</td>
                                    <td>{d.q4}</td>
                                    <td>{d.h1}</td>
                                    <td>{d.h2}</td>
                                    <td>{d.annual}</td>
                                </tr>))}                                
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Aux>
        : hq.length ? 
        <Aux>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">H1H2Q1Q4</Card.Title>
                            <span className="d-block m-t-5"><code>-1</code> means <code>no data recorded</code></span>
                        </Card.Header>
                        <Card.Body>
                            <Table striped responsive>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Year</th>
                                    <th>Jan</th>
                                    <th>Feb</th>
                                    <th>Mar</th>                                    
                                    <th>Apr</th>                                    
                                    <th>May</th>
                                    <th>Jun</th>
                                    <th>Jul</th>
                                    <th>Aug</th>
                                    <th>Sep</th>
                                    <th>Oct</th>
                                    <th>Nov</th>
                                    <th>Dec</th>
                                    <th>Annual</th>
                                    <th>Q1</th>
                                    <th>Q2</th>
                                    <th>Q3</th>
                                    <th>Q4</th>
                                    <th>H1</th>
                                    <th>H2</th>                                    
                                </tr>
                                </thead>
                                <tbody>
                                {hq.map((d, i) => (<tr key={i}>
                                    <th scope="row">{i + 1}</th>
                                    <td>{d.year}</td>
                                    <td>{d.jan}</td>
                                    <td>{d.feb}</td>
                                    <td>{d.mar}</td>                                    
                                    <td>{d.apr}</td>                                    
                                    <td>{d.may}</td>
                                    <td>{d.jun}</td>
                                    <td>{d.jul}</td>
                                    <td>{d.aug}</td>
                                    <td>{d.sep}</td>
                                    <td>{d.oct}</td>
                                    <td>{d.nov}</td>
                                    <td>{d.dec}</td>
                                    <td>{d.annual}</td>
                                    <td>{d.q1}</td>
                                    <td>{d.q2}</td>
                                    <td>{d.q3}</td>
                                    <td>{d.q4}</td>
                                    <td>{d.h1}</td>
                                    <td>{d.h2}</td>                                    
                                </tr>))}                                
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Aux>
        : averages.length ? 
        <Aux>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Averages</Card.Title>
                            <span className="d-block m-t-5"><code>-1</code> means <code>no data recorded</code></span>
                        </Card.Header>
                        <Card.Body>
                            <Table striped responsive>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Year</th>
                                    <th>Jan</th>
                                    <th>Feb</th>
                                    <th>Mar</th>                                    
                                    <th>Apr</th>                                    
                                    <th>May</th>
                                    <th>Jun</th>
                                    <th>Jul</th>
                                    <th>Aug</th>
                                    <th>Sep</th>
                                    <th>Oct</th>
                                    <th>Nov</th>
                                    <th>Dec</th>
                                    <th>Annual</th>
                                    <th>Q1</th>
                                    <th>Q2</th>
                                    <th>Q3</th>
                                    <th>Q4</th>
                                    <th>H1</th>
                                    <th>H2</th>
                                    <th>Winter</th>
                                    <th>Spring</th>
                                    <th>Summer</th>
                                    <th>Autumn</th>
                                    <th>From</th>
                                    <th>To</th>
                                </tr>
                                </thead>
                                <tbody>
                                {averages.map((d, i) => (<tr key={i}>
                                    <th scope="row">{i + 1}</th>
                                    <td>{d.year}</td>
                                    <td>{d.jan}</td>
                                    <td>{d.feb}</td>
                                    <td>{d.mar}</td>                                    
                                    <td>{d.apr}</td>                                    
                                    <td>{d.may}</td>
                                    <td>{d.jun}</td>
                                    <td>{d.jul}</td>
                                    <td>{d.aug}</td>
                                    <td>{d.sep}</td>
                                    <td>{d.oct}</td>
                                    <td>{d.nov}</td>
                                    <td>{d.dec}</td>
                                    <td>{d.annual}</td>
                                    <td>{d.q1}</td>
                                    <td>{d.q2}</td>
                                    <td>{d.q3}</td>
                                    <td>{d.q4}</td>
                                    <td>{d.h1}</td>
                                    <td>{d.h2}</td>
                                    <td>{d.winter}</td>
                                    <td>{d.spring}</td>
                                    <td>{d.summer}</td>
                                    <td>{d.autumn}</td>
                                    <td>{d.from}</td>
                                    <td>{d.to}</td>
                                </tr>))}                                
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Aux>
        : mon.length ? 
        <Aux>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Monthly Data</Card.Title>
                            <span className="d-block m-t-5"><code>-1</code> means <code>no data recorded</code></span>
                        </Card.Header>
                        <Card.Body>
                            <Table striped responsive>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Year</th>
                                    <th>Jan</th>
                                    <th>Feb</th>
                                    <th>Mar</th>                                    
                                    <th>Apr</th>                                    
                                    <th>May</th>
                                    <th>Jun</th>
                                    <th>Jul</th>
                                    <th>Aug</th>
                                    <th>Sep</th>
                                    <th>Oct</th>
                                    <th>Nov</th>
                                    <th>Dec</th>
                                    <th>Annual</th>
                                </tr>
                                </thead>
                                <tbody>
                                {mon.map((d, i) => (<tr key={i}>
                                    <th scope="row">{i + 1}</th>
                                    <td>{d.year}</td>
                                    <td>{d.jan}</td>
                                    <td>{d.feb}</td>
                                    <td>{d.mar}</td>                                    
                                    <td>{d.apr}</td>                                    
                                    <td>{d.may}</td>
                                    <td>{d.jun}</td>
                                    <td>{d.jul}</td>
                                    <td>{d.aug}</td>
                                    <td>{d.sep}</td>
                                    <td>{d.oct}</td>
                                    <td>{d.nov}</td>
                                    <td>{d.dec}</td>
                                    <td>{d.annual}</td>
                                </tr>))}                                
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Aux>
        :annual.length ? 
        <Aux>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Annual Raw Data</Card.Title>
                            <span className="d-block m-t-5"><code>-1</code> means <code>no data recorded</code></span>
                        </Card.Header>
                        <Card.Body>
                            <Table striped responsive>
                                <thead>
                                <tr>
                                    <th>#</th>                                    
                                    <th>Year</th>                                    
                                    <th>Monthly Precipitation Total (millimetres)</th>                                                                        
                                </tr>
                                </thead>
                                <tbody>
                                {annual.map((d, i) => (<tr key={i}>
                                    <th scope="row">{i + 1}</th>
                                    <td>{d.year}</td>
                                    <td>{d.rainfall_amount}</td>                                                                        
                                </tr>))}                                
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Aux>
        : monthly.length ? 
        <Aux>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Monthly Raw Data</Card.Title>
                            <span className="d-block m-t-5"><code>-1</code> means <code>no data recorded</code></span>
                        </Card.Header>
                        <Card.Body>
                            <Table striped responsive>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Product code</th>
                                    <th>Bureau of Meteorology station number</th>
                                    <th>Year</th>
                                    <th>Month</th>                                    
                                    <th>Monthly Precipitation Total (millimetres)</th>                                    
                                    <th>Quality</th>
                                </tr>
                                </thead>
                                <tbody>
                                {monthly.map((d, i) => (<tr key={i}>
                                    <th scope="row">{i + 1}</th>
                                    <td>{d.product_code}</td>
                                    <td>{d.station_number}</td>
                                    <td>{d.year}</td>
                                    <td>{d.month}</td>                                    
                                    <td>{d.rainfall_amount}</td>                                    
                                    <td>{d.quality}</td>
                                </tr>))}                                
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Aux>
        : 
        <Aux>
            <Row>
                <Col>
                    {/*<Card>
                        <Card.Header>
                            <Card.Title as="h5">Basic Table</Card.Title>
                            <span className="d-block m-t-5">use bootstrap <code>Table</code> component</span>
                        </Card.Header>
                        <Card.Body>
                            <Table responsive>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Username</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <th scope="row">1</th>
                                    <td>Mark</td>
                                    <td>Otto</td>
                                    <td>@mdo</td>
                                </tr>
                                <tr>
                                    <th scope="row">2</th>
                                    <td>Jacob</td>
                                    <td>Thornton</td>
                                    <td>@fat</td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td>Larry</td>
                                    <td>the Bird</td>
                                    <td>@twitter</td>
                                </tr>
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Hover Table</Card.Title>
                            <span className="d-block m-t-5">use props <code>hover</code> with <code>Table</code> component</span>
                        </Card.Header>
                        <Card.Body>
                            <Table responsive hover>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Username</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <th scope="row">1</th>
                                    <td>Mark</td>
                                    <td>Otto</td>
                                    <td>@mdo</td>
                                </tr>
                                <tr>
                                    <th scope="row">2</th>
                                    <td>Jacob</td>
                                    <td>Thornton</td>
                                    <td>@fat</td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td>Larry</td>
                                    <td>the Bird</td>
                                    <td>@twitter</td>
                                </tr>
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>*/}
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Daily Raw Data</Card.Title>
                            <span className="d-block m-t-5"><code>-1</code> means <code>no data recorded</code></span>
                        </Card.Header>
                        <Card.Body>
                            <Table striped responsive>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Product code</th>
                                    <th>Bureau of Meteorology station number</th>
                                    <th>Year</th>
                                    <th>Month</th>
                                    <th>Day</th>
                                    <th>Rainfall amount (millimetres)</th>
                                    <th>Period over which rainfall was measured (days)</th>
                                    <th>Quality</th>
                                </tr>
                                </thead>
                                <tbody>
                                {data.map((d, i) => (<tr key={i}>
                                    <th scope="row">{i}</th>
                                    <td>{d.product_code}</td>
                                    <td>{d.station_number}</td>
                                    <td>{d.year}</td>
                                    <td>{d.month}</td>
                                    <td>{d.day}</td>
                                    <td>{d.rainfall_amount}</td>
                                    <td>{d.measure_in_days}</td>
                                    <td>{d.quality}</td>
                                </tr>))}
                                {/*<tr>
                                    <th scope="row">2</th>
                                    <td>Jacob</td>
                                    <td>Thornton</td>
                                    <td>@fat</td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td>Larry</td>
                                    <td>the Bird</td>
                                    <td>@twitter</td>
                                </tr>*/}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Aux>
    );    
}

export default BootstrapTable;