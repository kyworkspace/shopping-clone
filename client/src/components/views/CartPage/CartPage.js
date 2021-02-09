import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import {getCartItems,removeCartItem} from '../../../_actions/user_actions'
import UserCardBlock from './Sections/UserCardBlock';
function CartPage(props) {

    const dispatch = useDispatch();
    const [Total, setTotal] = useState(0);
    useEffect(() => {
        let cartItems=[];
        //redux User state의 cart에 상품이 들어있는지 확인
        if(props.user.userData && props.user.userData.cart){
            if(props.user.userData.cart.length > 0){
                props.user.userData.cart.forEach(item=>{
                    // 카트안의 정보 가져옴
                    cartItems.push(item.id) //상품아이디
                })
                //액션으로 값 가져옴, 아이템 정보와 카트정보 보내줌
                dispatch(getCartItems(cartItems,props.user.userData.cart))
                .then(response=>{
                    //response에서 가져온 데이터 중 payload에 액션에서 가공한 정보가 들어가있음
                    calculateTotal( response.payload)
                })
            }
        }
    }, [props.user.userData])

    let calculateTotal=(cartDetail)=>{
        let total = 0;
        cartDetail.map((item,idx)=>{
            total += parseInt(item.price,10)*parseInt(item.quantity,10)
        })
        setTotal(total);
    }
    const removeFromCart=(productId)=>{
        dispatch(removeCartItem(productId))
    }

    return (
        <div style={{width:'85%', margin : '3rem auto'}}>
            <h1>My Cart</h1>
            <UserCardBlock products={props.user.cartDetail} removeItem={removeFromCart}/>
            <div style={{marginTop:'3rem'}}>
                <h2>Total Amount : $ {Total}</h2>

            </div>
        </div>
    )
}

export default CartPage
