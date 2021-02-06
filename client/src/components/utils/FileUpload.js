import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import {Icon} from 'antd';
import Axios from 'axios';

function FileUpload(props) {

    const [Images, setImages] = useState([]);

    const dropHandler=(files)=>{
        let formData = new FormData();
        const config ={
            header : {'content-type':'multipart/form-data'}
        }
        formData.append("file",files[0])
        Axios.post('/api/product/image',formData,config)
        .then(response=>{
            if(response.data.success){
                console.log(response.data);
                //원래 이미지에 새로운 이미지(경로)를 추가해서 붙이는 거임
                setImages([...Images,response.data.filePath])
                //부모 컴포넌트에 값 전달
                props.refreshFunction(Images);
            }else{
                alert("파일을 업로드하는데 실패하였습니다.");
            }
        })
    }
    const deleteHandler =(image)=>{
        //삭제하고자하는 이미지 인덱스
        const currentIndex = Images.indexOf(image);
        //기존 이미지 복사
        let newImages = [...Images]
        //삭제
        newImages.splice(currentIndex,1);
        //덮어씌움
        setImages(newImages)
        //부모 컴포넌트에 값 전달
        props.refreshFunction(Images);
    }


    return (
        <div style={{display:'flex', justifyContent:'space-between'}}>
            <Dropzone onDrop={dropHandler}>
            {({getRootProps, getInputProps}) => (
                <div 
                    style={{ 
                        width:300 , height:240, border : '1px solid lightgray',
                        display:'flex', alignItems:'center' , justifyContent:'center'
                    }}

                    {...getRootProps()}
                >
                    <input {...getInputProps()}/>
                    <Icon type="plus" style={{fontSize:'3rem'}}/>
                </div>
            )}
            </Dropzone>

            <div style={{display:'flex', width:'350px', height:'240px',overflow:'scroll'}}>
                {Images.map((item,index)=>(
                    <div key={index} onClick={()=>deleteHandler(item)}>
                        <img style={{minWidth:'300px', width:'300px', height:'240px'}}
                            src={`http://localhost:5000/${item}`} 
                            />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FileUpload