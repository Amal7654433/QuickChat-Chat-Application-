import { useState } from 'react'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, EyeOff, MessageSquare } from "lucide-react";
import { authSchema } from '../validations/authValidation';
import { Link } from 'react-router-dom';
import { userAuthStore } from '../store/userAuth';

const Login = () => {
  const { isLogged, login } = userAuthStore()
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(authSchema),
  })

  const onSubmit = async (data) => {
    await login(data)
  }

  return (
    <div
      className="auth-mesh"
      style={{ minHeight: 'calc(100vh - 56px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}
    >
      {/* Floating orbs */}
      <div style={{ position: 'fixed', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.12),transparent 70%)', top: '-150px', left: '-150px', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(6,182,212,0.1),transparent 70%)', bottom: '-100px', right: '-100px', pointerEvents: 'none' }} />

      <div
        className="glass-elevated animate-slide-up"
        style={{ width: '100%', maxWidth: '420px', padding: 'clamp(24px, 5vw, 40px) clamp(20px, 5vw, 36px)', position: 'relative', zIndex: 1 }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '16px',
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 6px 24px rgba(124,58,237,0.5)',
            }}>
              <MessageSquare size={24} color="#fff" />
            </div>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0 0 6px' }} className="gradient-text">
            Welcome back
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
            Sign in to continue chatting
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="input-glass"
              placeholder="you@example.com"
              style={{ fontSize: '0.875rem', height: '44px' }}
            />
            {errors.email && <p style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '4px', margin: '4px 0 0' }}>{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                {...register("password")}
                className="input-glass"
                placeholder="Enter your password"
                style={{ fontSize: '0.875rem', height: '44px', paddingRight: '44px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', display: 'flex' }}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {errors.password && <p style={{ color: '#f87171', fontSize: '0.78rem', margin: '4px 0 0' }}>{errors.password.message}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLogged}
            className="btn-glow"
            style={{ width: '100%', height: '46px', fontSize: '0.95rem', marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {isLogged ? (
              <>
                <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Signing in...
              </>
            ) : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#a78bfa', fontWeight: 600, textDecoration: 'none' }}>
            Create account
          </Link>
        </p>
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default Login;
