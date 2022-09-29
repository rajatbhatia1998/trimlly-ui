import React,{useEffect} from 'react'
import { useParams } from "react-router-dom";
import axios from 'axios'
import URLS from '../extras/enviroment';
export default function ShortUrlRedirect() {
    let params = useParams();
    useEffect(()=>{
        axios.get(URLS.GUEST_URL.GET_SLUG_DETAILS+params.slug).then(res=>{
          console.log("slug check",res)
          if(res.data.status){
            window.location.replace(res.data.data.longUrl)
          }else{
            //invalid url / slug not avaible
          }
        }).catch(err=>{
          console.log('some error',err)
        })
        
    },[])
  return (
    <div>Please wait redirecting !</div>
  )
}
