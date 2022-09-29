const server_url = "https://trimlly-server.herokuapp.com"


const URLS = {

    GUEST_URL:{
        CREATE_SHORTN:server_url+'/url/create',
        GET_SLUG_DETAILS:server_url+'/url/redirect/',
        GET_CURRENT_URL:server_url+'/url/guest/'
    }

}


export default URLS