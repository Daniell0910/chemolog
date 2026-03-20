import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { SYMPTOMS, COLORS } from '../lib/constants'

export default function LogEntry() {
  const { user } = useAuth()
  const nav = useNavigate()
  const [symptoms, setSymptoms] = useState(
    Object.fromEntries(SYMPTOMS.map(s => [s.key, 0]))
  )
  const [notes, setNotes] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [cycle, setCycle] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const update = (key, val) => setSymptoms(prev => ({ ...prev, [key]: val }))

  const handleSave = async () => {
    setSaving(true)
    setError('')
    const { error: err } = await supabase.from('symptom_logs').insert({
      user_id: user.id,
      log_date: date,
      symptoms,
      notes: notes.trim() || null,
      cycle_number: cycle ? parseInt(cycle) : null,
    })
    if (err) {
      setError(err.message)
      setSaving(false)
    } else {
      setSaved(true)
      setTimeout(() => nav('/dashboard'), 1200)
    }
  }

  if (saved) {
    return (
      <div style={{ minHeight: '100vh', background: '#F4F4F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, marginBottom: 8 }}>Entry saved</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F4F4F2' }}>
      {/* Slider thumb CSS — single global instance */}
      <style>{`
        input[type=range] { appearance: none; -webkit-appearance: none; outline: none; cursor: pointer; }
        input[type=range]::-webkit-slider-thumb {
          appearance: none; -webkit-appearance: none; width: 22px; height: 22px; border-radius: 50%;
          background: white; border: 2.5px solid var(--slider-color, #2A9D8F); cursor: pointer;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
        }
        input[type=range]::-moz-range-thumb {
          width: 22px; height: 22px; border-radius: 50%;
          background: white; border: 2.5px solid var(--slider-color, #2A9D8F); cursor: pointer;
        }
      `}</style>

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
        <Link to="/dashboard" style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500 }}>← Back to dashboard</Link>
      </nav>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, fontWeight: 400, marginBottom: 6 }}>
          How are you feeling?
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 32 }}>
          Rate each symptom from 0 (none) to 10 (worst). Be honest — this is for you.
        </p>

        <div style={{ display: 'flex', gap: 14, marginBottom: 28 }}>
          <div style={{ flex: 2 }}>
            <label style={styles.label}>Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={styles.input} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Cycle #</label>
            <input type="number" min={1} value={cycle} onChange={e => setCycle(e.target.value)} placeholder="e.g. 3" style={styles.input} />
          </div>
        </div>

        <div style={{
          background: 'var(--card)', borderRadius: 18, padding: '28px 24px',
          border: '1px solid var(--border)', marginBottom: 20,
        }}>
          {SYMPTOMS.map((s, i) => (
            <div key={s.key} style={{ marginBottom: i < SYMPTOMS.length - 1 ? 28 : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                <div>
                  <span style={{ fontSize: 16, marginRight: 8 }}>{s.emoji}</span>
                  <span style={{ fontSize: 15, fontWeight: 600 }}>{s.label}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 8 }}>{s.desc}</span>
                </div>
                <span style={{
                  fontFamily: "'DM Serif Display', serif", fontSize: 20,
                  color: symptoms[s.key] >= 7 ? 'var(--coral)' : symptoms[s.key] >= 4 ? '#D97706' : 'var(--accent)',
                  minWidth: 32, textAlign: 'right',
                }}>{symptoms[s.key]}</span>
              </div>
              <input
                type="range" min={0} max={10} step={1}
                value={symptoms[s.key]}
                onChange={e => update(s.key, Number(e.target.value))}
                style={{
                  '--slider-color': COLORS[i],
                  width: '100%', height: 6,
                  background: `linear-gradient(to right, ${COLORS[i]} ${symptoms[s.key] * 10}%, #E8E8E4 ${symptoms[s.key] * 10}%)`,
                  borderRadius: 3,
                }}
              />
            </div>
          ))}
        </div>

        <div style={{
          background: 'var(--card)', borderRadius: 18, padding: '24px',
          border: '1px solid var(--border)', marginBottom: 20,
        }}>
          <label style={styles.label}>Notes (optional)</label>
          <textarea
            value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="Anything else? E.g. 'Nausea hit hard 2 hours after infusion' or 'Slept 12 hours but still tired'"
            rows={3}
            style={{ ...styles.input, resize: 'vertical', minHeight: 80 }}
          />
        </div>

        {error && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10,
            padding: '10px 14px', marginBottom: 16, fontSize: 14, color: '#DC2626',
          }}>{error}</div>
        )}

        <button
          onClick={handleSave} disabled={saving}
          style={{
            width: '100%', padding: '14px', borderRadius: 12, fontSize: 16, fontWeight: 600,
            background: 'var(--accent)', color: '#fff', opacity: saving ? 0.7 : 1,
            transition: 'opacity 0.2s', boxShadow: '0 2px 12px #2A9D8F33',
          }}
        >
          {saving ? 'Saving...' : 'Save entry'}
        </button>
      </div>
    </div>
  )
}

const styles = {
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 6, letterSpacing: '0.01em' },
  input: {
    width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid var(--border)',
    fontSize: 15, outline: 'none', background: '#FAFAF8', fontFamily: "'DM Sans', sans-serif",
  },
}
