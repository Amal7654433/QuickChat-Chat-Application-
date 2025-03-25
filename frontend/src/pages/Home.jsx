import React, { useEffect,useState } from 'react'
import { userAuthStore } from '../store/userAuth'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import { useChatStore } from '../store/useChatStore'
import NoChatSelected from '../components/NoChatSelected'

const Home = () => {
  const { selectedUser } = useChatStore()
  const [ddd,setddd]=useState(false)
  console.log(ddd)

  return (
    <div className="flex">
      
      <Sidebar setddd={setddd} />
    <p>{ddd}</p>
      {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
  
    

    </div>




  )
}

export default Home