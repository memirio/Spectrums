'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import CreateAccountMessageModal from '../components/CreateAccountMessageModal'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showCreateAccountMessage, setShowCreateAccountMessage] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/app/all'

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
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900"
                placeholder="Enter your password"
              />
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
              onClick={async () => {
                setIsLoading(true)
                setError('')
                
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
              }}
              disabled={isLoading || !username || !password}
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

