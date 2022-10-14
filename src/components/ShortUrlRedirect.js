import React,{useEffect,useState} from 'react'
import { useParams } from "react-router-dom";
import { message,Button, Result,Input,Avatar } from 'antd';
import axios from 'axios'
import URLS from '../extras/enviroment';
import Spinner from './common/Spinner';
import { getRedirectUrl } from '../extras/commanScript';





export default function ShortUrlRedirect() {
    let params = useParams();
    const [isValidSlug,setIsValidSlug] = useState(true)
    const [isLoading,setIsLoading] = useState(false)
    const [currentUrl,setCurrentUrl] = useState({urlType:'NORMAL'})
    const [linkPassword,setLinkPassword] = useState("")
    useEffect(()=>{
      setIsLoading(true)
        axios.get(URLS.GUEST_URL.GET_SLUG_DETAILS+params.slug).then(res=>{
          console.log("slug check",res)
          setIsLoading(false)
          if(res.data.status){
            setIsValidSlug(true)
            setCurrentUrl(res.data.data)
            let urlDetail = res.data.data
            let longUrl = res.data.data.longUrl
            var pattern = /^((http|https):\/\/)/;

          if(!pattern.test(longUrl)) {
              longUrl = "http://" + longUrl;
          }
          if(urlDetail.urlType==='NORMAL'){
              
              window.location  = longUrl
          }else if(urlDetail.urlType==='SECURE'){

          }else{
            //bio link
          }
         
          }else{
            setIsValidSlug(false)
          }
        }).catch(err=>{
          console.log('some error',err)
          setIsValidSlug(false)
          setIsLoading(false)
        })
        
    },[])
    const passwordValidation = ()=>{
      var pattern = /^((http|https):\/\/)/;
      let longUrl = currentUrl.longUrl
      if(!pattern.test(longUrl)) {
          longUrl = "http://" + longUrl;
      }
      if(linkPassword===currentUrl.extensionData.secureLink.password){
        window.location = longUrl
      }else{
        message.error('Wrong Password');
      }
    }
  return (
    <div className={currentUrl.urlType==='BIO'?'w-screen flex justify-center item-center p-10':''} style={currentUrl.urlType==='BIO' ? {backgroundColor:currentUrl.extensionData.bioLinks.template.bgColor}:{}}>
     
      {isLoading ?
       <Result
       title="Validating the url !"
       subTitle="Please wait while we are validating your URL !"
       
     />
     :
     null
      }
          {(!isValidSlug && !isLoading) 
        &&
        <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        
      />
    
      }
      {(isValidSlug && !isLoading && currentUrl.urlType==='NORMAL') 
        &&
        <Result
        status="success"
        title="Redirecting you"
        subTitle="Redirecting you to actual URL !"
        
      />
 
  }
      {(isValidSlug && !isLoading && currentUrl.urlType==='SECURE') 
            &&
            <Result
            status="403"
            title="403"
            subTitle="This links seems to be secured , Please enter passsword !"
            extra={
            <div className='container px-10'>
              <Input type='password' value={linkPassword} onChange={e=>setLinkPassword(e.target.value)}/>
              <Button type="primary" className='mt-5'c onClick={passwordValidation}>Request</Button>
              
              </div>
              }
          />
    
      }
{(isValidSlug && !isLoading && currentUrl.urlType==='BIO') 
            &&
            <div className='flex flex-col justify-around items-center p-1'>
                <a href="https://trimlly.com/" class="flex items-center">
         <img src='./trimllyLogo.png'  class="mr-3 h-20 sm:h-20" alt="Trimlly Logo"/>
     </a>
              <span className='font-bold text-xl mb-10 '>BIO LINKS</span>
                    
            
                {(currentUrl.extensionData.bioLinks.links.length>0) &&
                    <div className='flex flex-col'>
                        {currentUrl.extensionData.bioLinks.links.map((link)=>{
                            return <a href={getRedirectUrl(link.url)} target='_blank' className={' text-center '+currentUrl.extensionData.bioLinks.template.buttonStyles}>{link.linkType}</a>
                        })}
                    </div>
                   
            
                }
                    
            
                  <span className='mt-10 font-serif '>Powered by <a href='https://www.trimlly.com'>Trimlly</a></span>
                </div>
    
      }

    </div>
  )
}
