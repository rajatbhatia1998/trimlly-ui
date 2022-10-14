import React,{useState,useEffect} from 'react'
import { Breadcrumb, message,Divider } from 'antd';
import {
 useNavigate,useLocation
   } from "react-router-dom";
   import {BellFilled,CrownTwoTone,PlusCircleTwoTone} from '@ant-design/icons';

import { notification ,Modal} from 'antd';
import axios from 'axios';
import {useSelector,useDispatch} from 'react-redux'
import URLS from '../../../extras/enviroment'
import {getFormatedDate,getRedirectUrl} from '../../../extras/commanScript'
import BioPreview from './BioPreview';


export default function CreateBioLink() {
    const navigate = useNavigate()
    const [longUrl,setLongUrl] = useState('')
    const [customSlug,setCustomSlug] = useState("")
    const [isCreating,setIsCreating] = useState(false)
    const [isSecureUrl,setIsSecureUrl] = useState(false)
    const [linkLable,setlinkLable] = useState("")
    const [linkUrl,setlinkUrl] = useState("")
    const [linksArray,setLinksArray] = useState([])
     const [templateArray,setTemplateArray] = useState([
      {
        themeName:'Default',
        bgColor:'#ffffff',
        buttonStyles:'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
      },{
        themeName:'Dark paradise',
        bgColor:'#000000',
        buttonStyles:"text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
      },
      {
        themeName:'Unicorn',
        bgColor:'#D2D1F9',
        buttonStyles:"text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
      },
      {
themeName:'Blush',
bgColor:'#FCECFD',
buttonStyles:'text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 shadow-lg shadow-pink-500/50 dark:shadow-lg dark:shadow-pink-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'
      }
     ])
     const [currentTemplate,setCurrentTemplate] = useState(templateArray[0])
    const [isNewLink,setIsNewLink] = useState(false)
    const user = useSelector(state=>state.login.oauthDetails)
    const configs = useSelector(state=>state.configs)
    




    var openNotificationWithIcon = (type,msg,desc) => {
      notification[type]({
        message: msg,
        description:desc
          
      });
    };
  

   const onCreateClick = ()=>{
    setIsCreating(true)
      const body = {
        "userType":"CUSTOMER",
        "userId":user.email,
        "longUrl":'',
        "slug":customSlug?customSlug:undefined,
        "urlType":"BIO",
        "extensionData":{
          bioLinks:{
                links:linksArray,
                isApplied:false,
                template:currentTemplate
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
    const handleAddNewLink = ()=>{
        console.log(linkLable,linkUrl)
        if(linkLable.length>0 && linkUrl.length>0){
          setLinksArray([
            ...linksArray,
            {
              linkType:linkLable,
              url:linkUrl
          }
          ])
          setIsNewLink(false)
          setlinkLable("")
          setlinkUrl("")
        }else{
          message.error('Invalid inputs')
        }
    }
    
  return (
    <div className='container w-screen'>
  <Modal title="Add new link" open={isNewLink} onOk={handleAddNewLink} onCancel={()=>setIsNewLink(false)}>
    <div class="mb-6">
      <label for="linkLable" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Label for Link</label>
      <input value={linkLable} onChange={(e)=>setlinkLable(e.target.value)} type="text" name="linkLable" id="linkLable" placeholder="Example: Facebook" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required/>

      <label for="linkUrl" class="block mb-2 mt-2 text-sm font-medium text-gray-900 dark:text-gray-300">Url for Link</label>
      <input value={linkUrl} onChange={(e)=>setlinkUrl(e.target.value)} type="text" name="linkUrl" id="linkUrl" placeholder="Example: www.facebook.com/username" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required/>
  </div>
      </Modal>
      <div className='py-5 px-5 flex flex-col'>
      <Breadcrumb>
            <Breadcrumb.Item onClick={()=>navigate('/dashboard/default')}> <a>DASHBOARD</a></Breadcrumb.Item>
            <Breadcrumb.Item>
           CREATE BIO LINK
            </Breadcrumb.Item>
        </Breadcrumb>

      </div>
        
       <div className='flex flex-col w-screen sm:justify-around sm:flex-row'>
        {/* form left */}
       <div className='p-10 flex flex-col sm:w-1/2'>
      
      <div class="mb-6">
      {configs.membership.planType=='FREE' &&  <CrownTwoTone style={{marginRight:5}} twoToneColor='#FFD700'/>}
        <label for="slug" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Link Slug  </label>
        <input onChange={(e)=>setCustomSlug(e.target.value)} value={customSlug} disabled={configs.membership.planType=='FREE' ? true:false} type="text" id="slug" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Example: trimlly.com/slug" required/>
      </div>
     
      <div class="mb-6 cursor-pointer" onClick={()=>setIsNewLink(true)}>
        <span className=' flex flex-row items-center justify-start font-bold'>  <PlusCircleTwoTone spin style={{fontSize:16,marginRight:5}}/> Add New Link</span>
      </div>
   
   {linksArray.length>0 &&
    <div class="mb-6 flex flex-col p-1">
      {linksArray.map(link=>{
        return <span className='flex flex-col mb-2 p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700'>
          <span className='font-bold'>{link.linkType}</span> 
          <span>{link.url}</span>
        </span>
      })}
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
   
        {/* preview panel */}
        <div className='p-5 flex sm:w-1/3 h-auto flex-col items-center'  >
        <Divider > <span className='font-bold text-xl mt-5'>Active Theme</span></Divider>
          
          <BioPreview theme={currentTemplate} linksArray={linksArray}/>
         
          <Divider > <span className='font-bold text-xl mt-5'>Themes</span></Divider>
              <div id='themeSection' className='flex flex-row flex-wrap justify-evenly items-center'>
                {templateArray.map((template)=>{
                return <span className='m-5 flex flex-col justify-center items-center' onClick={()=>setCurrentTemplate(template)} >
                  <BioPreview theme={template} linksArray={[]}/>
                  <span>{template.themeName}</span>
                  </span>
              })}
            </div>
        </div>
       </div>
       
    </div>
  )
}
