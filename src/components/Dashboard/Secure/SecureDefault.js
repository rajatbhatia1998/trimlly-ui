import React,{useState,useEffect} from 'react'
import {AppstoreOutlined,
    EditFilled,
    PlusOutlined,
    FilterOutlined,
    ReloadOutlined,
    BarcodeOutlined,
    BarChartOutlined,
    DeleteFilled
    } from '@ant-design/icons';
import {Popconfirm,Breadcrumb, Result,Button, Empty,notification,Spin,Typography,Modal, message} from 'antd';
  import {
  BrowserRouter as Router,
  Routes,
  Route,
  redirect,
  useNavigate
 } from "react-router-dom";  
import { getAuth,signOut} from 'firebase/auth'
import {useSelector,useDispatch} from 'react-redux'
import axios from 'axios';
import URLS from '../../../extras/enviroment'
import {getFormatedDate,getRedirectUrl} from '../../../extras/commanScript'
import '../../css/dashboard.css'
import QRCode from 'qrcode.react'
import {ADD_CUSTOMER_LINKS} from '../../../redux/action/actionTypes'
const { Text, Link } = Typography;

export default function SecureDefault() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
    const [isFetching,setIsFetching] = useState(true)
    const urlData = useSelector(state=>state.dashboard.secureLinks)
    const user = useSelector(state=>state.login.oauthDetails)
    const [generateQrCode,setGenerateQrCode] = useState(false)
    const [selectedUrl,setSelectedUrl] = useState({})
    var openNotificationWithIcon = (type,msg,desc) => {
      notification[type]({
        message: msg,
        description:desc
          
      });
    };
    const fetchCustomerUrls = ()=>{
      setIsFetching(true)
        axios.get(URLS.CUSTOMER.GET_USER_URLS+user.email).then((res)=>{
          console.log('url res',res)
          setIsFetching(false)
       
          if(res.data.status){
            if(res.data.data.length>0){
              dispatch({type:ADD_CUSTOMER_LINKS,payload:res.data.data})
            }else{
              dispatch({type:ADD_CUSTOMER_LINKS,payload:[]})
            }
           
          }else{
            dispatch({type:ADD_CUSTOMER_LINKS,payload:[]})
            openNotificationWithIcon('error',
            'ERROR',
            res.data.message
            )
          }
        })
      }
    const handleDeleteSlug = (slug)=>{
      axios.post(URLS.CUSTOMER.DELETE_SLUG + slug).then(res=>{
        if(res.data.status){
          openNotificationWithIcon('success',
          'Delete Success',
          res.data.message
          )
          fetchCustomerUrls()
        }else{
          openNotificationWithIcon('error',
          'ERROR',
          res.data.message
          )
        }
      }).catch(err=>{
        openNotificationWithIcon('error',
        'ERROR',
        err
        )
      })
    }
    const handleDownload = ()=>{
      const canvas = document.getElementById(selectedUrl.slug);
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${selectedUrl.slug}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
    const handleDownloadCancle = ()=>{
      setGenerateQrCode(false)
    }
    const showQrCode = (url)=>{
      setGenerateQrCode(true)
      setSelectedUrl(url)
    }
  return (
    <>
    {isFetching ? 
      <div className="flex justify-center align-middle p-10 m-10">
      <Spin tip='Loading...'/> : 
      </div>:
    <div className=''>
       <div className='py-5 px-5 flex flex-col'>
      <Breadcrumb>
            <Breadcrumb.Item onClick={()=>navigate('/dashboard/default')}> <a>DASHBOARD</a></Breadcrumb.Item>
            <Breadcrumb.Item>
           SECURE LINKS
            </Breadcrumb.Item>
        </Breadcrumb>

      </div>
       <div className='flex flex-row justify-end mr-2 mt-3'>
             
             <button className=' px-3 mr-2 py-1' style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-around'}}> 
             <FilterOutlined /> <span className='ml-1'>FILTER</span></button>
            
             <button onClick={()=>{fetchCustomerUrls()}} className=' px-3 mr-2 py-1' style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-around'}}> 
             <ReloadOutlined /> <span className='ml-1'>REFRESH</span></button>

             <button onClick={()=>{navigate('/dashboard/default/create')}} className='bg-blue-700 text-white px-3 py-1' style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-around'}}> 
             <PlusOutlined /> <span className='ml-1'>CREATE</span></button>
           
           </div>
           <Modal
        open={generateQrCode}
        title={`QR CODE - ${selectedUrl.shortUrl}`}
        onOk={handleDownload}
        onCancel={handleDownloadCancle}
        footer={[
          <Button key="cancle" onClick={handleDownloadCancle}>
            Cancle
          </Button>,
          <Button key="download" type="primary"  onClick={handleDownload}>
            Download
          </Button>
        ]}
      >
        <div className='flex justify-center items-center'>
        <QRCode
        id={selectedUrl.slug}
        value={selectedUrl.shortUrl}
        size={290}
        level={"H"}
        includeMargin={true}
      />
        </div>
          
      </Modal>

            {
              (urlData.length!==0) ?


        <div class="overflow-x-auto relative shadow-md sm:rounded-lg mt-10">
                
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="p-4">
                                <div class="flex items-center">
                                  
                                </div>
                            </th>
                            <th scope="col" class="py-3 px-6">
                                Date
                            </th>
                            <th scope="col" class="py-3 px-6">
                              Short Link (Secured)
                            </th>
                            <th scope="col" class="py-3 px-6">
                                Original Link
                            </th>
                            <th scope="col" class="py-3 px-6">
                                Clicks
                            </th>
                            <th scope="col" class="py-3 px-6">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        {urlData.map(url=>{
                          return <tr key={url.key} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                          <td class="p-4 w-4">
                              <div class="flex items-center">
                                  <input id="checkbox-table-search-1" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                  <label htmlFor="checkbox-table-search-1" class="sr-only">checkbox</label>
                              </div>
                          </td>
                          <th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {getFormatedDate(url.timestamp)}
                          </th>
                          <td class="py-4 px-6">
                          <Link style={{marginTop:10,marginBottom:10}} href={getRedirectUrl(url.shortUrl)} target="_blank">
                          <Text type='danger' strong copyable italic>{url.shortUrl}</Text>
                      </Link>
                          </td>
                          <td class="py-4 px-6">
                              {url.longUrl}
                          </td>
                          <td class="py-4 px-6">
                              {url.clicks}
                          </td>
                          <td class="py-4 px-6">
                            <span className='ml-2 cursor-pointer'>
                              <EditFilled style={{fontSize:20}} />
                            </span>
                            <span className='ml-2 cursor-pointer' onClick={()=>{showQrCode(url)}}>
                            <BarcodeOutlined style={{fontSize:20}} />
                            </span>
                            <span className='ml-2 cursor-pointer'>
                              <BarChartOutlined style={{fontSize:20}} />
                            </span>
                            <Popconfirm
                              title="Are you sure to delete this url?"
                              onConfirm={()=>handleDeleteSlug(url.slug)}
                              onCancel={()=>message.error('Delete Canceled !')}
                              okText="Yes"
                              cancelText="No"
                            >
                              <span className='ml-2 cursor-pointer' >
                              <DeleteFilled style={{fontSize:20}} />
                            </span>
                            </Popconfirm>
                            
                          </td>
                      </tr>
                        })}
                    </tbody>
                </table>
            </div>
              :
            <div className='mt-10 p-10'>
              <Empty/>
            
            </div>
            
            }
    </div>
          }
          </>
  )
}
