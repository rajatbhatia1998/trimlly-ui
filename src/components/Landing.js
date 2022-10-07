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
import { getAuth, signInWithPopup, GoogleAuthProvider,EmailAuthProvider,createUserWithEmailAndPassword,signInWithEmailAndPassword } from "firebase/auth";
import {Fade} from 'react-reveal'
import Footer from './Footer'
import URLS from '../extras/enviroment';
import axios from 'axios'
import { uid } from 'uid';
import { useNavigate} from 'react-router-dom';

import {useSelector,useDispatch} from 'react-redux'
import {USER_LOGIN_SUCCESS} from '../redux/action/actionTypes'
import {getRedirectUrl} from '../extras/commanScript'
const { Search } = Input;
const { Text, Link } = Typography;




 function Landing() {
    const navigate = useNavigate();
    const dispatch = useDispatch()
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
    
    
    useEffect(()=>{
        getAuth().onAuthStateChanged(function(user) {
            console.log('auth state changed',user)
            if (user) {
              // User is signed in.
              openNotificationWithIcon('success','Login Success','Logged in successfully!')
            
              dispatch({type:USER_LOGIN_SUCCESS,payload:{isLoggedIn:true,
                oauthDetails:user,
                userConfig:{membership:{plan:'TIER 1',planExpiry:'22/10/2023',planStarted:'22/10/2022'}}
            }})
            navigate('/dashboard')
              // ...
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
            console.log('singin sucess',user)
            openNotificationWithIcon('success','Signup Success','Account created successfully')
            navigate('/dashboard')
            if(!user.emailVerified){
                user.sendEmailVerification()
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
                navigate('/dashboard')
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
    return (
        
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
                 <a  onClick={()=>{handleGoogleLogin()}} className="flex flex-row border-2 p-2 rounded-sm" href="#"><img src="https://img.icons8.com/color/16/000000/google-logo.png" style={{marginRight:10}}/> Login Using Google</a> <br/>
                                
                            
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
      <img src='./trimllyLogo.png'  class="mr-3 h-10 sm:h-20" alt="Trimlly Logo"/>
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
                        <span id='logo'>URL Shortner</span>
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
           <div id="stats">
               
                    <Statistic title="Customers" value={11289} />
                    <Statistic title="Total Shortened URLs" value={125984444}/>
                    
                
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
    )
}

export default Landing;