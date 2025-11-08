'use client'

import { useState } from 'react'
import Header from '../components/Header'
import SubmissionForm from '../components/SubmissionForm'

export default function AppDesignPage() {
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)

  const handleSubmissionSuccess = () => {
    // Could refresh data or show success message
    console.log('App Design submission successful')
  }

  return (
    <div className="min-h-screen bg-[#fbf9f4]">
      {/* Header */}
      <Header onSubmitClick={() => setShowSubmissionForm(true)} />

      {/* Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center">
          <h1 className="text-4xl font-semibold text-gray-900">Coming soon</h1>
        </div>
      </div>

      {/* Submission Form Modal */}
      {showSubmissionForm && (
        <SubmissionForm
          onClose={() => setShowSubmissionForm(false)}
          onSuccess={handleSubmissionSuccess}
        />
      )}
    </div>
  )
}

