import {combineReducers} from 'redux'
import loginReducer from './loginReducer'
import membershipConfig from './membershipReducer'





const rootReducer = combineReducers({
    login:loginReducer,
    configs:membershipConfig,
})


export default rootReducer