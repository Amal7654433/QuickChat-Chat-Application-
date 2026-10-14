import { ArrowLeft, X } from 'lucide-react'
import { useChatStore } from '../store/useChatStore'
import { userAuthStore } from '../store/userAuth'

const DEFAULT_AVATAR =
  'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg?semt=ais_hybrid'

const TypingDots = () => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
    {[0, 1, 2].map(i => (
      <span
        key={i}
        style={{
          display: 'inline-block',
          width: '5px', height: '5px', borderRadius: '50%',
          background: '#a78bfa',
          animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }}
      />
    ))}
    <style>{`
      @keyframes typingBounce {
        0%, 100% { transform: translateY(0); opacity: 0.4; }
        50%       { transform: translateY(-4px); opacity: 1; }
      }
    `}</style>
  </span>
)

const ChatHeader = ({ isMobile = false }) => {
  const { selectedUser, setSelectUser, typingUsers } = useChatStore()
  const { onlineUsers } = userAuthStore()

  const isOnline = onlineUsers.includes(selectedUser._id)
  const isTyping = !!typingUsers[selectedUser._id]

  return (
    <div
      className="glass"
      style={{
        padding: isMobile ? '10px 14px' : '12px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        borderTop: 'none', borderLeft: 'none', borderRight: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
        gap: '10px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '12px', flex: 1, minWidth: 0 }}>
        {/* Back arrow — mobile only */}
        {isMobile && (
          <button
            onClick={() => setSelectUser(null)}
            className="btn-glass"
            style={{
              width: '34px', height: '34px', padding: 0, flexShrink: 0,
              borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <ArrowLeft size={17} />
          </button>
        )}

        {/* Avatar */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <img
            src={selectedUser.profilePic || DEFAULT_AVATAR}
            alt={selectedUser.name}
            style={{
              width: isMobile ? '38px' : '42px',
              height: isMobile ? '38px' : '42px',
              borderRadius: '50%', objectFit: 'cover',
              border: '2px solid rgba(99,102,241,0.5)',
              boxShadow: '0 0 14px rgba(99,102,241,0.3)',
            }}
          />
          {isOnline && (
            <div
              className="online-dot"
              style={{ position: 'absolute', bottom: '1px', right: '1px', border: '2px solid rgba(6,6,15,0.8)' }}
            />
          )}
        </div>

        {/* Name + status */}
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'nowrap', overflow: 'hidden' }}>
            <h3 style={{
              fontWeight: 600,
              fontSize: isMobile ? '0.9rem' : '0.95rem',
              color: 'var(--text-primary)',
              margin: 0, lineHeight: 1.3,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              flexShrink: 1,
            }}>
              {selectedUser.name}
            </h3>
            {selectedUser.username && (
              <span style={{ fontSize: '0.72rem', color: '#7c6fd4', fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0 }}>
                @{selectedUser.username}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', minHeight: '16px' }}>
            {isTyping ? (
              <>
                <TypingDots />
                <span style={{ fontSize: '0.7rem', color: '#a78bfa' }}>typing...</span>
              </>
            ) : (
              <span style={{ fontSize: '0.7rem', color: isOnline ? '#4ade80' : 'var(--text-muted)' }}>
                {isOnline ? '● Online' : '○ Offline'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Close — desktop only */}
      {!isMobile && (
        <button
          onClick={() => setSelectUser(null)}
          className="btn-glass"
          style={{ width: '32px', height: '32px', padding: 0, flexShrink: 0, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <X size={15} />
        </button>
      )}
    </div>
  )
}

export default ChatHeader
