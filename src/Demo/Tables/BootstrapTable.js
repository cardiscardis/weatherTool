import React from 'react';
import {Row, Col, Card, Table} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";

const BootstrapTable = (props) => {

    let monthly = props.monthly || [];
    let data = props.data || [];
    let annual = props.annual || [];

    return (
        annual.length ? 
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