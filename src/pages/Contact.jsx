import { useState } from 'react'
import Hero from '../components/Hero.jsx'
import { shop } from '../lib/config.js'
import { submitNetlify } from '../lib/forms.js'
import { useShop } from '../lib/shop.jsx'

export default function Contact() {
  const { showFlash } = useShop()
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const { lat, lng } = shop

  const send = async (e) => {
    e.preventDefault(); const f = e.currentTarget; setError(''); setSending(true)
    try {
      await submitNetlify('contact', Object.fromEntries(new FormData(f)))
      f.reset(); showFlash('Thanks! Your message has been sent. We will reply soon.'); window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch { setError('Sorry, your message could not be sent. Please try again.') }
    setSending(false)
  }

  const field = 'mt-1 w-full rounded border border-ink/25 bg-paper px-3 py-2'
  return (<>
    <Hero img="hero-contact.jpg" title="Contact us" sub="Questions about an order or a book? We would love to hear from you." />
    <section className="max-w-7xl mx-auto px-4 mt-14 grid lg:grid-cols-2 gap-10">
      <div className="space-y-6">
        <div className="bg-card border border-ink/10 rounded-lg p-6 space-y-3">
          <h2 className="font-serif text-2xl">Get in touch</h2>
          <p>📍 {shop.address}</p><p>📞 {shop.phone}</p><p>✉️ {shop.email}</p><p>🕘 Mon–Sat, 9:00–18:00</p>
        </div>
        <iframe title="Map" className="w-full h-80 rounded-lg border border-ink/10" loading="lazy"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.006}%2C${lng + 0.01}%2C${lat + 0.006}&layer=mapnik&marker=${lat}%2C${lng}`}></iframe>
      </div>
      <form onSubmit={send} className="bg-card border border-ink/10 rounded-lg p-6 space-y-4 h-fit">
        <h2 className="font-serif text-2xl">Send a message</h2>
        <p hidden><label>Do not fill this out: <input name="bot-field" /></label></p>
        {[['name', 'Your name'], ['email', 'Email'], ['subject', 'Subject']].map(([f, l]) => (
          <label key={f} className="block"><span className="font-medium">{l}</span>
            <input name={f} type={f === 'email' ? 'email' : 'text'} maxLength={f === 'subject' ? 150 : 120} required className={field} />
          </label>
        ))}
        <label className="block"><span className="font-medium">Message</span>
          <textarea name="message" rows="5" maxLength={3000} required className={field}></textarea>
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={sending} className="rounded bg-moss text-paper px-6 py-2.5 font-medium">{sending ? 'Sending…' : 'Send message'}</button>
      </form>
    </section>
  </>)
}
