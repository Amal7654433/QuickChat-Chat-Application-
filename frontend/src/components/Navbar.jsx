import { Link, useLocation } from 'react-router-dom'
import { Home, LogOut, MessageSquare, User } from 'lucide-react'
import { userAuthStore } from '../store/userAuth'
import { useIsMobile } from '../hooks/useIsMobile'

const Navbar = () => {
  const { logout, authUser } = userAuthStore()
  const location = useLocation()
  const isMobile = useIsMobile()

  const isActive = (path) => location.pathname === path

  return (
    <nav
      className="glass"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        borderTop: 'none', borderLeft: 'none', borderRight: 'none',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
      }}
    >
      <div style={{ padding: '0 16px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(124,58,237,0.45)',
            }}>
              <MessageSquare size={16} color="#fff" />
            </div>
            <span
              className="gradient-text"
              style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.01em' }}
            >
              QuickChat
            </span>
          </Link>

          {/* Center nav — hidden on mobile */}
          {authUser && !isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Link to="/" className={`nav-link ${isActive('/') ? 'active-link' : ''}`}>
                <Home size={15} /><span>Home</span>
              </Link>
              <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active-link' : ''}`}>
                <User size={15} /><span>Profile</span>
              </Link>
            </div>
          )}

          {/* Right side */}
          {authUser && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Profile icon on mobile */}
              {isMobile && (
                <Link
                  to="/profile"
                  className={`btn-glass ${isActive('/profile') ? 'active-link' : ''}`}
                  style={{
                    width: '36px', height: '36px', padding: 0, borderRadius: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    textDecoration: 'none',
                  }}
                >
                  <User size={16} />
                </Link>
              )}

              <button
                onClick={logout}
                className="btn-glass"
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: isMobile ? '0' : '7px 14px',
                  width: isMobile ? '36px' : 'auto',
                  height: '36px',
                  fontSize: '0.875rem',
                  borderRadius: '10px',
                  justifyContent: 'center',
                }}
              >
                <LogOut size={15} />
                {!isMobile && <span>Logout</span>}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
