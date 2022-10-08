import {
    SET_MEMBERSHIP_CONFIG
} from '../action/actionTypes'



const membershipState = {
    configs:{},
    membership:{}
};



export default  function (state=membershipState,action){
    switch(action.type){
        case SET_MEMBERSHIP_CONFIG:
            return {
                ...state,
               membership:action.payload.membershipInfo,
               configs:action.payload.configs
            }
       
        default:
            return state
    }
}