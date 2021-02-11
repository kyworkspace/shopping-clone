import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { getCartItems, removeCartItem, onSuccessBuy } from '../../../_actions/user_actions'
import UserCardBlock from './Sections/UserCardBlock';
import { Empty, Result } from 'antd'
import Paypal from '../../utils/Paypal';

function CartPage(props) {

    const dispatch = useDispatch();
    const [Total, setTotal] = useState(0);
    const [ShowTotal, setShowTotal] = useState(false)
    const [ShowSuccess, setShowSuccess] = useState(false);
    useEffect(() => {
        let cartItems = [];
        //redux User state의 cart에 상품이 들어있는지 확인
        if (props.user.userData && props.user.userData.cart) {
            if (props.user.userData.cart.length > 0) {
                props.user.userData.cart.forEach(item => {
                    // 카트안의 정보 가져옴
                    cartItems.push(item.id) //상품아이디
                })
                //액션으로 값 가져옴, 아이템 정보와 카트정보 보내줌
                dispatch(getCartItems(cartItems, props.user.userData.cart))
                    .then(response => {
                        //response에서 가져온 데이터 중 payload에 액션에서 가공한 정보가 들어가있음
                        calculateTotal(response.payload)
                    })
            }
        }
    }, [props.user.userData])

    let calculateTotal = (cartDetail) => {
        let total = 0;
        cartDetail.map((item, idx) => {
            total += parseInt(item.price, 10) * parseInt(item.quantity, 10)
        })
        setTotal(total);
        setShowTotal(true);
    }
    const removeFromCart = (productId) => {
        dispatch(removeCartItem(productId))
            .then(response => {
                if (response.payload.productInfo.length === 0) {
                    setShowTotal(false)
                }
            })
    }
    const transactionSuccess = (payment) => {

        dispatch(onSuccessBuy({

            paymentData: payment, //결재정보
            cartDetail: props.user.cartDetail // 장바구니 정보

        })).then(response => {
            if (response.payload.success) { //결재성공
                setShowTotal(false);
                setShowSuccess(true);
            }
        })

    }

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <h1>My Cart</h1>
            <UserCardBlock products={props.user.cartDetail} removeItem={removeFromCart} />

            {ShowTotal ?
                <div style={{ marginTop: '3rem' }}>
                    <h2>Total Amount : $ {Total}</h2>
                </div>
                : ShowSuccess ?
                    <Result
                        status="success"
                        title="Successfully Purchased Items!!"
                    /> :
                    <>
                        <Empty />
                    </>
            }
            {/* 페이팔 버튼 , 컴포넌트로 할거임*/}
            {ShowTotal &&
                <Paypal
                    total={Total} onSuccess={transactionSuccess}
                />
            }



        </div>
    )
}

export default CartPage
