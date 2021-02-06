import React, { useState } from 'react'
import {Typography,Button,Form,Input} from 'antd';
import FileUpload from '../../utils/FileUpload';
import Axios from 'axios';

const {Title} = Typography;
const {TextArea} = Input;
const Continents=[
    {key:1, value:"Africa"},
    {key:2, value:"Europe"},
    {key:3, value:"Asia"},
    {key:4, value:"North America"},
    {key:5, value:"South America"},
    {key:6, value:"Austrailia"},
    {key:7, value:"Antarctica"}
]

function UploadProductPage(props) {
    const [Name, setName] = useState("");
    const [Description, setDescription] = useState("");
    const [Price, setPrice] = useState(0);
    const [Continent, setContinent] = useState(1);
    const [Image, setImage] = useState([]);


    const TitileHandler=(e)=>{
        setName(e.currentTarget.value);
    }
    const DescriptionHandler=(e)=>{
        setDescription(e.currentTarget.value);
    }
    const PriceHandler=(e)=>{
        setPrice(e.currentTarget.value);
    }
    const ContinentHandler =(e)=>{
        setContinent(e.currentTarget.value)
    }

    const updateImages=(newImages)=>{
        setImage(newImages);
    }
    const submitHandler=(event)=>{
        event.preventDefault();
        if(!Name || !Description || !Image || !Price || !Continent){
            return alert("모든 값이 입력되어야 합니다.");
        }
        
        const body={
            writer : props.user.userData._id,
            title : Name,
            description : Description,
            images : Image,
            price : Price,
            continents : Continent
            
        }
        //서버에 값 전달
        Axios.post("/api/product",body)
        .then(response=>{
            if(response.data.success){
                alert("상품업로드에 성공했습니다.")
                props.history.push("/");
            }else{
                alert("상품업로드에 실패했습니다.")
            }
        })
        

    }

    return (
        <div style={{maxWidth:'700px' , margin:'2rem auto'}}>
            <div style={{textAlign:'center', marginBottom:'2rem'}}>
                <Title>여행 상품 업로드</Title>
            </div>
            <Form onSubmit={submitHandler}>
                {/* DROP ZONE */}
                <FileUpload refreshFunction={updateImages}/>
                <br/>
                <br/>
                <label>이름</label>
                <Input  value={Name} onChange={TitileHandler}/>
                <br/>
                <br/>
                <label>설명</label>
                <TextArea value={Description} onChange={DescriptionHandler}/>
                <br/>
                <br/>
                <label>가격($)</label>
                <Input type="number" value={Price} onChange={PriceHandler}/>
                <br/>
                <br/>
                <select onChange={ContinentHandler} value={Continent}>
                    {Continents.map((item,i)=>(
                        <option key={item.key} value={item.key}>{item.value}</option>
                    ))}
                </select >
                <br/>
                <br/>
                <Button type="submit" onClick={submitHandler}>
                    확인
                </Button>

            </Form>
            
        </div>
    )
}

export default UploadProductPage
