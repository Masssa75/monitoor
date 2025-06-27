'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '../../../lib/supabase/client'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] to-[#1e1e3f] text-white flex flex-col">
      <div className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full">
        {/* Header */}
        <div className="mb-12 mt-12">
          <Link href="/explore" className="text-gray-400 text-sm mb-6 inline-block">← Back to Explore</Link>
          <h1 className="text-xl font-light mb-2">Welcome back</h1>
          <p className="text-sm text-gray-400">Sign in to your account</p>
        </div>

        <form onSubmit={handleSignIn} className="flex-1 flex flex-col">
          <div className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>

          <div className="mt-auto space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <p className="text-center mt-6 text-slate-400">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300">
            Sign up
          </Link>
        </p>
        
        <p className="text-center mt-4 text-slate-400">
          <Link href="/explore" className="text-blue-400 hover:text-blue-300">
            Explore without account
          </Link>
        </p>
      </div>
    </div>
  )
}