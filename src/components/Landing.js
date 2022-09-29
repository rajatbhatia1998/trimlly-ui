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
    notification
} from 'antd';
import {ScissorOutlined,InstagramOutlined,GithubOutlined, BarChartOutlined} from '@ant-design/icons'
import {Fade} from 'react-reveal'
import Footer from './Footer'
import URLS from '../extras/enviroment';
import axios from 'axios'
import { uid } from 'uid';





const { Search } = Input;
const { Text, Link } = Typography;




 function Landing() {
    const [modalVisible,setModalVisible] = useState(false);
    const [isUrlShortening,setUrlShortening] = useState(false)
    const [currentShortn,setCurrentShorten] = useState({})
    const [currentLongUrl,setCurrentLongUrl] = useState("")


    useEffect(()=>{
      
      axios.get(URLS.GUEST_URL.GET_CURRENT_URL+getGuestId()).then(res=>{
           
            if(res.status===200 && res.data.status){
                setCurrentShorten(res.data.data)
               
            }
        })

    },[])


    const openNotificationWithIcon = (type,msg,desc) => {
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


    return (
        
        <div id="container">
        <Fade>
            <nav id="top-nav">
                 <span id="logo">Trimlly</span> 
                 <div id="links">
                    <InstagramOutlined  style={{fontSize:"30px"}}/>
                    <GithubOutlined  style={{fontSize:"30px",marginLeft:"5px"}}/>
                 </div>
            </nav>
        </Fade>
            <Divider/>
            <div id="middle">
                
           
                <Fade left>
                    <div id="middle-btn-grp">
                        <h1 id="logo-middle" >URL Shortner</h1>
                        <p>Shorten, personalize, and share  <br/>
                        fully branded short URLs.
                        </p>
                        <Button type="primary" shape="round"
                         onClick={()=>setModalVisible(true)}>START FOR FREE</Button>
                    
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
                    <Link style={{marginTop:10,marginBottom:10}} href={currentShortn.shortUrl} target="_blank">
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