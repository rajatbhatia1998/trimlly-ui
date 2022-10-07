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
              date: getFormatedDate("2022-09-29T10:07:11.328Z"),
              clicks: 32,
              shortUrl: 'trimlly.com/NU_r-oAVJ',
              longUrl: 'www.google.com',
            },
          
          ];
        setTimeout(()=>{
            setIsFetching(false)
            setUrlData(data)
        },5000)
    })
      
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
            <Table columns={columns} dataSource={urlData} />

            </>
        }
        
        
        </div>
  )
}
