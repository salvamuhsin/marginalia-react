import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 mt-16 text-center">
      <p className="text-6xl">📕</p>
      <h1 className="font-serif text-4xl mt-4">Page not found</h1>
      <p className="mt-3 text-ink/70">The page you are looking for does not exist.</p>
      <Link to="/" className="inline-block mt-6 rounded bg-moss text-paper px-6 py-2.5 font-medium">Back to home</Link>
    </div>
  )
}
