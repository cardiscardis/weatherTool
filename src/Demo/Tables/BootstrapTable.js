import React, { memo, useState } from 'react';
import {Button, OverlayTrigger, Tooltip, Row, Col, Card, Table, Form} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import PieChart from '../Charts/Nvd3Chart/PieBasicChart'
import LineChart from '../Charts/Nvd3Chart/LineChart'
import TiltedBarChart from '../Charts/Nvd3Chart/MultiBarHorizontalChart'
import UcFirst from "../../App/components/UcFirst";

const BootstrapTable = (props) => {        

    let monthly = props.monthly || []; //monthly data
    let data = props.data || []; //overview
    let annual = props.annual || []; //annual filter data
    let annualSort = props.annualSort || []; //annual sort filter data

    let annualAvg = props.annualAvg || ''; //annual avg filter data
    let mon = props.mon || []; //month filter data
    //table 1 averages data
    let averages = props.averages || []; //avg filter data
    //table 2 averages data    
    let avgPerTenYears= props.avgPerTenYears;
    let avgPerFiftyYears = props.avgPerFiftyYears;
    let last100YearAvg = props.last100YearAvg;
    let ltaYearsAvg = props.ltaYearsAvg;
    let avgPerFiveYears = props.avgPerFiveYears;

    let oj = props.oj || []; //oj filter data
    let hq = props.hq || []; //h1h2q1q2 filter data
    let hqSort = props.hqSort || []; //h1h2Q1Q2 sort filter data
    let seasonal = props.seasonal || []; //seasonal filter data
    let seasonalSort = props.seasonalSort || []; //season sort filter data
    let janToDecMaxPerYear = props.janToDecMaxPerYear || [];    //max rain per month per year

    let forDataAnalysis = props.forDailyAnalysis || []; //daily rain per month per year
    let analysisYear = props.q || ''; //query year

    let hrpmConsec = props.hrpmConsec || [];   //highest rain per month
    let hnodConsec = props.hnodConsec || [];   //highest no of days per month
    let hdnodConsec = props.hdnodConsec || [];   //highest no of dry days per month
    let hnodConsec2 = props.hnodConsec2 || [];   //highest no of days per month
    let hdnodConsec2 = props.hdnodConsec2 || [];   //highest no of dry days per month
    let nord = props.nord || [];//no of rain days
    let nodd = props.nodd || [];//no of dry days 
    let nowd25 = props.nowd25 || [], nowd15 = props.nowd15 || [], nowd10 = props.nowd10 ||  [];//no of wet days > 25mm, 15mm and 10mm

    let cumulativeRain = props.cumulativeRain || [];
    let cumulativeRain2 = props.cumulativeRain2 || [];         
    let filterControl = props.filterControl || '';    

    const [ annualSortControl1, setAnnualSortControl1 ] = useState('Select Year');
    const [ annualSortControl2, setAnnualSortControl2 ] = useState('Select Year');    
    const [ as, setAs ] = useState(annualSort);
    const [ arrOfKeys, setArrOfKeys ] = useState([]);
    const [ annualAvg2, setAnnualAvg2 ] = useState([]);
    const [ obj, setObj ] = useState([]);

     const onChange = (e) => {
//         e.stopPropagation();
        if (e.target.name === 'annualSortControl1') {
            if (e.target.value > annualSortControl2) {
                alert('start year must be less than end year!!');
            } else {
                setAnnualSortControl1(e.target.value); 
            }            
        } else if (e.target.name === 'annualSortControl2') {
            if (e.target.value < annualSortControl1) {
                alert('start year must be less than end year!!');
            } else {
                setAnnualSortControl2(e.target.value); 
            }
        }
     } 
     
     const onClick = (e) => {
        //sorted average        
        
        let annualAvg3 = [];
        if (annualSortControl1 !== 'Select Year' && annualSortControl2 !== 'Select Year' && as.length) {
            if (annualSortControl1 < annualSortControl2) {     
                                
                let avgresult = 0;            
                
                let annualSortControlIndex1 = props.sumOfRainYears.indexOf(`${annualSortControl1}`);
                let annualSortControlIndex2 = props.sumOfRainYears.indexOf(`${annualSortControl2}`);
                
                if (annualSortControlIndex1 !== -1 && annualSortControlIndex2 !== -1) {                                
                    let avgResult = [...arrOfKeys];
                    if (arrOfKeys.includes(`${annualSortControl1}-${annualSortControl2}`)) {
                        alert('Chosen data already exists');
                        return false;
                    } else {
                        avgResult = [...avgResult, `${annualSortControl1}-${annualSortControl2}`];
                    }
                    for (let y = annualSortControlIndex1; y <= annualSortControlIndex2; y++) {
                        avgresult += props.sumOfRain[y];                    
                    }
                    avgresult /= (annualSortControlIndex2 - annualSortControlIndex1) + 1;

                    let as2 = [...as];                    
                    let alreadyExists = false;
                    for (let z = 0; z <= as2.length - 1; z++) {                                                
                        annualAvg3.push({x: as2[z].year, y: annualAvg});
                        if (as2[z][`${annualSortControl1}-${annualSortControl2}`] !== undefined) {
                            alreadyExists = true;
                        }
                        if (alreadyExists) {                            
                            continue;
                        } else {
                            if (z >= annualSortControlIndex1 && z <= annualSortControlIndex2) {                                                    
                                as2[z] = {...as[z], [`${annualSortControl1}-${annualSortControl2}`]: Number(avgresult).toFixed(2)};                                                        
                            } else {
                                as2[z] = {...as[z], [`${annualSortControl1}-${annualSortControl2}`]: '-'};                        
                            }                                                       
                        }                           
                    }                                                                
                    let keys = avgResult;
                    let annualSortArr = as2;
                    let obj = {};
                    if (keys.length && annualSortArr.length) {                        
                        for (let x = 0; x <= keys.length - 1; x++) {
                            let res = [];
                            for (let y = 0; y <= annualSortArr.length - 1; y++) {
                                if (annualSortArr[y][keys[x]] !== '-') {
                                    res.push({x: annualSortArr[y].year, y: annualSortArr[y][keys[x]]});
                                } else {
                                    continue;
                                }
                            }
                            obj[keys[x]] = res;
                        }                                               
                    }
                    setObj(obj);
                    setAs(as2);
                    setArrOfKeys(avgResult);                        
                    setAnnualAvg2(annualAvg3);
                }
            }        
        } else {
            alert('Error!');
        }
    }


    const UserChoiceInput = () => (
        <>
        <Row>                   
            {(filterControl === 'Annual Sort') && <Col md={6} xl={4}>{'From:  '}
                <Form.Control size="lg" as="select" className="mb-3 col-12" name='annualSortControl1' value={annualSortControl1} onChange={(e) => {onChange(e)}}>
                <option>Select Year</option>
                {props.dataYears && props.dataYears.map((years, i) => <option key={i}>{years}</option>)}                    
            </Form.Control>
            </Col>}
            {(filterControl === 'Annual Sort') && <Col xl={4} md={6}>{'  To:  '}
            <Form.Control size="lg" as="select" className="mb-3 col-12" name='annualSortControl2' value={annualSortControl2} onChange={(e) => {onChange(e)}}>
                <option>Select Year</option>
                {props.dataYears && props.dataYears.map((years, i) => <option key={i}>{years}</option>)}                    
            </Form.Control>
            </Col>}
            
            {filterControl === 'Annual Sort' && <Col xl={4} md={12}>
                <OverlayTrigger overlay={<Tooltip>{'Make sure the selected years are not the same. Do not over-use this button to avoid processing too many computation'}</Tooltip>}>
                    <Button className="mb-3 col-12" variant={'primary'} onClick={(e) => onClick(e)}><UcFirst text={'Compute New Selected Average'} /></Button>
                </OverlayTrigger>
                {/*<button className="mb-3 mt-3 col-12" onClick={(e) => onClick(e)}>Compute New Selected Average</button>*/}
            </Col>}
        </Row> 
        </>
    )

    
    let cr = {}, cr2 = {};
    if (cumulativeRain.length && cumulativeRain.length && analysisYear) {
        cr = cumulativeRain.find((d) => {
            return d.year === analysisYear;
        });        
        cr2 = cumulativeRain2.find((d) => {
            return d.year === analysisYear;
        });        
    }

    //analysis data queried
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

    //max data queried
    let janToDecMax = '', hrpm = '', nrd = '', ndd = '', nwd25 = '', nwd15 = '', nwd10 = '', hnod = '', hdnod = '';
    let hnodYear = '', hdnodYear = '', nrdYear = '', nddYear = '', nwd25Year = '', nwd15Year = '', nwd10Year = '';
    if (analysisYear && janToDecMaxPerYear) {
        janToDecMax = janToDecMaxPerYear.find((d) => {
            return d.year === analysisYear;
        });
    }
    //highest rain queried        
    if (analysisYear && hrpmConsec.length) {
        hrpm = hrpmConsec.find((d) => {
            return d.year === analysisYear;
        });
    }
    //highest number of days consec queried        
    if (analysisYear && hnodConsec.length) {
        hnod = hnodConsec.find((d) => {
            return d.year === analysisYear;
        });
        let hnod2 = hnodConsec2.find((d) => {
            return d.year === analysisYear;
        });
        hnodYear = Object.values(hnod2.r) ? Object.values(hnod2.r).reduce(function(a, b) {
            return a + b;
         }) : 'n/a';
    }
    
    //highest number of days consec queried        
    if (analysisYear && hdnodConsec.length) {
        hdnod = hdnodConsec.find((d) => {
            return d.year === analysisYear;
        });
        let hdnod2 = hdnodConsec2.find((d) => {
            return d.year === analysisYear;
        });
        hdnodYear = Object.values(hdnod2.r)? Object.values(hdnod2.r).reduce(function(a, b) {
            return a + b;
         }) : 'n/a';
    }
    
    //No. of rain days queried    
    if (analysisYear && nord.length) {
        nrd = nord.find((d) => {
            return d.year === analysisYear;
        });
        nrdYear = Object.values(nrd.r) ? Object.values(nrd.r).reduce(function(a, b) {
            return a + b;
         }) : 'n/a';
    }
    
    //No. of rain days queried    
    if (analysisYear && nodd.length) {
        ndd = nodd.find((d) => {
            return d.year === analysisYear;
        });
        nddYear = Object.values(ndd.r) ? Object.values(ndd.r).reduce(function(a, b) {
            return a + b;
         }) : 'n/a';
    }
    
    //No. of rain days queried    
    if (analysisYear && nowd25.length && nowd15.length && nowd10.length) {
        nwd25 = nowd25.find((d) => {
            return d.year === analysisYear;
        });
        nwd15 = nowd15.find((d) => {
            return d.year === analysisYear;
        });
        nwd10 = nowd10.find((d) => {
            return d.year === analysisYear;
        });

        nwd25Year = Object.values(nwd25.r) ? Object.values(nwd25.r).reduce(function(a, b) {
            return a + b;
        }) : 'n/a';
        nwd15Year = Object.values(nwd15.r) ? Object.values(nwd15.r).reduce(function(a, b) {
            return a + b;
        }) : 'n/a';
        nwd10Year = Object.values(nwd10.r) ? Object.values(nwd10.r).reduce(function(a, b) {
            return a + b;
        }) : 'n/a';
    }  


    return (
        as.length ?
        <Aux>
        <UserChoiceInput />
            <Row>
                <Col xl={8} md={8}>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Annual Sort Raw Data</Card.Title>
                            <span className="d-block m-t-5"><code>-1</code> means <code>no data recorded</code></span>
                        </Card.Header>
                        <Card.Body>
                            {as.length ? <Table striped responsive className='text-center'>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Year</th>
                                    <th>Monthly Precipitation <br /> Total (millimetres)</th>
                                    <th>AVG</th>
                                    {(arrOfKeys && arrOfKeys.length) ? arrOfKeys.map((a, i) => (
                                        <th key={i}>{a}</th>
                                    )) : null}
                                </tr>
                                </thead>
                                <tbody>
                                {as.length ? as.map((d, i) => (<tr key={i}>
                                    <th scope="row">{i + 1}</th>
                                    <td>{d && d.year}</td>
                                    <td>{d && d.rainfall_amount}</td>
                                    <td>{annualAvg}</td>                            
                                    {(arrOfKeys && arrOfKeys.length) ? arrOfKeys.map((a, j) => (                                      
                                        <td key={j}>{d[a]}</td>                                                                              
                                    )) : null}
                                </tr>)) : null}
                                </tbody>
                            </Table> : (
                                <div>
                                <span className="spinner-border spinner-border-sm"></span>
                                <span> Please wait. Intense computation may take a while...</span>
                                </div>
                                )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} xl={4}>
                    {annualSortControl1 !== 'Select Year' && annualSortControl2 !== 'Select Year' && arrOfKeys.length && 
                        <LineChart 
                            data={props.lineChartData} 
                            m={'annual AVG'}
                        />}
                    {annualSortControl1 !== 'Select Year' && annualSortControl2 !== 'Select Year' && arrOfKeys.length && annualAvg2.length &&
                        <LineChart 
                            data={props.lineChartData}
                            totalAvg={annualAvg2}                         
                        />}
                    {annualSortControl1 !== 'Select Year' && annualSortControl2 !== 'Select Year' && arrOfKeys.length && annualAvg2.length &&
                        <LineChart 
                            data={props.lineChartData}
                            totalAvg={annualAvg2}
                            obj={obj}
                        />}
                </Col>
            </Row>
        </Aux>
        : Object.keys(cr).length ? 
        <Aux>
            <Row>    
                <Col>            
                <Card>
                    <Card.Header>
                        <Card.Title as="h5">Daily Cumulative</Card.Title>
                        <span className="d-block m-t-5"><code>-1</code> means <code>no data recorded</code></span>
                    </Card.Header>
                    <Card.Body>
                        <Table striped responsive>
                            <thead>
                                <tr>
                                    <th>1/1/{cr.year}</th>
                                    <th>1/2/{cr.year}</th>
                                    <th>1/3/{cr.year}</th>
                                    <th>1/4/{cr.year}</th>
                                    <th>1/5/{cr.year}</th>
                                    <th>1/6/{cr.year}</th>
                                    <th>1/7/{cr.year}</th>
                                    <th>1/8/{cr.year}</th>
                                    <th>1/9/{cr.year}</th>
                                    <th>1/10/{cr.year}</th>
                                    <th>1/11/{cr.year}</th>
                                    <th>1/12/{cr.year}</th>
                                    <th>1/13/{cr.year}</th>
                                    <th>1/14/{cr.year}</th>
                                    <th>1/15/{cr.year}</th>
                                    <th>1/16/{cr.year}</th>
                                    <th>1/17/{cr.year}</th>
                                    <th>1/18/{cr.year}</th>
                                    <th>1/19/{cr.year}</th>
                                    <th>1/20/{cr.year}</th>
                                    <th>1/21/{cr.year}</th>
                                    <th>1/22/{cr.year}</th>
                                    <th>1/23/{cr.year}</th>
                                    <th>1/24/{cr.year}</th>
                                    <th>1/25/{cr.year}</th>
                                    <th>1/26/{cr.year}</th>
                                    <th>1/27/{cr.year}</th>
                                    <th>1/28/{cr.year}</th>
                                    <th>1/29/{cr.year}</th>
                                    <th>1/30/{cr.year}</th>
                                    <th>1/31/{cr.year}</th>

                                    <th>2/1/{cr.year}</th>
                                    <th>2/2/{cr.year}</th>
                                    <th>2/3/{cr.year}</th>
                                    <th>2/4/{cr.year}</th>
                                    <th>2/5/{cr.year}</th>
                                    <th>2/6/{cr.year}</th>
                                    <th>2/7/{cr.year}</th>
                                    <th>2/8/{cr.year}</th>
                                    <th>2/9/{cr.year}</th>
                                    <th>2/10/{cr.year}</th>
                                    <th>2/11/{cr.year}</th>
                                    <th>2/12/{cr.year}</th>
                                    <th>2/13/{cr.year}</th>
                                    <th>2/14/{cr.year}</th>
                                    <th>2/15/{cr.year}</th>
                                    <th>2/16/{cr.year}</th>
                                    <th>2/17/{cr.year}</th>
                                    <th>2/18/{cr.year}</th>
                                    <th>2/19/{cr.year}</th>
                                    <th>2/20/{cr.year}</th>
                                    <th>2/21/{cr.year}</th>
                                    <th>2/22/{cr.year}</th>
                                    <th>2/23/{cr.year}</th>
                                    <th>2/24/{cr.year}</th>
                                    <th>2/25/{cr.year}</th>
                                    <th>2/26/{cr.year}</th>
                                    <th>2/27/{cr.year}</th>
                                    <th>2/28/{cr.year}</th>
                                    <th>2/29/{cr.year}</th>
                                    <th>2/30/{cr.year}</th>
                                    <th>2/31/{cr.year}</th>

                                    <th>3/1/{cr.year}</th>
                                    <th>3/2/{cr.year}</th>
                                    <th>3/3/{cr.year}</th>
                                    <th>3/4/{cr.year}</th>
                                    <th>3/5/{cr.year}</th>
                                    <th>3/6/{cr.year}</th>
                                    <th>3/7/{cr.year}</th>
                                    <th>3/8/{cr.year}</th>
                                    <th>3/9/{cr.year}</th>
                                    <th>3/10/{cr.year}</th>
                                    <th>3/11/{cr.year}</th>
                                    <th>3/12/{cr.year}</th>
                                    <th>3/13/{cr.year}</th>
                                    <th>3/14/{cr.year}</th>
                                    <th>3/15/{cr.year}</th>
                                    <th>3/16/{cr.year}</th>
                                    <th>3/17/{cr.year}</th>
                                    <th>3/18/{cr.year}</th>
                                    <th>3/19/{cr.year}</th>
                                    <th>3/20/{cr.year}</th>
                                    <th>3/21/{cr.year}</th>
                                    <th>3/22/{cr.year}</th>
                                    <th>3/23/{cr.year}</th>
                                    <th>3/24/{cr.year}</th>
                                    <th>3/25/{cr.year}</th>
                                    <th>3/26/{cr.year}</th>
                                    <th>3/27/{cr.year}</th>
                                    <th>3/28/{cr.year}</th>
                                    <th>3/29/{cr.year}</th>
                                    <th>3/30/{cr.year}</th>
                                    <th>3/31/{cr.year}</th>
                                    
                                    <th>1/1/{cr.year}</th>
                                    <th>4/2/{cr.year}</th>
                                    <th>4/3/{cr.year}</th>
                                    <th>4/4/{cr.year}</th>
                                    <th>4/5/{cr.year}</th>
                                    <th>4/6/{cr.year}</th>
                                    <th>4/7/{cr.year}</th>
                                    <th>4/8/{cr.year}</th>
                                    <th>4/9/{cr.year}</th>
                                    <th>4/10/{cr.year}</th>
                                    <th>4/11/{cr.year}</th>
                                    <th>4/12/{cr.year}</th>
                                    <th>4/13/{cr.year}</th>
                                    <th>4/14/{cr.year}</th>
                                    <th>4/15/{cr.year}</th>
                                    <th>4/16/{cr.year}</th>
                                    <th>4/17/{cr.year}</th>
                                    <th>4/18/{cr.year}</th>
                                    <th>4/19/{cr.year}</th>
                                    <th>4/20/{cr.year}</th>
                                    <th>4/21/{cr.year}</th>
                                    <th>4/22/{cr.year}</th>
                                    <th>4/23/{cr.year}</th>
                                    <th>4/24/{cr.year}</th>
                                    <th>4/25/{cr.year}</th>
                                    <th>4/26/{cr.year}</th>
                                    <th>4/27/{cr.year}</th>
                                    <th>4/28/{cr.year}</th>
                                    <th>4/29/{cr.year}</th>
                                    <th>4/30/{cr.year}</th>
                                    <th>4/31/{cr.year}</th>
                                    
                                    <th>1/1/{cr.year}</th>
                                    <th>5/2/{cr.year}</th>
                                    <th>5/3/{cr.year}</th>
                                    <th>5/4/{cr.year}</th>
                                    <th>5/5/{cr.year}</th>
                                    <th>5/6/{cr.year}</th>
                                    <th>5/7/{cr.year}</th>
                                    <th>5/8/{cr.year}</th>
                                    <th>5/9/{cr.year}</th>
                                    <th>5/10/{cr.year}</th>
                                    <th>5/11/{cr.year}</th>
                                    <th>5/12/{cr.year}</th>
                                    <th>5/13/{cr.year}</th>
                                    <th>5/14/{cr.year}</th>
                                    <th>5/15/{cr.year}</th>
                                    <th>5/16/{cr.year}</th>
                                    <th>5/17/{cr.year}</th>
                                    <th>5/18/{cr.year}</th>
                                    <th>5/19/{cr.year}</th>
                                    <th>5/20/{cr.year}</th>
                                    <th>5/21/{cr.year}</th>
                                    <th>5/22/{cr.year}</th>
                                    <th>5/23/{cr.year}</th>
                                    <th>5/24/{cr.year}</th>
                                    <th>5/25/{cr.year}</th>
                                    <th>5/26/{cr.year}</th>
                                    <th>5/27/{cr.year}</th>
                                    <th>5/28/{cr.year}</th>
                                    <th>5/29/{cr.year}</th>
                                    <th>5/30/{cr.year}</th>
                                    <th>5/31/{cr.year}</th>

                                    <th>1/1/{cr.year}</th>
                                    <th>6/2/{cr.year}</th>
                                    <th>6/3/{cr.year}</th>
                                    <th>6/4/{cr.year}</th>
                                    <th>6/5/{cr.year}</th>
                                    <th>6/6/{cr.year}</th>
                                    <th>6/7/{cr.year}</th>
                                    <th>6/8/{cr.year}</th>
                                    <th>6/9/{cr.year}</th>
                                    <th>6/10/{cr.year}</th>
                                    <th>6/11/{cr.year}</th>
                                    <th>6/12/{cr.year}</th>
                                    <th>6/13/{cr.year}</th>
                                    <th>6/14/{cr.year}</th>
                                    <th>6/15/{cr.year}</th>
                                    <th>6/16/{cr.year}</th>
                                    <th>6/17/{cr.year}</th>
                                    <th>6/18/{cr.year}</th>
                                    <th>6/19/{cr.year}</th>
                                    <th>6/20/{cr.year}</th>
                                    <th>6/21/{cr.year}</th>
                                    <th>6/22/{cr.year}</th>
                                    <th>6/23/{cr.year}</th>
                                    <th>6/24/{cr.year}</th>
                                    <th>6/25/{cr.year}</th>
                                    <th>6/26/{cr.year}</th>
                                    <th>6/27/{cr.year}</th>
                                    <th>6/28/{cr.year}</th>
                                    <th>6/29/{cr.year}</th>
                                    <th>6/30/{cr.year}</th>
                                    <th>6/31/{cr.year}</th>

                                    <th>7/1/{cr.year}</th>
                                    <th>7/2/{cr.year}</th>
                                    <th>7/3/{cr.year}</th>
                                    <th>7/4/{cr.year}</th>
                                    <th>7/5/{cr.year}</th>
                                    <th>7/6/{cr.year}</th>
                                    <th>7/7/{cr.year}</th>
                                    <th>7/8/{cr.year}</th>
                                    <th>7/9/{cr.year}</th>
                                    <th>7/10/{cr.year}</th>
                                    <th>7/11/{cr.year}</th>
                                    <th>7/12/{cr.year}</th>
                                    <th>7/13/{cr.year}</th>
                                    <th>7/14/{cr.year}</th>
                                    <th>7/15/{cr.year}</th>
                                    <th>7/16/{cr.year}</th>
                                    <th>7/17/{cr.year}</th>
                                    <th>7/18/{cr.year}</th>
                                    <th>7/19/{cr.year}</th>
                                    <th>7/20/{cr.year}</th>
                                    <th>7/21/{cr.year}</th>
                                    <th>7/22/{cr.year}</th>
                                    <th>7/23/{cr.year}</th>
                                    <th>7/24/{cr.year}</th>
                                    <th>7/25/{cr.year}</th>
                                    <th>7/26/{cr.year}</th>
                                    <th>7/27/{cr.year}</th>
                                    <th>7/28/{cr.year}</th>
                                    <th>7/29/{cr.year}</th>
                                    <th>7/30/{cr.year}</th>
                                    <th>7/31/{cr.year}</th>

                                    <th>8/1/{cr.year}</th>
                                    <th>8/2/{cr.year}</th>
                                    <th>8/3/{cr.year}</th>
                                    <th>8/4/{cr.year}</th>
                                    <th>8/5/{cr.year}</th>
                                    <th>8/6/{cr.year}</th>
                                    <th>8/7/{cr.year}</th>
                                    <th>8/8/{cr.year}</th>
                                    <th>8/9/{cr.year}</th>
                                    <th>8/10/{cr.year}</th>
                                    <th>8/11/{cr.year}</th>
                                    <th>8/12/{cr.year}</th>
                                    <th>8/13/{cr.year}</th>
                                    <th>8/14/{cr.year}</th>
                                    <th>8/15/{cr.year}</th>
                                    <th>8/16/{cr.year}</th>
                                    <th>8/17/{cr.year}</th>
                                    <th>8/18/{cr.year}</th>
                                    <th>8/19/{cr.year}</th>
                                    <th>8/20/{cr.year}</th>
                                    <th>8/21/{cr.year}</th>
                                    <th>8/22/{cr.year}</th>
                                    <th>8/23/{cr.year}</th>
                                    <th>8/24/{cr.year}</th>
                                    <th>8/25/{cr.year}</th>
                                    <th>8/26/{cr.year}</th>
                                    <th>8/27/{cr.year}</th>
                                    <th>8/28/{cr.year}</th>
                                    <th>8/29/{cr.year}</th>
                                    <th>8/30/{cr.year}</th>
                                    <th>8/31/{cr.year}</th>

                                    <th>9/1/{cr.year}</th>
                                    <th>9/2/{cr.year}</th>
                                    <th>9/3/{cr.year}</th>
                                    <th>9/4/{cr.year}</th>
                                    <th>9/5/{cr.year}</th>
                                    <th>9/6/{cr.year}</th>
                                    <th>9/7/{cr.year}</th>
                                    <th>9/8/{cr.year}</th>
                                    <th>9/9/{cr.year}</th>
                                    <th>9/10/{cr.year}</th>
                                    <th>9/11/{cr.year}</th>
                                    <th>9/12/{cr.year}</th>
                                    <th>9/13/{cr.year}</th>
                                    <th>9/14/{cr.year}</th>
                                    <th>9/15/{cr.year}</th>
                                    <th>9/16/{cr.year}</th>
                                    <th>9/17/{cr.year}</th>
                                    <th>9/18/{cr.year}</th>
                                    <th>9/19/{cr.year}</th>
                                    <th>9/20/{cr.year}</th>
                                    <th>9/21/{cr.year}</th>
                                    <th>9/22/{cr.year}</th>
                                    <th>9/23/{cr.year}</th>
                                    <th>9/24/{cr.year}</th>
                                    <th>9/25/{cr.year}</th>
                                    <th>9/26/{cr.year}</th>
                                    <th>9/27/{cr.year}</th>
                                    <th>9/28/{cr.year}</th>
                                    <th>9/29/{cr.year}</th>
                                    <th>9/30/{cr.year}</th>
                                    <th>9/31/{cr.year}</th>
                                    
                                    <th>10/1/{cr.year}</th>
                                    <th>10/2/{cr.year}</th>
                                    <th>10/3/{cr.year}</th>
                                    <th>10/4/{cr.year}</th>
                                    <th>10/5/{cr.year}</th>
                                    <th>10/6/{cr.year}</th>
                                    <th>10/7/{cr.year}</th>
                                    <th>10/8/{cr.year}</th>
                                    <th>10/9/{cr.year}</th>
                                    <th>10/10/{cr.year}</th>
                                    <th>10/11/{cr.year}</th>
                                    <th>10/12/{cr.year}</th>
                                    <th>10/13/{cr.year}</th>
                                    <th>10/14/{cr.year}</th>
                                    <th>10/15/{cr.year}</th>
                                    <th>10/16/{cr.year}</th>
                                    <th>10/17/{cr.year}</th>
                                    <th>10/18/{cr.year}</th>
                                    <th>10/19/{cr.year}</th>
                                    <th>10/20/{cr.year}</th>
                                    <th>10/21/{cr.year}</th>
                                    <th>10/22/{cr.year}</th>
                                    <th>10/23/{cr.year}</th>
                                    <th>10/24/{cr.year}</th>
                                    <th>10/25/{cr.year}</th>
                                    <th>10/26/{cr.year}</th>
                                    <th>10/27/{cr.year}</th>
                                    <th>10/28/{cr.year}</th>
                                    <th>10/29/{cr.year}</th>
                                    <th>10/30/{cr.year}</th>
                                    <th>10/31/{cr.year}</th>
                                    
                                    <th>11/1/{cr.year}</th>
                                    <th>11/2/{cr.year}</th>
                                    <th>11/3/{cr.year}</th>
                                    <th>11/4/{cr.year}</th>
                                    <th>11/5/{cr.year}</th>
                                    <th>11/6/{cr.year}</th>
                                    <th>11/7/{cr.year}</th>
                                    <th>11/8/{cr.year}</th>
                                    <th>11/9/{cr.year}</th>
                                    <th>11/10/{cr.year}</th>
                                    <th>11/11/{cr.year}</th>
                                    <th>11/12/{cr.year}</th>
                                    <th>11/13/{cr.year}</th>
                                    <th>11/14/{cr.year}</th>
                                    <th>11/15/{cr.year}</th>
                                    <th>11/16/{cr.year}</th>
                                    <th>11/17/{cr.year}</th>
                                    <th>11/18/{cr.year}</th>
                                    <th>11/19/{cr.year}</th>
                                    <th>11/20/{cr.year}</th>
                                    <th>11/21/{cr.year}</th>
                                    <th>11/22/{cr.year}</th>
                                    <th>11/23/{cr.year}</th>
                                    <th>11/24/{cr.year}</th>
                                    <th>11/25/{cr.year}</th>
                                    <th>11/26/{cr.year}</th>
                                    <th>11/27/{cr.year}</th>
                                    <th>11/28/{cr.year}</th>
                                    <th>11/29/{cr.year}</th>
                                    <th>11/30/{cr.year}</th>
                                    <th>11/31/{cr.year}</th>

                                    <th>12/1/{cr.year}</th>
                                    <th>12/2/{cr.year}</th>
                                    <th>12/3/{cr.year}</th>
                                    <th>12/4/{cr.year}</th>
                                    <th>12/5/{cr.year}</th>
                                    <th>12/6/{cr.year}</th>
                                    <th>12/7/{cr.year}</th>
                                    <th>12/8/{cr.year}</th>
                                    <th>12/9/{cr.year}</th>
                                    <th>12/10/{cr.year}</th>
                                    <th>12/11/{cr.year}</th>
                                    <th>12/12/{cr.year}</th>
                                    <th>12/13/{cr.year}</th>
                                    <th>12/14/{cr.year}</th>
                                    <th>12/15/{cr.year}</th>
                                    <th>12/16/{cr.year}</th>
                                    <th>12/17/{cr.year}</th>
                                    <th>12/18/{cr.year}</th>
                                    <th>12/19/{cr.year}</th>
                                    <th>12/20/{cr.year}</th>
                                    <th>12/21/{cr.year}</th>
                                    <th>12/22/{cr.year}</th>
                                    <th>12/23/{cr.year}</th>
                                    <th>12/24/{cr.year}</th>
                                    <th>12/25/{cr.year}</th>
                                    <th>12/26/{cr.year}</th>
                                    <th>12/27/{cr.year}</th>
                                    <th>12/28/{cr.year}</th>
                                    <th>12/29/{cr.year}</th>
                                    <th>12/30/{cr.year}</th>
                                    <th>12/31/{cr.year}</th>
                                </tr>
                            </thead>
                            <tbody>
                            <tr>                                    
                                    <td>{cr2.r.Jan._1 ? cr2.r.Jan._1 : 'n/a'}</td>
                                    <td>{cr2.r.Jan._2 ? cr2.r.Jan._2 : 'n/a'}</td>
                                    <td>{cr2.r.Jan._3 ? cr2.r.Jan._3 : 'n/a'}</td>
                                    <td>{cr2.r.Jan._4 ? cr2.r.Jan._4 : 'n/a'}</td>
                                    <td>{cr2.r.Jan._5 ? cr2.r.Jan._5 : 'n/a'}</td>
                                    <td>{cr2.r.Jan._6 ? cr2.r.Jan._6 : 'n/a'}</td>
                                    <td>{cr2.r.Jan._7 ? cr2.r.Jan._7 : 'n/a'}</td>
                                    <td>{cr2.r.Jan._8 ? cr2.r.Jan._8 : 'n/a'}</td>
                                    <td>{cr2.r.Jan._9 ? cr2.r.Jan._9 : 'n/a'}</td>
                                    <td>{cr2.r.Jan._10 ? cr2.r.Jan._10 : 'n/a'}</td>
                                    <td>{cr2.r.Jan._11 ? cr2.r.Jan._11 : 'n/a'}</td>
                                    <td>{cr2.r.Jan._12 ? cr2.r.Jan._12 : 'n/a'}</td>
                                    <td>{cr2.r.Jan._13 ? cr2.r.Jan._13 : 'n/a'}</td>
                                    <td>{cr2.r.Jan._14 ? cr2.r.Jan._14 : 'n/a'}</td>
                                    <td>{cr2.r.Jan._15 ? cr2.r.Jan._15 : 'n/a'}</td>
                                    <td>{cr2.r.Jan._16 ? cr2.r.Jan._16 : 'n/a'}</td>
                                    <td>{cr2.r.Jan._17 ? cr2.r.Jan._17 : 'n/a'}</td>
                                    <td>{cr2.r.Jan._18 ? cr2.r.Jan._18 : 'n/a'}</td>
                                    <td>{cr2.r.Jan._19 ? cr2.r.Jan._19 : 'n/a'}</td>
                                    <td>{cr2.r.Jan._20 ? cr2.r.Jan._20 : 'n/a'}</td>
                                    <td>{cr2.r.Jan._21 ? cr2.r.Jan._21 : 'n/a'}</td>
                                    <td>{cr2.r.Jan._22 ? cr2.r.Jan._22 : 'n/a'}</td>
                                    <td>{cr2.r.Jan._23 ? cr2.r.Jan._23 : 'n/a'}</td>
                                    <td>{cr2.r.Jan._24 ? cr2.r.Jan._24 : 'n/a'}</td>
                                    <td>{cr2.r.Jan._25 ? cr2.r.Jan._25 : 'n/a'}</td>
                                    <td>{cr2.r.Jan._26 ? cr2.r.Jan._26 : 'n/a'}</td>
                                    <td>{cr2.r.Jan._27 ? cr2.r.Jan._27 : 'n/a'}</td>
                                    <td>{cr2.r.Jan._28 ? cr2.r.Jan._28 : 'n/a'}</td>
                                    <td>{cr2.r.Jan._29 ? cr2.r.Jan._29 : 'n/a'}</td>
                                    <td>{cr2.r.Jan._30 ? cr2.r.Jan._30 : 'n/a'}</td>
                                    <td>{cr2.r.Jan._31 ? cr2.r.Jan._31 : 'n/a'}</td>
                                    
                                    <td>{cr2.r.Feb._1 ? cr2.r.Feb._1 : 'n/a'}</td>
                                    <td>{cr2.r.Feb._2 ? cr2.r.Feb._2 : 'n/a'}</td>
                                    <td>{cr2.r.Feb._3 ? cr2.r.Feb._3 : 'n/a'}</td>
                                    <td>{cr2.r.Feb._4 ? cr2.r.Feb._4 : 'n/a'}</td>
                                    <td>{cr2.r.Feb._5 ? cr2.r.Feb._5 : 'n/a'}</td>
                                    <td>{cr2.r.Feb._6 ? cr2.r.Feb._6 : 'n/a'}</td>
                                    <td>{cr2.r.Feb._7 ? cr2.r.Feb._7 : 'n/a'}</td>
                                    <td>{cr2.r.Feb._8 ? cr2.r.Feb._8 : 'n/a'}</td>
                                    <td>{cr2.r.Feb._9 ? cr2.r.Feb._9 : 'n/a'}</td>
                                    <td>{cr2.r.Feb._10 ? cr2.r.Feb._10 : 'n/a'}</td>
                                    <td>{cr2.r.Feb._11 ? cr2.r.Feb._11 : 'n/a'}</td>
                                    <td>{cr2.r.Feb._12 ? cr2.r.Feb._12 : 'n/a'}</td>
                                    <td>{cr2.r.Feb._13 ? cr2.r.Feb._13 : 'n/a'}</td>
                                    <td>{cr2.r.Feb._14 ? cr2.r.Feb._14 : 'n/a'}</td>
                                    <td>{cr2.r.Feb._15 ? cr2.r.Feb._15 : 'n/a'}</td>
                                    <td>{cr2.r.Feb._16 ? cr2.r.Feb._16 : 'n/a'}</td>
                                    <td>{cr2.r.Feb._17 ? cr2.r.Feb._17 : 'n/a'}</td>
                                    <td>{cr2.r.Feb._18 ? cr2.r.Feb._18 : 'n/a'}</td>
                                    <td>{cr2.r.Feb._19 ? cr2.r.Feb._19 : 'n/a'}</td>
                                    <td>{cr2.r.Feb._20 ? cr2.r.Feb._20 : 'n/a'}</td>
                                    <td>{cr2.r.Feb._21 ? cr2.r.Feb._21 : 'n/a'}</td>
                                    <td>{cr2.r.Feb._22 ? cr2.r.Feb._22 : 'n/a'}</td>
                                    <td>{cr2.r.Feb._23 ? cr2.r.Feb._23 : 'n/a'}</td>
                                    <td>{cr2.r.Feb._24 ? cr2.r.Feb._24 : 'n/a'}</td>
                                    <td>{cr2.r.Feb._25 ? cr2.r.Feb._25 : 'n/a'}</td>
                                    <td>{cr2.r.Feb._26 ? cr2.r.Feb._26 : 'n/a'}</td>
                                    <td>{cr2.r.Feb._27 ? cr2.r.Feb._27 : 'n/a'}</td>
                                    <td>{cr2.r.Feb._28 ? cr2.r.Feb._28 : 'n/a'}</td>
                                    <td>{cr2.r.Feb._29 ? cr2.r.Feb._29 : 'n/a'}</td>
                                    <td>{cr2.r.Feb._30 ? cr2.r.Feb._30 : 'n/a'}</td>
                                    <td>{cr2.r.Feb._31 ? cr2.r.Feb._31 : 'n/a'}</td>

                                    <td>{cr2.r.Mar._1 ? cr2.r.Mar._1 : 'n/a'}</td>
                                    <td>{cr2.r.Mar._2 ? cr2.r.Mar._2 : 'n/a'}</td>
                                    <td>{cr2.r.Mar._3 ? cr2.r.Mar._3 : 'n/a'}</td>
                                    <td>{cr2.r.Mar._4 ? cr2.r.Mar._4 : 'n/a'}</td>
                                    <td>{cr2.r.Mar._5 ? cr2.r.Mar._5 : 'n/a'}</td>
                                    <td>{cr2.r.Mar._6 ? cr2.r.Mar._6 : 'n/a'}</td>
                                    <td>{cr2.r.Mar._7 ? cr2.r.Mar._7 : 'n/a'}</td>
                                    <td>{cr2.r.Mar._8 ? cr2.r.Mar._8 : 'n/a'}</td>
                                    <td>{cr2.r.Mar._9 ? cr2.r.Mar._9 : 'n/a'}</td>
                                    <td>{cr2.r.Mar._10 ? cr2.r.Mar._10 : 'n/a'}</td>
                                    <td>{cr2.r.Mar._11 ? cr2.r.Mar._11 : 'n/a'}</td>
                                    <td>{cr2.r.Mar._12 ? cr2.r.Mar._12 : 'n/a'}</td>
                                    <td>{cr2.r.Mar._13 ? cr2.r.Mar._13 : 'n/a'}</td>
                                    <td>{cr2.r.Mar._14 ? cr2.r.Mar._14 : 'n/a'}</td>
                                    <td>{cr2.r.Mar._15 ? cr2.r.Mar._15 : 'n/a'}</td>
                                    <td>{cr2.r.Mar._16 ? cr2.r.Mar._16 : 'n/a'}</td>
                                    <td>{cr2.r.Mar._17 ? cr2.r.Mar._17 : 'n/a'}</td>
                                    <td>{cr2.r.Mar._18 ? cr2.r.Mar._18 : 'n/a'}</td>
                                    <td>{cr2.r.Mar._19 ? cr2.r.Mar._19 : 'n/a'}</td>
                                    <td>{cr2.r.Mar._20 ? cr2.r.Mar._20 : 'n/a'}</td>
                                    <td>{cr2.r.Mar._21 ? cr2.r.Mar._21 : 'n/a'}</td>
                                    <td>{cr2.r.Mar._22 ? cr2.r.Mar._22 : 'n/a'}</td>
                                    <td>{cr2.r.Mar._23 ? cr2.r.Mar._23 : 'n/a'}</td>
                                    <td>{cr2.r.Mar._24 ? cr2.r.Mar._24 : 'n/a'}</td>
                                    <td>{cr2.r.Mar._25 ? cr2.r.Mar._25 : 'n/a'}</td>
                                    <td>{cr2.r.Mar._26 ? cr2.r.Mar._26 : 'n/a'}</td>
                                    <td>{cr2.r.Mar._27 ? cr2.r.Mar._27 : 'n/a'}</td>
                                    <td>{cr2.r.Mar._28 ? cr2.r.Mar._28 : 'n/a'}</td>
                                    <td>{cr2.r.Mar._29 ? cr2.r.Mar._29 : 'n/a'}</td>
                                    <td>{cr2.r.Mar._30 ? cr2.r.Mar._30 : 'n/a'}</td>
                                    <td>{cr2.r.Mar._31 ? cr2.r.Mar._31 : 'n/a'}</td>

                                    <td>{cr2.r.Apr._1 ? cr2.r.Apr._1 : 'n/a'}</td>
                                    <td>{cr2.r.Apr._2 ? cr2.r.Apr._2 : 'n/a'}</td>
                                    <td>{cr2.r.Apr._3 ? cr2.r.Apr._3 : 'n/a'}</td>
                                    <td>{cr2.r.Apr._4 ? cr2.r.Apr._4 : 'n/a'}</td>
                                    <td>{cr2.r.Apr._5 ? cr2.r.Apr._5 : 'n/a'}</td>
                                    <td>{cr2.r.Apr._6 ? cr2.r.Apr._6 : 'n/a'}</td>
                                    <td>{cr2.r.Apr._7 ? cr2.r.Apr._7 : 'n/a'}</td>
                                    <td>{cr2.r.Apr._8 ? cr2.r.Apr._8 : 'n/a'}</td>
                                    <td>{cr2.r.Apr._9 ? cr2.r.Apr._9 : 'n/a'}</td>
                                    <td>{cr2.r.Apr._10 ? cr2.r.Apr._10 : 'n/a'}</td>
                                    <td>{cr2.r.Apr._11 ? cr2.r.Apr._11 : 'n/a'}</td>
                                    <td>{cr2.r.Apr._12 ? cr2.r.Apr._12 : 'n/a'}</td>
                                    <td>{cr2.r.Apr._13 ? cr2.r.Apr._13 : 'n/a'}</td>
                                    <td>{cr2.r.Apr._14 ? cr2.r.Apr._14 : 'n/a'}</td>
                                    <td>{cr2.r.Apr._15 ? cr2.r.Apr._15 : 'n/a'}</td>
                                    <td>{cr2.r.Apr._16 ? cr2.r.Apr._16 : 'n/a'}</td>
                                    <td>{cr2.r.Apr._17 ? cr2.r.Apr._17 : 'n/a'}</td>
                                    <td>{cr2.r.Apr._18 ? cr2.r.Apr._18 : 'n/a'}</td>
                                    <td>{cr2.r.Apr._19 ? cr2.r.Apr._19 : 'n/a'}</td>
                                    <td>{cr2.r.Apr._20 ? cr2.r.Apr._20 : 'n/a'}</td>
                                    <td>{cr2.r.Apr._21 ? cr2.r.Apr._21 : 'n/a'}</td>
                                    <td>{cr2.r.Apr._22 ? cr2.r.Apr._22 : 'n/a'}</td>
                                    <td>{cr2.r.Apr._23 ? cr2.r.Apr._23 : 'n/a'}</td>
                                    <td>{cr2.r.Apr._24 ? cr2.r.Apr._24 : 'n/a'}</td>
                                    <td>{cr2.r.Apr._25 ? cr2.r.Apr._25 : 'n/a'}</td>
                                    <td>{cr2.r.Apr._26 ? cr2.r.Apr._26 : 'n/a'}</td>
                                    <td>{cr2.r.Apr._27 ? cr2.r.Apr._27 : 'n/a'}</td>
                                    <td>{cr2.r.Apr._28 ? cr2.r.Apr._28 : 'n/a'}</td>
                                    <td>{cr2.r.Apr._29 ? cr2.r.Apr._29 : 'n/a'}</td>
                                    <td>{cr2.r.Apr._30 ? cr2.r.Apr._30 : 'n/a'}</td>
                                    <td>{cr2.r.Apr._31 ? cr2.r.Apr._31 : 'n/a'}</td>

                                    <td>{cr2.r.May._1 ? cr2.r.May._1 : 'n/a'}</td>
                                    <td>{cr2.r.May._2 ? cr2.r.May._2 : 'n/a'}</td>
                                    <td>{cr2.r.May._3 ? cr2.r.May._3 : 'n/a'}</td>
                                    <td>{cr2.r.May._4 ? cr2.r.May._4 : 'n/a'}</td>
                                    <td>{cr2.r.May._5 ? cr2.r.May._5 : 'n/a'}</td>
                                    <td>{cr2.r.May._6 ? cr2.r.May._6 : 'n/a'}</td>
                                    <td>{cr2.r.May._7 ? cr2.r.May._7 : 'n/a'}</td>
                                    <td>{cr2.r.May._8 ? cr2.r.May._8 : 'n/a'}</td>
                                    <td>{cr2.r.May._9 ? cr2.r.May._9 : 'n/a'}</td>
                                    <td>{cr2.r.May._10 ? cr2.r.May._10 : 'n/a'}</td>
                                    <td>{cr2.r.May._11 ? cr2.r.May._11 : 'n/a'}</td>
                                    <td>{cr2.r.May._12 ? cr2.r.May._12 : 'n/a'}</td>
                                    <td>{cr2.r.May._13 ? cr2.r.May._13 : 'n/a'}</td>
                                    <td>{cr2.r.May._14 ? cr2.r.May._14 : 'n/a'}</td>
                                    <td>{cr2.r.May._15 ? cr2.r.May._15 : 'n/a'}</td>
                                    <td>{cr2.r.May._16 ? cr2.r.May._16 : 'n/a'}</td>
                                    <td>{cr2.r.May._17 ? cr2.r.May._17 : 'n/a'}</td>
                                    <td>{cr2.r.May._18 ? cr2.r.May._18 : 'n/a'}</td>
                                    <td>{cr2.r.May._19 ? cr2.r.May._19 : 'n/a'}</td>
                                    <td>{cr2.r.May._20 ? cr2.r.May._20 : 'n/a'}</td>
                                    <td>{cr2.r.May._21 ? cr2.r.May._21 : 'n/a'}</td>
                                    <td>{cr2.r.May._22 ? cr2.r.May._22 : 'n/a'}</td>
                                    <td>{cr2.r.May._23 ? cr2.r.May._23 : 'n/a'}</td>
                                    <td>{cr2.r.May._24 ? cr2.r.May._24 : 'n/a'}</td>
                                    <td>{cr2.r.May._25 ? cr2.r.May._25 : 'n/a'}</td>
                                    <td>{cr2.r.May._26 ? cr2.r.May._26 : 'n/a'}</td>
                                    <td>{cr2.r.May._27 ? cr2.r.May._27 : 'n/a'}</td>
                                    <td>{cr2.r.May._28 ? cr2.r.May._28 : 'n/a'}</td>
                                    <td>{cr2.r.May._29 ? cr2.r.May._29 : 'n/a'}</td>
                                    <td>{cr2.r.May._30 ? cr2.r.May._30 : 'n/a'}</td>
                                    <td>{cr2.r.May._31 ? cr2.r.May._31 : 'n/a'}</td>

                                    <td>{cr2.r.Jun._1 ? cr2.r.Jun._1 : 'n/a'}</td>
                                    <td>{cr2.r.Jun._2 ? cr2.r.Jun._2 : 'n/a'}</td>
                                    <td>{cr2.r.Jun._3 ? cr2.r.Jun._3 : 'n/a'}</td>
                                    <td>{cr2.r.Jun._4 ? cr2.r.Jun._4 : 'n/a'}</td>
                                    <td>{cr2.r.Jun._5 ? cr2.r.Jun._5 : 'n/a'}</td>
                                    <td>{cr2.r.Jun._6 ? cr2.r.Jun._6 : 'n/a'}</td>
                                    <td>{cr2.r.Jun._7 ? cr2.r.Jun._7 : 'n/a'}</td>
                                    <td>{cr2.r.Jun._8 ? cr2.r.Jun._8 : 'n/a'}</td>
                                    <td>{cr2.r.Jun._9 ? cr2.r.Jun._9 : 'n/a'}</td>
                                    <td>{cr2.r.Jun._10 ? cr2.r.Jun._10 : 'n/a'}</td>
                                    <td>{cr2.r.Jun._11 ? cr2.r.Jun._11 : 'n/a'}</td>
                                    <td>{cr2.r.Jun._12 ? cr2.r.Jun._12 : 'n/a'}</td>
                                    <td>{cr2.r.Jun._13 ? cr2.r.Jun._13 : 'n/a'}</td>
                                    <td>{cr2.r.Jun._14 ? cr2.r.Jun._14 : 'n/a'}</td>
                                    <td>{cr2.r.Jun._15 ? cr2.r.Jun._15 : 'n/a'}</td>
                                    <td>{cr2.r.Jun._16 ? cr2.r.Jun._16 : 'n/a'}</td>
                                    <td>{cr2.r.Jun._17 ? cr2.r.Jun._17 : 'n/a'}</td>
                                    <td>{cr2.r.Jun._18 ? cr2.r.Jun._18 : 'n/a'}</td>
                                    <td>{cr2.r.Jun._19 ? cr2.r.Jun._19 : 'n/a'}</td>
                                    <td>{cr2.r.Jun._20 ? cr2.r.Jun._20 : 'n/a'}</td>
                                    <td>{cr2.r.Jun._21 ? cr2.r.Jun._21 : 'n/a'}</td>
                                    <td>{cr2.r.Jun._22 ? cr2.r.Jun._22 : 'n/a'}</td>
                                    <td>{cr2.r.Jun._23 ? cr2.r.Jun._23 : 'n/a'}</td>
                                    <td>{cr2.r.Jun._24 ? cr2.r.Jun._24 : 'n/a'}</td>
                                    <td>{cr2.r.Jun._25 ? cr2.r.Jun._25 : 'n/a'}</td>
                                    <td>{cr2.r.Jun._26 ? cr2.r.Jun._26 : 'n/a'}</td>
                                    <td>{cr2.r.Jun._27 ? cr2.r.Jun._27 : 'n/a'}</td>
                                    <td>{cr2.r.Jun._28 ? cr2.r.Jun._28 : 'n/a'}</td>
                                    <td>{cr2.r.Jun._29 ? cr2.r.Jun._29 : 'n/a'}</td>
                                    <td>{cr2.r.Jun._30 ? cr2.r.Jun._30 : 'n/a'}</td>
                                    <td>{cr2.r.Jun._31 ? cr2.r.Jun._31 : 'n/a'}</td>

                                    <td>{cr2.r.Jul._1 ? cr2.r.Jul._1 : 'n/a'}</td>
                                    <td>{cr2.r.Jul._2 ? cr2.r.Jul._2 : 'n/a'}</td>
                                    <td>{cr2.r.Jul._3 ? cr2.r.Jul._3 : 'n/a'}</td>
                                    <td>{cr2.r.Jul._4 ? cr2.r.Jul._4 : 'n/a'}</td>
                                    <td>{cr2.r.Jul._5 ? cr2.r.Jul._5 : 'n/a'}</td>
                                    <td>{cr2.r.Jul._6 ? cr2.r.Jul._6 : 'n/a'}</td>
                                    <td>{cr2.r.Jul._7 ? cr2.r.Jul._7 : 'n/a'}</td>
                                    <td>{cr2.r.Jul._8 ? cr2.r.Jul._8 : 'n/a'}</td>
                                    <td>{cr2.r.Jul._9 ? cr2.r.Jul._9 : 'n/a'}</td>
                                    <td>{cr2.r.Jul._10 ? cr2.r.Jul._10 : 'n/a'}</td>
                                    <td>{cr2.r.Jul._11 ? cr2.r.Jul._11 : 'n/a'}</td>
                                    <td>{cr2.r.Jul._12 ? cr2.r.Jul._12 : 'n/a'}</td>
                                    <td>{cr2.r.Jul._13 ? cr2.r.Jul._13 : 'n/a'}</td>
                                    <td>{cr2.r.Jul._14 ? cr2.r.Jul._14 : 'n/a'}</td>
                                    <td>{cr2.r.Jul._15 ? cr2.r.Jul._15 : 'n/a'}</td>
                                    <td>{cr2.r.Jul._16 ? cr2.r.Jul._16 : 'n/a'}</td>
                                    <td>{cr2.r.Jul._17 ? cr2.r.Jul._17 : 'n/a'}</td>
                                    <td>{cr2.r.Jul._18 ? cr2.r.Jul._18 : 'n/a'}</td>
                                    <td>{cr2.r.Jul._19 ? cr2.r.Jul._19 : 'n/a'}</td>
                                    <td>{cr2.r.Jul._20 ? cr2.r.Jul._20 : 'n/a'}</td>
                                    <td>{cr2.r.Jul._21 ? cr2.r.Jul._21 : 'n/a'}</td>
                                    <td>{cr2.r.Jul._22 ? cr2.r.Jul._22 : 'n/a'}</td>
                                    <td>{cr2.r.Jul._23 ? cr2.r.Jul._23 : 'n/a'}</td>
                                    <td>{cr2.r.Jul._24 ? cr2.r.Jul._24 : 'n/a'}</td>
                                    <td>{cr2.r.Jul._25 ? cr2.r.Jul._25 : 'n/a'}</td>
                                    <td>{cr2.r.Jul._26 ? cr2.r.Jul._26 : 'n/a'}</td>
                                    <td>{cr2.r.Jul._27 ? cr2.r.Jul._27 : 'n/a'}</td>
                                    <td>{cr2.r.Jul._28 ? cr2.r.Jul._28 : 'n/a'}</td>
                                    <td>{cr2.r.Jul._29 ? cr2.r.Jul._29 : 'n/a'}</td>
                                    <td>{cr2.r.Jul._30 ? cr2.r.Jul._30 : 'n/a'}</td>
                                    <td>{cr2.r.Jul._31 ? cr2.r.Jul._31 : 'n/a'}</td>

                                    <td>{cr2.r.Aug._1 ? cr2.r.Aug._1 : 'n/a'}</td>
                                    <td>{cr2.r.Aug._2 ? cr2.r.Aug._2 : 'n/a'}</td>
                                    <td>{cr2.r.Aug._3 ? cr2.r.Aug._3 : 'n/a'}</td>
                                    <td>{cr2.r.Aug._4 ? cr2.r.Aug._4 : 'n/a'}</td>
                                    <td>{cr2.r.Aug._5 ? cr2.r.Aug._5 : 'n/a'}</td>
                                    <td>{cr2.r.Aug._6 ? cr2.r.Aug._6 : 'n/a'}</td>
                                    <td>{cr2.r.Aug._7 ? cr2.r.Aug._7 : 'n/a'}</td>
                                    <td>{cr2.r.Aug._8 ? cr2.r.Aug._8 : 'n/a'}</td>
                                    <td>{cr2.r.Aug._9 ? cr2.r.Aug._9 : 'n/a'}</td>
                                    <td>{cr2.r.Aug._10 ? cr2.r.Aug._10 : 'n/a'}</td>
                                    <td>{cr2.r.Aug._11 ? cr2.r.Aug._11 : 'n/a'}</td>
                                    <td>{cr2.r.Aug._12 ? cr2.r.Aug._12 : 'n/a'}</td>
                                    <td>{cr2.r.Aug._13 ? cr2.r.Aug._13 : 'n/a'}</td>
                                    <td>{cr2.r.Aug._14 ? cr2.r.Aug._14 : 'n/a'}</td>
                                    <td>{cr2.r.Aug._15 ? cr2.r.Aug._15 : 'n/a'}</td>
                                    <td>{cr2.r.Aug._16 ? cr2.r.Aug._16 : 'n/a'}</td>
                                    <td>{cr2.r.Aug._17 ? cr2.r.Aug._17 : 'n/a'}</td>
                                    <td>{cr2.r.Aug._18 ? cr2.r.Aug._18 : 'n/a'}</td>
                                    <td>{cr2.r.Aug._19 ? cr2.r.Aug._19 : 'n/a'}</td>
                                    <td>{cr2.r.Aug._20 ? cr2.r.Aug._20 : 'n/a'}</td>
                                    <td>{cr2.r.Aug._21 ? cr2.r.Aug._21 : 'n/a'}</td>
                                    <td>{cr2.r.Aug._22 ? cr2.r.Aug._22 : 'n/a'}</td>
                                    <td>{cr2.r.Aug._23 ? cr2.r.Aug._23 : 'n/a'}</td>
                                    <td>{cr2.r.Aug._24 ? cr2.r.Aug._24 : 'n/a'}</td>
                                    <td>{cr2.r.Aug._25 ? cr2.r.Aug._25 : 'n/a'}</td>
                                    <td>{cr2.r.Aug._26 ? cr2.r.Aug._26 : 'n/a'}</td>
                                    <td>{cr2.r.Aug._27 ? cr2.r.Aug._27 : 'n/a'}</td>
                                    <td>{cr2.r.Aug._28 ? cr2.r.Aug._28 : 'n/a'}</td>
                                    <td>{cr2.r.Aug._29 ? cr2.r.Aug._29 : 'n/a'}</td>
                                    <td>{cr2.r.Aug._30 ? cr2.r.Aug._30 : 'n/a'}</td>
                                    <td>{cr2.r.Aug._31 ? cr2.r.Aug._31 : 'n/a'}</td>

                                    <td>{cr2.r.Sep._1 ? cr2.r.Sep._1 : 'n/a'}</td>
                                    <td>{cr2.r.Sep._2 ? cr2.r.Sep._2 : 'n/a'}</td>
                                    <td>{cr2.r.Sep._3 ? cr2.r.Sep._3 : 'n/a'}</td>
                                    <td>{cr2.r.Sep._4 ? cr2.r.Sep._4 : 'n/a'}</td>
                                    <td>{cr2.r.Sep._5 ? cr2.r.Sep._5 : 'n/a'}</td>
                                    <td>{cr2.r.Sep._6 ? cr2.r.Sep._6 : 'n/a'}</td>
                                    <td>{cr2.r.Sep._7 ? cr2.r.Sep._7 : 'n/a'}</td>
                                    <td>{cr2.r.Sep._8 ? cr2.r.Sep._8 : 'n/a'}</td>
                                    <td>{cr2.r.Sep._9 ? cr2.r.Sep._9 : 'n/a'}</td>
                                    <td>{cr2.r.Sep._10 ? cr2.r.Sep._10 : 'n/a'}</td>
                                    <td>{cr2.r.Sep._11 ? cr2.r.Sep._11 : 'n/a'}</td>
                                    <td>{cr2.r.Sep._12 ? cr2.r.Sep._12 : 'n/a'}</td>
                                    <td>{cr2.r.Sep._13 ? cr2.r.Sep._13 : 'n/a'}</td>
                                    <td>{cr2.r.Sep._14 ? cr2.r.Sep._14 : 'n/a'}</td>
                                    <td>{cr2.r.Sep._15 ? cr2.r.Sep._15 : 'n/a'}</td>
                                    <td>{cr2.r.Sep._16 ? cr2.r.Sep._16 : 'n/a'}</td>
                                    <td>{cr2.r.Sep._17 ? cr2.r.Sep._17 : 'n/a'}</td>
                                    <td>{cr2.r.Sep._18 ? cr2.r.Sep._18 : 'n/a'}</td>
                                    <td>{cr2.r.Sep._19 ? cr2.r.Sep._19 : 'n/a'}</td>
                                    <td>{cr2.r.Sep._20 ? cr2.r.Sep._20 : 'n/a'}</td>
                                    <td>{cr2.r.Sep._21 ? cr2.r.Sep._21 : 'n/a'}</td>
                                    <td>{cr2.r.Sep._22 ? cr2.r.Sep._22 : 'n/a'}</td>
                                    <td>{cr2.r.Sep._23 ? cr2.r.Sep._23 : 'n/a'}</td>
                                    <td>{cr2.r.Sep._24 ? cr2.r.Sep._24 : 'n/a'}</td>
                                    <td>{cr2.r.Sep._25 ? cr2.r.Sep._25 : 'n/a'}</td>
                                    <td>{cr2.r.Sep._26 ? cr2.r.Sep._26 : 'n/a'}</td>
                                    <td>{cr2.r.Sep._27 ? cr2.r.Sep._27 : 'n/a'}</td>
                                    <td>{cr2.r.Sep._28 ? cr2.r.Sep._28 : 'n/a'}</td>
                                    <td>{cr2.r.Sep._29 ? cr2.r.Sep._29 : 'n/a'}</td>
                                    <td>{cr2.r.Sep._30 ? cr2.r.Sep._30 : 'n/a'}</td>
                                    <td>{cr2.r.Sep._31 ? cr2.r.Sep._31 : 'n/a'}</td>

                                    <td>{cr2.r.Oct._1 ? cr2.r.Oct._1 : 'n/a'}</td>
                                    <td>{cr2.r.Oct._2 ? cr2.r.Oct._2 : 'n/a'}</td>
                                    <td>{cr2.r.Oct._3 ? cr2.r.Oct._3 : 'n/a'}</td>
                                    <td>{cr2.r.Oct._4 ? cr2.r.Oct._4 : 'n/a'}</td>
                                    <td>{cr2.r.Oct._5 ? cr2.r.Oct._5 : 'n/a'}</td>
                                    <td>{cr2.r.Oct._6 ? cr2.r.Oct._6 : 'n/a'}</td>
                                    <td>{cr2.r.Oct._7 ? cr2.r.Oct._7 : 'n/a'}</td>
                                    <td>{cr2.r.Oct._8 ? cr2.r.Oct._8 : 'n/a'}</td>
                                    <td>{cr2.r.Oct._9 ? cr2.r.Oct._9 : 'n/a'}</td>
                                    <td>{cr2.r.Oct._10 ? cr2.r.Oct._10 : 'n/a'}</td>
                                    <td>{cr2.r.Oct._11 ? cr2.r.Oct._11 : 'n/a'}</td>
                                    <td>{cr2.r.Oct._12 ? cr2.r.Oct._12 : 'n/a'}</td>
                                    <td>{cr2.r.Oct._13 ? cr2.r.Oct._13 : 'n/a'}</td>
                                    <td>{cr2.r.Oct._14 ? cr2.r.Oct._14 : 'n/a'}</td>
                                    <td>{cr2.r.Oct._15 ? cr2.r.Oct._15 : 'n/a'}</td>
                                    <td>{cr2.r.Oct._16 ? cr2.r.Oct._16 : 'n/a'}</td>
                                    <td>{cr2.r.Oct._17 ? cr2.r.Oct._17 : 'n/a'}</td>
                                    <td>{cr2.r.Oct._18 ? cr2.r.Oct._18 : 'n/a'}</td>
                                    <td>{cr2.r.Oct._19 ? cr2.r.Oct._19 : 'n/a'}</td>
                                    <td>{cr2.r.Oct._20 ? cr2.r.Oct._20 : 'n/a'}</td>
                                    <td>{cr2.r.Oct._21 ? cr2.r.Oct._21 : 'n/a'}</td>
                                    <td>{cr2.r.Oct._22 ? cr2.r.Oct._22 : 'n/a'}</td>
                                    <td>{cr2.r.Oct._23 ? cr2.r.Oct._23 : 'n/a'}</td>
                                    <td>{cr2.r.Oct._24 ? cr2.r.Oct._24 : 'n/a'}</td>
                                    <td>{cr2.r.Oct._25 ? cr2.r.Oct._25 : 'n/a'}</td>
                                    <td>{cr2.r.Oct._26 ? cr2.r.Oct._26 : 'n/a'}</td>
                                    <td>{cr2.r.Oct._27 ? cr2.r.Oct._27 : 'n/a'}</td>
                                    <td>{cr2.r.Oct._28 ? cr2.r.Oct._28 : 'n/a'}</td>
                                    <td>{cr2.r.Oct._29 ? cr2.r.Oct._29 : 'n/a'}</td>
                                    <td>{cr2.r.Oct._30 ? cr2.r.Oct._30 : 'n/a'}</td>
                                    <td>{cr2.r.Oct._31 ? cr2.r.Oct._31 : 'n/a'}</td>

                                    <td>{cr2.r.Nov._1 ? cr2.r.Nov._1 : 'n/a'}</td>
                                    <td>{cr2.r.Nov._2 ? cr2.r.Nov._2 : 'n/a'}</td>
                                    <td>{cr2.r.Nov._3 ? cr2.r.Nov._3 : 'n/a'}</td>
                                    <td>{cr2.r.Nov._4 ? cr2.r.Nov._4 : 'n/a'}</td>
                                    <td>{cr2.r.Nov._5 ? cr2.r.Nov._5 : 'n/a'}</td>
                                    <td>{cr2.r.Nov._6 ? cr2.r.Nov._6 : 'n/a'}</td>
                                    <td>{cr2.r.Nov._7 ? cr2.r.Nov._7 : 'n/a'}</td>
                                    <td>{cr2.r.Nov._8 ? cr2.r.Nov._8 : 'n/a'}</td>
                                    <td>{cr2.r.Nov._9 ? cr2.r.Nov._9 : 'n/a'}</td>
                                    <td>{cr2.r.Nov._10 ? cr2.r.Nov._10 : 'n/a'}</td>
                                    <td>{cr2.r.Nov._11 ? cr2.r.Nov._11 : 'n/a'}</td>
                                    <td>{cr2.r.Nov._12 ? cr2.r.Nov._12 : 'n/a'}</td>
                                    <td>{cr2.r.Nov._13 ? cr2.r.Nov._13 : 'n/a'}</td>
                                    <td>{cr2.r.Nov._14 ? cr2.r.Nov._14 : 'n/a'}</td>
                                    <td>{cr2.r.Nov._15 ? cr2.r.Nov._15 : 'n/a'}</td>
                                    <td>{cr2.r.Nov._16 ? cr2.r.Nov._16 : 'n/a'}</td>
                                    <td>{cr2.r.Nov._17 ? cr2.r.Nov._17 : 'n/a'}</td>
                                    <td>{cr2.r.Nov._18 ? cr2.r.Nov._18 : 'n/a'}</td>
                                    <td>{cr2.r.Nov._19 ? cr2.r.Nov._19 : 'n/a'}</td>
                                    <td>{cr2.r.Nov._20 ? cr2.r.Nov._20 : 'n/a'}</td>
                                    <td>{cr2.r.Nov._21 ? cr2.r.Nov._21 : 'n/a'}</td>
                                    <td>{cr2.r.Nov._22 ? cr2.r.Nov._22 : 'n/a'}</td>
                                    <td>{cr2.r.Nov._23 ? cr2.r.Nov._23 : 'n/a'}</td>
                                    <td>{cr2.r.Nov._24 ? cr2.r.Nov._24 : 'n/a'}</td>
                                    <td>{cr2.r.Nov._25 ? cr2.r.Nov._25 : 'n/a'}</td>
                                    <td>{cr2.r.Nov._26 ? cr2.r.Nov._26 : 'n/a'}</td>
                                    <td>{cr2.r.Nov._27 ? cr2.r.Nov._27 : 'n/a'}</td>
                                    <td>{cr2.r.Nov._28 ? cr2.r.Nov._28 : 'n/a'}</td>
                                    <td>{cr2.r.Nov._29 ? cr2.r.Nov._29 : 'n/a'}</td>
                                    <td>{cr2.r.Nov._30 ? cr2.r.Nov._30 : 'n/a'}</td>
                                    <td>{cr2.r.Nov._31 ? cr2.r.Nov._31 : 'n/a'}</td>

                                    <td>{cr2.r.Dec._1 ? cr2.r.Dec._1 : 'n/a'}</td>
                                    <td>{cr2.r.Dec._2 ? cr2.r.Dec._2 : 'n/a'}</td>
                                    <td>{cr2.r.Dec._3 ? cr2.r.Dec._3 : 'n/a'}</td>
                                    <td>{cr2.r.Dec._4 ? cr2.r.Dec._4 : 'n/a'}</td>
                                    <td>{cr2.r.Dec._5 ? cr2.r.Dec._5 : 'n/a'}</td>
                                    <td>{cr2.r.Dec._6 ? cr2.r.Dec._6 : 'n/a'}</td>
                                    <td>{cr2.r.Dec._7 ? cr2.r.Dec._7 : 'n/a'}</td>
                                    <td>{cr2.r.Dec._8 ? cr2.r.Dec._8 : 'n/a'}</td>
                                    <td>{cr2.r.Dec._9 ? cr2.r.Dec._9 : 'n/a'}</td>
                                    <td>{cr2.r.Dec._10 ? cr2.r.Dec._10 : 'n/a'}</td>
                                    <td>{cr2.r.Dec._11 ? cr2.r.Dec._11 : 'n/a'}</td>
                                    <td>{cr2.r.Dec._12 ? cr2.r.Dec._12 : 'n/a'}</td>
                                    <td>{cr2.r.Dec._13 ? cr2.r.Dec._13 : 'n/a'}</td>
                                    <td>{cr2.r.Dec._14 ? cr2.r.Dec._14 : 'n/a'}</td>
                                    <td>{cr2.r.Dec._15 ? cr2.r.Dec._15 : 'n/a'}</td>
                                    <td>{cr2.r.Dec._16 ? cr2.r.Dec._16 : 'n/a'}</td>
                                    <td>{cr2.r.Dec._17 ? cr2.r.Dec._17 : 'n/a'}</td>
                                    <td>{cr2.r.Dec._18 ? cr2.r.Dec._18 : 'n/a'}</td>
                                    <td>{cr2.r.Dec._19 ? cr2.r.Dec._19 : 'n/a'}</td>
                                    <td>{cr2.r.Dec._20 ? cr2.r.Dec._20 : 'n/a'}</td>
                                    <td>{cr2.r.Dec._21 ? cr2.r.Dec._21 : 'n/a'}</td>
                                    <td>{cr2.r.Dec._22 ? cr2.r.Dec._22 : 'n/a'}</td>
                                    <td>{cr2.r.Dec._23 ? cr2.r.Dec._23 : 'n/a'}</td>
                                    <td>{cr2.r.Dec._24 ? cr2.r.Dec._24 : 'n/a'}</td>
                                    <td>{cr2.r.Dec._25 ? cr2.r.Dec._25 : 'n/a'}</td>
                                    <td>{cr2.r.Dec._26 ? cr2.r.Dec._26 : 'n/a'}</td>
                                    <td>{cr2.r.Dec._27 ? cr2.r.Dec._27 : 'n/a'}</td>
                                    <td>{cr2.r.Dec._28 ? cr2.r.Dec._28 : 'n/a'}</td>
                                    <td>{cr2.r.Dec._29 ? cr2.r.Dec._29 : 'n/a'}</td>
                                    <td>{cr2.r.Dec._30 ? cr2.r.Dec._30 : 'n/a'}</td>
                                    <td>{cr2.r.Dec._31 ? cr2.r.Dec._31 : 'n/a'}</td>
                                </tr>
                                <tr>                                    
                                    <td>{Object.keys(cr).length && cr.r.Jan._1 ? cr.r.Jan._1 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jan._2 ? cr.r.Jan._2 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jan._3 ? cr.r.Jan._3 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jan._4 ? cr.r.Jan._4 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jan._5 ? cr.r.Jan._5 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jan._6 ? cr.r.Jan._6 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jan._7 ? cr.r.Jan._7 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jan._8 ? cr.r.Jan._8 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jan._9 ? cr.r.Jan._9 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jan._10 ? cr.r.Jan._10 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jan._11 ? cr.r.Jan._11 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jan._12 ? cr.r.Jan._12 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jan._13 ? cr.r.Jan._13 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jan._14 ? cr.r.Jan._14 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jan._15 ? cr.r.Jan._15 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jan._16 ? cr.r.Jan._16 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jan._17 ? cr.r.Jan._17 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jan._18 ? cr.r.Jan._18 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jan._19 ? cr.r.Jan._19 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jan._20 ? cr.r.Jan._20 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jan._21 ? cr.r.Jan._21 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jan._22 ? cr.r.Jan._22 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jan._23 ? cr.r.Jan._23 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jan._24 ? cr.r.Jan._24 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jan._25 ? cr.r.Jan._25 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jan._26 ? cr.r.Jan._26 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jan._27 ? cr.r.Jan._27 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jan._28 ? cr.r.Jan._28 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jan._29 ? cr.r.Jan._29 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jan._30 ? cr.r.Jan._30 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jan._31 ? cr.r.Jan._31 : 'n/a'}</td>
                                    
                                    <td>{Object.keys(cr).length && cr.r.Feb._1 ? cr.r.Feb._1 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Feb._2 ? cr.r.Feb._2 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Feb._3 ? cr.r.Feb._3 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Feb._4 ? cr.r.Feb._4 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Feb._5 ? cr.r.Feb._5 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Feb._6 ? cr.r.Feb._6 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Feb._7 ? cr.r.Feb._7 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Feb._8 ? cr.r.Feb._8 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Feb._9 ? cr.r.Feb._9 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Feb._10 ? cr.r.Feb._10 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Feb._11 ? cr.r.Feb._11 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Feb._12 ? cr.r.Feb._12 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Feb._13 ? cr.r.Feb._13 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Feb._14 ? cr.r.Feb._14 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Feb._15 ? cr.r.Feb._15 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Feb._16 ? cr.r.Feb._16 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Feb._17 ? cr.r.Feb._17 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Feb._18 ? cr.r.Feb._18 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Feb._19 ? cr.r.Feb._19 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Feb._20 ? cr.r.Feb._20 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Feb._21 ? cr.r.Feb._21 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Feb._22 ? cr.r.Feb._22 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Feb._23 ? cr.r.Feb._23 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Feb._24 ? cr.r.Feb._24 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Feb._25 ? cr.r.Feb._25 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Feb._26 ? cr.r.Feb._26 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Feb._27 ? cr.r.Feb._27 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Feb._28 ? cr.r.Feb._28 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Feb._29 ? cr.r.Feb._29 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Feb._30 ? cr.r.Feb._30 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Feb._31 ? cr.r.Feb._31 : 'n/a'}</td>

                                    <td>{Object.keys(cr).length && cr.r.Mar._1 ? cr.r.Mar._1 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Mar._2 ? cr.r.Mar._2 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Mar._3 ? cr.r.Mar._3 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Mar._4 ? cr.r.Mar._4 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Mar._5 ? cr.r.Mar._5 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Mar._6 ? cr.r.Mar._6 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Mar._7 ? cr.r.Mar._7 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Mar._8 ? cr.r.Mar._8 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Mar._9 ? cr.r.Mar._9 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Mar._10 ? cr.r.Mar._10 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Mar._11 ? cr.r.Mar._11 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Mar._12 ? cr.r.Mar._12 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Mar._13 ? cr.r.Mar._13 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Mar._14 ? cr.r.Mar._14 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Mar._15 ? cr.r.Mar._15 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Mar._16 ? cr.r.Mar._16 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Mar._17 ? cr.r.Mar._17 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Mar._18 ? cr.r.Mar._18 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Mar._19 ? cr.r.Mar._19 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Mar._20 ? cr.r.Mar._20 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Mar._21 ? cr.r.Mar._21 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Mar._22 ? cr.r.Mar._22 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Mar._23 ? cr.r.Mar._23 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Mar._24 ? cr.r.Mar._24 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Mar._25 ? cr.r.Mar._25 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Mar._26 ? cr.r.Mar._26 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Mar._27 ? cr.r.Mar._27 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Mar._28 ? cr.r.Mar._28 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Mar._29 ? cr.r.Mar._29 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Mar._30 ? cr.r.Mar._30 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Mar._31 ? cr.r.Mar._31 : 'n/a'}</td>

                                    <td>{Object.keys(cr).length && cr.r.Apr._1 ? cr.r.Apr._1 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Apr._2 ? cr.r.Apr._2 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Apr._3 ? cr.r.Apr._3 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Apr._4 ? cr.r.Apr._4 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Apr._5 ? cr.r.Apr._5 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Apr._6 ? cr.r.Apr._6 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Apr._7 ? cr.r.Apr._7 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Apr._8 ? cr.r.Apr._8 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Apr._9 ? cr.r.Apr._9 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Apr._10 ? cr.r.Apr._10 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Apr._11 ? cr.r.Apr._11 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Apr._12 ? cr.r.Apr._12 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Apr._13 ? cr.r.Apr._13 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Apr._14 ? cr.r.Apr._14 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Apr._15 ? cr.r.Apr._15 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Apr._16 ? cr.r.Apr._16 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Apr._17 ? cr.r.Apr._17 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Apr._18 ? cr.r.Apr._18 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Apr._19 ? cr.r.Apr._19 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Apr._20 ? cr.r.Apr._20 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Apr._21 ? cr.r.Apr._21 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Apr._22 ? cr.r.Apr._22 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Apr._23 ? cr.r.Apr._23 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Apr._24 ? cr.r.Apr._24 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Apr._25 ? cr.r.Apr._25 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Apr._26 ? cr.r.Apr._26 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Apr._27 ? cr.r.Apr._27 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Apr._28 ? cr.r.Apr._28 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Apr._29 ? cr.r.Apr._29 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Apr._30 ? cr.r.Apr._30 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Apr._31 ? cr.r.Apr._31 : 'n/a'}</td>

                                    <td>{Object.keys(cr).length && cr.r.May._1 ? cr.r.May._1 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.May._2 ? cr.r.May._2 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.May._3 ? cr.r.May._3 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.May._4 ? cr.r.May._4 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.May._5 ? cr.r.May._5 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.May._6 ? cr.r.May._6 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.May._7 ? cr.r.May._7 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.May._8 ? cr.r.May._8 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.May._9 ? cr.r.May._9 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.May._10 ? cr.r.May._10 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.May._11 ? cr.r.May._11 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.May._12 ? cr.r.May._12 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.May._13 ? cr.r.May._13 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.May._14 ? cr.r.May._14 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.May._15 ? cr.r.May._15 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.May._16 ? cr.r.May._16 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.May._17 ? cr.r.May._17 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.May._18 ? cr.r.May._18 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.May._19 ? cr.r.May._19 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.May._20 ? cr.r.May._20 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.May._21 ? cr.r.May._21 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.May._22 ? cr.r.May._22 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.May._23 ? cr.r.May._23 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.May._24 ? cr.r.May._24 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.May._25 ? cr.r.May._25 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.May._26 ? cr.r.May._26 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.May._27 ? cr.r.May._27 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.May._28 ? cr.r.May._28 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.May._29 ? cr.r.May._29 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.May._30 ? cr.r.May._30 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.May._31 ? cr.r.May._31 : 'n/a'}</td>

                                    <td>{Object.keys(cr).length && cr.r.Jun._1 ? cr.r.Jun._1 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jun._2 ? cr.r.Jun._2 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jun._3 ? cr.r.Jun._3 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jun._4 ? cr.r.Jun._4 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jun._5 ? cr.r.Jun._5 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jun._6 ? cr.r.Jun._6 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jun._7 ? cr.r.Jun._7 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jun._8 ? cr.r.Jun._8 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jun._9 ? cr.r.Jun._9 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jun._10 ? cr.r.Jun._10 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jun._11 ? cr.r.Jun._11 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jun._12 ? cr.r.Jun._12 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jun._13 ? cr.r.Jun._13 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jun._14 ? cr.r.Jun._14 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jun._15 ? cr.r.Jun._15 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jun._16 ? cr.r.Jun._16 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jun._17 ? cr.r.Jun._17 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jun._18 ? cr.r.Jun._18 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jun._19 ? cr.r.Jun._19 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jun._20 ? cr.r.Jun._20 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jun._21 ? cr.r.Jun._21 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jun._22 ? cr.r.Jun._22 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jun._23 ? cr.r.Jun._23 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jun._24 ? cr.r.Jun._24 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jun._25 ? cr.r.Jun._25 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jun._26 ? cr.r.Jun._26 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jun._27 ? cr.r.Jun._27 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jun._28 ? cr.r.Jun._28 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jun._29 ? cr.r.Jun._29 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jun._30 ? cr.r.Jun._30 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jun._31 ? cr.r.Jun._31 : 'n/a'}</td>

                                    <td>{Object.keys(cr).length && cr.r.Jul._1 ? cr.r.Jul._1 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jul._2 ? cr.r.Jul._2 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jul._3 ? cr.r.Jul._3 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jul._4 ? cr.r.Jul._4 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jul._5 ? cr.r.Jul._5 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jul._6 ? cr.r.Jul._6 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jul._7 ? cr.r.Jul._7 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jul._8 ? cr.r.Jul._8 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jul._9 ? cr.r.Jul._9 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jul._10 ? cr.r.Jul._10 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jul._11 ? cr.r.Jul._11 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jul._12 ? cr.r.Jul._12 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jul._13 ? cr.r.Jul._13 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jul._14 ? cr.r.Jul._14 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jul._15 ? cr.r.Jul._15 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jul._16 ? cr.r.Jul._16 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jul._17 ? cr.r.Jul._17 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jul._18 ? cr.r.Jul._18 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jul._19 ? cr.r.Jul._19 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jul._20 ? cr.r.Jul._20 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jul._21 ? cr.r.Jul._21 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jul._22 ? cr.r.Jul._22 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jul._23 ? cr.r.Jul._23 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jul._24 ? cr.r.Jul._24 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jul._25 ? cr.r.Jul._25 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jul._26 ? cr.r.Jul._26 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jul._27 ? cr.r.Jul._27 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jul._28 ? cr.r.Jul._28 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jul._29 ? cr.r.Jul._29 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jul._30 ? cr.r.Jul._30 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Jul._31 ? cr.r.Jul._31 : 'n/a'}</td>

                                    <td>{Object.keys(cr).length && cr.r.Aug._1 ? cr.r.Aug._1 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Aug._2 ? cr.r.Aug._2 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Aug._3 ? cr.r.Aug._3 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Aug._4 ? cr.r.Aug._4 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Aug._5 ? cr.r.Aug._5 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Aug._6 ? cr.r.Aug._6 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Aug._7 ? cr.r.Aug._7 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Aug._8 ? cr.r.Aug._8 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Aug._9 ? cr.r.Aug._9 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Aug._10 ? cr.r.Aug._10 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Aug._11 ? cr.r.Aug._11 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Aug._12 ? cr.r.Aug._12 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Aug._13 ? cr.r.Aug._13 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Aug._14 ? cr.r.Aug._14 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Aug._15 ? cr.r.Aug._15 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Aug._16 ? cr.r.Aug._16 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Aug._17 ? cr.r.Aug._17 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Aug._18 ? cr.r.Aug._18 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Aug._19 ? cr.r.Aug._19 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Aug._20 ? cr.r.Aug._20 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Aug._21 ? cr.r.Aug._21 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Aug._22 ? cr.r.Aug._22 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Aug._23 ? cr.r.Aug._23 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Aug._24 ? cr.r.Aug._24 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Aug._25 ? cr.r.Aug._25 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Aug._26 ? cr.r.Aug._26 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Aug._27 ? cr.r.Aug._27 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Aug._28 ? cr.r.Aug._28 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Aug._29 ? cr.r.Aug._29 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Aug._30 ? cr.r.Aug._30 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Aug._31 ? cr.r.Aug._31 : 'n/a'}</td>

                                    <td>{Object.keys(cr).length && cr.r.Sep._1 ? cr.r.Sep._1 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Sep._2 ? cr.r.Sep._2 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Sep._3 ? cr.r.Sep._3 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Sep._4 ? cr.r.Sep._4 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Sep._5 ? cr.r.Sep._5 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Sep._6 ? cr.r.Sep._6 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Sep._7 ? cr.r.Sep._7 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Sep._8 ? cr.r.Sep._8 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Sep._9 ? cr.r.Sep._9 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Sep._10 ? cr.r.Sep._10 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Sep._11 ? cr.r.Sep._11 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Sep._12 ? cr.r.Sep._12 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Sep._13 ? cr.r.Sep._13 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Sep._14 ? cr.r.Sep._14 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Sep._15 ? cr.r.Sep._15 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Sep._16 ? cr.r.Sep._16 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Sep._17 ? cr.r.Sep._17 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Sep._18 ? cr.r.Sep._18 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Sep._19 ? cr.r.Sep._19 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Sep._20 ? cr.r.Sep._20 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Sep._21 ? cr.r.Sep._21 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Sep._22 ? cr.r.Sep._22 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Sep._23 ? cr.r.Sep._23 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Sep._24 ? cr.r.Sep._24 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Sep._25 ? cr.r.Sep._25 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Sep._26 ? cr.r.Sep._26 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Sep._27 ? cr.r.Sep._27 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Sep._28 ? cr.r.Sep._28 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Sep._29 ? cr.r.Sep._29 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Sep._30 ? cr.r.Sep._30 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Sep._31 ? cr.r.Sep._31 : 'n/a'}</td>

                                    <td>{Object.keys(cr).length && cr.r.Oct._1 ? cr.r.Oct._1 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Oct._2 ? cr.r.Oct._2 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Oct._3 ? cr.r.Oct._3 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Oct._4 ? cr.r.Oct._4 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Oct._5 ? cr.r.Oct._5 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Oct._6 ? cr.r.Oct._6 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Oct._7 ? cr.r.Oct._7 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Oct._8 ? cr.r.Oct._8 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Oct._9 ? cr.r.Oct._9 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Oct._10 ? cr.r.Oct._10 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Oct._11 ? cr.r.Oct._11 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Oct._12 ? cr.r.Oct._12 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Oct._13 ? cr.r.Oct._13 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Oct._14 ? cr.r.Oct._14 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Oct._15 ? cr.r.Oct._15 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Oct._16 ? cr.r.Oct._16 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Oct._17 ? cr.r.Oct._17 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Oct._18 ? cr.r.Oct._18 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Oct._19 ? cr.r.Oct._19 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Oct._20 ? cr.r.Oct._20 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Oct._21 ? cr.r.Oct._21 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Oct._22 ? cr.r.Oct._22 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Oct._23 ? cr.r.Oct._23 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Oct._24 ? cr.r.Oct._24 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Oct._25 ? cr.r.Oct._25 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Oct._26 ? cr.r.Oct._26 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Oct._27 ? cr.r.Oct._27 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Oct._28 ? cr.r.Oct._28 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Oct._29 ? cr.r.Oct._29 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Oct._30 ? cr.r.Oct._30 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Oct._31 ? cr.r.Oct._31 : 'n/a'}</td>

                                    <td>{Object.keys(cr).length && cr.r.Nov._1 ? cr.r.Nov._1 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Nov._2 ? cr.r.Nov._2 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Nov._3 ? cr.r.Nov._3 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Nov._4 ? cr.r.Nov._4 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Nov._5 ? cr.r.Nov._5 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Nov._6 ? cr.r.Nov._6 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Nov._7 ? cr.r.Nov._7 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Nov._8 ? cr.r.Nov._8 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Nov._9 ? cr.r.Nov._9 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Nov._10 ? cr.r.Nov._10 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Nov._11 ? cr.r.Nov._11 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Nov._12 ? cr.r.Nov._12 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Nov._13 ? cr.r.Nov._13 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Nov._14 ? cr.r.Nov._14 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Nov._15 ? cr.r.Nov._15 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Nov._16 ? cr.r.Nov._16 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Nov._17 ? cr.r.Nov._17 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Nov._18 ? cr.r.Nov._18 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Nov._19 ? cr.r.Nov._19 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Nov._20 ? cr.r.Nov._20 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Nov._21 ? cr.r.Nov._21 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Nov._22 ? cr.r.Nov._22 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Nov._23 ? cr.r.Nov._23 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Nov._24 ? cr.r.Nov._24 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Nov._25 ? cr.r.Nov._25 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Nov._26 ? cr.r.Nov._26 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Nov._27 ? cr.r.Nov._27 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Nov._28 ? cr.r.Nov._28 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Nov._29 ? cr.r.Nov._29 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Nov._30 ? cr.r.Nov._30 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Nov._31 ? cr.r.Nov._31 : 'n/a'}</td>

                                    <td>{Object.keys(cr).length && cr.r.Dec._1 ? cr.r.Dec._1 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Dec._2 ? cr.r.Dec._2 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Dec._3 ? cr.r.Dec._3 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Dec._4 ? cr.r.Dec._4 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Dec._5 ? cr.r.Dec._5 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Dec._6 ? cr.r.Dec._6 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Dec._7 ? cr.r.Dec._7 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Dec._8 ? cr.r.Dec._8 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Dec._9 ? cr.r.Dec._9 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Dec._10 ? cr.r.Dec._10 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Dec._11 ? cr.r.Dec._11 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Dec._12 ? cr.r.Dec._12 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Dec._13 ? cr.r.Dec._13 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Dec._14 ? cr.r.Dec._14 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Dec._15 ? cr.r.Dec._15 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Dec._16 ? cr.r.Dec._16 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Dec._17 ? cr.r.Dec._17 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Dec._18 ? cr.r.Dec._18 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Dec._19 ? cr.r.Dec._19 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Dec._20 ? cr.r.Dec._20 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Dec._21 ? cr.r.Dec._21 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Dec._22 ? cr.r.Dec._22 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Dec._23 ? cr.r.Dec._23 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Dec._24 ? cr.r.Dec._24 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Dec._25 ? cr.r.Dec._25 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Dec._26 ? cr.r.Dec._26 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Dec._27 ? cr.r.Dec._27 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Dec._28 ? cr.r.Dec._28 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Dec._29 ? cr.r.Dec._29 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Dec._30 ? cr.r.Dec._30 : 'n/a'}</td>
                                    <td>{Object.keys(cr).length && cr.r.Dec._31 ? cr.r.Dec._31 : 'n/a'}</td>
                                </tr>
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
                <Col xl={12} md={12}>
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
                                    <th scope="row">27</th>
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
                                    <th scope="row">28</th>                                                                                                            
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
                                    <th scope="row">29</th>                                                                                                            
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
                                    <th scope="row">30</th>                                                                                                            
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
                                    <th scope="row">31</th>                                                                                                            
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
                                <tr>
                                    <th scope="row">Highest Daily</th>
                                    <td>{janToDecMax.max.Jan ? janToDecMax.max.Jan : janToDecMax.max.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{janToDecMax.max.Feb ? janToDecMax.max.Feb : janToDecMax.max.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{janToDecMax.max.Mar ? janToDecMax.max.Mar : janToDecMax.max.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{janToDecMax.max.Apr ? janToDecMax.max.Apr : janToDecMax.max.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{janToDecMax.max.May ? janToDecMax.max.May : janToDecMax.max.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{janToDecMax.max.Jun ? janToDecMax.max.Jun : janToDecMax.max.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{janToDecMax.max.Jul ? janToDecMax.max.Jul : janToDecMax.max.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{janToDecMax.max.Aug ? janToDecMax.max.Aug : janToDecMax.max.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{janToDecMax.max.Sep ? janToDecMax.max.Sep : janToDecMax.max.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{janToDecMax.max.Oct ? janToDecMax.max.Oct : janToDecMax.max.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{janToDecMax.max.Nov ? janToDecMax.max.Nov : janToDecMax.max.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{janToDecMax.max.Dec ? janToDecMax.max.Dec : janToDecMax.max.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                </tr>
                                <tr>
                                    <th scope="row">Highest (Consecutive Multi Day)</th>
                                    <td>{Number(hrpm.r.Jan).toFixed(2) ? hrpm.r.Jan : hrpm.r.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{Number(hrpm.r.Feb).toFixed(2) ? hrpm.r.Feb : hrpm.r.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{Number(hrpm.r.Mar).toFixed(2) ? hrpm.r.Mar : hrpm.r.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{Number(hrpm.r.Apr).toFixed(2) ? hrpm.r.Apr : hrpm.r.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{Number(hrpm.r.May).toFixed(2) ? hrpm.r.May : hrpm.r.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{Number(hrpm.r.Jun).toFixed(2) ? hrpm.r.Jun : hrpm.r.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{Number(hrpm.r.Jul).toFixed(2) ? hrpm.r.Jul : hrpm.r.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{Number(hrpm.r.Aug).toFixed(2) ? hrpm.r.Aug : hrpm.r.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{Number(hrpm.r.Sep).toFixed(2) ? hrpm.r.Sep : hrpm.r.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{Number(hrpm.r.Oct).toFixed(2) ? hrpm.r.Oct : hrpm.r.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{Number(hrpm.r.Nov).toFixed(2) ? hrpm.r.Nov : hrpm.r.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{Number(hrpm.r.Dec).toFixed(2) ? hrpm.r.Dec : hrpm.r.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                </tr>
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                    <Card>
                        {/*<Card.Header>
                            <Card.Title as="h5">Data Analysis</Card.Title>
                            <span className="d-block m-t-5"><code>-1</code> means <code>no data recorded</code></span>
                        </Card.Header>*/}
                        <Card.Body>
                            <Table striped responsive>
                            <thead>
                                <tr>
                                    <th style={{visibility:'hidden'}}>{analysisData.year}</th>                                    
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
                                    <th>{analysisData.year}</th>                                    
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <th scope="row">No. Rain Days</th>
                                    <td>{nrd.r.Jan ? nrd.r.Jan : nrd.r.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{nrd.r.Feb ? nrd.r.Feb : nrd.r.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{nrd.r.Mar ? nrd.r.Mar : nrd.r.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{nrd.r.Apr ? nrd.r.Apr : nrd.r.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{nrd.r.May ? nrd.r.May : nrd.r.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{nrd.r.Jun ? nrd.r.Jun : nrd.r.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{nrd.r.Jul ? nrd.r.Jul : nrd.r.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{nrd.r.Aug ? nrd.r.Aug : nrd.r.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{nrd.r.Sep ? nrd.r.Sep : nrd.r.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{nrd.r.Oct ? nrd.r.Oct : nrd.r.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{nrd.r.Nov ? nrd.r.Nov : nrd.r.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{nrd.r.Dec ? nrd.r.Dec : nrd.r.Dec === 0 ? 0 : 'n/a'}</td>
                                    <td>{nrdYear ? nrdYear : nrdYear === 0 ? 0 : 'n/a'}</td>
                                </tr>
                                <tr>
                                    <th scope="row">No. Dry Days</th>
                                    <td>{ndd.r.Jan ? ndd.r.Jan : ndd.r.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{ndd.r.Feb ? ndd.r.Feb : ndd.r.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{ndd.r.Mar ? ndd.r.Mar : ndd.r.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{ndd.r.Apr ? ndd.r.Apr : ndd.r.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{ndd.r.May ? ndd.r.May : ndd.r.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{ndd.r.Jun ? ndd.r.Jun : ndd.r.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{ndd.r.Jul ? ndd.r.Jul : ndd.r.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{ndd.r.Aug ? ndd.r.Aug : ndd.r.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{ndd.r.Sep ? ndd.r.Sep : ndd.r.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{ndd.r.Oct ? ndd.r.Oct : ndd.r.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{ndd.r.Nov ? ndd.r.Nov : ndd.r.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{ndd.r.Dec ? ndd.r.Dec : ndd.r.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                    <td>{nddYear ? nddYear : nddYear === 0 ? 0 : 'n/a'}</td>
                                </tr>
                                <tr>
                                    <th scope="row">No. Wet Days &#62; 25mm</th>
                                    <td>{nwd25.r.Jan ? nwd25.r.Jan : nwd25.r.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{nwd25.r.Feb ? nwd25.r.Feb : nwd25.r.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{nwd25.r.Mar ? nwd25.r.Mar : nwd25.r.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{nwd25.r.Apr ? nwd25.r.Apr : nwd25.r.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{nwd25.r.May ? nwd25.r.May : nwd25.r.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{nwd25.r.Jun ? nwd25.r.Jun : nwd25.r.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{nwd25.r.Jul ? nwd25.r.Jul : nwd25.r.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{nwd25.r.Aug ? nwd25.r.Aug : nwd25.r.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{nwd25.r.Sep ? nwd25.r.Sep : nwd25.r.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{nwd25.r.Oct ? nwd25.r.Oct : nwd25.r.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{nwd25.r.Nov ? nwd25.r.Nov : nwd25.r.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{nwd25.r.Dec ? nwd25.r.Dec : nwd25.r.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                    <td>{nwd25Year ? nwd25Year : nwd25Year === 0 ? 0 : 'n/a'}</td>
                                </tr>
                                <tr>
                                    <th scope="row">No. Wet Days &#62; 15mm</th>
                                    <td>{nwd15.r.Jan ? nwd15.r.Jan : nwd15.r.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{nwd15.r.Feb ? nwd15.r.Feb : nwd15.r.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{nwd15.r.Mar ? nwd15.r.Mar : nwd15.r.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{nwd15.r.Apr ? nwd15.r.Apr : nwd15.r.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{nwd15.r.May ? nwd15.r.May : nwd15.r.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{nwd15.r.Jun ? nwd15.r.Jun : nwd15.r.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{nwd15.r.Jul ? nwd15.r.Jul : nwd15.r.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{nwd15.r.Aug ? nwd15.r.Aug : nwd15.r.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{nwd15.r.Sep ? nwd15.r.Sep : nwd15.r.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{nwd15.r.Oct ? nwd15.r.Oct : nwd15.r.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{nwd15.r.Nov ? nwd15.r.Nov : nwd15.r.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{nwd15.r.Dec ? nwd15.r.Dec : nwd15.r.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                    <td>{nwd15Year ? nwd15Year : nwd15Year === 0 ? 0 : 'n/a'}</td>
                                </tr>
                                <tr>
                                    <th scope="row">No. Wet Days &#62; 10mm</th>
                                    <td>{nwd10.r.Jan ? nwd10.r.Jan : nwd10.r.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{nwd10.r.Feb ? nwd10.r.Feb : nwd10.r.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{nwd10.r.Mar ? nwd10.r.Mar : nwd10.r.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{nwd10.r.Apr ? nwd10.r.Apr : nwd10.r.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{nwd10.r.May ? nwd10.r.May : nwd10.r.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{nwd10.r.Jun ? nwd10.r.Jun : nwd10.r.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{nwd10.r.Jul ? nwd10.r.Jul : nwd10.r.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{nwd10.r.Aug ? nwd10.r.Aug : nwd10.r.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{nwd10.r.Sep ? nwd10.r.Sep : nwd10.r.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{nwd10.r.Oct ? nwd10.r.Oct : nwd10.r.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{nwd10.r.Nov ? nwd10.r.Nov : nwd10.r.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{nwd10.r.Dec ? nwd10.r.Dec : nwd10.r.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                    <td>{nwd10Year ? nwd10Year : nwd10Year === 0 ? 0 : 'n/a'}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Highest No. Consecutive Dry Days</th>
                                    <td>{hdnod.r.Jan ? hdnod.r.Jan : hdnod.r.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{hdnod.r.Feb ? hdnod.r.Feb : hdnod.r.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{hdnod.r.Mar ? hdnod.r.Mar : hdnod.r.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{hdnod.r.Apr ? hdnod.r.Apr : hdnod.r.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{hdnod.r.May ? hdnod.r.May : hdnod.r.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{hdnod.r.Jun ? hdnod.r.Jun : hdnod.r.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{hdnod.r.Jul ? hdnod.r.Jul : hdnod.r.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{hdnod.r.Aug ? hdnod.r.Aug : hdnod.r.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{hdnod.r.Sep ? hdnod.r.Sep : hdnod.r.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{hdnod.r.Oct ? hdnod.r.Oct : hdnod.r.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{hdnod.r.Nov ? hdnod.r.Nov : hdnod.r.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{hdnod.r.Dec ? hdnod.r.Dec : hdnod.r.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                    <td>{hdnodYear ? hdnodYear : hdnodYear === 0 ? 0 : 'n/a'}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Highest No. Consecutive Wet Days</th>
                                    <td>{hnod.r.Jan ? hnod.r.Jan : hnod.r.Jan === 0 ? 0 : 'n/a'}</td>
                                    <td>{hnod.r.Feb ? hnod.r.Feb : hnod.r.Feb === 0 ? 0 : 'n/a'}</td>
                                    <td>{hnod.r.Mar ? hnod.r.Mar : hnod.r.Mar === 0 ? 0 : 'n/a'}</td>
                                    <td>{hnod.r.Apr ? hnod.r.Apr : hnod.r.Apr === 0 ? 0 : 'n/a'}</td>
                                    <td>{hnod.r.May ? hnod.r.May : hnod.r.May === 0 ? 0 : 'n/a'}</td>
                                    <td>{hnod.r.Jun ? hnod.r.Jun : hnod.r.Jun === 0 ? 0 : 'n/a'}</td>
                                    <td>{hnod.r.Jul ? hnod.r.Jul : hnod.r.Jul === 0 ? 0 : 'n/a'}</td>
                                    <td>{hnod.r.Aug ? hnod.r.Aug : hnod.r.Aug === 0 ? 0 : 'n/a'}</td>
                                    <td>{hnod.r.Sep ? hnod.r.Sep : hnod.r.Sep === 0 ? 0 : 'n/a'}</td>
                                    <td>{hnod.r.Oct ? hnod.r.Oct : hnod.r.Oct === 0 ? 0 : 'n/a'}</td>
                                    <td>{hnod.r.Nov ? hnod.r.Nov : hnod.r.Nov === 0 ? 0 : 'n/a'}</td>
                                    <td>{hnod.r.Dec ? hnod.r.Dec : hnod.r.Dec === 0 ? 0 : 'n/a'}</td>                                    
                                    <td>{hnodYear ? hnodYear : hnodYear === 0 ? 0 : 'n/a'}</td>
                                </tr>
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={12} md={12}>
                    { 
                        <TiltedBarChart                             
                            dryDays={hdnodYear}
                            wetDays={hnodYear}
                            nwd25={nwd25Year}
                            nwd15={nwd15Year}
                            nwd10={nwd10Year}
                        />
                    }
                    {
                        /*analysisControl !== 'Select Year' && */<PieChart                                               
                            q={analysisYear} 
                            dry={nodd}
                            wet={nord}
                        />
                    }
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
                                    <td>{Number(d.aj).toFixed(2)}</td>
                                    <td>{Number(d.sj).toFixed(2)}</td>                                    
                                    <td>{Number(d.oj).toFixed(2)}</td>                                    
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
                                    <th>From/To:</th>                                    
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
                                {ltaYearsAvg.map((d, i) => (<tr key={i}>
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
                                    <td>{d.year}</td>                                    
                                </tr>))}       
                                {avgPerTenYears.map((d, i) => (<tr key={i}>
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
                                    <td>{d.year}</td>                                    
                                </tr>))}     
                                {avgPerFiftyYears.map((d, i) => (<tr key={i}>
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
                                    <td>{d.year}</td>                                    
                                </tr>))}   
                                {last100YearAvg.map((d, i) => (<tr key={i}>
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
                                    <td>{d.year}</td>                                    
                                </tr>))}   
                                {avgPerFiveYears.map((d, i) => (<tr key={i}>
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
                                    <td>{d.year}</td>                                    
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
                            <Table striped responsive className='text-center'>
                                <thead>
                                <tr>
                                    <th>#</th>                                    
                                    <th>Year</th>                                    
                                    <th>Monthly Precipitation <br /> Total (millimetres)</th>                                                                        
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
                            <Table striped responsive className='text-center'>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Product code</th>
                                    <th>Bureau of Meteorology <br /> station number</th>
                                    <th>Year</th>
                                    <th>Month</th>                                    
                                    <th>Monthly Precipitation <br /> Total (millimetres)</th>                                    
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
        : data.length ?
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
                            <Table striped responsive className='text-center' style={{width: '100%', maxWidth: '100%'}}>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Product code</th>
                                    <th>Bureau of Meteorology <br /> station number</th>
                                    <th>Year</th>
                                    <th>Month</th>
                                    <th>Day</th>
                                    <th>Rainfall amount <br /> (millimetres)</th>
                                    <th>Period over which <br /> rainfall was measured <br /> (days)</th>
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
        </Aux>: null
    );    
}

export default memo(BootstrapTable);