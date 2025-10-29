
import React from 'react'

import LandingPage from './pages/landingPage/LandingPage'
import SignUp from './pages/SignUp/SignUp'
import Login from './pages/Login/Login'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Details from './pages/Details/Details'
import Qrgenerator from './pages/qr generator/Qrgenerator'
import ScanQr from './pages/ScanQr/ScanQr'

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element = {<LandingPage/>} />
      <Route path='/signup' element={<SignUp/>}/>
      <Route path='/login' element = {<Login/>} />
      <Route path='/details' element = {<Details/>} />
      <Route path='/scanner' element={<ScanQr/>}/>
      <Route path = "/generateQr" element={<Qrgenerator/>}/>
      </Routes>
      </BrowserRouter>
  )
}

export default App