import { useEffect } from 'react'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { userAuthStore } from './store/userAuth'
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
      <div className="auth-mesh flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="spinner-ring" />
          <p className="gradient-text font-semibold tracking-wide">QuickChat</p>
        </div>
      </div>
    )
  }

  return (
    <div data-theme="dark" style={{ position: 'relative', minHeight: '100vh' }}>
      <div className="app-bg" />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />
        <Routes>
          <Route path="/login"   element={!authUser ? <Login />   : <Navigate to="/" />} />
          <Route path="/"        element={authUser  ? <Home />    : <Navigate to="/login" />} />
          <Route path="/signup"  element={!authUser ? <Signup />  : <Navigate to="/" />} />
          <Route path="/profile" element={authUser  ? <Profile /> : <Navigate to="/login" />} />
        </Routes>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#e2e8f0',
            borderRadius: '12px',
          },
        }}
      />
    </div>
  )
}

export default App
