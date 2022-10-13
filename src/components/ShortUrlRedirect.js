import React,{useEffect,useState} from 'react'
import { useParams } from "react-router-dom";
import { message,Button, Result,Input } from 'antd';
import axios from 'axios'
import URLS from '../extras/enviroment';
import Spinner from './common/Spinner';





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
    <div >
     
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


    </div>
  )
}
