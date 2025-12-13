'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface SubmissionFormProps {
  onClose: () => void
  onSuccess: () => void
  onLoginClick?: () => void
  onCreateAccountClick?: () => void
}

export default function SubmissionForm({ onClose, onSuccess, onLoginClick, onCreateAccountClick }: SubmissionFormProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const isLoggedIn = !!session?.user
  
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [website, setWebsite] = useState('')
  const [company, setCompany] = useState('')
  const [category, setCategory] = useState('website')
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [imageError, setImageError] = useState('')
  const [websiteError, setWebsiteError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const acceptedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  
  const categories = [
    { value: 'website', label: 'Webb' },
    { value: 'packaging', label: 'Packaging' },
    { value: 'brand', label: 'Brand' },
    { value: 'graphic', label: 'Graphic' },
    { value: 'logo', label: 'Logo' },
  ]
  
  const handleOpenLogin = () => {
    onClose()
    router.push('/login')
  }

  const handleCreateAccount = () => {
    onClose()
    if (onCreateAccountClick) {
      onCreateAccountClick()
    }
  }

  const handleFileSelect = (file: File) => {
    if (!acceptedFormats.includes(file.type)) {
      setImageError('Please upload a valid image file (JPG, JPEG, PNG, or WEBP)')
      return
    }
    
    setImageError('')
    setError('')
    setImageFile(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }, [])

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleSubmit = async () => {
    // Clear previous errors
    setImageError('')
    setWebsiteError('')
    setError('')
    
    // Validate fields
    let hasErrors = false
    
    if (!imageFile) {
      setImageError('Please upload an image')
      hasErrors = true
    }
    
    if (!website.trim()) {
      setWebsiteError('Please enter a website URL')
      hasErrors = true
    }
    
    if (hasErrors) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // First, upload the image
      // imageFile is guaranteed to be non-null here due to validation above
      const uploadFormData = new FormData()
      uploadFormData.append('image', imageFile!)
      
      const uploadResponse = await fetch('/api/upload-image', {
        method: 'POST',
        body: uploadFormData,
      })
      
      if (!uploadResponse.ok) {
        const uploadData = await uploadResponse.json()
        throw new Error(uploadData.error || 'Failed to upload image')
      }
      
      const uploadData = await uploadResponse.json()
      const imageUrl = uploadData.imageUrl
      
      // Then, create the site with the image URL
      // Use Pipeline 2.0: Skip concept generation (only tag with existing concepts)
      const response = await fetch('/api/sites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: website.trim(),
          title: company.trim() || website.trim(), // Company name is the title
          author: company.trim() || '',
          imageUrl: imageUrl,
          category: category, // Category for the image
          skipConceptGeneration: true, // Use Pipeline 2.0 - no new tag creation
        }),
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit design')
      }
      
      // Success
      onSuccess()
      onClose()
      
      // Reset form
      setImageFile(null)
      setImagePreview(null)
      setWebsite('')
      setCompany('')
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show login prompt for non-logged-in users
  if (!isLoggedIn) {
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

  // Show upload form for logged-in users
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="relative mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Submit a design</h2>
            <button
              onClick={onClose}
              className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-900 bg-white cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Image</label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  imageError
                    ? 'border-red-300'
                    : isDragging
                    ? 'border-gray-900 bg-gray-50'
                    : imagePreview
                    ? 'border-gray-300'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                {imagePreview ? (
                  <div className="space-y-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                    <p className="text-sm text-gray-600">{imageFile?.name}</p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setImageFile(null)
                        setImagePreview(null)
                        if (fileInputRef.current) {
                          fileInputRef.current.value = ''
                        }
                      }}
                      className="text-sm text-gray-600 hover:text-gray-900 underline"
                    >
                      Remove image
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-900">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">JPG, JPEG, PNG, or WEBP</p>
                    <p className="text-xs text-gray-500">Recommended size: 1848x1386 px</p>
                  </div>
                )}
              </div>
              {imageError && (
                <p className="mt-1 text-sm text-red-600">{imageError}</p>
              )}
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Website</label>
              <input
                type="url"
                value={website}
                onChange={(e) => {
                  setWebsite(e.target.value)
                  if (websiteError) {
                    setWebsiteError('')
                  }
                }}
                placeholder="https://example.com"
                className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 text-gray-900 bg-[#EEEDEA] ${
                  websiteError
                    ? 'border border-red-300 focus:ring-red-500'
                    : 'focus:ring-gray-400'
                }`}
              />
              {websiteError && (
                <p className="mt-1 text-sm text-red-600">{websiteError}</p>
              )}
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Company</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company name"
                className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-900 bg-[#EEEDEA]"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="text-sm text-red-600">{error}</div>
            )}

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
