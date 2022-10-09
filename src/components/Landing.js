import React,{useState,useEffect,Suspense} from 'react'
import './css/landing.css'
import { 
    Button ,
    Divider ,
    Card,
    Modal,
    Statistic,
    Spin,
    Input,
    Descriptions,
    Typography,
    Skeleton,
    Popover,
    notification,
    Form,
    Switch
} from 'antd';
import {ScissorOutlined,InstagramOutlined,GithubOutlined, BarChartOutlined} from '@ant-design/icons'
import { sendEmailVerification,AdditionalUserInfo,onAuthStateChanged,getAuth, signInWithPopup, GoogleAuthProvider,signInWithRedirect,createUserWithEmailAndPassword,signInWithEmailAndPassword } from "firebase/auth";
import {Fade} from 'react-reveal'
import Footer from './Footer'
import URLS from '../extras/enviroment';
import axios from 'axios'
import { uid } from 'uid';
import { useNavigate} from 'react-router-dom';

import {useSelector,useDispatch} from 'react-redux'
import {USER_LOGIN_SUCCESS} from '../redux/action/actionTypes'
import {getRedirectUrl} from '../extras/commanScript'
import {ReactComponent as LandingIllu} from './common/landingIllu.svg'

const { Search } = Input;
const { Text, Link } = Typography;




 function Landing() {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [isAppLoading,setIsAppLoading] = useState(false)
    const [modalVisible,setModalVisible] = useState(false);
    const [isUrlShortening,setUrlShortening] = useState(false)
    const [currentShortn,setCurrentShorten] = useState({})
    const [currentLongUrl,setCurrentLongUrl] = useState("")
    const [loginUsername,setLoginUserName] = useState("")
    const [loginPassword,setLoginPassword] = useState("")
    const [singUpUsername,setsingUpUserName] = useState("")
    const [singUpPassword,setsingUpPassword] = useState("")
    const [loginMode,setLoginMode] = useState('LOGIN')
    const [loginProgress,setLoginProgress]  = useState(false)
    const [appStats,setAppStats] = useState({
        totalCustomer:0,
        totalUrls:0
    })
    useEffect(()=>{
        //application stats check
        setIsAppLoading(true)
        axios.get(URLS.APPLICATION.STATS).then(resApp=>{
            if(resApp.data.status){
                setAppStats(resApp.data)
            }else{
                setAppStats({
                    totalCustomer:100,
                    totalUrls:103456
                })
            }
            setIsAppLoading(false)
        }).catch(err=>{
            setAppStats({
                totalCustomer:100,
                totalUrls:103456
            })
            setIsAppLoading(false)
        })
    },[])
    useEffect(()=>{
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            console.log('auth state check',user)
        if (user) {
            const uid = user.uid;
            
            
            dispatch({type:USER_LOGIN_SUCCESS,payload:{isLoggedIn:true,
            oauthDetails:user,
            userConfig:{}
            }})
            navigate('/dashboard/default')
        
        } else {
            navigate('/')
        }
        });
       
       
    },[])
     
    const handleGoogleLogin = ()=>{
        const auth = getAuth();
        signInWithPopup(auth, new GoogleAuthProvider())
          .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
           // console.log('google signin check',user,user.AdditionalUserInfo)
            openNotificationWithIcon('success','Login Success','Logged in successfully!')
          }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
          });
    }
   
    useEffect(()=>{
      
      axios.get(URLS.GUEST_URL.GET_CURRENT_URL+getGuestId()).then(res=>{
           
            if(res.status===200 && res.data.status){
                setCurrentShorten(res.data.data)
            }
        })

    },[])

   
    var openNotificationWithIcon = (type,msg,desc) => {
        notification[type]({
          message: msg,
          description:desc
            
        });
      };
    const getGuestId = ()=>{
        const guestId = localStorage.getItem('trimlly-guestId')
        console.log(guestId)
        if(guestId){
            return guestId
        }else{
            let newGuestId = uid();
            localStorage.setItem('trimlly-guestId',newGuestId)
            return newGuestId
        }
       
    }
    function validURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
          '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(str);
      }
    const handleUrlShortening = (url)=>{
        if(validURL(currentLongUrl)){
        setUrlShortening(true)
        const CREATE_BODY = {
            "userType":"GUEST",
            "userId":getGuestId(),
            "longUrl":currentLongUrl
          }
        //api call for shortening
        axios.post(URLS.GUEST_URL.CREATE_SHORTN,CREATE_BODY).then(res=>{
            console.log("RES",res)
            if(res.status===200 && res.data.status===true){
            setUrlShortening(false)
            setCurrentShorten(res.data.data)
            setCurrentLongUrl("")
            openNotificationWithIcon('success','Url Shortned Success',`Your URL ${currentLongUrl} shrinked successfully. Kindly copy the short url and share it !`)

            }else{
                setCurrentLongUrl("")
                setCurrentShorten({})
                openNotificationWithIcon('error','Failure','Not able to generate shortn url ! Please try again')
            }
        })
        }else{
            setCurrentLongUrl("")
            setCurrentShorten({})
            openNotificationWithIcon('error','Invalid URL','Please give valid url for shortening!')
        }
    }
    const clickContent = (
        <div>
          <p>{currentShortn.clicks} Clicks</p>
          
        </div>
      );

      const handleUserNameChange = (e)=>{
        //console.log("usrrname changed",loginMode,e.target.value)
        if(loginMode==='LOGIN'){
            setLoginUserName(e.target.value)
        }else{
            setsingUpUserName(e.target.value)
        }
        
      }
      const handlePasswordChange = (e)=>{
        //console.log("passowrd changed",loginMode,e.target.value)
        if(loginMode==='LOGIN'){
            setLoginPassword(e.target.value)
        }else{
            setsingUpPassword(e.target.value)
        }
        
      }
      const handleSingUp = ()=>{
        setLoginProgress(true)
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, singUpUsername, singUpPassword)
          .then((userCredential) => {
            // Signed in 
            setLoginProgress(false)
            const user = userCredential.user;
         
            openNotificationWithIcon('success','Signup Success','Account created successfully')
          
            if(!user.emailVerified){
              sendEmailVerification(user)
                openNotificationWithIcon('info','Email Verification','Verification mail sent to your registered email!')
            }
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            setLoginProgress(false)
            openNotificationWithIcon('error','Signup Error',errorMessage)
           // console.log('ssinguin error',error)
            // ..
          });
      }
      const handleLogin = ()=>{
        setLoginProgress(true)
        const auth = getAuth();
            signInWithEmailAndPassword(auth, loginUsername, loginPassword)
            .then((userCredential) => {
                // Signed in 
                setLoginProgress(false)
                const user = userCredential.user;
                console.log('logun sucess',user)
                openNotificationWithIcon('success','Login Success','Logged in successfully!')
               
                if(!user.emailVerified){
                    openNotificationWithIcon('info','Email Verification','Your Email verification is pending , Kindly verify !')
                }
                // ...
            })
            .catch((error) => {
                console.log(error)
                const errorCode = error.code;
                const errorMessage = error.message;
                setLoginProgress(false)
            openNotificationWithIcon('error','Login Error',errorMessage)
            });
      }
     const  onPayClick = async(amount)=>{
        let order = await axios.post(URLS.CUSTOMER.CREATE_ORDER_TO_UPGRADE,{amount:amount})
        console.log(order)
        var options = {
            "key": "rzp_test_RIrUEwLm14CUHl", // Enter the Key ID generated from the Dashboard
            "amount": amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": "INR",
            "name": "Trimlly",
            "description": "Test Transaction",
            "image": "https://example.com/your_logo",
            "order_id": order.orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "callback_url": "https://eneqd3r9zrjok.x.pipedream.net/",
            "prefill": {
                "name": "Rajat Bhatia",
                "email": "rajat.bhatia859@gmail.com",
                "contact": "9023788306"
            },
            "notes": {
                "address": "Razorpay Corporate Office"
            },
            "theme": {
                "color": "#3399cc"
            }
        };
        var rzp1 = new window.Razorpay(options);
    
        rzp1.open();
       

     }
    return (
        <>
            {
                isAppLoading ?
                <div className='flex h-screen justify-center align-middle items-center'>
                    <Spin size='large'></Spin>
                </div>
                :
                <div id="container">
            
                <Modal title= {loginMode==='LOGIN'?'LOGIN':'SIGNUP'} open={modalVisible} onOk={()=>setModalVisible(false)}  onCancel={()=>setModalVisible(false)}>
                <Spin tip="Please Wait!" spinning={loginProgress}>
                   <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                               <Form
                   name="basic"
                   labelCol={{ span: 8 }}
                   wrapperCol={{ span: 16 }}
                   autoComplete="off"
                   >
                   <Form.Item
               
                       label="Email Id"
                       name="email"
                       rules={[{ required: true, message: 'Please input your email!' }]}
                   >
                       <Input  value={loginMode==='LOGIN'?loginUsername:singUpUsername} onChange={handleUserNameChange} />
                   </Form.Item>
   
                   <Form.Item
                       label="Password"
                       name="password"
                       rules={[{ required: true, message: 'Please input your password!' }]}
                   >
                       <Input.Password value={loginMode==='LOGIN'?loginPassword:singUpPassword} onChange={handlePasswordChange} />
                   </Form.Item>
   
                   {/* <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                       <Checkbox>Remember me</Checkbox>
                   </Form.Item> */}
                       <Form.Item label="SINGUP ?" valuePropName="checked">
                       <Switch onChange={(e)=>{
                           console.log("switch toggle",e)
                           if(e){
                               setLoginMode('SINGUP')
                               setsingUpUserName(loginUsername)
                               setsingUpPassword(loginPassword)
                              
   
                           }else{
                               setLoginMode('LOGIN')
                               setLoginPassword(singUpPassword)
                               setLoginUserName(singUpUsername)
                             
                           }
                       }}  />
                       </Form.Item>
   
   
                   <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                       <Button type="primary" htmlType="submit"
                       onClick= {()=>{loginMode==='LOGIN'?handleLogin():handleSingUp()}}
                       >
                       {loginMode==='LOGIN'?'LOGIN':'SIGNUP'}
                       </Button>
                   </Form.Item>
   
                   </Form>
                     <div onClick={()=>{handleGoogleLogin()}} class="google-btn">
                   <div class="google-icon-wrapper">
                       <img class="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>
                   </div>
                   <p class="btn-text"><b>Sign in with google</b></p>
                   </div>           
                               
                   </div>
               </Spin> 
         </Modal>
       
           <Fade>
               {/* <nav id="top-nav">
                    <img width={100} height={100} src='./trimllyLogo.png'/>
                    <div id="links">
                       <InstagramOutlined  style={{fontSize:"30px"}}/>
                       <GithubOutlined  style={{fontSize:"30px",marginLeft:"5px"}}/>
                    </div>
               </nav> */}
               
   
               <nav class="bg-white px-2 sm:px-4 py-2.5 dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
     <div class="container flex flex-wrap justify-between items-center mx-auto">
     <a href="https://flowbite.com/" class="flex items-center">
         <img src='./trimllyLogo.png'  class="mr-3 h-20 sm:h-20" alt="Trimlly Logo"/>
         {/* <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Trimlly</span> */}
     </a>
     <div class="flex md:order-2">
         <button onClick={()=>setModalVisible(true)} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Get started</button>
         
     </div>
     
     </div>
   </nav>
   
   
           </Fade>
               <Divider/>
               <div id="middle">
                   
              
                   <Fade left>
                       <div id="middle-btn-grp">
                           <LandingIllu/> 
                           <p>Shorten, personalize, and share  <br/>
                           fully branded short URLs.
                           </p>
   
                           {/* <Button type="primary" shape="round"
                            onClick={()=>setModalVisible(true)}>START FOR FREE</Button> */}
   
                            
                       
                       </div>
               </Fade>
               
               <Fade right>
                       
                   <div style={{display:"flex",flexDirection:"column",flexWrap:"wrap",justifyContent:"center",alignItems:"center"}}>
                  
                     <Search  style={{marginBottom:10}}  value={currentLongUrl} onChange={(e)=>{setCurrentLongUrl(e.target.value)}}  onSearch={handleUrlShortening} placeholder="Enter your long url here" enterButton="Shorten" size="large" loading={isUrlShortening} />
                     <Skeleton active title="Short Url" loading={isUrlShortening} >
                     
                       {(currentShortn && currentShortn.shortUrl)&&
                       <Card style={{marginTop:10 }}>
                       <div id="homeShortner">
                       <Text style={{marginTop:5}} strong  type='secondary'>{currentShortn.longUrl}</Text>
                       <Link style={{marginTop:10,marginBottom:10}} href={getRedirectUrl(currentShortn.shortUrl)} target="_blank">
                           <Text type='danger' strong copyable italic>{currentShortn.shortUrl}</Text>
                       </Link>
                       <Popover  content={clickContent} title="Total Clicks">
                    
                           <Button size='small' icon={<BarChartOutlined />}  style={{width:100}} >Clicks</Button>
                       </Popover>
                       
                       </div>
                       </Card>
                       }
                      
                   </Skeleton>   
                     </div>
                     <div>
               
                     <Divider/>
                     
      
                       
                    
                 </div>
                   </Fade>
               </div>
   
               <Divider/>
               <Fade bottom>
               <div id="card-grp">
                   
                       <Card title="Clickstream & Detailed Statistics" hoverable style={{margin:5}}>
                       Track the success of every short link and domain with detailed insights .
                       </Card>
                  
                   
                       <Card title="Advanced Custom URLs" hoverable style={{margin:5}}>
                           Create unlimited auto expiry , password protection and qr generated custom url's 
                       </Card>
                 
                       <Card title="Bio Links" hoverable style={{margin:5}}>
                           Create bio links for your socials and manage all your social links in one place
                       </Card>
                   
                       <Card title="API" hoverable style={{margin:5}}>
                       Shorten, analyze, and manage URLs with a free API for developers. 
                       </Card>
                
               </div>
               </Fade>
              <Divider/>
             
              
   <div id="detailed-pricing" class="overflow-x-auto w-full">
       <div class="overflow-hidden min-w-max">
           <div class="grid grid-cols-4 gap-x-16 p-4 text-sm font-medium text-gray-900 bg-gray-100 border-t border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
               <div class="flex items-center">Trimlly Features</div>
               <div>Free</div>
               <div>Personal</div>
               <div>Pro</div>
           </div>
           <div class="grid grid-cols-4 gap-x-16 py-5 px-4 text-sm text-gray-700 border-b border-gray-200 dark:border-gray-700">
               <div class="text-gray-500 dark:text-gray-400">Unlimited Links</div>
               <div>
                   <svg class="w-5 h-5 text-red-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
               </div>
               <div>
                   <svg class="w-5 h-5 text-green-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
               </div>
               <div>
                   <svg class="w-5 h-5 text-green-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
               </div>
           </div>
           <div class="grid grid-cols-4 gap-x-16 py-5 px-4 text-sm text-gray-700 border-b border-gray-200 dark:border-gray-700">
               <div class="text-gray-500 dark:text-gray-400">Password Protected Links</div>
               <div>
                   <svg class="w-5 h-5 text-red-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
               </div>
               <div>
                   <svg class="w-5 h-5 text-green-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
               </div>
               <div>
                   <svg class="w-5 h-5 text-green-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
               </div>
           </div>
           <div class="grid grid-cols-4 gap-x-16 py-5 px-4 text-sm text-gray-700 border-b border-gray-200 dark:border-gray-700">
               <div class="text-gray-500 dark:text-gray-400">Bio Links</div>
               <div>
                   <svg class="w-5 h-5 text-red-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
               </div>
               
               <div>
                   <svg class="w-5 h-5 text-red-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
               </div>
               <div>
                   <svg class="w-5 h-5 text-green-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
               </div>
           </div>
           <div class="grid grid-cols-4 gap-x-16 py-5 px-4 text-sm text-gray-700 border-b border-gray-200 dark:border-gray-700">
               <div class="text-gray-500 dark:text-gray-400">Developer API</div>
               <div>
                   
                   <svg class="w-5 h-5 text-red-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
               </div>
               <div>
                   
                   <svg class="w-5 h-5 text-red-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
               </div>
               <div>
                   <svg class="w-5 h-5 text-green-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
               </div>
               
           </div>
           <div class="grid grid-cols-4 gap-x-16 py-5 px-4 text-sm text-gray-700 border-b border-gray-200 dark:border-gray-700">
               <div class="text-gray-500 dark:text-gray-400"></div>
               <div >
                   <a href="#" class="text-white block w-full bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-4 py-2.5 text-center dark:focus:ring-blue-900">Get Started</a>
               </div>
               <div onClick={()=>{onPayClick('10000')}}>
                   <a  class="text-white block w-full bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-4 py-2.5 text-center dark:focus:ring-blue-900">Buy now</a>
               </div>
               <div onClick={()=>{onPayClick('20000')}}>
                   <a  class="text-white block w-full bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-4 py-2.5 text-center dark:focus:ring-blue-900">Buy now</a>
               </div>
           </div>
       </div>
   </div>
   <div id="stats">
                  
                  <Statistic title="Customers" value={appStats.totalCustomer} />
                  <Statistic title="Total Shortened URLs" value={appStats.totalUrls}/>
                  
              
          </div>
         <Divider/>
             <Footer/>
   
              {/* <Modal
              title="Login "
              centered
              visible={modalVisible}
              onOk={() => setModalVisible(false)}
              onCancel={() => setModalVisible(false)}
            >
            <Suspense fallback={<Spin size={40} style={{textAlign:"center"}}/>}>
                <OAuth/>
            </Suspense>
              
            </Modal> */}
           </div>
            }
        
        </>
      
    )
}

export default Landing;