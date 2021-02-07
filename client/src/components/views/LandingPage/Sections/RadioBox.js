import React, { useState } from 'react'
import {Collapse, Radio} from 'antd';
const {Panel} = Collapse ;


function RadioBox(props) {

    const [Value, setValue] = useState(0)

    const renderRadioBox=() =>props.list && props.list.map((item,i)=>(
        <React.Fragment>
                <Radio key = {item._id} value={item._id}>{item.name}</Radio>
        </React.Fragment>
    ))
    const handleChange = (e) =>{
        setValue(e.target.value)
        props.handlerFilters(e.target.value)
    }

    return (
        <div>
            <Collapse defaultActiveKey={['1']}>
                <Panel header="Price">
                    <Radio.Group onChange={handleChange} value={Value}>
                    {renderRadioBox()}
                    </Radio.Group>
                </Panel>
            </Collapse>            
        </div>
    )
}

export default RadioBox
