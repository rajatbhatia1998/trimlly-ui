import React,{useEffect} from 'react'
import { useParams } from "react-router-dom";
export default function ShortUrlRedirect() {
    let params = useParams();
    useEffect(()=>{
        let longUrl = 'https://www.codifiedcoder.in'
        
        window.location.replace(longUrl)
        console.log("short url params",params)
    },[])
  return (
    <div>Please wait redirecting !</div>
  )
}
