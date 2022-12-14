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
import AnalyticsDefault from './Analytics/AnalyticsDefault';
import CreateUrl from './Default/CreateUrl';
import axios from 'axios';
import URLS from '../../extras/enviroment';
import {USER_LOGIN_SUCCESS,SET_MEMBERSHIP_CONFIG} from '../../redux/action/actionTypes'
import SecureDefault from './Secure/SecureDefault';
import UpgradePlans from './Upgrade/UpgradePlans';
import NotFound from '../NotFound';
import BioLinkDefault from './BioLink/BioLinkDefault';
import CreateBioLink from './BioLink/CreateBioLink';





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
        axios.get(URLS.CUSTOMER.GET_MEMVERSHIP_CONFIG+user.email).then(res=>{
          console.log('memebership configs',res.data)
          if(res.data.status){
            dispatch({type:SET_MEMBERSHIP_CONFIG,payload:{...res.data.data}})
          }
          
          dispatch({type:USER_LOGIN_SUCCESS,payload:{isLoggedIn:true,
            oauthDetails:user,
            userConfig:{}
            }})
            navigate('/dashboard/default')
        })
       
    
    } else {
        navigate('/')
    }
    });
   
   
},[])
  useEffect(()=>{
    
  },[location])

    var openNotificationWithIcon = (type,msg,desc) => {
      notification[type]({
        message: msg,
        description:desc
          
      });
    };
   

    const getRouteScreen = (path)=>{
      switch(path){
        case "/dashboard/default":
          return  <DashboardDefault/>
        case "/dashboard/default/create":
            return <CreateUrl/>
        case "/dashboard/analytics":
          return <AnalyticsDefault/>
        case "/dashboard/secure":
            return <SecureDefault/>
        case "/dashboard/upgrade":
            return <UpgradePlans/>
        case "/dashboard/bioLinks":
          return <BioLinkDefault/>
        case '/dashboard/bioLinks/create':
            return <CreateBioLink/>
        default:
            <NotFound/>
      }
        

    }
  return (

    <div>
      <Navbar/>
  
 
    <div className=''>
      {getRouteScreen(location.pathname)}
    </div>
    
    </div>



  )

}
