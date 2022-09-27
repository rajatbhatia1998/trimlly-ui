import React from 'react'
import {Spin} from 'antd'
export default function Spinner() {
    return (
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh"}}>
                <Spin size="large"/>

            </div>
    )
}
