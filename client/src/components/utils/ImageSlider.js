import { Carousel } from 'antd'
import React, { useState } from 'react'

function ImageSlider(props) {

    const [Images, setImages] = useState([]);

    return (
        <div>
            <Carousel autoplay>
                {props.images.map((image,i)=>(
                    <div key={i}>
                        <img src={`http://localhost:5000/${image}`} style={{width:'100%',maxHeight:'150px'}}/>
                    </div>
                ))}
            </Carousel>
        </div>
        
    )
}

export default ImageSlider
