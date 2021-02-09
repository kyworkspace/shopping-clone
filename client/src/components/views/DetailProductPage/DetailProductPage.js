import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import ProductImage from './Sections/ProductImage';
import ProductInfo from './Sections/ProductInfo';
import {Row,Col} from 'antd';

function DetailProductPage(props) {

    const productId = props.match.params.productId;

    //정보가 오브젝트 이기 때문에 {}로 받음
    const [Product, setProduct] = useState({});

    useEffect(() => {
        //url에서 유니크값을 가져와야함
        Axios.get(`/api/product/product_by_id?id=${productId}&type=single`)
        .then(response=>{
            setProduct(response.data[0]);
        })
        .catch(err=>alert(err))
        
    }, [])
    return (
        <div style={{ width :'100%', padding: '3rem 4rem'}}>
            <div style={{display:'flex', justifyContent:'center'}}>
                <h1>{Product.title}</h1>
            </div>
            <br/>
            <Row gutter={[16,16]}>
                <Col lg={12} sm={24}>
                    {/* Product Image */}
                    <ProductImage detail={Product}/>    
                </Col>
                <Col  lg={12} sm={24}>
                    {/* Product Info */}
                    <ProductInfo detail={Product}/>
                </Col>
            </Row>
        </div>
    )
}

export default DetailProductPage
