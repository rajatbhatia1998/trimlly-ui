import {
    SET_MEMBERSHIP_CONFIG
} from '../action/actionTypes'



const membershipState = {
    configs:{},
    membership:{},
    paymentDetails:{}
};



export default  function (state=membershipState,action){
    switch(action.type){
        case SET_MEMBERSHIP_CONFIG:
            return {
                ...state,
               membership:action.payload.membershipInfo,
               configs:action.payload.configs,
               paymentDetails:action.payload.paymentDetails
            }
       
        default:
            return state
    }
}