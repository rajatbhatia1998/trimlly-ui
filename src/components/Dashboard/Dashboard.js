import React,{useEffect, useState} from 'react'
import {BellFilled
} from '@ant-design/icons';
import { Button, Menu,notification,Avatar,Radio, Space, Table, Tag } from 'antd';
import {
  useNavigate,useLocation
 } from "react-router-dom";
import { getAuth,signOut,onAuthStateChanged} from 'firebase/auth'
import {useDispatch, useSelector} from 'react-redux'

import DashboardDefault from './Default/DashboardDefault';
import Navbar from '../Navbar';
import Analytics from './Analytics';
import CreateUrl from './Default/CreateUrl';


export default function Dashboard() {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showDrawer,setShowDrower] = useState(true)
  const [currentMenu,setCurrentMenu] = useState('DASHBOARD')
  const user = useSelector(state=>state.login.oauthDetails)
  const location = useLocation();

  useEffect(()=>{
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        console.log('auth state check',user)
    if (user) {
        const uid = user.uid;
        openNotificationWithIcon('success','Login Success','Logged in successfully!')
        
        dispatch({type:'USER_LOGIN_SUCCESS',payload:{isLoggedIn:true,
        oauthDetails:user,
        userConfig:{membership:{plan:'TIER 1',planExpiry:'22/10/2023',planStarted:'22/10/2022'}}
        }})
        navigate('/dashboard/default')
    
    } else {
        navigate('/')
    }
    });
   
   
},[])
  useEffect(()=>{
    // console.log('route changed',location)
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
