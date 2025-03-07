import { useEffect, useState } from 'react'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { userAuthStore } from './store/userAuth'
import { Loader } from 'lucide-react'
import Home from './pages/Home'
import { Toaster } from "react-hot-toast";
import Navbar from './components/Navbar'
import Profile from './pages/Profile'
function App() {
  const { authUser, isCheckingAuth, checkAuth } = userAuthStore()
  useEffect(() => {
    checkAuth()
  }, [])
  if (isCheckingAuth && !authUser) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin'></Loader>
      </div>
    )
  }
  return (
    < div data-theme="dark">
      <Navbar />
      <Routes>
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
        <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />} />
        <Route path='/signup' element={!authUser ? < Signup /> : <Navigate to="/" />} />
        <Route path='/profile' element={authUser ? < Profile /> : <Navigate to="/login" />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
