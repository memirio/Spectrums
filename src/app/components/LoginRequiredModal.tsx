'use client'

import { useRouter } from 'next/navigation'

interface LoginRequiredModalProps {
  onClose: () => void
}

export default function LoginRequiredModal({ onClose }: LoginRequiredModalProps) {
  const router = useRouter()

  const handleLogin = () => {
    onClose()
    router.push('/login?callbackUrl=/app/all')
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 100 }}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="relative mb-6">
            <button
              onClick={onClose}
              className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Login required</h2>
            <p className="text-gray-900 text-base leading-relaxed mb-6">
              You've reached the maximum number of active vibe filters. Please log in to add an unlimited number of filters.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleLogin}
              className="w-full px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors cursor-pointer"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

