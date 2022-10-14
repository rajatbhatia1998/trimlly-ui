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
    const [plans,setPlans] = useState({
        personal:{
            
            
        },
        pro:{
            
        }
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
        const perosnalPrice = 1000
       const proPrice = 2000

       setPlans({
        personal:{
            
            amount:perosnalPrice,
            formatedAmount:new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(perosnalPrice)
        },
        pro:{
            amount:proPrice,
            formatedAmount:new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(proPrice)
        }
       })
      
       
       
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
            "longUrl":currentLongUrl,
            'urlType':"NORMAL"
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
     openNotificationWithIcon('info','SignUp Required','Please SignUp and Upgrade Plan')

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
                   <p class="btn-text"><b>Sign in</b></p>
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
     <a href="https://trimlly.com/" class="flex items-center">
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
                  
                     <Input  style={{marginBottom:10}}  value={currentLongUrl} onChange={(e)=>{setCurrentLongUrl(e.target.value)}}  placeholder="Enter your long url here"  />
                            {isUrlShortening ? <button disabled type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
            <svg aria-hidden="true" role="status" class="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
            </svg>
            Trimming...
        </button>:
        <button onClick={()=>handleUrlShortening()}  class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">CREATE</button>
        }
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
             
              
              <section class="bg-white dark:bg-gray-900">
  <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div class="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
          <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Lookout our premium plans !</h2>
         </div>
      <div class="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
          {/* <!-- Pricing Card --> */}
          <div class="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
              <h3 class="mb-4 text-2xl font-semibold">Starter</h3>
              <p class="font-light text-gray-500 sm:text-lg dark:text-gray-400">Best for testing &  creating few url's and partial analytics for your links clicks</p>
              <div class="flex justify-center items-baseline my-8">
                  <span class="mr-2 text-5xl font-extrabold">FREE</span>
                  <span class="text-gray-500 dark:text-gray-400">/lifetime</span>
              </div>
              {/* <!-- List --> */}
              <ul role="list" class="mb-8 space-y-4 text-left">
                  <li class="flex items-center space-x-3">
                  <svg class="w-5 h-5 text-red-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
               
                 <span>Unlimited Links (Max 15)</span>
                  </li>
                  <li class="flex items-center space-x-3">
                      <svg class="w-5 h-5 text-red-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    <span>Password Protected Links (Max 1)</span>
                  </li>
                  <li class="flex items-center space-x-3">
                    
                      <svg class="w-5 h-5 text-red-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    <span>Bio Links</span>
                  </li>
                  <li class="flex items-center space-x-3">
                  <svg class="w-5 h-5 text-red-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    <span>Developer API's </span>
                  </li>
                  <li class="flex items-center space-x-3">
                      <svg class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                      <span>Support:<span class="font-semibold">24 Months</span></span>
                  </li>
              </ul>
              <a href="#" class="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-700 dark:text-white  dark:focus:ring-primary-900">Current Plan</a>
          </div>
          {/* <!-- Pricing Card --> */}
          <div class="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
              <h3 class="mb-4 text-2xl font-semibold">Personal</h3>
              <p class="font-light text-gray-500 sm:text-lg dark:text-gray-400">Relevant for personal use, extended & premium support & features.</p>
              <div class="flex justify-center items-baseline my-8">
                  <span class="mr-2 text-5xl font-extrabold">{plans.personal.formatedAmount}</span>
                  <span class="text-gray-500 dark:text-gray-400">/year</span>
              </div>
              {/* <!-- List --> */}
              <ul role="list" class="mb-8 space-y-4 text-left">
                  <li class="flex items-center space-x-3">
                  <svg class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                    
                 <span>Unlimited Links</span>
                  </li>
                  <li class="flex items-center space-x-3">
                  <svg class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                      <span>Password Protected Links (Max 10)</span>
                  </li>
                  <li class="flex items-center space-x-3">
                    
                  <svg class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                        <span>Bio Links (Max 1)</span>
                  </li>
                  <li class="flex items-center space-x-3">
                  <svg class="w-5 h-5 text-red-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    <span>Developer API's </span>
                  </li>
                  <li class="flex items-center space-x-3">
                      <svg class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                      <span>Support:<span class="font-semibold">24 Months</span></span>
                  </li>
              </ul>
              <a onClick={()=>onPayClick(plans.personal.amount)} class="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-700 dark:text-white  dark:focus:ring-primary-900">Buy</a>
          </div>
          {/* <!-- Pricing Card --> */}
          <div class="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
              <h3 class="mb-4 text-2xl font-semibold">Pro</h3>
              <p class="font-light text-gray-500 sm:text-lg dark:text-gray-400">Best for large scale uses and all features of the product</p>
              <div class="flex justify-center items-baseline my-8">
                  <span class="mr-2 text-5xl font-extrabold">{plans.pro.formatedAmount}</span>
                  <span class="text-gray-500 dark:text-gray-400">/year</span>
              </div>
              {/* <!-- List --> */}
              <ul role="list" class="mb-8 space-y-4 text-left">
                  <li class="flex items-center space-x-3">
                  <svg class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                    
                 <span>Unlimited Links </span>
                  </li>
                  <li class="flex items-center space-x-3">
                  <svg class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                      <span>Password Protected Links</span>
                  </li>
                  <li class="flex items-center space-x-3">
                    
                  <svg class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                     <span>Bio Links</span>
                  </li>
                  <li class="flex items-center space-x-3">
                  <svg class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                     <span>Developer API's </span>
                  </li>
                  <li class="flex items-center space-x-3">
                      <svg class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                      <span>Support:<span class="font-semibold">24 Months</span></span>
                  </li>
              </ul>
              <a onClick={()=>onPayClick(plans.pro.amount)} class="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-700 dark:text-white  dark:focus:ring-primary-900">Buy</a>
          </div>
      </div>
  </div>
</section>


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