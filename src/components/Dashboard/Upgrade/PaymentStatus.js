import React,{useState,useEffect} from 'react'
import { Button, Result ,notification} from 'antd';
import { useParams,useNavigate } from "react-router-dom";
import axios from 'axios'
import URLS from '../../../extras/enviroment';

export default function PaymentStatus() {
    let params = useParams();
    const navigate = useNavigate()
    const [isLoading,setIsLoading] = useState(false)
    useEffect(()=>{
      setIsLoading(true)
      
        
    },[])
    var openNotificationWithIcon = (type,msg,desc) => {
        notification[type]({
          message: msg,
          description:desc
            
        });
      };
  return (
    <div className='container mx-auto'>
         <Result
    status="success"
    title={`Successfully Purchased ${params.planType} Subscription`}
    subTitle={`Order number: ${params.orderId}  , Please check dashbaord to access features!`}
    extra={[
      <Button type="primary" key="console" 
        onClick={()=>{
            
            navigate('/dashboard/default')
            setTimeout(()=>{
                openNotificationWithIcon('success','Payment Successfull','Thanks for buying the plan !')
            },2000)
        }}
      >
        Go Dashboard
      </Button>,
     
    ]}
  />
    </div>
  )
}
