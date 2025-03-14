import React, { useEffect } from 'react'
import { userAuthStore } from '../store/userAuth'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import { useChatStore } from '../store/useChatStore'
import NoChatSelected from '../components/NoChatSelected'

const Home = () => {
  const { selectedUser } = useChatStore()

  return (
    <div className="flex">
      
      <Sidebar />
      {!selectedUser ? <NoChatSelected /> : <ChatContainer />}

    </div>




  )
}

export default Home