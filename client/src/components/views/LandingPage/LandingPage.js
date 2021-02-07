import React, { useEffect, useState } from 'react'
import Axios from 'axios';
import {Card,Icon,Col,Row, Carousel} from 'antd'
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider';

function LandingPage() {
    const [Products, setProducts] = useState([]);
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState(0) // 목록에 보이는 배열 갯수

    useEffect(() => {
        //필터값이 들어간 바디
        let body = {
            skip : Skip,
            limit : Limit,
        }
        getProducts(body)
    }, [])

    const getProducts =(body)=>{
        Axios.post("/api/product/products",body)
        .then(response=>{
            if(response.data.success){
                if(body.loadMore){ //더보기를 눌렀을 경우
                    //기존 배열에 스프레드 오퍼레이터를 써서 붙여줌
                    setProducts([...Products,...response.data.productsInfo])
                }else{
                    setProducts(response.data.productsInfo)
                }
                setPostSize(response.data.postSize) //더보기 버튼을 보여줄지 말지
            }else{
                alert("상품을 불러오는데 실패하였습니다.")
            }
        })
    }

    const loadMoreHandler=()=>{
        //SKIP과 LIMIT은 State로 관리
        //버튼을 누를때마다 Skip을 관리해서 값을 던져움

        let skip = Skip+Limit;

        let body = {
            skip : skip,
            limit : Limit,
            loadMore : true
        }
        getProducts(body)
        setSkip(skip);
    }

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
            {PostSize >= Limit &&
                <div style={{justifyContent:'center'}}>
                    <button onClick={loadMoreHandler}>더보기</button>
                </div>
            }
            

        </div>
    )
}

export default LandingPage
