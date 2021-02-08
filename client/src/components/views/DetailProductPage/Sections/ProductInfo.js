import React from 'react'
import { Descriptions, Button } from 'antd';
import Axios from 'axios';
import {useDispatch} from 'react-redux'
import {addToCart} from '../../../../_actions/user_actions'
function ProductInfo(props) {
    const dispatch = useDispatch();

    const ClickHandler=()=>{
        //필요한 정보를 Cart 필드에 넣어줌
        //데이터를 백엔드에 전달하지 않고 바로 던질거임
        //리덕스로 해서 값을 던집시다.
        dispatch(addToCart(props.detail._id))
    }

    return (
        <div>
            <Descriptions title="Product Info" >
                <Descriptions.Item label="Price">{props.detail.price}</Descriptions.Item>
                <Descriptions.Item label="Sold">{props.detail.sold}</Descriptions.Item>
                <Descriptions.Item label="View">{props.detail.views}</Descriptions.Item>
                <Descriptions.Item label="Description">{props.detail.description}</Descriptions.Item>
            </Descriptions>
            <br/>
            <br/>
            <div style={{ display : 'flex' , justifyContent:'center'}}>
            <Button size="large" shape="round" type="danger" onClick={ClickHandler}>
                Add to Cart
            </Button>
            </div>
            
        </div>
    )
}

export default ProductInfo
