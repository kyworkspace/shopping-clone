import React, { useState } from 'react'
import {Collapse, Checkbox, Row, Col} from 'antd';
const {Panel} = Collapse ;
function CheckBox(props) {
    //선택된 키값들 배열
    const [Checked, setChecked] = useState([]);

    const handleToggle =(value)=>{
        //누른것의 인덱스를 구하고
        const currentIndex = Checked.indexOf(value);
        const newChecked = [...Checked];
        if(currentIndex>-1){// 전체 checked된 State에서 현재 누른 체크박스가 이미 있다면
        //빼주고
            newChecked.splice(currentIndex,1);
        }else{
        //넣음
            newChecked.push(value);
        }
        setChecked(newChecked);
        props.handlerFilters(newChecked);
    }
    const renderCheckBoxList=() =>props.list && props.list.map((item,i)=>(
        <React.Fragment>
                <Col xl={6}>
                    <Checkbox key = {i} onChange={()=>handleToggle(item._id)} checked={Checked.indexOf(item._id)>-1 ? true:false}></Checkbox>
                    <span> {item.name} </span>
                </Col>
        </React.Fragment>
    ))

    return (
        <div>
            <Collapse defaultActiveKey={['0']}>
                <Panel header="Continents" key="1">
                    <Row gutter={[16,16]}>
                        {renderCheckBoxList()}
                    </Row>
                </Panel>
            </Collapse>
        </div>
    )
}

export default CheckBox
