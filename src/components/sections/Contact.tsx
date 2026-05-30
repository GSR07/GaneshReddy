import { FormEvent, useState } from 'react'
import toast from 'react-hot-toast'

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined

const FIELDS = [
  { id: 'name',    label: 'Name *',  type: 'text',  placeholder: 'Your name' },
  { id: 'email',   label: 'Email *', type: 'email', placeholder: 'your@email.com' },
  { id: 'subject', label: 'Subject', type: 'text',  placeholder: 'Thesis / Werkstudent / Internship…' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in Name, Email and Message.')
      return
    }
    setSending(true)
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY ?? '',
          name: form.name,
          email: form.email,
          subject: form.subject || `Portfolio contact from ${form.name}`,
          message: form.message,
          from_name: 'Ganesh Portfolio',
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSent(true)
        toast.success("Message sent! I'll get back to you soon.")
        setForm({ name: '', email: '', subject: '', message: '' })
      } else throw new Error(data.message)
    } catch {
      toast.error('Failed to send — email me at ganeshreddy30102000@gmail.com')
    }
    setSending(false)
  }

  return (
    <section id="contact" className="section section-alt">
      <div className="container">
        <div className="section-label">06 / Contact</div>
        <h2 className="section-title">Let's Connect</h2>

        <div className="contact-wrap">
          {/* ── Left: info ── */}
          <div className="contact-info glass-card reveal">
            <p className="contact-lead">
              I'm actively seeking a <strong>Master's thesis placement</strong>,{' '}
              <strong>Pflichtpraktikum (10+ weeks)</strong>, or{' '}
              <strong>Werkstudent role</strong> in robotics, autonomous systems, or
              embedded engineering — at research labs, or
              industrial teams across Germany and Europe.
              Immediate availability. On-site.
            </p>

            <div className="contact-links">
              <a href="mailto:ganeshreddy30102000@gmail.com" className="contact-link">
                <div className="clink-icon">
                  <svg className="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <div>
                  <div className="clink-label">Email</div>
                  <div className="clink-val">ganeshreddy30102000@gmail.com</div>
                </div>
              </a>

              <a href="tel:+4915510182395" className="contact-link">
                <div className="clink-icon">
                  <svg className="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.12 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <div className="clink-label">Phone</div>
                  <div className="clink-val">+49 1551 018 2395</div>
                </div>
              </a>

              <a href="https://www.linkedin.com/in/ganeshssreddy09" target="_blank" rel="noreferrer" className="contact-link">
                <div className="clink-icon" style={{ fontWeight: 700, fontSize: '0.875rem' }}>in</div>
                <div>
                  <div className="clink-label">LinkedIn</div>
                  <div className="clink-val">ganeshssreddy09</div>
                </div>
              </a>

              <a href="https://github.com/gsr07" target="_blank" rel="noreferrer" className="contact-link">
                <div className="clink-icon">
                  <svg className="icon-svg" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                </div>
                <div>
                  <div className="clink-label">GitHub</div>
                  <div className="clink-val">gsr07</div>
                </div>
              </a>
            </div>

            <div className="languages">
              <span className="lang-pill"><span className="lang-flag lang-flag-en">EN</span> English (C1)</span>
              <span className="lang-pill"><span className="lang-flag lang-flag-de">DE</span> German (A2 Certified)</span>
              <span className="lang-pill"><span className="lang-flag lang-flag-hi">HI</span> Hindi (Native)</span>
            </div>
          </div>

          {/* ── Right: form + CV ── */}
          <div className="contact-cta reveal">
            {sent ? (
              <div className="glass-card contact-form" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem' }}>✓</div>
                <h3>Message Sent!</h3>
                <p style={{ color: 'var(--text-muted)' }}>I'll get back to you within 1–2 business days.</p>
                <button onClick={() => setSent(false)} className="btn-ghost" style={{ marginTop: '0.5rem' }}>
                  Send Another
                </button>
              </div>
            ) : (
              <form className="glass-card contact-form" onSubmit={handleSubmit}>
                <h3>Send a Message</h3>

                {FIELDS.map(f => (
                  <div key={f.id} className="contact-field">
                    <label htmlFor={f.id}>{f.label}</label>
                    <input
                      id={f.id} type={f.type} placeholder={f.placeholder}
                      value={form[f.id as keyof typeof form]}
                      onChange={e => setForm(p => ({ ...p, [f.id]: e.target.value }))}
                    />
                  </div>
                ))}

                <div className="contact-field">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message" placeholder="Tell me about the opportunity…"
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  />
                </div>

                <button type="submit" className="btn-primary" disabled={sending}
                  style={{ width: '100%', justifyContent: 'center' }}>
                  {sending ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}

            <a
              href="/cv/cv/Ganesh_Reddy_CV_MSc_Autonomy_Technologies.pdf"
              target="_blank"
              className="btn-ghost"
              style={{ justifyContent: 'center', gap: '0.5rem' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 15, height: 15 }}>
                <path d="M12 15V3m0 12-4-4m4 4 4-4" />
                <path d="M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" />
              </svg>
              Download Full CV
            </a>

            <p className="cta-note" style={{ textAlign: 'center' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                style={{ display: 'inline', width: 13, height: 13, marginRight: 4, verticalAlign: -1 }}>
                <path d="M20 10c0 6-8 13-8 13s-8-7-8-13a8 8 0 0 1 16 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Based in Erlangen, Germany · Open to remote &amp; on-site
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
