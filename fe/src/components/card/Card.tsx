import React from 'react'

interface CardProps{
    name : string;
    phoneNo : string;
    roomNo : string;
}

const Card = (props : CardProps) => {
  return (
    <div className='h-20 px-5  w-70 border-slate-500 border m-3 rounded-lg'>
        <div className='felx justify-start items-center flex-col gap-1'>
            <h1>Name: {props.name} </h1>
            <h1>RoomNo: {props.roomNo}</h1>
            <h1>PhoneNo: {props.phoneNo}</h1>
        </div>
    </div>
  )
}

export default Card