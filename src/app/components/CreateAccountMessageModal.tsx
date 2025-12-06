'use client'

interface CreateAccountMessageModalProps {
  onClose: () => void
}

export default function CreateAccountMessageModal({ onClose }: CreateAccountMessageModalProps) {
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create account</h2>
            <p className="text-gray-900 text-base leading-relaxed">
              We are glad you want to join us. For the moment, we are only inviting friends and acquaintances.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

