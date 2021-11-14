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