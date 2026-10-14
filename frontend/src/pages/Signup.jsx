import { useState, useEffect, useRef } from 'react'
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Link } from "react-router-dom"
import { Eye, EyeOff, Mail, User, AtSign, Check, X } from "lucide-react"
import { signupSchema } from '../validations/authValidation'
import { userAuthStore } from '../store/userAuth'
import { axiosInstance } from '../libs/axios'

const Signup = () => {
    const { isSignup, signup } = userAuthStore()
    const [visibility, setVisibility]   = useState({ password: false, confirmPassword: false })
    const [usernameState, setUsernameState] = useState({ status: 'idle', message: '' })
    // status: 'idle' | 'checking' | 'available' | 'taken' | 'invalid'
    const debounceRef = useRef(null)

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: yupResolver(signupSchema),
    })

    const usernameValue = watch('username', '')

    // Real-time username availability check
    useEffect(() => {
        const val = (usernameValue || '').trim()
        if (!val || val.length < 3 || !/^[a-zA-Z0-9_]+$/.test(val)) {
            setUsernameState({ status: 'idle', message: '' })
            return
        }
        setUsernameState({ status: 'checking', message: '' })
        clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(async () => {
            try {
                const res = await axiosInstance.get(`/check-username/${val}`)
                if (res.data.available) {
                    setUsernameState({ status: 'available', message: '@' + val + ' is available' })
                } else {
                    setUsernameState({ status: 'taken', message: '@' + val + ' is already taken' })
                }
            } catch {
                setUsernameState({ status: 'idle', message: '' })
            }
        }, 500)
        return () => clearTimeout(debounceRef.current)
    }, [usernameValue])

    const toggle = (field) => setVisibility(v => ({ ...v, [field]: !v[field] }))

    const onSubmit = async (data) => {
        if (usernameState.status === 'taken') return
        await signup(data)
    }

    const usernameStatusColor = {
        available: '#4ade80',
        taken:     '#f87171',
        checking:  '#a78bfa',
        idle:      'transparent',
    }[usernameState.status]

    return (
        <div
            className="auth-mesh"
            style={{ minHeight: 'calc(100vh - 56px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}
        >
            {/* Orbs */}
            <div style={{ position: 'fixed', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(236,72,153,0.1),transparent 70%)', top: '-150px', right: '-100px', pointerEvents: 'none' }} />
            <div style={{ position: 'fixed', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.1),transparent 70%)', bottom: '-100px', left: '-100px', pointerEvents: 'none' }} />

            <div
                className="glass-elevated animate-slide-up"
                style={{ width: '100%', maxWidth: '420px', padding: 'clamp(24px,5vw,36px) clamp(20px,5vw,36px)', position: 'relative', zIndex: 1 }}
            >
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                        <div style={{
                            width: '52px', height: '52px', borderRadius: '16px',
                            background: 'linear-gradient(135deg, #ec4899, #7c3aed)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 6px 24px rgba(236,72,153,0.4)',
                        }}>
                            <AtSign size={24} color="#fff" />
                        </div>
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 4px' }} className="gradient-text-warm">
                        Create account
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
                        Pick a unique username to get started
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                    {/* Full Name */}
                    <div>
                        <label style={labelStyle}>Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <User size={15} style={iconStyle} />
                            <input
                                type="text"
                                {...register('name')}
                                className="input-glass"
                                placeholder="Your full name"
                                style={{ ...inputStyle, paddingLeft: '38px' }}
                            />
                        </div>
                        {errors.name && <p style={errStyle}>{errors.name.message}</p>}
                    </div>

                    {/* Username */}
                    <div>
                        <label style={labelStyle}>Username</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#a78bfa', fontWeight: 600, fontSize: '0.95rem', pointerEvents: 'none' }}>@</span>
                            <input
                                type="text"
                                {...register('username')}
                                className="input-glass"
                                placeholder="your_username"
                                autoComplete="off"
                                style={{
                                    ...inputStyle,
                                    paddingLeft: '30px',
                                    paddingRight: '36px',
                                    borderColor: usernameState.status === 'available'
                                        ? 'rgba(74,222,128,0.5)'
                                        : usernameState.status === 'taken'
                                            ? 'rgba(248,113,113,0.5)'
                                            : undefined,
                                }}
                            />
                            {/* Status icon */}
                            <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                                {usernameState.status === 'checking' && (
                                    <div style={{ width: '14px', height: '14px', border: '2px solid rgba(167,139,250,0.3)', borderTopColor: '#a78bfa', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                                )}
                                {usernameState.status === 'available' && <Check size={15} color="#4ade80" />}
                                {usernameState.status === 'taken'     && <X    size={15} color="#f87171" />}
                            </div>
                        </div>
                        {/* Availability message */}
                        {usernameState.message && (
                            <p style={{ fontSize: '0.75rem', margin: '4px 0 0', color: usernameStatusColor }}>
                                {usernameState.message}
                            </p>
                        )}
                        {errors.username && !usernameState.message && (
                            <p style={errStyle}>{errors.username.message}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label style={labelStyle}>Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={15} style={iconStyle} />
                            <input
                                type="email"
                                {...register('email')}
                                className="input-glass"
                                placeholder="you@example.com"
                                style={{ ...inputStyle, paddingLeft: '38px' }}
                            />
                        </div>
                        {errors.email && <p style={errStyle}>{errors.email.message}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label style={labelStyle}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={visibility.password ? 'text' : 'password'}
                                {...register('password')}
                                className="input-glass"
                                placeholder="Create a password"
                                style={{ ...inputStyle, paddingRight: '40px' }}
                            />
                            <button type="button" onClick={() => toggle('password')} style={eyeBtn}>
                                {visibility.password ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {errors.password && <p style={errStyle}>{errors.password.message}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label style={labelStyle}>Confirm Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={visibility.confirmPassword ? 'text' : 'password'}
                                {...register('confirmPassword')}
                                className="input-glass"
                                placeholder="Re-enter your password"
                                style={{ ...inputStyle, paddingRight: '40px' }}
                            />
                            <button type="button" onClick={() => toggle('confirmPassword')} style={eyeBtn}>
                                {visibility.confirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {errors.confirmPassword && <p style={errStyle}>{errors.confirmPassword.message}</p>}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSignup || usernameState.status === 'taken'}
                        className="btn-glow"
                        style={{
                            width: '100%', height: '46px', fontSize: '0.95rem', marginTop: '4px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            background: 'linear-gradient(135deg,#ec4899,#7c3aed)',
                            boxShadow: '0 4px 20px rgba(236,72,153,0.4)',
                        }}
                    >
                        {isSignup ? (
                            <>
                                <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                Creating account...
                            </>
                        ) : 'Create Account'}
                    </button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>or</span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                </div>

                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#a78bfa', fontWeight: 600, textDecoration: 'none' }}>
                        Sign in
                    </Link>
                </p>
            </div>

            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </div>
    )
}

// ── Shared style constants ────────────────────────────────────────────
const labelStyle = {
    display: 'block', fontSize: '0.78rem', fontWeight: 600,
    color: 'var(--text-secondary)', marginBottom: '5px',
    letterSpacing: '0.04em', textTransform: 'uppercase',
}
const inputStyle = { fontSize: '0.875rem', height: '42px' }
const errStyle   = { color: '#f87171', fontSize: '0.75rem', margin: '3px 0 0' }
const iconStyle  = {
    position: 'absolute', left: '12px', top: '50%',
    transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none',
}
const eyeBtn = {
    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer',
    color: 'var(--text-muted)', padding: '4px', display: 'flex',
}

export default Signup
