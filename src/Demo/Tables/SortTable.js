import React, { useState, useLayoutEffect } from 'react';
import {Button, OverlayTrigger, Tooltip, Row, Col, Card, Table, Form} from 'react-bootstrap';

import './styles.css';
import Aux from "../../hoc/_Aux";
import UcFirst from "../../App/components/UcFirst";
import MyModalWithGrid from './MyModalWithGrid';
import MultiBarChart from '../Charts/Nvd3Chart/MultiBarChart';
import LineChart from '../Charts/Nvd3Chart/LineChart';

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
  
  let filterControl = props.filterControl;
  let seasonControl = props.seasonControl;
  let monthlyControl = props.monthlyControl;
  let annualAvg = props.annualAvg || ''; //annual avg filter data
  
  let data = [];
  
  (filterControl === 'OJ Index Sort' && props.ojs) ? data = [...props.ojs]
  : (filterControl === 'H1H2Q1Q4 Sort' && props.hqs) ? data = props.hqs
  : (filterControl === 'Seasonal Sort' && props.ss) ? data = props.ss
  : (filterControl === 'Monthly Sort' && props.ms) ? data = props.ms
  : (filterControl === 'Annual Sort' && props.as) ? data = props.as
  : data = [];
  
  const [modalShow, setModalShow] = useState(false);
  const [ tableData, setTableData ] = useState(data);  
  const [ mainState, setMainState ] = useState({})

  const [ annualSortControl1, setAnnualSortControl1 ] = useState('Select Year');
  const [ annualSortControl2, setAnnualSortControl2 ] = useState('Select Year');      
  const [ arrOfKeys, setArrOfKeys ] = useState([]);
  const [ annualAvg2, setAnnualAvg2 ] = useState([]);
  const [ obj, setObj ] = useState([]);
  const [ annualSortHideProp, setAnnualSortHideProp ] = useState(false);  
  
  //console.log(tableData);
  const { items, requestSort, sortConfig, setSortConfig } = useSortableData(tableData);

  const [ as, setAs ] = useState(items);
  const [ as4, setAs4 ] = useState([]);
  //for sortable and average part of annual sort table
  const [ avg, setAvg ] = useState([]);

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

  useLayoutEffect(() => {

    const chartStateHandle = async () => {
      let mainData = {}
      let itemsCopy = [...items];
      
      if (filterControl === 'H1H2Q1Q4 Sort') {
      
        mainData.q1 = [];
        mainData.q2 = [];
        mainData.q3 = [];
        mainData.q4 = [];
        mainData.h1 = [];
        mainData.h2 = [];
    
        await itemsCopy.forEach((data) => {
          mainData.q1.push({x: data.year[0], y: Number(data.q1)});
          mainData.q2.push({x: data.year[0], y: Number(data.q2)});
          mainData.q3.push({x: data.year[0], y: Number(data.q3)});
          mainData.q4.push({x: data.year[0], y: Number(data.q4)});
          mainData.h1.push({x: data.year[0], y: Number(data.h1)});
          mainData.h2.push({x: data.year[0], y: Number(data.h2)});
        });
      } else if (filterControl === 'Seasonal Sort') {
        if (seasonControl === 'Spring') {              
          mainData.springPerYear = [];
          await itemsCopy.forEach((data) => {        
            mainData.springPerYear.push({x: `${data.from}.${data.to[2]}${data.to[3]}`, y: Number(data.spring)});
          }); 
        } else if (seasonControl === 'Winter') {             
          mainData.winterPerYear = [];
          await itemsCopy.forEach((data) => {        
            mainData.winterPerYear.push({x: `${data.from}.${data.to[2]}${data.to[3]}`, y: Number(data.winter)});
          }); 
        } else if (seasonControl === 'Summer') {          
          mainData.summerPerYear = [];
          await itemsCopy.forEach((data) => {        
            mainData.summerPerYear.push({x: `${data.from}.${data.to[2]}${data.to[3]}`, y: Number(data.summer)});
          }); 
        } else if (seasonControl === 'Autumn') {        
          mainData.autumnPerYear = [];
          await itemsCopy.forEach((data) => {        
            mainData.autumnPerYear.push({x: `${data.from}.${data.to[2]}${data.to[3]}`, y: Number(data.autumn)});
          }); 
        }
      } else if (filterControl === 'Monthly Sort') {
        mainData.monthlyGraphs = {};
        if (monthlyControl === 'January') {                       
          mainData.monthlyGraphs.g_jan = [];
          await itemsCopy.forEach((data) => {        
            mainData.monthlyGraphs.g_jan.push({x: data.year, y: Number(data.jan)});
          });
        } else if (monthlyControl === 'February') {                       
          mainData.monthlyGraphs.g_feb = [];
          await itemsCopy.forEach((data) => {        
            mainData.monthlyGraphs.g_feb.push({x: data.year, y: Number(data.feb)});
          });
        } else if (monthlyControl === 'March') {                       
          mainData.monthlyGraphs.g_mar = [];
          await itemsCopy.forEach((data) => {        
            mainData.monthlyGraphs.g_mar.push({x: data.year, y: Number(data.mar)});
          });
        } else if (monthlyControl === 'April') {                       
          mainData.monthlyGraphs.g_apr = [];
          await itemsCopy.forEach((data) => {        
            mainData.monthlyGraphs.g_apr.push({x: data.year, y: Number(data.apr)});
          });
        } else if (monthlyControl === 'May') {                       
          mainData.monthlyGraphs.g_may = [];
          await itemsCopy.forEach((data) => {        
            mainData.monthlyGraphs.g_may.push({x: data.year, y: Number(data.may)});
          });
        } else if (monthlyControl === 'June') {                       
          mainData.monthlyGraphs.g_jun = [];
          await itemsCopy.forEach((data) => {        
            mainData.monthlyGraphs.g_jun.push({x: data.year, y: Number(data.jun)});
          });
        } else if (monthlyControl === 'July') {                       
          mainData.monthlyGraphs.g_jul = [];
          await itemsCopy.forEach((data) => {        
            mainData.monthlyGraphs.g_jul.push({x: data.year, y: Number(data.jul)});
          });
        } else if (monthlyControl === 'August') {                       
          mainData.monthlyGraphs.g_aug = [];
          await itemsCopy.forEach((data) => {        
            mainData.monthlyGraphs.g_aug.push({x: data.year, y: Number(data.aug)});
          });
        } else if (monthlyControl === 'September') {                       
          mainData.monthlyGraphs.g_sep = [];
          await itemsCopy.forEach((data) => {        
            mainData.monthlyGraphs.g_sep.push({x: data.year, y: Number(data.sep)});
          });
        } else if (monthlyControl === 'October') {                       
          mainData.monthlyGraphs.g_oct = [];
          await itemsCopy.forEach((data) => {        
            mainData.monthlyGraphs.g_pct.push({x: data.year, y: Number(data.oct)});
          });
        } else if (monthlyControl === 'November') {                       
          mainData.monthlyGraphs.g_feb = [];
          await itemsCopy.forEach((data) => {        
            mainData.monthlyGraphs.g_nov.push({x: data.year, y: Number(data.nov)});
          });
        } else if (monthlyControl === 'December') {                       
          mainData.monthlyGraphs.g_dec = [];
          await itemsCopy.forEach((data) => {        
            mainData.monthlyGraphs.g_dec.push({x: data.year, y: Number(data.dec)});
          });
        }
      } else if (filterControl === 'Annual Sort') {

      }
      
      return mainData;
    }
    
    chartStateHandle().then((mainData) => {        
      setMainState(mainData);
    });
  }, [filterControl, seasonControl, items, monthlyControl]);


  //---------annual sort logic-------------    
    
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
                    
                    //for unsortable part of table
                    let as5 = [...as4];

                    //for sortable part of table                    
                    let as2 = [...as];
                    //for annualavg part of table
                    let avg2 = [];
                    let alreadyExists = false;
                    for (let z = 0; z <= as2.length - 1; z++) {
                      as5[z] = {...as5[z], [`${annualSortControl1}-${annualSortControl2}`]: '-'};
                      avg2[z] = {annualAvg: '-'};
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
                    as5[0] = {...as5[0], [`${annualSortControl1}-${annualSortControl2}`]: Number(avgresult).toFixed(2)};
                    avg2[0].annualAvg = annualAvg;

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
                    //for sortable part of table
                    setAs(as2);
                    //for unsortable part of table
                    setAs4(as5);
                    //for average and unsortable part of table
                    setAvg(avg2);
                    setArrOfKeys(avgResult);                        
                    setAnnualAvg2(annualAvg3);                    
                    setAnnualSortHideProp(true);
                    
                } else {
                    alert('Error! Wrong Selection!!');
                }
            }        
        } else {
            alert('Error! it may be that you have not selected a year range');
        }
    }


    const UserChoiceInput = () => (
        <>
        <Row>                   
            {(filterControl === 'Annual Sort') && <Col md={6} xl={6}>{'From:  '}
                <Form.Control size="lg" as="select" className="mb-3 col-12" name='annualSortControl1' value={annualSortControl1} onChange={(e) => {onChange(e)}}>
                <option>Select Year</option>
                {props.dataYears && props.dataYears.map((years, i) => <option key={i}>{years}</option>)}                    
            </Form.Control>
            </Col>}
            {(filterControl === 'Annual Sort') && <Col xl={6} md={6}>{'  To:  '}
            <Form.Control size="lg" as="select" className="mb-3 col-12" name='annualSortControl2' value={annualSortControl2} onChange={(e) => {onChange(e)}}>
                <option>Select Year</option>
                {props.dataYears && props.dataYears.map((years, i) => <option key={i}>{years}</option>)}                    
            </Form.Control>
            </Col>}
            
            {filterControl === 'Annual Sort' && <Col xl={12} md={12}>{'  '}
                <OverlayTrigger overlay={<Tooltip>{'Make sure the selected years are not the same. Do not over-use this button to avoid processing too many computation'}</Tooltip>}>
                    <Button className="mb-3 col-12" variant={'secondary'} onClick={(e) => onClick(e)}><UcFirst text={'Click Here To Compute New Average'} /></Button>
                </OverlayTrigger>
                {/*<button className="mb-3 mt-3 col-12" onClick={(e) => onClick(e)}>Compute New Selected Average</button>*/}
            </Col>}
        </Row> 
        </>
    )

    
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
                      <span className='float-right'>                    
                        <Button variant="primary float-right" onClick={() => setModalShow(true)}>
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
                      <span className='float-right'>                    
                        <Button variant="primary float-right" onClick={() => setModalShow(true)}>
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
        <Row>
          <Col xl={12} md={12}>
              {monthlyControl === 'January' && mainState && mainState.monthlyGraphs && <MultiBarChart data={mainState.monthlyGraphs.g_jan} m={'Jan'} />}
              {monthlyControl === 'February' && mainState && mainState.monthlyGraphs && <MultiBarChart data={mainState.monthlyGraphs.g_feb} m={'Feb'} />}
              {monthlyControl === 'March' && mainState && mainState.monthlyGraphs && <MultiBarChart data={mainState.monthlyGraphs.g_mar} m={'Mar'} />}
              {monthlyControl === 'April' && mainState && mainState.monthlyGraphs && <MultiBarChart data={mainState.monthlyGraphs.g_apr} m={'Apr'} />}
              {monthlyControl === 'May' && mainState && mainState.monthlyGraphs && <MultiBarChart data={mainState.monthlyGraphs.g_may} m={'May'} />}
              {monthlyControl === 'June' && mainState && mainState.monthlyGraphs && <MultiBarChart data={mainState.monthlyGraphs.g_jun} m={'Jun'} />}
              {monthlyControl === 'July' && mainState && mainState.monthlyGraphs && <MultiBarChart data={mainState.monthlyGraphs.g_jul} m={'Jul'} />}
              {monthlyControl === 'August' && mainState && mainState.monthlyGraphs && <MultiBarChart data={mainState.monthlyGraphs.g_aug} m={'Aug'} />}
              {monthlyControl === 'September' && mainState && mainState.monthlyGraphs && <MultiBarChart data={mainState.monthlyGraphs.g_sep} m={'Sep'} />}
              {monthlyControl === 'October' && mainState && mainState.monthlyGraphs && <MultiBarChart data={mainState.monthlyGraphs.g_oct} m={'Oct'} />}
              {monthlyControl === 'November' && mainState && mainState.monthlyGraphs && <MultiBarChart data={mainState.monthlyGraphs.g_nov} m={'Nov'} />}
              {monthlyControl === 'December' && mainState && mainState.monthlyGraphs && <MultiBarChart data={mainState.monthlyGraphs.g_dec} m={'Dec'} />}
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
                      <span className='float-right'>                    
                        <Button variant="primary float-right" onClick={() => setModalShow(true)}>
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
        {seasonControl === 'Winter' && mainState && mainState['winterPerYear'] && mainState['winterPerYear'].length && <Row>
            <Col xl={12} md={12}>
            <MultiBarChart winter={mainState['winterPerYear']} />
            </Col>
            </Row>}
            {seasonControl === 'Spring' && mainState && mainState['springPerYear'] && mainState['springPerYear'].length && <Row>
            <Col xl={12} md={12}>
            <MultiBarChart spring={mainState['springPerYear']} />
            </Col>
            </Row>}
            {seasonControl === 'Summer' && mainState && mainState['summerPerYear'] && mainState['summerPerYear'].length && <Row>
            <Col xl={12} md={12}>
            <MultiBarChart summer={mainState.summerPerYear} />
            </Col>
            </Row>}
            {seasonControl === 'Autumn' && mainState && mainState['autumnPerYear'] && mainState['autumnPerYear'].length && <Row>
            <Col xl={12} md={12}>
            <MultiBarChart autumn={mainState['autumnPerYear']} />
          </Col>          
        </Row>}
    </Aux>
    : filterControl === 'Annual Sort' ?
    <Aux>
      <Row>
          <Col xl={12} md={12}>
              <UserChoiceInput />
          </Col>                
      </Row>
      <Row>
        <Col xl={6} md={6}>
          <Card>
              <Card.Header>
                <Card.Title as="h5">Annual Sort</Card.Title>
                  <Row>
                    <Col xl={8} md={8}>
                      <span className="d-block m-t-5"><code>-1</code> means <code>no data recorded. Click on the colored headers to sort.</code></span>
                    </Col>
                    <Col xl={4} md={4} className='text-center'>
                      <span className='float-right'>                    
                        <Button variant="primary float-right" onClick={() => setModalShow(true)}>
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
                {as.length ? <Table striped responsive className='text-center'>
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
                        onClick={() => requestSort('rainfall_amount')}
                        className={getClassNamesFor('rainfall_amount')}
                      >
                        Monthly Precipitation  <br /> Total (millimetres){' '}
                      </button></th>
                      <th>AVG</th>
                        {(arrOfKeys && arrOfKeys.length) ? arrOfKeys.map((a, i) => (
                            <th key={i}>{a}</th>
                        )) : null}
                  </tr>
                </thead>
                <tbody>
                {items.length ? items.map((d, i) => (<tr key={i}>
                        <th scope="row">{i + 1}</th>
                        <td>{d && d.year}</td>
                        <td>{d && d.rainfall_amount}</td>
                        {(avg && avg.length) ? <td>{avg[i] && avg[i].annualAvg}</td> : null}
                        {(as4 && as4.length && arrOfKeys && arrOfKeys.length) ? arrOfKeys.map((a, j) => (
                          <td key={j}>{as4[i][a]}</td>
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
            {annualSortHideProp && <Col md={6} xl={6}>                    
              <LineChart 
                  l_data={props.lineChartData} 
                  m={'annual AVG'}
              />
              <LineChart 
                  data={props.lineChartData}
                  totalAvg={annualAvg2}                         
              />
              <LineChart 
                  data={props.lineChartData}
                  totalAvg={annualAvg2}
                  obj={obj}
              />                    
          </Col>}
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
                      <span className='float-right'>                    
                        <Button variant="primary float-right" onClick={() => setModalShow(true)}>
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
        <Row>                
                    <Col xl={12} md={12}>
                        {mainState && mainState.q1 && mainState.q1.length && <MultiBarChart q1={mainState.q1} q2={mainState.q2} q3={mainState.q3} q4={mainState.q4} />}
                    </Col>
                </Row>
                <Row>                
                    <Col xl={12} md={12}>
                        {mainState && mainState.h1 && mainState.h1.length && <MultiBarChart h1={mainState.h1} h2={mainState.h2} />}
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