import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { SYMPTOMS, COLORS, SEVERITY_COLOR, SEVERITY_BG } from '../lib/constants'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const nav = useNavigate()
  const [logs, setLogs] = useState([])
  const [meds, setMeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [compareMode, setCompareMode] = useState(false)
  const [selectedCycles, setSelectedCycles] = useState([])

  useEffect(() => { fetchData() }, [user])

  const fetchData = async () => {
    if (!user) return
    const [logsRes, medsRes] = await Promise.all([
      supabase.from('symptom_logs').select('*').eq('user_id', user.id).order('log_date', { ascending: true }).limit(120),
      supabase.from('medications').select('*').eq('user_id', user.id).order('start_date', { ascending: false }),
    ])
    if (logsRes.data) setLogs(logsRes.data)
    if (medsRes.data) setMeds(medsRes.data)
    // If medications table doesn't exist yet, silently handle
    setLoading(false)
  }

  const handleSignOut = async () => { await signOut(); nav('/') }

  const latest = logs.length > 0 ? logs[logs.length - 1] : null
  const userName = user?.user_metadata?.full_name || 'there'

  // ── Cycle logic ──
  const cycles = [...new Set(logs.filter(l => l.cycle_number).map(l => l.cycle_number))].sort((a, b) => a - b)

  const getCycleData = (cycleNum) =>
    logs.filter(l => l.cycle_number === cycleNum).map((l, i) => ({
      day: `Day ${i + 1}`,
      date: new Date(l.log_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      ...l.symptoms,
    }))

  // ── Default chart data (all logs) ──
  const chartData = logs.map(l => ({
    date: new Date(l.log_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    ...l.symptoms,
  }))

  // ── Cycle averages for comparison ──
  const getCycleAvg = (cycleNum) => {
    const cycleLogs = logs.filter(l => l.cycle_number === cycleNum)
    if (cycleLogs.length === 0) return null
    const avgs = {}
    SYMPTOMS.forEach(s => {
      const vals = cycleLogs.map(l => l.symptoms?.[s.key] ?? 0)
      avgs[s.key] = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)
    })
    return avgs
  }

  const toggleCycleSelect = (c) => {
    setSelectedCycles(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : prev.length < 2 ? [...prev, c] : [prev[1], c]
    )
  }

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link to="/guide" style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-muted)', padding: '8px 14px' }}>Guide</Link>
          <Link to="/medications" style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-muted)', padding: '8px 14px' }}>Medications</Link>
          {logs.length > 0 && (
            <Link to="/report" style={{
              fontSize: 14, fontWeight: 600, background: '#F9F9F7', color: 'var(--text)',
              padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)',
            }}>📄 Report</Link>
          )}
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
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, fontWeight: 400, marginBottom: 4 }}>
          Hi, {userName} 👋
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 32 }}>
          {logs.length === 0
            ? "You haven't logged any symptoms yet. Let's start."
            : `You have ${logs.length} log${logs.length > 1 ? 's' : ''} recorded${cycles.length > 0 ? ` across ${cycles.length} cycle${cycles.length > 1 ? 's' : ''}` : ''}.`}
        </p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>Loading your data...</div>
        ) : logs.length === 0 ? (
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
            {/* ── Active medications banner ── */}
            {meds.length > 0 && (
              <div style={{
                background: 'var(--card)', borderRadius: 14, padding: '16px 20px',
                border: '1px solid var(--border)', marginBottom: 20,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 18 }}>💊</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>Current regimen</div>
                    <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                      {meds.filter(m => !m.end_date).map(m => m.drug_name).join(', ') || 'No active medications'}
                    </div>
                  </div>
                </div>
                <Link to="/medications" style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>Manage →</Link>
              </div>
            )}

            {/* ── Current severity cards ── */}
            {latest && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 28 }}>
                {SYMPTOMS.map((s, i) => {
                  const val = latest.symptoms?.[s.key] ?? 0
                  return (
                    <div key={s.key} style={{
                      background: 'var(--card)', borderRadius: 14, padding: '18px 16px',
                      border: '1px solid var(--border)',
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{s.label}</div>
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

            {/* ── Cycle comparison toggle ── */}
            {cycles.length >= 2 && (
              <div style={{
                background: 'var(--card)', borderRadius: 18, padding: '20px 24px',
                border: '1px solid var(--border)', marginBottom: 20,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: compareMode ? 16 : 0 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600 }}>📊 Cycle comparison</h3>
                  <button onClick={() => { setCompareMode(!compareMode); setSelectedCycles([]) }} style={{
                    fontSize: 13, fontWeight: 600, padding: '6px 14px', borderRadius: 8,
                    background: compareMode ? 'var(--accent)' : '#F0F0EE',
                    color: compareMode ? '#fff' : 'var(--text-muted)',
                    border: 'none', transition: 'all 0.2s',
                  }}>
                    {compareMode ? 'Close' : 'Compare cycles'}
                  </button>
                </div>

                {compareMode && (
                  <>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>Select two cycles to compare:</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                      {cycles.map(c => (
                        <button key={c} onClick={() => toggleCycleSelect(c)} style={{
                          padding: '6px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                          background: selectedCycles.includes(c) ? 'var(--accent-light)' : '#F9F9F7',
                          color: selectedCycles.includes(c) ? 'var(--accent-dark)' : 'var(--text-muted)',
                          border: selectedCycles.includes(c) ? '1.5px solid #2A9D8F44' : '1px solid var(--border)',
                        }}>Cycle {c}</button>
                      ))}
                    </div>

                    {selectedCycles.length === 2 && (() => {
                      const avg1 = getCycleAvg(selectedCycles[0])
                      const avg2 = getCycleAvg(selectedCycles[1])
                      if (!avg1 || !avg2) return null
                      return (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
                          {SYMPTOMS.map((s, i) => {
                            const v1 = parseFloat(avg1[s.key])
                            const v2 = parseFloat(avg2[s.key])
                            const diff = v2 - v1
                            return (
                              <div key={s.key} style={{
                                background: '#F9F9F7', borderRadius: 12, padding: '14px 14px',
                                border: '1px solid var(--border)',
                              }}>
                                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>{s.label}</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                                  <span>C{selectedCycles[0]}: <strong>{v1}</strong></span>
                                  <span>C{selectedCycles[1]}: <strong>{v2}</strong></span>
                                </div>
                                <div style={{
                                  fontSize: 12, fontWeight: 700, textAlign: 'center', padding: '3px 0', borderRadius: 4,
                                  background: diff > 0.5 ? '#FEF2F2' : diff < -0.5 ? '#E6F5F3' : '#F9F9F7',
                                  color: diff > 0.5 ? 'var(--coral)' : diff < -0.5 ? 'var(--accent)' : 'var(--text-muted)',
                                }}>
                                  {diff > 0.5 ? `↑ +${diff.toFixed(1)} worse` : diff < -0.5 ? `↓ ${diff.toFixed(1)} better` : '→ stable'}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )
                    })()}
                  </>
                )}
              </div>
            )}

            {/* ── Trend chart ── */}
            {chartData.length > 1 && (
              <div style={{
                background: 'var(--card)', borderRadius: 18, padding: '28px 24px',
                border: '1px solid var(--border)', marginBottom: 28,
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Symptom trends</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F0EE" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                    <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                    <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E8E8E4', fontSize: 13 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    {SYMPTOMS.map((s, i) => (
                      <Line key={s.key} type="monotone" dataKey={s.key} stroke={COLORS[i]} strokeWidth={2} dot={{ r: 3 }} name={s.label} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* ── Recent logs ── */}
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
                    <div style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                      {new Date(l.log_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      {l.cycle_number && (
                        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', background: 'var(--accent-light)', padding: '2px 8px', borderRadius: 4 }}>
                          Cycle {l.cycle_number}
                        </span>
                      )}
                    </div>
                    {l.notes && <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>{l.notes.slice(0, 80)}{l.notes.length > 80 ? '...' : ''}</div>}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {SYMPTOMS.slice(0, 3).map((s) => {
                      const val = l.symptoms?.[s.key] ?? 0
                      return (
                        <div key={s.key} style={{
                          fontSize: 12, fontWeight: 600,
                          color: SEVERITY_COLOR(val),
                          background: SEVERITY_BG(val),
                          padding: '3px 8px', borderRadius: 6,
                        }}>{s.label.slice(0, 3)} {val}</div>
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
