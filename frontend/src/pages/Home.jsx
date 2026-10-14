import { useChatStore } from '../store/useChatStore'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import NoChatSelected from '../components/NoChatSelected'
import { useIsMobile } from '../hooks/useIsMobile'

const Home = () => {
  const { selectedUser } = useChatStore()
  const isMobile = useIsMobile()

  if (isMobile) {
    // Mobile: full-screen sidebar OR full-screen chat (like WhatsApp)
    return (
      <div style={{ height: 'calc(100vh - 56px)', overflow: 'hidden', position: 'relative' }}>
        {!selectedUser ? (
          <Sidebar isMobile />
        ) : (
          <ChatContainer isMobile />
        )}
      </div>
    )
  }

  // Desktop: side-by-side
  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 56px)', overflow: 'hidden' }}>
      <Sidebar />
      {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
    </div>
  )
}

export default Home
