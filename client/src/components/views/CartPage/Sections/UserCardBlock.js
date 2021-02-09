import React from 'react'
import "./UserCardBlock.css"

function UserCardBlock(props) {

    const renderCartImage=(images)=>{
        if(images.length>0){
            let image = images[0]
            return `http://localhost:5000/${image}`
        }
    }

    const renderItems = ()=>(
        props.products && props.products.map((product,i)=>(
            <tr key={i}>
                <td>
                    {/* 이미지가 2개이상 있을수도 있어서 헬퍼메서드 사용 */}
                    <img src={renderCartImage(product.images)} style={{width:'70px'}} alt="product"/>
                </td>
                <td>
                    {product.quantity} EA
                </td>
                <td>
                    $ {product.price}
                </td>
                <td>
                    <button
                        onClick={()=>props.removeItem(product._id)}
                    >
                        REMOVE
                    </button>
                </td>
            </tr>
        ))
    )

    return (
        <div>
            <table>
                <thead>
                    <th>Product Image</th>
                    <th>Product Quantity</th>
                    <th>Product price</th>
                    <th>Remove From Cart</th>
                </thead>
                <tbody>
                    {renderItems()}
                </tbody>
            </table>
        </div>
    )
}

export default UserCardBlock
