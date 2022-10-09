const server_url = "https://trimlly-server.herokuapp.com"


const URLS = {

    GUEST_URL:{
        CREATE_SHORTN:server_url+'/url/create',
        GET_SLUG_DETAILS:server_url+'/url/redirect/',
        GET_CURRENT_URL:server_url+'/url/guest/',
        
    },
    CUSTOMER:{
        GET_USER_URLS : server_url+'/url/getUrls/', //:userId
        GET_MEMVERSHIP_CONFIG: server_url + '/membership/plan/', //:userId,
        CREATE_SHORTN:server_url+'/url/create',
    },
    APPLICATION:{
        STATS:server_url + '/stats/app'
    }

}


export default URLS