import React,{useState} from 'react'
import {AppstoreOutlined,
ContainerOutlined,
DesktopOutlined,
MailOutlined,
MenuFoldOutlined,
MenuUnfoldOutlined,
PieChartOutlined,
} from '@ant-design/icons';
import { Button, Menu,notification } from 'antd';

import { getAuth,signOut} from 'firebase/auth'



import { useNavigate} from 'react-router-dom';


export default function Dashboard() {
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false);

  var openNotificationWithIcon = (type,msg,desc) => {
    notification[type]({
      message: msg,
      description:desc
        
    });
  };
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    };
  }

  const items = [
    getItem('Dashboard', '1', <PieChartOutlined />),
    getItem('Bio Links', '2', <DesktopOutlined />),
    getItem('API', '3', <ContainerOutlined />),
   
    getItem('Profile', 'profileSub', <AppstoreOutlined />, [
      getItem('Update Pofile', '4'),
      getItem('Logout', '5'),
    ]),

    getItem('Upgrade', '6', <ContainerOutlined />),
    getItem('Help & Support', '7', <ContainerOutlined />),
  ];
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
  }
  const handleMenuClick = (e)=>{
    const {key,  keyPath,domEvent} = {...e}
    console.log("menu clicked",key,  keyPath,domEvent)
    //handle logout
    if(key==='5'){
      handleLogout()
    }
  }
  return (
    <div
      style={{
        width: 256,
      }}
    >
      <Button
        type="primary"
        onClick={toggleCollapsed}
        style={{
          marginBottom: 16,
        }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <Menu
        onClick={handleMenuClick}
        mode="inline"
        theme="light"
        inlineCollapsed={collapsed}
        items={items}
      />
    </div>
  )
}
