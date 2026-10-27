export default function Hero({ img, title, sub }) {
  return (
    <section className="bg-cover bg-center text-white" style={{ backgroundImage: `linear-gradient(rgb(0 0 0 / .5), rgb(0 0 0 / .5)), url('/images/${img}'), linear-gradient(135deg, #2F5D50, #1B2433)` }}>
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <h1 className="hero-rise font-serif text-4xl md:text-5xl">{title}</h1>
        {sub && <p style={{ '--d': '150ms' }} className="hero-rise mt-3 max-w-xl text-white/85 text-lg">{sub}</p>}
      </div>
    </section>
  )
}
