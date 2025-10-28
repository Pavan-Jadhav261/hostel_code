import React, { useRef, useState } from 'react'
import Button from '../../components/button/Button'
import axios from 'axios'

const Details = () => {
        const nameRef = useRef<HTMLInputElement>(null)
        const phoneRef = useRef<HTMLInputElement>(null)
        const roomNoRef = useRef<HTMLInputElement>(null)
    const [isClickable, setIsClickable] = useState(true)

async function addDetails(){
           setIsClickable(prev => !prev)
const nameVal = nameRef.current?.value
const phoneVal = phoneRef.current?.value
const roomVal  = roomNoRef.current?.value
if(nameVal?.trim()=="" || phoneVal?.trim()=="" || roomVal?.trim()==""){
    alert ("input cannot be empty")
    return
}
const token = localStorage.getItem("token")
 
    const response = await axios.post("http://localhost:3000/details",{
        name : nameVal,
        phoneNo : phoneVal,
        roomNo : roomVal,
    },{
            headers:{
                token : token
            }
        })
        console.log(response.data.msg)
    setIsClickable(true)


}

  return (
    <div className='h-screen w-full  flex justify-center items-center'>
        <div className='border border-slate-800  h-100 w-80 rounded-md '>
            <div className='flex justify-center items-center p-5 mb-4'>
                <h1 className='text-2xl'>Enter your details</h1>
            </div>
                <div className='flex justify-center items-center flex-col'>
                <input type="text" ref={nameRef} placeholder='Full Name' className='ml-5 m-4 pr-20 border-b placeholder:text-shadow-slate-300  focus:outline-0 focus:border-b-2' />
                 <input type="text" placeholder='Phone no.' ref={phoneRef} className='ml-5 m-4 pr-20 border-b placeholder:text-shadow-slate-300  focus:outline-0 focus:border-b-2' />
                 <input type="text" placeholder='Room no.' ref={roomNoRef} maxLength={5} className='ml-5 m-4 pr-20 border-b placeholder:text-shadow-slate-300  focus:outline-0 focus:border-b-2' />
                 <div className='pt-5'>
                 <Button varient="primary" isClickAble={isClickable} text='Submit' OnClick={()=>{
                    addDetails()
                 }} />
                 </div>
            </div>
        </div>
    </div>
  )
}

export default Details