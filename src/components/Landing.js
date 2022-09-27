import React,{useState,useEffect,Suspense} from 'react'
import './css/landing.css'
import { 
    Button ,
    Divider ,
    Card,
    Modal,
    Statistic,
    Spin
} from 'antd';


import {ScissorOutlined,InstagramOutlined,GithubOutlined} from '@ant-design/icons'
import {Fade} from 'react-reveal'

import Footer from './Footer'


 function Landing() {
    const [modalVisible,setModalVisible] = useState(false);
    
 
    useEffect(()=>{
       
           
    },[])

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
                        <h1 style={{color:"#3959a2"}}>URL Shortner</h1>
                        <p>Shorten, personalize, and share  <br/>
                        fully branded short URLs.
                        </p>
                        <Button type="primary" shape="round"
                         onClick={()=>setModalVisible(true)}>START FOR FREE</Button>
                    
                    </div>
            </Fade>
            <Fade right>
                    
                <div style={{display:"flex",flexDirection:"column",flexWrap:"wrap",justifyContent:"center",alignItems:"center"}}>
                <ScissorOutlined  spin style={{fontSize:"60px"}}/>
                    <span id="logo-middle">
                    Most Advanced URL Shortner
                  </span></div>
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