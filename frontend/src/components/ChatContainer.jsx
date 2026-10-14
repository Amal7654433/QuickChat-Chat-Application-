import { useEffect, useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './chatHead'
import MessageInput from './InputBox'
import { userAuthStore } from '../store/userAuth'
import { Check, CheckCheck } from 'lucide-react'

const DEFAULT_AVATAR =
  'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg?semt=ais_hybrid'

const EMOJI_OPTIONS = ['👍', '❤️', '😂', '😮', '😢', '🔥']

function groupReactions(reactions = []) {
  const map = {}
  for (const r of reactions) map[r.emoji] = (map[r.emoji] || 0) + 1
  return Object.entries(map)
}

// ── Reaction picker popup ────────────────────────────────────────────
const ReactionPicker = ({ onSelect, onClose }) => (
  <div
    style={{
      position: 'absolute',
      bottom: 'calc(100% + 6px)',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex', gap: '4px',
      background: 'rgba(12,12,24,0.95)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: '24px',
      padding: '6px 10px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,58,237,0.15)',
      zIndex: 50,
      animation: 'slide-up 0.15s ease-out',
      whiteSpace: 'nowrap',
    }}
  >
    {EMOJI_OPTIONS.map(emoji => (
      <button
        key={emoji}
        onClick={() => { onSelect(emoji); onClose() }}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '1.25rem', lineHeight: 1, padding: '2px 4px',
          borderRadius: '8px', transition: 'transform 0.15s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.3)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
      >
        {emoji}
      </button>
    ))}
  </div>
)

// ── Single message bubble ────────────────────────────────────────────
const MessageBubble = ({ message, isMine, authUser, selectedUser, onReact }) => {
  const [showPicker, setShowPicker] = useState(false)
  const [hovered, setHovered]       = useState(false)
  const pickerRef = useRef(null)

  const reactionGroups = groupReactions(message.reactions)
  const myReaction = message.reactions?.find(
    r => r.userId === authUser._id || r.userId?._id === authUser._id
  )?.emoji

  useEffect(() => {
    if (!showPicker) return
    const handler = e => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) setShowPicker(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showPicker])

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        justifyContent: isMine ? 'flex-end' : 'flex-start',
        marginBottom: '10px',
        alignItems: 'flex-end',
        gap: '6px',
        position: 'relative',
      }}
    >
      {/* Their avatar */}
      {!isMine && (
        <img
          src={selectedUser.profilePic || DEFAULT_AVATAR}
          alt="avatar"
          style={{
            width: '28px', height: '28px', borderRadius: '50%',
            objectFit: 'cover', flexShrink: 0,
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMine ? 'flex-end' : 'flex-start', gap: '4px', position: 'relative', maxWidth: 'min(22rem, 78vw)' }}>
        {/* Reaction trigger + picker */}
        <div ref={pickerRef} style={{ position: 'relative', maxWidth: '100%' }}>
          {hovered && (
            <button
              onClick={() => setShowPicker(v => !v)}
              style={{
                position: 'absolute',
                [isMine ? 'left' : 'right']: '-26px',
                bottom: '4px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '50%',
                width: '22px', height: '22px',
                cursor: 'pointer', fontSize: '0.75rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(8px)',
                zIndex: 10,
              }}
            >
              😊
            </button>
          )}

          {showPicker && (
            <ReactionPicker
              onSelect={emoji => onReact(message._id, emoji)}
              onClose={() => setShowPicker(false)}
            />
          )}

          {/* Bubble */}
          <div className={isMine ? 'bubble-sent' : 'bubble-received'}>
            {message.image && (
              <img
                src={message.image}
                alt="attachment"
                style={{
                  maxWidth: '100%', width: 'min(200px, 60vw)',
                  borderRadius: '10px',
                  marginBottom: message.text ? '8px' : 0,
                  display: 'block',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              />
            )}
            {message.text && (
              <p style={{ margin: 0, lineHeight: 1.5, fontSize: '0.875rem', wordBreak: 'break-word' }}>
                {message.text}
              </p>
            )}
          </div>
        </div>

        {/* Reactions */}
        {reactionGroups.length > 0 && (
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
            {reactionGroups.map(([emoji, count]) => (
              <button
                key={emoji}
                onClick={() => onReact(message._id, emoji)}
                style={{
                  background: myReaction === emoji ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.07)',
                  border: myReaction === emoji ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px', padding: '2px 7px',
                  fontSize: '0.8rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '3px',
                  color: 'var(--text-primary)', transition: 'all 0.15s ease',
                }}
              >
                <span>{emoji}</span>
                {count > 1 && <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{count}</span>}
              </button>
            ))}
          </div>
        )}

        {/* Timestamp + read receipt */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0 4px' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isMine && (
            message.read
              ? <CheckCheck size={13} color="#818cf8" />
              : <Check      size={13} color="var(--text-muted)" />
          )}
        </div>
      </div>

      {/* My avatar */}
      {isMine && (
        <img
          src={authUser.profilePic || DEFAULT_AVATAR}
          alt="me"
          style={{
            width: '28px', height: '28px', borderRadius: '50%',
            objectFit: 'cover', flexShrink: 0,
            border: '1px solid rgba(99,102,241,0.5)',
          }}
        />
      )}
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────
const ChatContainer = ({ isMobile = false }) => {
  const { selectedUser, getMessages, messages, isMessagesLoading, Listener, NotListener, reactToMessage } = useChatStore()
  const { authUser } = userAuthStore()
  const messageEndRef = useRef(null)

  useEffect(() => {
    getMessages(selectedUser._id)
    Listener()
    return () => NotListener()
  }, [selectedUser, getMessages, Listener, NotListener])

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  if (isMessagesLoading) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <ChatHeader isMobile={isMobile} />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: 'linear-gradient(135deg,#7c3aed,#06b6d4)',
                animation: `bounce 1.2s ease-in-out ${i * 0.15}s infinite`,
                boxShadow: '0 0 8px rgba(124,58,237,0.5)',
              }}
            />
          ))}
          <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
        </div>
        <MessageInput />
      </div>
    )
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <ChatHeader isMobile={isMobile} />

      <div
        className="custom-scroll"
        style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '12px 12px 6px' : '20px 24px 8px' }}
      >
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '0.875rem' }}>No messages yet. Say hello! 👋</p>
          </div>
        )}

        {messages.map(message => (
          <MessageBubble
            key={message._id}
            message={message}
            isMine={message.senderId === authUser._id}
            authUser={authUser}
            selectedUser={selectedUser}
            onReact={reactToMessage}
          />
        ))}

        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  )
}

export default ChatContainer
