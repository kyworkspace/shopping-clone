import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    ADD_TO_CART,
    GET_CART_ITEMS
} from '../_actions/types';
 

export default function(state={},action){
    switch(action.type){
        case REGISTER_USER:
            return {...state, register: action.payload }
        case LOGIN_USER:
            return { ...state, loginSucces: action.payload }
        case AUTH_USER:
            return {...state, userData: action.payload }
        case LOGOUT_USER:
            return {...state }
        case ADD_TO_CART:
            return {...state 
                        ,userData:{
                            ...state.userData,
                            //카트 정보만 리턴해서 오기 때문에 기존 유저데이터를 보존 시키고 payload 적용
                            cart : action.payload
                        }
                    }
        case GET_CART_ITEMS:
            return {...state, cartDetail : action.payload }
        default:
            return state;
    }
}