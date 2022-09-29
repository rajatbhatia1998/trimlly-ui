import React,{useEffect,useState} from 'react'
import { useParams } from "react-router-dom";
import { Button, Result } from 'antd';
import axios from 'axios'
import URLS from '../extras/enviroment';
import Spinner from './common/Spinner';





export default function ShortUrlRedirect() {
    let params = useParams();
    const [isValidSlug,setIsValidSlug] = useState(true)
    const [isLoading,setIsLoading] = useState(false)
    useEffect(()=>{
      setIsLoading(true)
        axios.get(URLS.GUEST_URL.GET_SLUG_DETAILS+params.slug).then(res=>{
          console.log("slug check",res)
          setIsLoading(false)
          if(res.data.status){
            setIsValidSlug(true)
           
            let longUrl = res.data.data.longUrl
            var pattern = /^((http|https):\/\/)/;

          if(!pattern.test(longUrl)) {
              longUrl = "http://" + longUrl;
          }
           window.location  = longUrl
          }else{
            setIsValidSlug(false)
          }
        }).catch(err=>{
          console.log('some error',err)
          setIsValidSlug(false)
          setIsLoading(false)
        })
        
    },[])
  return (
    <div style={{}}>
     
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
      {(isValidSlug && !isLoading) 
        &&
        <Result
        status="success"
        title="Redirecting you"
        subTitle="Redirecting you to actual URL !"
        
      />
 
  }


    </div>
  )
}
