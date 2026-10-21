import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { TrendingDown, Mail, Lock, ArrowRight, AlertCircle, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please fill in both email and password.')
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      await login(email, password)
      navigate(redirect)
    } catch {
      setError('Invalid email or password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const fillDemoAccount = (role: 'user' | 'admin') => {
    if (role === 'admin') {
      setEmail('admin@pricewise.ai')
      setPassword('admin1234')
    } else {
      setEmail('shopper@pricewise.ai')
      setPassword('password123')
    }
    setError(null)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-gray-200 shadow-xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <TrendingDown className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-gray-900">
              PriceWise<span className="text-emerald-500">AI</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-gray-900 pt-2">Welcome Back</h2>
          <p className="text-xs text-gray-500">
            Sign in to access your custom price drop alerts & synced watchlist
          </p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="bg-blue-50/80 p-3 rounded-xl border border-blue-100 space-y-2">
          <p className="text-[11px] font-semibold text-blue-900 uppercase tracking-wider text-center">
            Quick Demo Login:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('user')}
              className="text-xs bg-white hover:bg-blue-100 text-blue-700 py-1.5 px-2 rounded-lg border border-blue-200 font-medium transition-colors"
            >
              Regular User
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('admin')}
              className="text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 py-1.5 px-2 rounded-lg border border-purple-200 font-medium transition-colors flex items-center justify-center gap-1"
            >
              <Shield className="w-3 h-3 text-purple-600" /> Admin Role
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            required
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="py-3 font-semibold"
          >
            Sign In
          </Button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 text-xs text-gray-500">
          Don't have an account yet?{' '}
          <Link
            to={`/register?redirect=${encodeURIComponent(redirect)}`}
            className="text-blue-600 hover:text-blue-700 font-bold hover:underline"
          >
            Sign up free
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
