import React, { useEffect } from 'react'
import { userAuthStore } from '../store/userAuth'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'

const Home = () => {

  return (

    <div className="flex">
    <Sidebar />
    <ChatContainer/>
   
  </div>
  
   
  )
}

export default Home