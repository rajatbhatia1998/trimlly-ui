import React,{useState,useEffect} from 'react'
import { Breadcrumb } from 'antd';
import {

    useNavigate,useLocation
   } from "react-router-dom";
export default function CreateUrl() {
    const navigate = useNavigate()
  return (
    <div>

        <Breadcrumb>
            <Breadcrumb.Item onClick={()=>navigate('/dashboard/default')}> <a>Dashboard</a></Breadcrumb.Item>
            <Breadcrumb.Item>
           Create
            </Breadcrumb.Item>
        </Breadcrumb>

    </div>
  )
}
