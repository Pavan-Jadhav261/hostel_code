
import React from 'react'

import LandingPage from './pages/landingPage/LandingPage'
import SignUp from './pages/SignUp/SignUp'
import Login from './pages/Login/Login'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Details from './pages/Details/Details'
import Qrgenerator from './pages/qr generator/Qrgenerator'
import ScanQr from './pages/ScanQr/ScanQr'
import { Analytics } from '@vercel/analytics/react';
import OutStudents from './pages/StudentsOut/StudentsOut'
import AdminLogin from './pages/Login/AdminLogin'
import ScanningStatus from './pages/ScanningStatus/ScanningStatus'
const App = () => {
  return (
    <>

    <BrowserRouter>
    <Routes>
      <Route path='/' element = {<LandingPage/>} />
      <Route path='/signup' element={<SignUp/>}/>
      <Route path='/login' element = {<Login/>} />
      <Route path='/details' element = {<Details/>} />
      <Route path='/scanner' element={<ScanQr/>}/>
      <Route path = "/generateQr" element={<Qrgenerator/>}/>
      <Route path='/outStudents' element = {<OutStudents/>}/>
      <Route path='/adminLogin' element={<AdminLogin/>} />
      <Route path='/scanStatus' element = {<ScanningStatus/>}/>
      </Routes>
      </BrowserRouter>
        <Analytics />
        </>
  )
}

export default App