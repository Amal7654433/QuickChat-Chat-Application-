import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'

const ChatContainer = () => {
  const { selectedUser,getMessages } = useChatStore()
  useEffect(()=>
  {
    getMessages(selectedUser._id)
  },[])
  console.log(selectedUser)
  return (
    <div>{selectedUser?.name}</div>
  )
}

export default ChatContainer