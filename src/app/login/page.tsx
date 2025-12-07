'use client'

import { useState, Suspense, useRef } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import CreateAccountMessageModal from '../components/CreateAccountMessageModal'

function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showCreateAccountMessage, setShowCreateAccountMessage] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({})
  const usernameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/app/all'

  const handleLogin = async () => {
    // Clear previous errors
    setError('')
    setFieldErrors({})
    
    // Validate fields
    const errors: { username?: string; password?: string } = {}
    let hasErrors = false
    
    if (!username.trim()) {
      errors.username = 'Username is required'
      hasErrors = true
    }
    
    if (!password.trim()) {
      errors.password = 'Password is required'
      hasErrors = true
    }
    
    if (hasErrors) {
      setFieldErrors(errors)
      // Focus the first field with an error
      if (errors.username) {
        usernameRef.current?.focus()
      } else if (errors.password) {
        passwordRef.current?.focus()
      }
      return
    }
    
    setIsLoading(true)
    
    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid username or password')
      } else if (result?.ok) {
        // Redirect to callback URL or app home
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (err: any) {
      setError('An error occurred. Please try again.')
      console.error('[login] Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fbf9f4]">
      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-[#fbf9f4] rounded-lg border border-gray-300 max-w-md w-full p-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Login</h2>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User name
              </label>
              <input
                ref={usernameRef}
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  if (fieldErrors.username) {
                    setFieldErrors(prev => ({ ...prev, username: undefined }))
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleLogin()
                  }
                }}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-900 ${
                  fieldErrors.username 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-gray-500'
                }`}
                placeholder="Enter your username"
              />
              {fieldErrors.username && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.username}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                ref={passwordRef}
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (fieldErrors.password) {
                    setFieldErrors(prev => ({ ...prev, password: undefined }))
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleLogin()
                  }
                }}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-900 ${
                  fieldErrors.password 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-gray-500'
                }`}
                placeholder="Enter your password"
              />
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-3 mt-6">
            <button
              type="button"
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
            <button
              type="button"
              onClick={() => setShowCreateAccountMessage(true)}
              className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded-md hover:bg-[#f5f3ed] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer"
            >
              Create account
            </button>
          </div>
        </div>
      </div>

      {/* Create Account Message Modal */}
      {showCreateAccountMessage && (
        <CreateAccountMessageModal
          onClose={() => setShowCreateAccountMessage(false)}
        />
      )}
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fbf9f4] flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}

