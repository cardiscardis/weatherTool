import React, { useState } from 'react';
import {Button, Row, Col, Card, Table} from 'react-bootstrap';

import './styles.css';
import Aux from "../../hoc/_Aux";
import MyModalWithGrid from './MyModalWithGrid';
//import MultiBarChart from '../Charts/Nvd3Chart/LineChart';

const useSortableData = (items, config = null) => {  
  const [sortConfig, setSortConfig] = React.useState(config);

  const sortedItems = React.useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);


  const requestSort = (key) => {
    let direction = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig, setSortConfig };
};


const SortTable = (props) => {
  //const afterSortHandle = props.afterSortHandle;
  const filterControl = props.filterControl;
  
  let data = [];
  
  (filterControl === 'OJ Index Sort' && props.ojs) ? data = props.ojs
  : (filterControl === 'H1H2Q1Q4 Sort' && props.hqs) ? data = props.hqs
  : (filterControl === 'Seasonal Sort' && props.ss) ? data = props.ss
  : (filterControl === 'Monthly Sort' && props.ms) ? data = props.ms
  : (filterControl === 'Annual Sort' && props.as) ? data = props.as
  : data = [];
  
  const [modalShow, setModalShow] = useState(false);
  const [ tableData, setTableData ] = useState(data);  
  
  
  //console.log(tableData);
  const { items, requestSort, sortConfig, setSortConfig } = useSortableData(tableData);

  const std = (td) => {        
    setSortConfig(null);
    setTableData(td);
  }
  
  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  /**React.useEffect(() => {
    let mainData = {}
    if (filterControl === 'H1H2Q1Q4 Sort') {
      
      mainData.q1 = [];
      mainData.q2 = [];
      mainData.q3 = [];
      mainData.q4 = [];
      mainData.h1 = [];
      mainData.h2 = [];
  
      for (let data of items) {              
        mainData.q1.push({x: data.year[0], y: Number(data.q1)});
        mainData.q2.push({x: data.year[0], y: Number(data.q2)});
        mainData.q3.push({x: data.year[0], y: Number(data.q3)});
        mainData.q4.push({x: data.year[0], y: Number(data.q4)});
        mainData.h1.push({x: data.year[0], y: Number(data.h1)});
        mainData.h2.push({x: data.year[0], y: Number(data.h2)});
      }
    } else if (filterControl === 'Seasonal Sort') {
  
    }
    props.setMainState({...props.mainState, mainData});
  }, [filterControl, items, props]);
 */
  
  
  //console.log(items);
  //console.log(chartState);
/*
 

  if (ojiControl && items.length) {
    
    if (ojiControl === 'OJ') {      
      for (let data of items) {
        const yearFrom = data.yearFrom.split('-');
        sortGraphsData.push({x: `${yearFrom[0]}.${yearFrom[1]}`, y: data.oj});
      }
    } else if (ojiControl === 'AJ') {
      for (let data of items) {
        const yearFrom = data.yearFrom.split('-');
        sortGraphsData.push({x: `${yearFrom[0]}.${yearFrom[1]}`, y: data.aj});
      }
    } else if (ojiControl === 'SJ') {
      for (let data of items) {
        const yearFrom = data.yearFrom.split('-');
        sortGraphsData.push({x: `${yearFrom[0]}.${yearFrom[1]}`, y: data.sj});
      }
    }
    //setMainChartState(sortGraphsData);
  }
  console.log(sortGraphsData);
*/
  return (
    filterControl === 'OJ Index Sort' ?
    <Aux>
      <Row>
        <Col>
          <Card>
              <Card.Header>
                <Card.Title as="h5">OJ Index Sort</Card.Title>
                  <Row>
                    <Col xl={8} md={8}>
                      <span className="d-block m-t-5"><code>-1</code> means <code>no data recorded. Click on the colored headers to sort.</code></span>
                    </Col>
                    <Col xl={4} md={4} className='text-center'>
                      <span>                    
                        <Button variant="primary left-align align-left" onClick={() => setModalShow(true)}>
                          Custom Sort
                        </Button>
                      </span>                  
                    </Col>                 
                  </Row>
              </Card.Header>
              <Card.Body>
                <>
                  <MyModalWithGrid show={modalShow} onHide={() => setModalShow(false)} filtercontrol={filterControl} tabledata={items} settabledata={(td) => std(td)} />
                </>
                {filterControl === 'OJ Index Sort' ? <Table striped responsive className='text-center'>
                  {/*<caption>Products</caption>*/}
                  <thead>
                    <tr>
                      <th>#</th>
                      <th><button
     //                     type="button"
                          onClick={() => requestSort('yearFrom')}
                          className={getClassNamesFor('yearFrom')}
                        >
                          {'From '}
                        </button></th>
                      <th>
                        <button
     //                     type="button"
                          onClick={() => requestSort('aj')}
                          className={getClassNamesFor('aj')}
                        >
                          {'AJ '}
                        </button>
                      </th>
                      <th>
                        <button
       //                   type="button"
                          onClick={() => requestSort('sj')}
                          className={getClassNamesFor('sj')}
                        >
                          {'SJ '}
                        </button>
                      </th>
                      <th>
                        <button
         //                 type="button"
                          onClick={() => requestSort('oj')}
                          className={getClassNamesFor('oj')}
                        >
                          {'OJ '}
                        </button>
                      </th>
                      <th>CuttOff</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((d, i) => (
                      <tr key={i}>
                        <th scope="row">{i + 1}</th>
                          <td>{d && d.yearFrom}</td>                                    
                          <td>{d && Number(d.aj).toFixed(2)}</td>
                          <td>{d && Number(d.sj).toFixed(2)}</td>                                    
                          <td>{d && Number(d.oj).toFixed(2)}</td>                                    
                          <td>{80}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table> : null}
              </Card.Body>
                </Card>
            </Col>
        </Row>        
    </Aux>
    : filterControl === 'Monthly Sort' ?
    <Aux>
      <Row>
        <Col>
          <Card>
              <Card.Header>
                <Card.Title as="h5">Monthly Sort Data</Card.Title>
                  <Row>
                    <Col xl={8} md={8}>
                      <span className="d-block m-t-5"><code>-1</code> means <code>no data recorded. Click on the colored headers to sort.</code></span>
                    </Col>
                    <Col xl={4} md={4} className='text-center'>
                      <span>                    
                        <Button variant="primary left-align align-left" onClick={() => setModalShow(true)}>
                          Custom Sort
                        </Button>
                      </span>                  
                    </Col>                 
                  </Row>
              </Card.Header>
              <Card.Body>
                <>
                  <MyModalWithGrid show={modalShow} onHide={() => setModalShow(false)} filtercontrol={filterControl} tabledata={items} settabledata={(td) => std(td)} />
                </>
                <Table striped responsive className='text-center'>
                <thead>
                <tr>
                    <th>#</th>
                    <th><button
     //                     type="button"
                          onClick={() => requestSort('year')}
                          className={getClassNamesFor('year')}
                        >
                          {'Year '}
                        </button></th>
                    <th><button
     //                     type="button"
                          onClick={() => requestSort('jan')}
                          className={getClassNamesFor('jan')}
                        >
                          {'Jan '}
                        </button></th>
                    <th><button
     //                     type="button"
                          onClick={() => requestSort('feb')}
                          className={getClassNamesFor('feb')}
                        >
                          {'Feb '}
                        </button></th>
                    <th><button
     //                     type="button"
                          onClick={() => requestSort('mar')}
                          className={getClassNamesFor('mar')}
                        >
                          {'Mar '}
                        </button></th>          
                    <th><button
     //                     type="button"
                          onClick={() => requestSort('apr')}
                          className={getClassNamesFor('apr')}
                        >
                          {'Apr '}
                        </button></th>           
                    <th><button
     //                     type="button"
                          onClick={() => requestSort('may')}
                          className={getClassNamesFor('may')}
                        >
                          {'May '}
                        </button></th>
                    <th><button
     //                     type="button"
                          onClick={() => requestSort('jun')}
                          className={getClassNamesFor('jun')}
                        >
                          {'Jun '}
                        </button></th>
                    <th><button
     //                     type="button"
                          onClick={() => requestSort('jul')}
                          className={getClassNamesFor('jul')}
                        >
                          {'Jul '}
                        </button></th>
                    <th><button
     //                     type="button"
                          onClick={() => requestSort('aug')}
                          className={getClassNamesFor('aug')}
                        >
                          {'Aug '}
                        </button></th>
                    <th><button
     //                     type="button"
                          onClick={() => requestSort('sep')}
                          className={getClassNamesFor('sep')}
                        >
                          {'Sep '}
                        </button></th>
                    <th><button
     //                     type="button"
                          onClick={() => requestSort('oct')}
                          className={getClassNamesFor('oct')}
                        >
                          {'Oct '}
                        </button></th>
                    <th><button
     //                     type="button"
                          onClick={() => requestSort('nov')}
                          className={getClassNamesFor('nov')}
                        >
                          {'Nov '}
                        </button></th>
                    <th><button
     //                     type="button"
                          onClick={() => requestSort('dec')}
                          className={getClassNamesFor('dec')}
                        >
                          {'Dec '}
                        </button></th>
                    <th><button
     //                     type="button"
                          onClick={() => requestSort('annual')}
                          className={getClassNamesFor('annual')}
                        >
                          {'Annual '}
                        </button></th>
                </tr>
                </thead>
                <tbody>
                {items.map((d, i) => (<tr key={i}>
                    <th scope="row">{i + 1}</th>
                    <td>{d.year}</td>
                    <td>{Number(d.jan).toFixed(2) || -1}</td>
                    <td>{Number(d.feb).toFixed(2) || -1}</td>
                    <td>{Number(d.mar).toFixed(2) || -1}</td>                                    
                    <td>{Number(d.apr).toFixed(2) || -1}</td>                                    
                    <td>{Number(d.may).toFixed(2) || -1}</td>
                    <td>{Number(d.jun).toFixed(2) || -1}</td>
                    <td>{Number(d.jul).toFixed(2) || -1}</td>
                    <td>{Number(d.aug).toFixed(2) || -1}</td>
                    <td>{Number(d.sep).toFixed(2) || -1}</td>
                    <td>{Number(d.oct).toFixed(2) || -1}</td>
                    <td>{Number(d.nov).toFixed(2) || -1}</td>
                    <td>{Number(d.dec).toFixed(2) || -1}</td>
                    <td>{Number(d.annual).toFixed(2) || -1}</td>
                </tr>))}                                
                </tbody>
                </Table>
              </Card.Body>
                </Card>
            </Col>
        </Row>
    </Aux>
    : filterControl === 'Seasonal Sort' ?
    <Aux>
      <Row>
        <Col>
          <Card>
              <Card.Header>
                <Card.Title as="h5">Seasonal Sort</Card.Title>
                  <Row>
                    <Col xl={8} md={8}>
                      <span className="d-block m-t-5"><code>-1</code> means <code>no data recorded. Click on the colored headers to sort.</code></span>
                    </Col>
                    <Col xl={4} md={4} className='text-center'>
                      <span>                    
                        <Button variant="primary left-align align-left" onClick={() => setModalShow(true)}>
                          Custom Sort
                        </Button>
                      </span>                  
                    </Col>                 
                  </Row>
              </Card.Header>
              <Card.Body>
                <>
                  <MyModalWithGrid show={modalShow} onHide={() => setModalShow(false)} filtercontrol={filterControl} tabledata={items} settabledata={(td) => std(td)} />
                </>
                <Table striped responsive className='text-center'>
                <thead>                
                <tr>
                  <th>#</th>
                  <th><button
    //                     type="button"
                        onClick={() => requestSort('from')}
                        className={getClassNamesFor('from')}
                      >
                        {'From '}
                      </button></th>
                  <th><button
    //                     type="button"
                        onClick={() => requestSort('to')}
                        className={getClassNamesFor('to')}
                      >
                        {'To '}
                      </button></th>
                  <th><button
    //                     type="button"
                        onClick={() => requestSort('winter')}
                        className={getClassNamesFor('winter')}
                      >
                        {'Winter '}
                      </button></th>
                  <th><button
    //                     type="button"
                        onClick={() => requestSort('spring')}
                        className={getClassNamesFor('spring')}
                      >
                        {'Spring '}
                      </button></th>          
                  <th><button
    //                     type="button"
                        onClick={() => requestSort('summer')}
                        className={getClassNamesFor('summer')}
                      >
                        {'Summer '}
                      </button></th>           
                      <th><button
    //                     type="button"
                        onClick={() => requestSort('autumn')}
                        className={getClassNamesFor('autumn')}
                      >
                        {'Autumn '}
                      </button></th>           
                  
                </tr>
                </thead>
                <tbody>
                  {items.map((d, i) => (<tr key={i}>
                      <th scope="row">{i + 1}</th>
                      <td>{d.from}</td>
                      <td>{d.to}</td>                                      
                      <td>{Number(d.winter).toFixed(2) || -1}</td>
                      <td>{Number(d.spring).toFixed(2) || -1}</td>
                      <td>{Number(d.summer).toFixed(2) || -1}</td>
                      <td>{Number(d.autumn).toFixed(2) || -1}</td>                                     
                  </tr>))}                                
                  </tbody>
                </Table>
              </Card.Body>
                </Card>
            </Col>
        </Row>
    </Aux>
    : filterControl === 'H1H2Q1Q4 Sort' ?
    <Aux>
      <Row>
        <Col>
          <Card>
              <Card.Header>
                <Card.Title as="h5">H1H2Q1Q4 Sort Data</Card.Title>
                  <Row>
                    <Col xl={8} md={8}>
                      <span className="d-block m-t-5"><code>-1</code> means <code>no data recorded. Click on the colored headers to sort.</code></span>
                    </Col>
                    <Col xl={4} md={4} className='text-center'>
                      <span>                    
                        <Button variant="primary left-align align-left" onClick={() => setModalShow(true)}>
                          Custom Sort
                        </Button>
                      </span>                  
                    </Col>                 
                  </Row>
              </Card.Header>
              <Card.Body>
                <>
                  <MyModalWithGrid show={modalShow} onHide={() => setModalShow(false)} filtercontrol={filterControl} tabledata={items} settabledata={(td) => std(td)} />
                </>
                <Table striped responsive className='text-center'>
                <thead>                 
                <tr>
                  <th>#</th>
                  <th><button
    //                     type="button"
                        onClick={() => requestSort('year')}
                        className={getClassNamesFor('year')}
                      >
                        {'Year '}
                      </button></th>
                  <th><button
    //                     type="button"
                        onClick={() => requestSort('q1')}
                        className={getClassNamesFor('q1')}
                      >
                        {'Q1 '}
                      </button></th>
                  <th><button
    //                     type="button"
                        onClick={() => requestSort('q2')}
                        className={getClassNamesFor('q2')}
                      >
                        {'Q2 '}
                      </button></th>
                  <th><button
    //                     type="button"
                        onClick={() => requestSort('q3')}
                        className={getClassNamesFor('q3')}
                      >
                        {'Q3 '}
                      </button></th>          
                  <th><button
    //                     type="button"
                        onClick={() => requestSort('q4')}
                        className={getClassNamesFor('q4')}
                      >
                        {'Q4 '}
                      </button></th>           
                      <th><button
    //                     type="button"
                        onClick={() => requestSort('h1')}
                        className={getClassNamesFor('h1')}
                      >
                        {'H1 '}
                      </button></th>           
                      <th><button
    //                     type="button"
                        onClick={() => requestSort('h2')}
                        className={getClassNamesFor('h2')}
                      >
                        {'H2 '}
                      </button></th>           
                      <th><button
    //                     type="button"
                        onClick={() => requestSort('annual')}
                        className={getClassNamesFor('annual')}
                      >
                        {'Annual '}
                      </button></th>                             
                </tr>
                </thead>
                <tbody>
                  {items.map((d, i) => (<tr key={i}>
                      <th scope="row">{i + 1}</th>
                      <td>{d.year}</td>                                                                        
                      <td>{Number(d.q1).toFixed(2) || -1}</td>
                      <td>{Number(d.q2).toFixed(2) || -1}</td>
                      <td>{Number(d.q3).toFixed(2) || -1}</td>
                      <td>{Number(d.q4).toFixed(2) || -1}</td>
                      <td>{Number(d.h1).toFixed(2) || -1}</td>
                      <td>{Number(d.h2).toFixed(2) || -1}</td>
                      <td>{Number(d.annual).toFixed(2) || -1}</td>
                  </tr>))}                                
                  </tbody>
                </Table>
              </Card.Body>
                </Card>
            </Col>
        </Row>
        
    </Aux>
    :<Aux>
      {/*<Row>
          <UserChoiceInput />
      </Row>*/}
      <Row>
          <Col xl={12} md={12}>
              <Card>
                  <Card.Header>
                      <Card.Title as="h5">Error!</Card.Title>
                      {/*<span className="d-block m-t-5"><code>-1</code> means <code>no data recorded</code></span>*/}
                  </Card.Header>
                  <Card.Body>
                  {'No Data To Display. Consider Selecting Another Year, Choosing Another Filter or Reloading the Page to Continue.'}
                  </Card.Body>
              </Card>
          </Col>
      </Row>            
    </Aux>
  );
};


export default SortTable;