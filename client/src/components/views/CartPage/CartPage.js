import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import {getCartItems} from '../../../_actions/user_actions'
function CartPage(props) {

    const dispatch = useDispatch();

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
            }
        }
    }, [props.user.userData])

    return (
        <div>
            CartPage
        </div>
    )
}

export default CartPage
