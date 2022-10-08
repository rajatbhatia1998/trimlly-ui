import React,{useState,useEffect} from 'react'
import {AppstoreOutlined,
    EditFilled,
    PlusOutlined,
    FilterOutlined,
    ReloadOutlined
    } from '@ant-design/icons';
import { Button, Menu,notification,Avatar,Radio, Space, Table, Tag ,Spin,Typography} from 'antd';
    
import { getAuth,signOut} from 'firebase/auth'
import {useSelector} from 'react-redux'
import axios from 'axios';
import {getFormatedDate,getRedirectUrl} from '../extras/commanScript'
import './css/dashboard.css'
const { Text, Link } = Typography;


const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
   
    },
    {
      title: 'Short Link',
      dataIndex: 'shortUrl',
      key: 'shortUrl',
      render: (url) =>  <Link style={{marginTop:10,marginBottom:10}} href={getRedirectUrl(url)} target="_blank">
      <Text type='danger' strong copyable italic>{url}</Text>
  </Link>,
    },
    {
      title: 'Original Link',
      dataIndex: 'longUrl',
      key: 'longUrl',
    },
    {
        title: 'Clicks',
        dataIndex: 'clicks',
        key: 'clicks',
      },
    {
      title: 'Actions',
      key: 'actions',
      dataIndex: 'actions',
      render: (_, { actions }) => (
        <>
          <EditFilled/>
        </>
      ),
    },
    
  ];
 
export default function DashboardDefault() {
    const [isFetching,setIsFetching] = useState(true)
    const [urlData,setUrlData] = useState([])
    
 
    
    useEffect(()=>{
        const data = [
            {
              key: '1',
              date: "2022-09-29T10:07:11.328Z",
              clicks: 32,
              shortUrl: 'trimlly.com/NU_r-oAVJ',
              longUrl: 'www.codifiedcoder.in',
            },
            {
              key: '2',
              date: "2022-09-28T10:07:11.328Z",
              clicks: 23,
              shortUrl: 'trimlly.com/NU_r-oAV',
              longUrl: 'www.google.com',
            },
          
          ];
        setTimeout(()=>{
            setIsFetching(false)
            setUrlData(data)
        },5000)
    },[])
      
  return (
    <div className="">
        {isFetching ? 
            <div className="flex justify-center align-middle p-10 m-10">
            <Spin tip='Loading...'/> : 
            </div>:
            <>
              <div className='flex flex-row justify-end mr-2'>
             
              <button className=' px-3 mr-2 py-1' style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-around'}}> 
              <FilterOutlined /> <span className='ml-1'>FILTER</span></button>
             
              <button className=' px-3 mr-2 py-1' style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-around'}}> 
              <ReloadOutlined /> <span className='ml-1'>REFRESH</span></button>

              <button className='bg-blue-700 text-white px-3 py-1' style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-around'}}> 
              <PlusOutlined /> <span className='ml-1'>CREATE</span></button>
            
            </div>
            
<div class="overflow-x-auto relative shadow-md sm:rounded-lg mt-2">
    
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
                   Short Link
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
              return <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td class="p-4 w-4">
                  <div class="flex items-center">
                      <input id="checkbox-table-search-1" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                      <label for="checkbox-table-search-1" class="sr-only">checkbox</label>
                  </div>
              </td>
              <th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {getFormatedDate(url.date)}
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
              <EditFilled/>
              </td>
          </tr>
            })}
        </tbody>
    </table>
</div>


            </>
        }
        
        
        </div>
  )
}