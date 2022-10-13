import React,{useState,useEffect} from 'react'
import { Breadcrumb } from 'antd';
import {
 useNavigate,useLocation
   } from "react-router-dom";
   import {BellFilled,CrownTwoTone} from '@ant-design/icons';

import { notification } from 'antd';
import axios from 'axios';
import {useSelector,useDispatch} from 'react-redux'
import URLS from '../../../extras/enviroment'
import {getFormatedDate,getRedirectUrl} from '../../../extras/commanScript'


export default function CreateUrl() {
    const navigate = useNavigate()
    const [longUrl,setLongUrl] = useState('')
    const [customSlug,setCustomSlug] = useState("")
    const [isCreating,setIsCreating] = useState(false)
    const [isSecureUrl,setIsSecureUrl] = useState(false)
    const [linkPassword,setLinkPassword] = useState("")
    const user = useSelector(state=>state.login.oauthDetails)
    const configs = useSelector(state=>state.configs)
    




    var openNotificationWithIcon = (type,msg,desc) => {
      notification[type]({
        message: msg,
        description:desc
          
      });
    };
    const resetForm = ()=>{
      setLongUrl('')
    }

   const onCreateClick = ()=>{
    setIsCreating(true)
      const body = {
        "userType":"CUSTOMER",
        "userId":user.email,
        "longUrl":longUrl,
        "slug":customSlug?customSlug:undefined
      }
      if(isSecureUrl){
        body['urlType'] = 'SECURE'
        body['extensionData'] = {
          
          secureLink:{
              password:linkPassword,
              isApplied:true
          }
          
        }
      }
      axios.post(URLS.CUSTOMER.CREATE_SHORTN,body).then(res=>{
        console.log(res)
        setIsCreating(false)
        if(res.data.status){
          openNotificationWithIcon('success',res.data.message,`Your url ${longUrl} shortnd to ${res.data.data.shortUrl}`) 
          setTimeout(()=>{
            navigate('/dashboard/default')
          },2000)
        }else{
          openNotificationWithIcon('error','SERIVCE ERROR',res.data.message)
        }
      }).catch(err=>{
        openNotificationWithIcon('error','SERIVCE ERROR',err.message)
      })
    }
  return (
    <div>

      <div className='py-5 px-5 flex flex-col'>
      <Breadcrumb>
            <Breadcrumb.Item onClick={()=>navigate('/dashboard/default')}> <a>DASHBOARD</a></Breadcrumb.Item>
            <Breadcrumb.Item>
           CREATE
            </Breadcrumb.Item>
        </Breadcrumb>

      </div>
       
      {/* form */}
       <div className='p-10'>
      
  <div class="mb-6">
  {configs.membership.planType=='FREE' &&  <CrownTwoTone style={{marginRight:5}} twoToneColor='#FFD700'/>}
    <label for="slug" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Link Slug     </label>

    <input onChange={(e)=>setCustomSlug(e.target.value)} value={customSlug} disabled={configs.membership.planType=='FREE' ? true:false} type="text" id="slug" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Custom Slug" required/>
  </div>
  <div class="mb-6">
    <label for="longUrl" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Orginal Link</label>
    <input value={longUrl} onChange={(e)=>setLongUrl(e.target.value)} type="text" id="longUrl" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required placeholder='Example: www.google.com'/>
  </div>
  
  <div class="flex items-start mb-6">
    <div class="flex items-center h-5">
    {configs.membership.planType=='FREE' &&  <CrownTwoTone style={{marginRight:5}} twoToneColor='#FFD700'/>}
      <input onChange={e=>{setIsSecureUrl(e.target.checked)}} disabled={!configs.configs.secureLinksAllowed} id="passwordProtected" type="checkbox" value={isSecureUrl} class="w-4 h-4 bg-gray-50 rounded border border-gray-300 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800" required/>
    </div>
    <label for="passwordProtected" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Password Protected ? </label>
  </div>
  {
    isSecureUrl &&
  <div class="mb-6">
      <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Enter Password for your link</label>
      <input value={linkPassword} onChange={(e)=>setLinkPassword(e.target.value)} type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required/>
    </div>
}
  {isCreating ? <button disabled type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
    <svg aria-hidden="true" role="status" class="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
    </svg>
    Loading...
</button>:
 <button onClick={()=>onCreateClick()}  class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">CREATE</button>
}
 
       </div>
    </div>
  )
}
