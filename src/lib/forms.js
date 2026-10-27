// Posts a form to Netlify Forms (works once deployed on Netlify).
export async function submitNetlify(formName, data) {
  const body = new URLSearchParams({ 'form-name': formName, ...data }).toString()
  const r = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body })
  if (!r.ok) throw new Error('Form submit failed')
}
