import { useState, useEffect } from 'react'
import { AlignRight, X, Search, Users, Image as ImageIcon } from 'lucide-react'
import { useChatStore } from '../store/useChatStore'
import { userAuthStore } from '../store/userAuth'

const DEFAULT_AVATAR =
  'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg?semt=ais_hybrid'

function formatTime(dateStr) {
  if (!dateStr) return ''
  const d    = new Date(dateStr)
  const now  = new Date()
  const diff = (now - d) / 1000
  if (diff < 60)     return 'now'
  if (diff < 3600)   return `${Math.floor(diff / 60)}m`
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h`
  if (diff < 604800) return d.toLocaleDateString('en', { weekday: 'short' })
  return d.toLocaleDateString('en', { month: 'short', day: 'numeric' })
}

function lastMessagePreview(lastMessage) {
  if (!lastMessage) return null
  if (lastMessage.image && !lastMessage.text) return { icon: true, text: 'Photo' }
  if (lastMessage.text) return { icon: false, text: lastMessage.text }
  return null
}

const Sidebar = ({ isMobile = false }) => {
  // On mobile the sidebar is always expanded; on desktop it can collapse
  const [isOpen, setIsOpen]               = useState(true)
  const [searchTerm, setSearchTerm]       = useState('')
  const [showOnlineOnly, setShowOnlineOnly] = useState(false)

  const { getUsers, users, isUsersLoading, setSelectUser, selectedUser } = useChatStore()
  const { onlineUsers } = userAuthStore()

  useEffect(() => { getUsers() }, [getUsers])

  // Sort by most recent message
  const sorted = [...users].sort((a, b) => {
    const ta = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt) : new Date(0)
    const tb = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt) : new Date(0)
    return tb - ta
  })

  const filtered = sorted
    .filter(u => {
      const q = searchTerm.toLowerCase().replace(/^@/, '') // strip leading @ if typed
      return u.name.toLowerCase().includes(q) || (u.username && u.username.includes(q))
    })
    .filter(u => !showOnlineOnly || onlineUsers.includes(u._id))

  const onlineCount = Math.max(0, onlineUsers.length - 1)

  // On mobile: always full-width expanded
  const expanded = isMobile ? true : isOpen
  const width    = isMobile ? '100%' : (isOpen ? '300px' : '72px')
  const minWidth = isMobile ? '100%' : (isOpen ? '300px' : '72px')

  return (
    <div
      className="glass"
      style={{
        width, minWidth,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRight: isMobile ? 'none' : '1px solid rgba(255,255,255,0.07)',
        borderTop: 'none', borderBottom: 'none', borderLeft: 'none',
        transition: isMobile ? 'none' : 'width 0.3s cubic-bezier(0.4,0,0.2,1), min-width 0.3s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* ── Header ── */}
      <div style={{
        padding: '14px 16px 12px',
        display: 'flex', alignItems: 'center', gap: '10px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {expanded && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '8px',
              background: 'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(6,182,212,0.2))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Users size={14} color="#a78bfa" />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#c4b5fd', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Contacts
            </span>
            <span style={{
              marginLeft: 'auto', fontSize: '0.7rem',
              background: 'rgba(34,197,94,0.12)', color: '#4ade80',
              borderRadius: '20px', padding: '2px 9px',
              border: '1px solid rgba(34,197,94,0.22)', flexShrink: 0,
            }}>
              {onlineCount} online
            </span>
          </div>
        )}

        {/* Collapse toggle — desktop only */}
        {!isMobile && (
          <button
            onClick={() => setIsOpen(v => !v)}
            className="btn-glass"
            style={{ width: '34px', height: '34px', padding: 0, flexShrink: 0, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {isOpen ? <X size={16} /> : <AlignRight size={16} />}
          </button>
        )}
      </div>

      {/* ── Search + filter ── */}
      {expanded && (
        <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ position: 'relative', marginBottom: '10px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search by name or @username..."
              className="input-glass"
              style={{ paddingLeft: '36px', fontSize: '0.875rem', height: '40px' }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}>
            <div
              onClick={() => setShowOnlineOnly(v => !v)}
              style={{
                width: '32px', height: '18px', borderRadius: '9px', position: 'relative', cursor: 'pointer', flexShrink: 0,
                background: showOnlineOnly ? 'linear-gradient(135deg,#7c3aed,#6366f1)' : 'rgba(255,255,255,0.1)',
                boxShadow: showOnlineOnly ? '0 0 10px rgba(124,58,237,0.4)' : 'none',
                transition: 'all 0.2s ease',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div style={{
                width: '13px', height: '13px', borderRadius: '50%', background: '#fff',
                position: 'absolute', top: '2px',
                left: showOnlineOnly ? '16px' : '2px',
                transition: 'left 0.2s ease',
                boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
              }} />
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Online only</span>
          </label>
        </div>
      )}

      {/* ── User list ── */}
      <div className="custom-scroll" style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
        {isUsersLoading ? (
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.35 }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
                {expanded && (
                  <div style={{ flex: 1 }}>
                    <div style={{ height: '11px', borderRadius: '6px', background: 'rgba(255,255,255,0.1)', marginBottom: '7px', width: '50%' }} />
                    <div style={{ height: '9px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', width: '80%' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {filtered.map(user => {
              const isOnline   = onlineUsers.includes(user._id)
              const isSelected = selectedUser?._id === user._id
              const preview    = lastMessagePreview(user.lastMessage)
              const hasUnread  = user.unreadCount > 0 && !isSelected

              return (
                <li
                  key={user._id}
                  onClick={() => setSelectUser(user)}
                  className={`user-item hover-lift ${isSelected ? 'active' : ''}`}
                  title={!expanded ? user.name : undefined}
                >
                  {/* Avatar */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img
                      src={user.profilePic || DEFAULT_AVATAR}
                      alt={user.name}
                      style={{
                        width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover',
                        border: isSelected ? '2px solid rgba(99,102,241,0.65)' : '2px solid rgba(255,255,255,0.1)',
                        boxShadow: isSelected ? '0 0 14px rgba(99,102,241,0.35)' : 'none',
                        transition: 'all 0.2s ease',
                      }}
                    />
                    {isOnline && (
                      <div className="online-dot" style={{ position: 'absolute', bottom: '1px', right: '1px', border: '2px solid #06060f' }} />
                    )}
                  </div>

                  {/* Info */}
                  {expanded && (
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Name + time + badge */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                        <span style={{
                          fontWeight: hasUnread ? 700 : 600,
                          fontSize: '0.9rem',
                          color: 'var(--text-primary)',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          flex: 1, marginRight: '8px',
                        }}>
                          {user.name}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                          {user.lastMessage?.createdAt && (
                            <span style={{ fontSize: '0.7rem', color: hasUnread ? '#a78bfa' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                              {formatTime(user.lastMessage.createdAt)}
                            </span>
                          )}
                          {hasUnread && (
                            <div style={{
                              minWidth: '19px', height: '19px', borderRadius: '10px',
                              background: 'linear-gradient(135deg,#7c3aed,#6366f1)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              padding: '0 5px', fontSize: '0.65rem', fontWeight: 700, color: '#fff',
                              boxShadow: '0 0 8px rgba(124,58,237,0.5)',
                            }}>
                              {user.unreadCount > 99 ? '99+' : user.unreadCount}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Last message or username */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', overflow: 'hidden' }}>
                        {preview ? (
                          <>
                            {preview.icon && <ImageIcon size={11} color="var(--text-muted)" style={{ flexShrink: 0 }} />}
                            <span style={{
                              fontSize: '0.78rem',
                              color: hasUnread ? 'var(--text-secondary)' : 'var(--text-muted)',
                              fontWeight: hasUnread ? 500 : 400,
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>
                              {preview.text}
                            </span>
                          </>
                        ) : user.username ? (
                          <span style={{ fontSize: '0.75rem', color: '#7c6fd4', fontWeight: 500 }}>
                            @{user.username}
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: isOnline ? '#4ade80' : 'var(--text-muted)' }}>
                            {isOnline ? '● Online' : '○ Offline'}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Unread dot in collapsed desktop mode */}
                  {!expanded && hasUnread && (
                    <div style={{
                      position: 'absolute', top: '6px', right: '6px',
                      width: '12px', height: '12px', borderRadius: '50%',
                      background: 'linear-gradient(135deg,#7c3aed,#6366f1)',
                      border: '2px solid #06060f',
                      boxShadow: '0 0 6px rgba(124,58,237,0.5)',
                    }} />
                  )}
                </li>
              )
            })}
          </ul>
        )}

        {!isUsersLoading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
            <Users size={30} style={{ margin: '0 auto 12px', opacity: 0.35 }} />
            <p style={{ fontSize: '0.875rem', margin: 0 }}>No users found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar
