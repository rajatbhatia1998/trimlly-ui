import {
    ADD_CUSTOMER_LINKS
} from '../action/actionTypes'



const dashboardState = {
    bioLinks:[],
    normalLinks:[],
    secureLinks:[]
};

const getFilteredLinks = (links,type)=>{
    let tempLinks = links.filter(l=>l.urlType===type)
    return tempLinks
}


export default  function (state=dashboardState,action){
    switch(action.type){
        case ADD_CUSTOMER_LINKS:
            return {
                ...state,
                normalLinks:getFilteredLinks(action.payload,'NORMAL'),
                bioLinks:getFilteredLinks(action.payload,'BIO'),
                secureLinks:getFilteredLinks(action.payload,'SECURE')
            }
       
        default:
            return state
    }
}