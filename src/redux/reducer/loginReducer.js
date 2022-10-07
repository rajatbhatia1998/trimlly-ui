import {
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILED
} from '../action/actionTypes'



const loginState = {
    isLoggedIn:false,
    oauthDetails:{},
    userConfig:{}
};


export default  function (state=loginState,action){
    switch(action.type){
        case USER_LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn:true,
                oauthDetails:action.payload.oauthDetails,
                userConfig:action.payload.userConfig,
            }
        case USER_LOGIN_FAILED:
            return {
                ...state,
                isLoggedIn:false,
                oauthDetails:{},
                userConfig:{}
            }
        default:
            return state
    }
}