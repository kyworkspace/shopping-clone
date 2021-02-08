import React, { useEffect, useState } from 'react'
import Axios from 'axios';
import {Card,Icon,Col,Row} from 'antd'
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider';
import CheckBox from './Sections/CheckBox';
import {continents, prices} from './Sections/Datas';
import RadioBox from './Sections/RadioBox';
import SearchFeatures from './Sections/SearchFeatures';

function LandingPage() {
    const [Products, setProducts] = useState([]);
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState(0) // 목록에 보이는 배열 갯수
    const [Filters, setFilters] = useState({
        continents:[],
        price : []
    });
    const [SearchTerm, setSearchTerm] = useState("")

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
        return (
            <Col  key = {i} lg={6} md={8} xs={24}>
                <Card 
                    cover={<a href={`/product/${product._id}`}> <ImageSlider images={product.images}/> </a>}
                >
                    <Meta
                        title ={product.title}
                        description={`$${product.price}`}
                    />
                </Card>
            </Col>
            
        )
    });

    //  Filter
    const handlerFilters = (filters,category) => {
        //넘어오는 값이 filters임
        const newFilters = {...Filters};

        if(category==="price"){
            let priceValues = handlePrice(filters)
            newFilters[category] = priceValues
        }else{
            newFilters[category] = filters
        }
        showFilterResults(newFilters);
        //필터 보존
        setFilters(newFilters)
    }
    const handlePrice =(filterValue)=>{
        const data = prices;
        let array = [];
        for(let key in data){
            if(data[key]._id==parseInt(filterValue,10)){
                array = data[key].array;
            }
        }
        return array;
    }
    const showFilterResults =(filters)=>{
        let body = {
            skip : 0, //새로 하는 것이기 때문에 0부터 시작
            limit : Limit,
            filters : filters
        }
        getProducts(body)
        setSkip(0);
    }
    const updateSearchTerm =(newSearchTerm)=>{
        setSearchTerm(newSearchTerm);

        let body={
            skip : 0, //새로 하는 것이기 때문에 0부터 시작
            limit : Limit,
            filters : Filters,
            searchTerm : newSearchTerm,
        }
        getProducts(body)
        setSkip(0);
    }

    return (
        <div style={{width:'75%', margin:'3rem auto'}}>
            <div style={{textAlign:'center'}}>
                <h2>여행상품 목록<Icon type="rocket"/></h2>
            </div>
            {/* Filter */}
            
            <Row gutter={[16,16]}>
                <Col lg={12} xs={24}>
                    {/* CheckBox */}
                    < CheckBox list={continents} handlerFilters={filter=>handlerFilters(filter,"continents")}/>
                </Col>
                <Col lg={12} xs={24}>
                    {/* RadioBox */}
                    <RadioBox list={prices} handlerFilters={filter=>handlerFilters(filter,"price")}/>
                </Col>
            </Row>
            {/* Search */}
            <div style={{display:'flex',justifyContent:'flex-end', margin:'1rem auto'}}>
                <SearchFeatures refreshFunction={updateSearchTerm}/>
            </div>
            

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
