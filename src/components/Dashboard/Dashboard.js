import React,{useEffect, useState} from 'react'
import {BellFilled
} from '@ant-design/icons';
import { Button, Menu,notification,Avatar,Radio, Space, Table, Tag } from 'antd';
import {
  useNavigate,useLocation
 } from "react-router-dom";
import { getAuth,signOut} from 'firebase/auth'
import {useSelector} from 'react-redux'

import DashboardDefault from './Default/DashboardDefault';
import Navbar from '../Navbar';
import Analytics from './Analytics';
import CreateUrl from './Default/CreateUrl';


export default function Dashboard() {

  const navigate = useNavigate()
  const [showDrawer,setShowDrower] = useState(true)
  const [currentMenu,setCurrentMenu] = useState('DASHBOARD')
  const user = useSelector(state=>state.login.oauthDetails)
  const location = useLocation();

  useEffect(()=>{
    console.log('route changed',location)
  },[location])

    var openNotificationWithIcon = (type,msg,desc) => {
      notification[type]({
        message: msg,
        description:desc
          
      });
    };
    const handleLogout = ()=>{
      const auth = getAuth();
    signOut(auth).then(() => {
      openNotificationWithIcon('success',
      'Logout Success',
      'You have been logged out successfully !'
      )
      navigate('/')
    }).catch((error) => {
      openNotificationWithIcon('error',
      'Service error',
      error.errorMessage
      )
      });
    };

  return (

    <div>
      <Navbar/>
  
 
    <div className=''>
      {location.pathname==="/dashboard/default" && <DashboardDefault/>}
      {location.pathname==="/dashboard/default/create" && <CreateUrl/>}
      {location.pathname==="/dashboard/analytics" && <Analytics/>}
    </div>
    
    </div>



  )

}
