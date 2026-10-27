import { useEffect } from 'react'

// Port of the scroll animations from layout.blade.php: progress bar, header shadow, back-to-top,
// parallax banners, number counters and reveal-on-scroll. Re-runs on every page change.
export default function useScrollEffects(key) {
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const $$ = (s, r = document) => [...r.querySelectorAll(s)]
    const bar = document.getElementById('scrollbar'), header = document.querySelector('header'), toTop = document.getElementById('to-top')
    const cleanups = []
    const timeout = setTimeout(() => {
      const parallax = reduce ? [] : $$('main .bg-cover:not(.kb)')
      let queued = false
      const frame = () => {
        queued = false
        const y = scrollY, max = document.documentElement.scrollHeight - innerHeight, vh = innerHeight
        if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')'
        if (header) header.classList.toggle('is-scrolled', y > 8)
        if (toTop) toTop.classList.toggle('is-on', y > 600)
        parallax.forEach((el) => {
          const r = el.getBoundingClientRect()
          if (r.bottom < 0 || r.top > vh) return
          const p = (vh - r.top) / (vh + r.height)
          el.style.backgroundPositionY = (30 + p * 40).toFixed(1) + '%'
        })
      }
      const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(frame) } }
      addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', frame); frame()
      cleanups.push(() => { removeEventListener('scroll', onScroll); removeEventListener('resize', frame) })

      if (reduce || !('IntersectionObserver' in window)) return

      // number counters: <p data-count>12,000+</p>
      const co = new IntersectionObserver((es) => es.forEach((e) => {
        if (!e.isIntersecting) return
        co.unobserve(e.target)
        const { el, target, fmt } = e.target._count, t0 = performance.now(), dur = 1600
        const tick = (now) => { const k = Math.min((now - t0) / dur, 1); el.textContent = fmt(target * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(tick) }
        requestAnimationFrame(tick)
      }), { threshold: 0.6 })
      $$('[data-count]').forEach((el) => {
        const m = el.textContent.trim().match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/); if (!m) return
        const dec = (m[2].split('.')[1] || '').length, target = parseFloat(m[2].replace(/,/g, ''))
        const fmt = (n) => m[1] + n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + m[3]
        el._count = { el, target, fmt }; el.textContent = fmt(0); co.observe(el)
      })
      cleanups.push(() => co.disconnect())

      // reveal on scroll
      const above = document.querySelector('main > :first-child')
      const targets = $$('main .grid > *, footer .grid > *, main h2, main ol > li, main .space-y-3 > *, main > section > .rounded-2xl, main figure, main > div > section > .rounded-2xl')
      const io = new IntersectionObserver((es) => es.forEach((e) => {
        if (!(e.isIntersecting || e.boundingClientRect.top < 0)) return
        const el = e.target; io.unobserve(el); el.classList.add('is-in')
        setTimeout(() => { el.classList.remove('reveal', 'is-in'); el.removeAttribute('data-reveal'); el.style.removeProperty('--d') },
          900 + (parseInt(el.style.getPropertyValue('--d')) || 0))
      }), { rootMargin: '0px 0px -8% 0px' })
      targets.forEach((el) => {
        if (above && above.contains(el)) return
        if (el.parentElement.closest('.reveal')) return
        if (el.matches('.grid > *') && el.querySelector('.grid')) return
        const sibs = [...el.parentElement.children], i = sibs.indexOf(el)
        if (el.matches('ol > li')) el.dataset.reveal = 'left'
        else if (el.matches('.rounded-2xl')) el.dataset.reveal = 'zoom'
        else if (el.matches('.grid > *') && sibs.length === 2) el.dataset.reveal = i ? 'right' : 'left'
        el.style.setProperty('--d', (el.matches('.grid > *, .space-y-3 > *') ? (i % 4) * 90 : 0) + 'ms')
        el.classList.add('reveal'); io.observe(el)
      })
      cleanups.push(() => io.disconnect())
    }, 60)
    return () => { clearTimeout(timeout); cleanups.forEach((c) => c()) }
  }, [key])
}
