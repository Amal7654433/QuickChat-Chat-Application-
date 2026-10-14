import { MessageSquare, Zap, Shield, Globe } from "lucide-react";

const features = [
  { icon: Zap,    label: 'Instant',  desc: 'Real-time messaging' },
  { icon: Shield, label: 'Secure',   desc: 'End-to-end encrypted' },
  { icon: Globe,  label: 'Always on', desc: 'Cloud powered chat' },
]

const NoChatSelected = () => {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(24px, 5vw, 40px) clamp(16px, 4vw, 24px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow blobs */}
      <div style={{
        position: 'absolute', width: '350px', height: '350px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.1), transparent 70%)',
        top: '10%', left: '50%', transform: 'translateX(-50%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: '250px', height: '250px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.08), transparent 70%)',
        bottom: '15%', right: '20%',
        pointerEvents: 'none',
      }} />

      {/* Icon */}
      <div className="animate-float" style={{ marginBottom: '28px', position: 'relative' }}>
        <div
          className="animate-pulse-glow"
          style={{
            width: '80px', height: '80px', borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(6,182,212,0.2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(124,58,237,0.3)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <MessageSquare size={36} color="#a78bfa" />
        </div>
        {/* Orbiting dot */}
        <div style={{
          position: 'absolute', top: '-4px', right: '-4px',
          width: '18px', height: '18px', borderRadius: '50%',
          background: 'linear-gradient(135deg,#7c3aed,#06b6d4)',
          boxShadow: '0 0 12px rgba(124,58,237,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />
        </div>
      </div>

      {/* Heading */}
      <h2
        className="gradient-text"
        style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 10px', textAlign: 'center', letterSpacing: '-0.02em' }}
      >
        Welcome to QuickChat
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', maxWidth: '320px', lineHeight: 1.6, margin: '0 0 36px' }}>
        Select a conversation from the sidebar to start chatting with your contacts
      </p>

      {/* Feature pills */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: '420px' }}>
        {features.map(({ icon: Icon, label, desc }) => (
          <div
            key={label}
            className="glass-card hover-lift"
            style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 130px', minWidth: '120px' }}
          >
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'linear-gradient(135deg,rgba(124,58,237,0.25),rgba(6,182,212,0.15))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              border: '1px solid rgba(124,58,237,0.2)',
            }}>
              <Icon size={15} color="#a78bfa" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</p>
              <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)' }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoChatSelected;
