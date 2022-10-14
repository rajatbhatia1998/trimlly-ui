import React, { useEffect } from 'react'

export default function BioPreview(props) {
    useEffect(()=>{
        console.log('props',props)
    },[])
  return (
    <div>
<span className='h-auto items-center  flex flex-col mb-2 p-6 max-w-sm  rounded-lg border border-gray-200 shadow-md' style={{backgroundColor:props.theme.bgColor}}>
    {(props.linksArray && props.linksArray.length>0)?
        <div className='flex flex-col'>
            {props.linksArray.map((link)=>{
                return <button className={props.theme.buttonStyles}>{link.linkType}</button>
            })}
        </div>
        :
    <div className='flex flex-col'>        
        <button className={props.theme.buttonStyles}></button>
        <button className={props.theme.buttonStyles}></button>
        <button className={props.theme.buttonStyles}></button>
        <button className={props.theme.buttonStyles}></button>
        </div>

    }
        

        </span>
    </div>
  )
}
