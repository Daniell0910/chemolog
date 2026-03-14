import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'

const SYMPTOMS = ['Nausea', 'Fatigue', 'Pain', 'Neuropathy', 'Appetite loss', 'Mood']
const COLORS = ['#2A9D8F', '#E76F51', '#E9C46A', '#264653', '#F4A261', '#6B7280']

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const nav = useNavigate()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLogs()
  }, [user])

  const fetchLogs = async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('symptom_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('log_date', { ascending: true })
      .limit(60)
    if (!error && data) setLogs(data)
    setLoading(false)
  }

  const handleSignOut = async () => {
    await signOut()
    nav('/')
  }

  const latest = logs.length > 0 ? logs[logs.length - 1] : null
  const userName = user?.user_metadata?.full_name || 'there'

  const chartData = logs.map(l => ({
    date: new Date(l.log_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    ...l.symptoms,
  }))

  return (
    <div style={{ minHeight: '100vh', background: '#F4F4F2' }}>
      {/* Top nav */}
      <nav style={{
        background: 'var(--card)', borderBottom: '1px solid var(--border)',
        padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 13, fontWeight: 700,
          }}>C</div>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: 'var(--text)' }}>ChemoLog</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/log" style={{
            fontSize: 14, fontWeight: 600, background: 'var(--accent)', color: '#fff',
            padding: '8px 20px', borderRadius: 8, transition: 'opacity 0.2s',
          }}>+ Log symptoms</Link>
          <button onClick={handleSignOut} style={{
            fontSize: 14, fontWeight: 500, background: 'transparent', color: 'var(--text-muted)',
            padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)',
          }}>Sign out</button>
        </div>
      </nav>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px' }}>
        {/* Greeting */}
        <h1 style={{
          fontFamily: "'DM Serif Display', serif", fontSize: 28, fontWeight: 400, marginBottom: 4,
        }}>
          Hi, {userName} 👋
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 32 }}>
          {logs.length === 0 ? "You haven't logged any symptoms yet. Let's start." : `You have ${logs.length} log${logs.length > 1 ? 's' : ''} recorded.`}
        </p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>Loading your data...</div>
        ) : logs.length === 0 ? (
          /* Empty state */
          <div style={{
            background: 'var(--card)', borderRadius: 20, padding: '60px 32px',
            border: '1px solid var(--border)', textAlign: 'center',
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, marginBottom: 10, fontWeight: 400 }}>No logs yet</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 24, maxWidth: 380, margin: '0 auto 24px' }}>
              Start by logging how you feel today. It takes about 30 seconds.
            </p>
            <Link to="/log" style={{
              fontSize: 15, fontWeight: 600, background: 'var(--accent)', color: '#fff',
              padding: '12px 32px', borderRadius: 10, display: 'inline-block',
            }}>Log your first entry</Link>
          </div>
        ) : (
          <>
            {/* Current severity cards */}
            {latest && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 28 }}>
                {SYMPTOMS.map((s, i) => {
                  const val = latest.symptoms?.[s.toLowerCase().replace(' ', '_')] ?? 0
                  return (
                    <div key={s} style={{
                      background: 'var(--card)', borderRadius: 14, padding: '18px 16px',
                      border: '1px solid var(--border)',
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{s}</div>
                      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26 }}>
                        {val}<span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: "'DM Sans'", fontWeight: 400 }}>/10</span>
                      </div>
                      <div style={{ marginTop: 8, height: 5, background: '#F0F0EE', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${val * 10}%`, height: '100%', borderRadius: 3, background: COLORS[i], transition: 'width 0.5s' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Trend chart */}
            {chartData.length > 1 && (
              <div style={{
                background: 'var(--card)', borderRadius: 18, padding: '28px 24px',
                border: '1px solid var(--border)', marginBottom: 28,
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Symptom trends</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F0EE" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                    <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                    <Tooltip
                      contentStyle={{ borderRadius: 10, border: '1px solid #E8E8E4', fontSize: 13 }}
                    />
                    {SYMPTOMS.map((s, i) => (
                      <Line
                        key={s}
                        type="monotone"
                        dataKey={s.toLowerCase().replace(' ', '_')}
                        stroke={COLORS[i]}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        name={s}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Recent logs */}
            <div style={{
              background: 'var(--card)', borderRadius: 18, padding: '24px',
              border: '1px solid var(--border)',
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Recent entries</h3>
              {[...logs].reverse().slice(0, 7).map((l, i) => (
                <div key={i} style={{
                  padding: '14px 0', borderBottom: i < Math.min(logs.length, 7) - 1 ? '1px solid #F0F0EE' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>
                      {new Date(l.log_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    {l.notes && <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>{l.notes.slice(0, 80)}{l.notes.length > 80 ? '...' : ''}</div>}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {SYMPTOMS.slice(0, 3).map((s, j) => {
                      const val = l.symptoms?.[s.toLowerCase().replace(' ', '_')] ?? 0
                      return (
                        <div key={s} style={{
                          fontSize: 12, fontWeight: 600, color: val >= 7 ? 'var(--coral)' : val >= 4 ? 'var(--warm)' : 'var(--accent)',
                          background: val >= 7 ? '#FEF2F2' : val >= 4 ? '#FEF8E8' : 'var(--accent-light)',
                          padding: '3px 8px', borderRadius: 6,
                        }}>{s.slice(0, 3)} {val}</div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
