import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'
import SignUp from './SignUp'
import Spend from './Spend'
import './index.css'

const root = createRoot(document.getElementById('root'))
root.render((
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/propose/spend" element={<Spend />} />
      <Route path="/propose/user" element={<SignUp />} />
    </Routes>
  </BrowserRouter>
))
