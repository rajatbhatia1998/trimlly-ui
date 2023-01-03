const server_url = "https://trimlly-server.vercel.app"
//const server_url = 'http://localhost:3001'

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
        DELETE_SLUG:server_url + '/url/delete/', //:slug,
        CREATE_ORDER_TO_UPGRADE : server_url + '/membership/order/create',
        PAYMENT_VERIFY : server_url + '/membership/payment/verify/'//:planType/:email
    },
    APPLICATION:{
        STATS:server_url + '/stats/app'
    }

}


export default URLS