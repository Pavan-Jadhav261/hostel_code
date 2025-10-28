import React, { useState } from 'react'
import Button from '../../components/button/Button'
import { useNavigate } from 'react-router-dom'

const LandingPage = () => {
  const navigate = useNavigate()
      const [isClickable, setIsClickable] = useState(true)
  
  function signup(){
navigate("/signup")
  }

   function login(){
navigate("/login")
  }
  return (
   <div className='h-screen w-full p-4 flex justify-center items-center flex-col'>
      <div className='flex justify-between items-center flex-col gap-5 mb-30'>
        <h1 className='text-3xl font-extrabold'>BITM Hostel Outing</h1>
        <div className='flex flex-col gap-2'>  
           <Button isClickAble={isClickable} varient="primary" text='Signup' OnClick={()=>{
            signup()
           }} />
        <Button varient='primary' isClickAble={isClickable} text= 'Login'OnClick={()=>{
          login()
        }}/></div>
      </div>
    </div>
  )
}

export default LandingPage