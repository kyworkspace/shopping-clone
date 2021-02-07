import React, { useEffect, useState } from 'react'
import Axios from 'axios';
import {Card,Icon,Col,Row, Carousel} from 'antd'
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider';

function LandingPage() {
    const [Products, setProducts] = useState([]);

    useEffect(() => {
        let body ={
        }
        Axios.post("/api/product/products")
        .then(response=>{
            if(response.data.success){
                setProducts(response.data.productsInfo)
            }else{
                alert("상품을 불러오는데 실패하였습니다.")
            }
        })
        
        
    }, [])

    const renderCards = Products.map((product,i)=>{
        console.log(product)
        return (
            <Col  key = {i} lg={6} md={8} xs={24}>
                <Card 
                    cover={ <ImageSlider images={product.images}/> }
                >
                    <Meta
                        title ={product.title}
                        description={`$${product.price}`}
                    />
                </Card>
            </Col>
            
        )
    });


    return (
        <div style={{width:'75%', margin:'3rem auto'}}>
            <div style={{textAlign:'center'}}>
                <h2>여행상품 목록<Icon type="rocket"/></h2>
            </div>
            {/* Filter */}

            {/* Search */}

            {/* Card */}
            
            <Row gutter={[16,16]}>
                {renderCards}
            </Row>

            <div style={{justifyContent:'center'}}>
                <button>더보기</button>

            </div>

        </div>
    )
}

export default LandingPage
