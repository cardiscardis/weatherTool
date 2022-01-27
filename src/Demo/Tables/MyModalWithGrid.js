import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal'
import {Form, Container, Row, Col, Button} from 'react-bootstrap';


//----------------------------------------
const SortOrderControlComponent = (props) => {
  let filtercontrol = props.filtercontrol;
  return (
      <div className="card" style={{height: 'auto', borderBottom: '0.5px solid gray'}}>
        <div className="card-body">                    
          <Row>
              <Col md={6} xl={6}>{'Order By:'}
                  <Form.Control size="md" as="select" className="mb-3 col-12" name={props.data && props.data.sortFieldID} value={props.data && props.data.sortFieldVal} onChange={(e) => props.onChange(e)}>
                      {filtercontrol === 'Annual Sort' ?                       
                          <><option>Select</option>
                          <option>year</option>
                          <option>rainfall_amount</option></>
                      : filtercontrol === 'H1H2Q1Q4 Sort' ? 
                          <><option>Select</option>
                          <option>q1</option>
                          <option>q2</option>
                          <option>q3</option>
                          <option>q4</option>
                          <option>h1</option>
                          <option>h2</option>
                          <option>annual</option></>
                      : filtercontrol === 'Seasonal Sort' ? 
                          <><option>Select</option>
                          <option>from</option>
                          <option>to</option>
                          <option>winter</option>
                          <option>spring</option>
                          <option>summer</option>
                          <option>autumn</option></>
                      : filtercontrol === 'Monthly Sort' ? 
                          <><option>Select</option>
                          <option>year</option>
                          <option>jan</option>
                          <option>feb</option>
                          <option>mar</option>
                          <option>apr</option>
                          <option>may</option>
                          <option>jun</option>
                          <option>jul</option>
                          <option>aug</option>
                          <option>sep</option>
                          <option>oct</option>
                          <option>nov</option>
                          <option>dec</option>
                          <option>annual</option></>
                      : filtercontrol === 'OJ Index Sort' ? 
                          <><option>Select</option>                          
                          <option>aj</option>
                          <option>sj</option>
                          <option>oj</option></> : null}
                  </Form.Control>
              </Col>
              <Col md={6} xl={6}>{'Sort Type:'}
                  <Form.Control size="md" as="select" className="mb-3 col-12" name={props.data && props.data.sortTypeID} value={props.data && props.data.sortTypeVal} onChange={(e) => props.onChange(e)}>
                      <option>Ascending</option>
                      <option>Descending</option>
                  </Form.Control>
              </Col>              
          </Row>                                            
        </div>
    </div>
  )       
}
//----------------------------------------


function MyModalWithGrid(props) {

  let { filtercontrol, tabledata, settabledata, onHide, show } = props;
  
  let sortableObj = {sortFieldID: 'sortField-1', sortTypeID: 'sortType-1', sortFieldVal: 'Select', sortTypeVal: 'Ascending'};
  
  const [ sortControlList, setSortControlList ] = useState([sortableObj]);
  //console.log(sortControlList);

  const handleAdd = async (e) => {
    if (!sortControlList.length) {
      let sortableObj = {sortFieldID: 'sortField-1', sortTypeID: 'sortType-1', sortFieldVal: 'Select', sortTypeVal: 'Ascending'};
      setSortControlList([sortableObj]);    
    } else if (sortControlList.length && sortControlList[sortControlList.length - 1].sortFieldVal !== 'Select') {
      let stateCopy = [...sortControlList];      
      let lastVal = stateCopy[sortControlList.length - 1].sortFieldID.split('-');
      let sortableObj = [...stateCopy, {sortFieldID: 'sortField-' + Number(lastVal[1] + 1), sortTypeID: 'sortType-' + Number(lastVal[1] + 1), sortFieldVal: 'Select', sortTypeVal: 'Ascending'}];
      setSortControlList(sortableObj);                    
    } else alert('You must finish setting up the current sort order before adding a new one!');
  }
  
  
  const handleRemove = (e) => {
    if (!sortControlList.length) {
      alert('Nothing to remove');
      return false;      
    }
    setSortControlList([...sortControlList].splice(0, sortControlList.length - 1));  
  }
  
  
  const onChange =  async (e) => {        
    let scl = [...sortControlList];
    let updatedData = [];
    let isRepeated = false;
    for (let sc of scl) {      
      if (sc.sortFieldVal === e.target.value) {        
        isRepeated = true;
        break;        
      }
    }

    if (isRepeated) {
      alert('Sort column already chosen! Current sort order will not be considered!');      
      return false;
    }
    
    if (e.target.name.includes('sortField')) {
      //sc = await scl.find((s) => s.sortFieldID === e.target.name); items[items.findIndex(el => el.id === item.id)] = {...sc, sortFieldVal: e.target.value};
      updatedData = await scl.map(s => (s.sortFieldID === e.target.name ? {...s, sortFieldVal: e.target.value} : s));    
    } else if (e.target.name.includes('sortType')) {
      updatedData = await scl.map(s => (s.sortTypeID === e.target.name ? {...s, sortTypeVal: e.target.value} : s));    
    }
    setSortControlList([...updatedData]);
  }

  const onSort = (e) => {
    let expression = [];
    for (let obj of sortControlList) {
      if (obj.sortTypeVal === 'Ascending' && obj.sortFieldVal !== 'Select') expression.push(`a['${obj.sortFieldVal}'] - b['${obj.sortFieldVal}']`)
      else if (obj.sortTypeVal === 'Descending' && obj.sortFieldVal !== 'Select') expression.push(`b['${obj.sortFieldVal}'] - a['${obj.sortFieldVal}']`);
      else continue;
    }
    expression = expression.join('||');
    //console.log(expression);
    let td = tabledata.sort((a, b) => eval(expression),);
    settabledata(td);
    //console.log(td);
    onHide()
  }

  return (
    <Modal show={show} onHide={onHide} animation={false} centered size="lg" aria-labelledby="contained-modal-title-vcenter">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Custom Sort
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="show-grid">
        <Container>          
          <Row>
            <Col>            
              {sortControlList.length ? sortControlList.map((d, i) => (<SortOrderControlComponent key={i} data={d} onChange={onChange} filtercontrol={filtercontrol} />)) : null}
            </Col>
          </Row>  
          <Row>
            <Col md={6} xl={6}>
                <button className="btn btn-primary btn-block" onClick={(e) => {handleAdd(e)}}><i className='fa fa-plus'></i></button>
            </Col>
            <Col md={6} xl={6}>
                <button className="btn btn-danger btn-block" onClick={(e) => {handleRemove(e)}}><i className='fa fa-minus'></i></button>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onSort}>Sort</Button>
      </Modal.Footer>
    </Modal>
  );
}
  
export default MyModalWithGrid;