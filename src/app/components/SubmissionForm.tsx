'use client'

import { useRouter } from 'next/navigation'

interface SubmissionFormProps {
  onClose: () => void
  onSuccess: () => void
  onLoginClick?: () => void
  onCreateAccountClick?: () => void
}

export default function SubmissionForm({ onClose, onSuccess, onLoginClick, onCreateAccountClick }: SubmissionFormProps) {
  const router = useRouter()
  
  const handleOpenLogin = () => {
    // Close the submission form modal first
    onClose()
    // Navigate to login page
    router.push('/login')
  }

  const handleCreateAccount = () => {
    // Close the submission form modal first
    onClose()
    // Then open create account message modal if callback is provided
    if (onCreateAccountClick) {
      onCreateAccountClick()
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Join direction to submit a design.</h2>
            <p className="text-gray-700">
              Free unlimited access to the best designs in the world
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleOpenLogin}
              className="w-full px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors cursor-pointer"
            >
              Login
            </button>
            <button
              type="button"
              onClick={handleCreateAccount}
              className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded-md hover:bg-[#f5f3ed] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer"
            >
              Create account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
