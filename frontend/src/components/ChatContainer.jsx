import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './chatHead'
import MessageInput from './InputBox'
import { userAuthStore } from '../store/userAuth'
import { Loader } from 'lucide-react'
const ChatContainer = () => {
  const { selectedUser, getMessages, messages, isMessagesLoading, Listener, NotListener } = useChatStore()
  const { authUser } = userAuthStore()
  const messageEndRef = useRef(null);
  useEffect(() => {
    getMessages(selectedUser._id)
    Listener()
    return () => NotListener()
  }, [selectedUser, getMessages, Listener, NotListener])
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  if (isMessagesLoading)
    return (
      <>
        <div className='flex justify-center content-center w-full bg-gray-200 text-gray-950'><span className="loading loading-ball loading-xs"></span>
          <span className="loading loading-ring loading-xl"></span>
          <span className="loading loading-ring loading-xl"></span>
          <span className="loading loading-ring loading-xl"></span>
          <span className="loading loading-ring loading-xl"></span>
          <span className="loading loading-ring loading-xl"></span>
        </div>
      </>
    )
  return (
    <div className="flex w-full flex-col h-screen bg-gray-100">
      {/* Chat Header */}
      <ChatHeader />

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => {
          const isAuthUser = message.senderId === authUser._id;
          return (
            <div  ref={messageEndRef}
              key={message._id}
              className={`flex ${isAuthUser ? 'justify-start' : 'justify-end'} mb-4`}
            >
              <div className="flex items-end">
                {isAuthUser && (
                  <img
                    src={authUser.profilePic || './avatar.png'}
                    alt="Profile"
                    className="w-8 h-8 rounded-full mr-2 shadow-md"
                  />
                )}
                <div
                  className={`relative p-4 max-w-xs rounded-2xl shadow-md text-sm ${isAuthUser
                    ? 'bg-blue-500 text-white rounded-bl-none'
                    : 'bg-gray-300 text-gray-700 rounded-br-none'
                    }`}
                >
                  {/* Message Timestamp */}

                  {/* Message Image */}
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="sm:max-w-[200px] rounded-md mb-2 border border-gray-300"
                    />
                  )}
                  {/* Message Text */}
                  {message.text && <p className="leading-tight break-words">{message.text}</p>}
                  <span className="text-xs opacity-70 mt-1 self-end">
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                {!isAuthUser && (
                  <img
                    src={selectedUser.profilePic || './avatar.png'}
                    alt="Profile"
                    className="w-8 h-8 rounded-full ml-2 shadow-md"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Input */}
      <MessageInput />
    </div>
  )
}

export default ChatContainer