import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obs.unobserve(el) }
    }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, vis]
}

function Fade({ children, delay = 0, style = {} }) {
  const [ref, vis] = useInView()
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(28px)',
      transition: `opacity 0.7s cubic-bezier(.16,1,.3,1) ${delay}s, transform 0.7s cubic-bezier(.16,1,.3,1) ${delay}s`,
      ...style,
    }}>{children}</div>
  )
}

function AnimatedCounter({ target, suffix = '', duration = 2000 }) {
  const [ref, vis] = useInView(0.3)
  const [count, setCount] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (!vis || started.current) return
    started.current = true
    const start = performance.now()
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [vis, target, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

/* ── Mini bar chart for hero mockup ── */
function MiniChart({ values, color, animate }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 40 }}>
      {values.map((v, i) => (
        <div key={i} style={{
          width: 6, borderRadius: 2,
          background: color,
          opacity: 0.3 + (v / 10) * 0.7,
          height: animate ? `${v * 10}%` : '0%',
          transition: `height 0.6s cubic-bezier(.16,1,.3,1) ${0.6 + i * 0.05}s`,
        }} />
      ))}
    </div>
  )
}

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(250,250,248,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      transition: 'all 0.35s ease',
    }}>
      <div style={{
        maxWidth: 1160, margin: '0 auto', padding: '16px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 14, fontWeight: 700,
          }}>C</div>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: 'var(--text)' }}>ChemoLog</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <a href="#about" style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500 }}>About</a>
          <a href="#features" style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500 }}>Features</a>
          <a href="#guide" style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500 }}>Guide</a>
          <Link to="/login" style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500 }}>Log in</Link>
          <Link to="/signup" style={{
            fontSize: 14, fontWeight: 600, background: 'var(--accent)', color: '#fff',
            padding: '9px 22px', borderRadius: 28, transition: 'opacity 0.2s',
          }}>Sign up free</Link>
        </div>
      </div>
    </nav>
  )
}

export default function Landing() {
  const [heroVis, setHeroVis] = useState(false)
  useEffect(() => { setTimeout(() => setHeroVis(true), 300) }, [])

  return (
    <>
      <Nav />

      {/* ━━━ HERO ━━━ */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden', paddingTop: 80,
      }}>
        <div style={{ position: 'absolute', top: -120, right: -120, width: 480, height: 480, borderRadius: '50%', background: 'var(--accent-light)', opacity: 0.5, filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 320, height: 320, borderRadius: '50%', background: '#FEF3E2', opacity: 0.6, filter: 'blur(60px)' }} />

        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '60px 28px', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Fade delay={0.05}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--accent-light)', borderRadius: 24, padding: '7px 18px', marginBottom: 28,
            }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-dark)', letterSpacing: '0.02em' }}>
                Free &amp; open source · Built by students at Stuyvesant High School
              </span>
            </div>
          </Fade>

          <Fade delay={0.15}>
            <h1 style={{
              fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(38px, 5.5vw, 64px)',
              lineHeight: 1.1, margin: '0 auto 20px', maxWidth: 720, fontWeight: 400,
            }}>
              Your treatment.<br /><span style={{ color: 'var(--accent)' }}>Your data.</span> Your voice.
            </h1>
          </Fade>

          <Fade delay={0.25}>
            <p style={{ fontSize: 18, lineHeight: 1.65, color: 'var(--text-muted)', maxWidth: 560, margin: '0 auto 36px' }}>
              Chemotherapy is hard enough without losing track of how you feel. Log side effects, spot patterns across cycles, and walk into your next appointment with real data — not guesswork.
            </p>
          </Fade>

          <Fade delay={0.35}>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/signup" style={{
                fontSize: 16, fontWeight: 600, background: 'var(--accent)', color: '#fff',
                padding: '14px 36px', borderRadius: 32, boxShadow: '0 4px 24px #2A9D8F44',
                transition: 'all 0.25s', display: 'inline-block',
              }}>Start logging — it's free</Link>
              <a href="#how-it-works" style={{
                fontSize: 16, fontWeight: 600, background: 'transparent', color: 'var(--text)',
                padding: '14px 36px', borderRadius: 32, border: '1.5px solid var(--border)',
                transition: 'all 0.25s', display: 'inline-block',
              }}>See how it works</a>
            </div>
          </Fade>

          {/* ── Animated dashboard mockup ── */}
          <Fade delay={0.5}>
            <div style={{
              marginTop: 56, background: 'var(--card)', borderRadius: 20,
              border: '1px solid var(--border)', padding: 24,
              maxWidth: 700, margin: '56px auto 0', boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
            }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF6058' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFBD2E' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28CA42' }} />
                <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8, fontWeight: 500 }}>ChemoLog Dashboard</span>
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {[
                  { name: 'Nausea', val: 3.2, color: '#2A9D8F', bars: [2,4,6,3,2,5,3,1,4,2] },
                  { name: 'Fatigue', val: 7.8, color: '#E76F51', bars: [5,7,8,9,7,8,6,8,7,9] },
                  { name: 'Neuropathy', val: 2.1, color: '#E9C46A', bars: [1,2,3,2,1,3,2,2,1,3] },
                ].map((s, i) => (
                  <div key={s.name} style={{
                    flex: 1, minWidth: 140, background: i === 1 ? 'var(--accent-light)' : '#F9F9F7',
                    borderRadius: 14, padding: '18px 16px',
                    border: i === 1 ? '1.5px solid #2A9D8F33' : '1px solid var(--border)',
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.name}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28 }}>
                        {s.val}<span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}>/10</span>
                      </div>
                      <MiniChart values={s.bars} color={s.color} animate={heroVis} />
                    </div>
                    <div style={{ marginTop: 10, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{
                        width: heroVis ? `${s.val * 10}%` : '0%', height: '100%', borderRadius: 3,
                        background: i === 1 ? 'var(--coral)' : 'var(--accent)',
                        transition: 'width 1.2s cubic-bezier(.16,1,.3,1) 0.8s',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Fade>
        </div>
      </section>

      {/* ━━━ HOW IT WORKS ━━━ */}
      <section id="how-it-works" style={{ padding: '100px 28px', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <Fade><p style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16, textAlign: 'center' }}>How it works</p></Fade>
          <Fade delay={0.1}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(28px, 4vw, 40px)', textAlign: 'center', marginBottom: 64, fontWeight: 400 }}>Three steps to better conversations with your care team</h2>
          </Fade>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 40 }}>
            {[
              {
                step: '01', icon: '📝', title: 'Log daily',
                desc: 'Rate your symptoms on a simple 0–10 scale. Add notes about what you\'re experiencing. Takes about 30 seconds.',
              },
              {
                step: '02', icon: '📈', title: 'Track patterns',
                desc: 'See how symptoms change across cycles. Compare Cycle 3 vs. Cycle 2. Spot trends you\'d miss relying on memory alone.',
              },
              {
                step: '03', icon: '🩺', title: 'Share with your doctor',
                desc: 'Generate a clean, printable report before your next appointment. Real data replaces "I think it was bad last Tuesday."',
              },
            ].map((s, i) => (
              <Fade key={i} delay={0.15 + i * 0.12}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: '50%', margin: '0 auto 20px',
                    background: 'var(--accent-light)', border: '2px solid #2A9D8F22',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32,
                  }}>{s.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.1em', marginBottom: 8 }}>STEP {s.step}</div>
                  <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, marginBottom: 10, fontWeight: 400 }}>{s.title}</h3>
                  <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.65, maxWidth: 280, margin: '0 auto' }}>{s.desc}</p>
                </div>
              </Fade>
            ))}
          </div>

          {/* Connecting line (desktop) */}
          <div style={{
            display: 'flex', justifyContent: 'center', margin: '-180px 0 0', position: 'relative', zIndex: -1,
            opacity: 0.15, pointerEvents: 'none',
          }}>
            <div style={{ width: '60%', height: 2, background: 'var(--accent)', marginTop: 36 }} />
          </div>
        </div>
      </section>

      {/* ━━━ ABOUT — sourced stats ━━━ */}
      <section id="about" style={{ background: 'var(--bg-dark)', padding: '100px 28px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Fade><p style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Why ChemoLog?</p></Fade>
          <Fade delay={0.1}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(28px, 4vw, 42px)', color: 'var(--text-light)', lineHeight: 1.25, marginBottom: 24, fontWeight: 400 }}>
              Patients deserve better tools to communicate what they're going through.
            </h2>
          </Fade>
          <Fade delay={0.2}>
            <p style={{ fontSize: 17, lineHeight: 1.75, color: '#9CA3AF', maxWidth: 680 }}>
              During chemotherapy, side effects change cycle to cycle — and remembering exactly when the nausea peaked, how many days the fatigue lasted, or whether the tingling got worse is nearly impossible. Most patients walk into follow-ups relying on memory alone.
            </p>
          </Fade>
          <Fade delay={0.3}>
            <p style={{ fontSize: 17, lineHeight: 1.75, color: '#9CA3AF', maxWidth: 680, marginTop: 16 }}>
              ChemoLog gives you a simple way to log symptoms daily, track severity over time, and share clear reports with your care team. Better data means better conversations — and better care.
            </p>
          </Fade>

          {/* Stats with real citations */}
          <Fade delay={0.4}>
            <div style={{ display: 'flex', gap: 32, marginTop: 48, flexWrap: 'wrap' }}>
              {[
                {
                  n: '50%',
                  d: 'of severe side effects go unreported by clinicians in follow-ups',
                  src: 'Di Maio et al., Journal of Clinical Oncology, 2015',
                },
                {
                  n: '~20 min',
                  d: 'average face-to-face time with your oncologist per visit',
                  src: 'Tung et al., The Oncologist, 2024',
                },
                {
                  n: '60%',
                  d: 'of chemo patients experience at least one serious side effect',
                  src: 'Pearce et al., PLOS ONE, 2017',
                },
              ].map((s, i) => (
                <div key={i} style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, color: 'var(--warm)', marginBottom: 8 }}>
                    <AnimatedCounter target={parseInt(s.n)} suffix={s.n.replace(/[0-9]/g, '')} />
                  </div>
                  <div style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.5, marginBottom: 6 }}>{s.d}</div>
                  <div style={{ fontSize: 11, color: '#6B7280', fontStyle: 'italic', lineHeight: 1.4 }}>{s.src}</div>
                </div>
              ))}
            </div>
          </Fade>
        </div>
      </section>

      {/* ━━━ FEATURES ━━━ */}
      <section id="features" style={{ padding: '100px 28px' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <Fade><p style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16, textAlign: 'center' }}>Features</p></Fade>
          <Fade delay={0.1}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(28px, 4vw, 40px)', textAlign: 'center', marginBottom: 56, fontWeight: 400 }}>Simple tools for a hard time</h2>
          </Fade>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {[
              { icon: '📋', title: 'Daily symptom logging', desc: 'Track nausea, fatigue, neuropathy, appetite, mood, and more — rate severity on a simple scale and add notes.' },
              { icon: '📊', title: 'Cycle-over-cycle comparison', desc: 'Compare symptoms across treatment cycles side by side. Spot patterns and see whether things are improving or getting worse.' },
              { icon: '📄', title: 'Printable doctor reports', desc: 'Generate a clean, one-page summary to bring to your next appointment. Symptom averages, peaks, trends, and your notes.' },
              { icon: '💊', title: 'Medication tracking', desc: 'Log your chemo regimen, dosages, and infusion dates. Correlate symptoms to specific days post-treatment.' },
              { icon: '🔔', title: 'Gentle reminders', desc: 'Optional daily nudges to log symptoms, so you don\'t fall behind — especially during the rough days.' },
              { icon: '📖', title: 'Side effects guide', desc: 'Evidence-based information about every trackable symptom: what causes it, when it peaks, and when to call your doctor.' },
            ].map((f, i) => (
              <Fade key={i} delay={0.15 + i * 0.08}>
                <div style={{
                  background: 'var(--card)', borderRadius: 18, padding: '32px 26px',
                  border: '1px solid var(--border)', transition: 'box-shadow 0.3s, transform 0.3s', height: '100%',
                  cursor: 'default',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 32px rgba(0,0,0,0.07)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}
                >
                  <div style={{ fontSize: 28, marginBottom: 16 }}>{f.icon}</div>
                  <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 10 }}>{f.title}</div>
                  <div style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--text-muted)' }}>{f.desc}</div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ SIDE EFFECTS GUIDE PREVIEW ━━━ */}
      <section id="guide" style={{ background: '#F9F9F7', padding: '100px 28px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Fade><p style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16, textAlign: 'center' }}>Side Effects Guide</p></Fade>
          <Fade delay={0.1}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(28px, 4vw, 40px)', textAlign: 'center', marginBottom: 16, fontWeight: 400 }}>Know what to expect — and when to speak up</h2>
          </Fade>
          <Fade delay={0.2}>
            <p style={{ fontSize: 16, color: 'var(--text-muted)', textAlign: 'center', maxWidth: 560, margin: '0 auto 48px', lineHeight: 1.65 }}>
              Evidence-based information about common chemotherapy side effects, sourced from the National Cancer Institute, American Cancer Society, and peer-reviewed literature.
            </p>
          </Fade>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
            {[
              { emoji: '🤢', name: 'Nausea & Vomiting', preview: 'Affects 60–80% of patients. Usually peaks 24–48 hours post-infusion.' },
              { emoji: '😴', name: 'Fatigue', preview: 'The most commonly reported side effect (85%+). Tends to worsen with each cycle.' },
              { emoji: '🫠', name: 'Neuropathy', preview: 'Tingling and numbness that can persist years after treatment ends.' },
              { emoji: '😣', name: 'Pain', preview: 'Can range from muscle aches to bone pain depending on the regimen.' },
            ].map((s, i) => (
              <Fade key={i} delay={0.2 + i * 0.08}>
                <Link to="/guide" style={{
                  display: 'block', background: 'var(--card)', borderRadius: 14, padding: '24px 22px',
                  border: '1px solid var(--border)', transition: 'all 0.3s', textDecoration: 'none', color: 'inherit',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#2A9D8F44'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none' }}
                >
                  <div style={{ fontSize: 24, marginBottom: 10 }}>{s.emoji}</div>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{s.name}</div>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.55 }}>{s.preview}</div>
                  <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600, marginTop: 12 }}>Read more →</div>
                </Link>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ TESTIMONIALS ━━━ */}
      <section style={{ padding: '100px 28px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <Fade><p style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16, textAlign: 'center' }}>What patients say</p></Fade>
          <Fade delay={0.1}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(28px, 4vw, 40px)', textAlign: 'center', marginBottom: 56, fontWeight: 400 }}>Built for patients, shaped by feedback</h2>
          </Fade>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {[
              {
                quote: "I used to walk into appointments and blank on everything. Now I pull up my ChemoLog report and my oncologist actually adjusts my plan based on it.",
                name: 'Patient feedback',
                detail: 'Breast cancer, Cycle 6',
              },
              {
                quote: "Being able to compare my Cycle 4 to Cycle 3 showed me the fatigue was actually getting better, even though it didn't feel like it in the moment.",
                name: 'Patient feedback',
                detail: 'Colorectal cancer, Cycle 4',
              },
              {
                quote: "My daughter set this up for me and it's the only app I actually use every day. Simple enough that even on the worst days I can log in 30 seconds.",
                name: 'Patient feedback',
                detail: 'Lung cancer, Cycle 3',
              },
            ].map((t, i) => (
              <Fade key={i} delay={0.15 + i * 0.1}>
                <div style={{
                  background: 'var(--card)', borderRadius: 18, padding: '32px 28px',
                  border: '1px solid var(--border)', height: '100%',
                  display: 'flex', flexDirection: 'column',
                }}>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, color: 'var(--accent)', lineHeight: 1, marginBottom: 12 }}>"</div>
                  <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.7, flex: 1 }}>{t.quote}</p>
                  <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{t.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t.detail}</div>
                  </div>
                </div>
              </Fade>
            ))}
          </div>

          <Fade delay={0.5}>
            <p style={{ textAlign: 'center', marginTop: 32, fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic' }}>
              Testimonials reflect early user feedback. Names withheld for patient privacy.
            </p>
          </Fade>
        </div>
      </section>

      {/* ━━━ CTA ━━━ */}
      <section style={{ padding: '80px 28px 120px' }}>
        <Fade>
          <div style={{
            maxWidth: 720, margin: '0 auto', textAlign: 'center',
            background: 'linear-gradient(135deg, var(--bg-dark), #162A3E)',
            borderRadius: 28, padding: '64px 40px', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'var(--accent)', opacity: 0.08, filter: 'blur(40px)' }} />
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(26px, 3.5vw, 36px)', color: 'var(--text-light)', marginBottom: 16, fontWeight: 400, position: 'relative' }}>
              You're already fighting.<br />Let us help you keep track.
            </h2>
            <p style={{ fontSize: 16, color: '#9CA3AF', marginBottom: 32, lineHeight: 1.6, position: 'relative' }}>
              Free to use. No ads. No data selling. Built by students who care about cancer patients.
            </p>
            <Link to="/signup" style={{
              fontSize: 16, fontWeight: 600, background: 'var(--accent)', color: '#fff',
              padding: '15px 40px', borderRadius: 32, boxShadow: '0 4px 24px #2A9D8F44',
              position: 'relative', display: 'inline-block',
            }}>Create your free account</Link>
          </div>
        </Fade>
      </section>

      {/* ━━━ FOOTER ━━━ */}
      <footer style={{ background: 'var(--bg-dark)', padding: '48px 28px', borderTop: '1px solid #1E2D3D' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 32,
          }}>
            {/* Left */}
            <div style={{ maxWidth: 320 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 11, fontWeight: 700,
                }}>C</div>
                <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 16, color: '#CBD5E1' }}>ChemoLog</span>
              </div>
              <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6, marginBottom: 12 }}>
                Built with care by students at Stuyvesant High School, NYC. Driven by the belief that cancer patients deserve better tools.
              </p>
              <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.5 }}>
                ⚠️ ChemoLog is not a medical device and is not a substitute for professional medical advice. For personal tracking only. Always consult your care team before making treatment decisions.
              </p>
            </div>

            {/* Links */}
            <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Product</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <a href="#features" style={{ fontSize: 14, color: '#64748B' }}>Features</a>
                  <a href="#how-it-works" style={{ fontSize: 14, color: '#64748B' }}>How it works</a>
                  <Link to="/guide" style={{ fontSize: 14, color: '#64748B' }}>Side effects guide</Link>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Account</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Link to="/signup" style={{ fontSize: 14, color: '#64748B' }}>Sign up</Link>
                  <Link to="/login" style={{ fontSize: 14, color: '#64748B' }}>Log in</Link>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Sources</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <a href="https://www.cancer.org" target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: '#64748B' }}>American Cancer Society</a>
                  <a href="https://www.cancer.gov" target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: '#64748B' }}>National Cancer Institute</a>
                </div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #1E2D3D', marginTop: 32, paddingTop: 20, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <p style={{ fontSize: 12, color: '#475569' }}>© {new Date().getFullYear()} ChemoLog. Open source. Free forever.</p>
            <p style={{ fontSize: 12, color: '#475569' }}>Made in NYC 🗽</p>
          </div>
        </div>
      </footer>
    </>
  )
}
