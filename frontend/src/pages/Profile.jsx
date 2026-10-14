import { useState } from "react";
import { userAuthStore } from "../store/userAuth";
import { Camera, Mail, User, Calendar, Shield, AtSign } from "lucide-react";
import imageCompression from "browser-image-compression";

const DEFAULT_AVATAR = 'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg?semt=ais_hybrid';

const Profile = () => {
  const { authUser, updateProfile, isUpdate } = userAuthStore()
  const [selectedImg, setSelectedImg] = useState(null)

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const options = { maxSizeMB: 0.5, maxWidthOrHeight: 500 }
    const compressed = await imageCompression(file, options)

    const reader = new FileReader()
    reader.readAsDataURL(compressed)
    reader.onload = async () => {
      setSelectedImg(reader.result)
      await updateProfile({ profilePic: reader.result })
    }
  }

  const infoFields = [
    { icon: User,    label: 'Full Name',     value: authUser?.name },
    { icon: AtSign,  label: 'Username',      value: authUser?.username ? `@${authUser.username}` : '—', highlight: true },
    { icon: Mail,    label: 'Email Address', value: authUser?.email },
  ]

  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: 'clamp(20px, 4vw, 40px) 16px' }}>
      {/* Background accents */}
      <div style={{ position: 'fixed', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.1),transparent 70%)', top: 0, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 1 }}>

        {/* Profile card */}
        <div className="glass-elevated animate-slide-up" style={{ padding: '36px 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h1 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 4px' }}>Profile</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>Manage your personal information</p>
          </div>

          {/* Avatar */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
            <div style={{ position: 'relative', marginBottom: '14px' }}>
              <img
                src={selectedImg || authUser?.profilePic || DEFAULT_AVATAR}
                alt="Profile"
                style={{
                  width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover',
                  border: '3px solid transparent',
                  background: 'linear-gradient(#06060f,#06060f) padding-box, linear-gradient(135deg,#7c3aed,#06b6d4) border-box',
                  boxShadow: '0 8px 28px rgba(124,58,237,0.35)',
                  transition: 'all 0.3s ease',
                }}
              />
              <label
                htmlFor="avatar-upload"
                style={{
                  position: 'absolute', bottom: '4px', right: '4px',
                  width: '34px', height: '34px', borderRadius: '50%',
                  background: 'linear-gradient(135deg,#7c3aed,#6366f1)',
                  border: '2px solid #06060f',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: isUpdate ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(124,58,237,0.5)',
                  transition: 'all 0.2s ease',
                  ...(isUpdate ? { opacity: 0.6 } : {}),
                }}
              >
                <Camera size={15} color="#fff" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdate}
                />
              </label>
            </div>

            <p style={{ fontSize: '0.78rem', color: isUpdate ? '#a78bfa' : 'var(--text-muted)', margin: 0 }}>
              {isUpdate ? '⟳ Uploading photo...' : 'Click the camera icon to update photo'}
            </p>
          </div>

          {/* Info fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {infoFields.map(({ icon: Icon, label, value, highlight }) => (
              <div key={label}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <Icon size={13} color={highlight ? '#a78bfa' : 'var(--text-muted)'} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: highlight ? '#a78bfa' : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {label}
                  </span>
                </div>
                <div
                  className="glass"
                  style={{
                    padding: '11px 16px', borderRadius: '12px',
                    fontSize: highlight ? '1rem' : '0.9rem',
                    color: highlight ? '#c4b5fd' : 'var(--text-primary)',
                    fontWeight: highlight ? 700 : 500,
                    letterSpacing: highlight ? '0.01em' : undefined,
                    border: highlight ? '1px solid rgba(124,58,237,0.25)' : undefined,
                    background: highlight ? 'rgba(124,58,237,0.08)' : undefined,
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account info card */}
        <div className="glass-card animate-slide-up" style={{ padding: '24px 28px', animationDelay: '0.1s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg,rgba(124,58,237,0.25),rgba(6,182,212,0.15))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={14} color="#a78bfa" />
            </div>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>Account Information</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={14} color="var(--text-muted)" />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Member Since</span>
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {authUser?.createdAt?.split("T")[0]}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={14} color="var(--text-muted)" />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Account Status</span>
              </div>
              <span style={{
                fontSize: '0.78rem', fontWeight: 600, padding: '3px 12px', borderRadius: '20px',
                background: 'rgba(34,197,94,0.12)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.25)',
              }}>
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
