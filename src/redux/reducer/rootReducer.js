import {combineReducers} from 'redux'
import dashboardReducer from './dashboardReducer'
import loginReducer from './loginReducer'
import membershipConfig from './membershipReducer'





const rootReducer = combineReducers({
    login:loginReducer,
    configs:membershipConfig,
    dashboard:dashboardReducer
})


export default rootReducer