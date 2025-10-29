import React, { useRef, useState } from 'react'
import Button from '../../components/button/Button'
import EyeIcon from '../../icons/EyeIcon'
import axios  from 'axios'
import { useNavigate } from 'react-router-dom'


const AdminLogin = () => {
    const [isPwdVsble , setIsPwdVsble] = useState(false)
    const [isClickable, setIsClickable] = useState(true)
    const navigate = useNavigate()
    const usnRef = useRef<HTMLInputElement>(null)
      const pwdRef = useRef<HTMLInputElement>(null)

      async function login(){
        setIsClickable(false)
  const usnVal:string | undefined = usnRef.current?.value
const pwdVal : string | undefined = pwdRef.current?.value

   if(usnVal?.trim() == "" || pwdVal?.trim() == "") {
alert("input cannot be empty")
   }else{
let response;

  try{
 response= await axios.post("https://hostel-code.onrender.com/login",{
    usn : usnVal,
    password :pwdVal
})
console.log(response)
localStorage.setItem("token",response.data.token)
navigate("/generateQr")

  }
  catch(e){
    console.log(e)
  }
  setIsClickable(true)
}
}

  function isPasswordVisible(){
    setIsPwdVsble(e => !e)
  }


  return (
    <div className='h-screen w-full p-4 flex justify-center items-center '>
      
        <div className='h-120 w-80 mb-20 border border-slate-400 rounded-lg pt-3'>
          <div className='flex justify-center items-center p-3 text-3xl flex-col'> 
          <h1>Admin Login</h1>
          <p className='text-sm'>Login to continue</p>
          </div>
         <div className='flex flex-col justify-center items-center pt-20'>
         
         <input placeholder='Username' ref={usnRef} type='text' spellCheck={false} onChange={(e)=>{
            let value = e.target.value
            
            e.target.value = value.toUpperCase()
         }} className=' placeholder:text-lg text-slate-600 mb-13 border-b border-slate-400 focus:outline-0 focus:border-b-2 '/>
         <div className='flex '>
         <input placeholder='Password' ref={pwdRef} type ={isPwdVsble ? "text" : "password"}  className=' mb-15 ml-4 placeholder:text-lg text-slate-600 border-b focus:outline-0 focus:border-b-2  border-slate-400 focus:border-b-2 '/>
         <EyeIcon OnClick={()=>{
          isPasswordVisible()
         }}/>
         </div>

         <Button isClickAble={isClickable}  varient="primary" text='Login' OnClick={()=>{
          login()
         }} />
         </div>
        </div>
    </div>
  )
}

export default AdminLogin