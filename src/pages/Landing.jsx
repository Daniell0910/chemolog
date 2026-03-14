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
          <Link to="/login" style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500 }}>Log in</Link>
          <Link to="/signup" style={{
            fontSize: 14, fontWeight: 600, background: 'var(--accent)', color: '#fff',
            padding: '9px 22px', borderRadius: 28, transition: 'opacity 0.2s',
          }}>Sign up</Link>
        </div>
      </div>
    </nav>
  )
}

export default function Landing() {
  return (
    <>
      <Nav />
      {/* HERO */}
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
                Trusted by patients going through treatment
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
              Chemotherapy is hard enough without losing track of how you feel. Log your side effects, spot patterns across cycles, and walk into your next appointment with real data — not guesswork.
            </p>
          </Fade>

          <Fade delay={0.35}>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/signup" style={{
                fontSize: 16, fontWeight: 600, background: 'var(--accent)', color: '#fff',
                padding: '14px 36px', borderRadius: 32, boxShadow: '0 4px 24px #2A9D8F44',
                transition: 'all 0.25s', display: 'inline-block',
              }}>Start logging</Link>
              <a href="#about" style={{
                fontSize: 16, fontWeight: 600, background: 'transparent', color: 'var(--text)',
                padding: '14px 36px', borderRadius: 32, border: '1.5px solid var(--border)',
                transition: 'all 0.25s', display: 'inline-block',
              }}>Learn more</a>
            </div>
          </Fade>

          <Fade delay={0.5}>
            <div style={{
              marginTop: 56, background: 'var(--card)', borderRadius: 20,
              border: '1px solid var(--border)', padding: 24,
              maxWidth: 640, margin: '56px auto 0', boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
            }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF6058' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFBD2E' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28CA42' }} />
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {['Nausea', 'Fatigue', 'Neuropathy'].map((s, i) => (
                  <div key={s} style={{
                    flex: 1, minWidth: 140, background: i === 1 ? 'var(--accent-light)' : '#F9F9F7',
                    borderRadius: 14, padding: '18px 16px',
                    border: i === 1 ? '1.5px solid #2A9D8F33' : '1px solid var(--border)',
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s}</div>
                    <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28 }}>
                      {['3.2', '7.8', '2.1'][i]}<span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}>/10</span>
                    </div>
                    <div style={{ marginTop: 10, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${[32, 78, 21][i]}%`, height: '100%', borderRadius: 3, background: i === 1 ? 'var(--coral)' : 'var(--accent)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Fade>
        </div>
      </section>

      {/* ABOUT */}
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
          <Fade delay={0.4}>
            <div style={{ display: 'flex', gap: 32, marginTop: 48, flexWrap: 'wrap' }}>
              {[
                { n: '70%', d: 'of patients underreport side effects at appointments' },
                { n: '5 min', d: 'average oncology follow-up discussion time' },
                { n: '1 in 3', d: 'patients say side effects are worse than expected' },
              ].map((s, i) => (
                <div key={i} style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, color: 'var(--warm)', marginBottom: 8 }}>{s.n}</div>
                  <div style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.5 }}>{s.d}</div>
                </div>
              ))}
            </div>
          </Fade>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '100px 28px' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <Fade><p style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16, textAlign: 'center' }}>Features</p></Fade>
          <Fade delay={0.1}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(28px, 4vw, 40px)', textAlign: 'center', marginBottom: 56, fontWeight: 400 }}>Simple tools for a hard time</h2>
          </Fade>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {[
              { icon: '📋', title: 'Daily symptom logging', desc: 'Track nausea, fatigue, neuropathy, appetite, mood, and more — rate severity on a simple scale and add notes.' },
              { icon: '📊', title: 'Cycle-over-cycle trends', desc: "Visualize how your symptoms change across treatment cycles. Spot patterns your doctor needs to know about." },
              { icon: '📄', title: 'Shareable reports', desc: "Generate a clean summary to bring to your next appointment. No more 'I think it was bad last Tuesday.'" },
              { icon: '🔔', title: 'Gentle reminders', desc: 'Optional daily nudges to log symptoms, so you don\'t fall behind — especially during the rough days.' },
            ].map((f, i) => (
              <Fade key={i} delay={0.15 + i * 0.1}>
                <div style={{
                  background: 'var(--card)', borderRadius: 18, padding: '32px 26px',
                  border: '1px solid var(--border)', transition: 'box-shadow 0.3s, transform 0.3s', height: '100%',
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

      {/* CTA */}
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
              Free to use. No ads. Built by students who care about cancer patients.
            </p>
            <Link to="/signup" style={{
              fontSize: 16, fontWeight: 600, background: 'var(--accent)', color: '#fff',
              padding: '15px 40px', borderRadius: 32, boxShadow: '0 4px 24px #2A9D8F44',
              position: 'relative', display: 'inline-block',
            }}>Create your free account</Link>
          </div>
        </Fade>
      </section>

      {/* FOOTER */}
      <footer style={{ background: 'var(--bg-dark)', padding: '40px 28px', borderTop: '1px solid #1E2D3D' }}>
        <div style={{
          maxWidth: 1060, margin: '0 auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 26, height: 26, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 11, fontWeight: 700,
            }}>C</div>
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 16, color: '#CBD5E1' }}>ChemoLog</span>
          </div>
          <p style={{ fontSize: 13, color: '#64748B' }}>Not a medical device. For personal tracking only. Always consult your care team.</p>
        </div>
      </footer>
    </>
  )
}
