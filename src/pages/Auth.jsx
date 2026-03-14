import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'

export default function Auth({ mode }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmSent, setConfirmSent] = useState(false)
  const { signIn, signUp } = useAuth()
  const nav = useNavigate()
  const isSignup = mode === 'signup'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isSignup) {
        const { error } = await signUp(email, password, name)
        if (error) throw error
        setConfirmSent(true)
      } else {
        const { error } = await signIn(email, password)
        if (error) throw error
        nav('/dashboard')
      }
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (confirmSent) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>C</div>
            <span style={styles.logoText}>ChemoLog</span>
          </div>
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📬</div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, marginBottom: 12, fontWeight: 400 }}>Check your email</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.6 }}>
              We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account and start logging.
            </p>
            <Link to="/login" style={{ ...styles.btn, display: 'inline-block', marginTop: 24 }}>Go to login</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <Link to="/" style={styles.logo}>
          <div style={styles.logoIcon}>C</div>
          <span style={styles.logoText}>ChemoLog</span>
        </Link>

        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, marginBottom: 6, fontWeight: 400, textAlign: 'center' }}>
          {isSignup ? 'Create your account' : 'Welcome back'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, textAlign: 'center', marginBottom: 28 }}>
          {isSignup ? 'Start tracking your treatment journey.' : 'Log in to view your dashboard.'}
        </p>

        {error && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10,
            padding: '10px 14px', marginBottom: 16, fontSize: 14, color: '#DC2626',
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div style={styles.field}>
              <label style={styles.label}>Full name</label>
              <input style={styles.input} type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required />
            </div>
          )}
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input style={styles.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input style={styles.input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={isSignup ? 'At least 6 characters' : 'Your password'} required minLength={6} />
          </div>
          <button type="submit" disabled={loading} style={{ ...styles.btn, opacity: loading ? 0.7 : 1, width: '100%', marginTop: 8 }}>
            {loading ? 'Hold on...' : isSignup ? 'Create account' : 'Log in'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-muted)' }}>
          {isSignup ? 'Already have an account? ' : "Don't have an account? "}
          <Link to={isSignup ? '/login' : '/signup'} style={{ color: 'var(--accent)', fontWeight: 600 }}>
            {isSignup ? 'Log in' : 'Sign up'}
          </Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 28, background: '#F4F4F2',
  },
  card: {
    width: '100%', maxWidth: 420, background: 'var(--card)', borderRadius: 20,
    padding: '40px 36px', border: '1px solid var(--border)', boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
  },
  logo: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 28,
    textDecoration: 'none',
  },
  logoIcon: {
    width: 32, height: 32, borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontSize: 14, fontWeight: 700,
  },
  logoText: { fontFamily: "'DM Serif Display', serif", fontSize: 20, color: 'var(--text)' },
  field: { marginBottom: 16 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 6, letterSpacing: '0.01em' },
  input: {
    width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid var(--border)',
    fontSize: 15, outline: 'none', transition: 'border-color 0.2s', background: '#FAFAF8',
  },
  btn: {
    background: 'var(--accent)', color: '#fff', fontSize: 15, fontWeight: 600,
    padding: '13px 24px', borderRadius: 10, border: 'none', cursor: 'pointer',
    transition: 'opacity 0.2s', textAlign: 'center', textDecoration: 'none',
  },
}
