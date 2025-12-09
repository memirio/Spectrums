'use client'

import { useState, useEffect } from 'react'

interface Collection {
  id: string
  name: string
  description: string | null
  images?: Array<{ id: string; url: string }>
}

interface AddToCollectionModalProps {
  isOpen: boolean
  onClose: () => void
  image: {
    id: string
    url: string
    title?: string
  }
  onCreateCollection?: () => void // Made optional since we handle it internally now
}

export default function AddToCollectionModal({
  isOpen,
  onClose,
  image,
  onCreateCollection
}: AddToCollectionModalProps) {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(false)
  const [addingToCollection, setAddingToCollection] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [collectionName, setCollectionName] = useState('')
  const [collectionDescription, setCollectionDescription] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchCollections()
      setShowCreateForm(false) // Reset to collections view when modal opens
      setCollectionName('')
      setCollectionDescription('')
    }
  }, [isOpen])

  const fetchCollections = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/collections')
      if (!response.ok) {
        console.error('[AddToCollectionModal] Failed to fetch collections:', response.status)
        return
      }
      const data = await response.json()
      setCollections(data.collections || [])
    } catch (error) {
      console.error('[AddToCollectionModal] Error fetching collections:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCollection = async (collectionId: string) => {
    try {
      setAddingToCollection(collectionId)
      const response = await fetch(`/api/collections/${collectionId}/images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageId: image.id })
      })

      if (!response.ok) {
        const error = await response.json()
        if (error.error === 'Image already in collection') {
          // Image is already in collection, just close the modal
          onClose()
          return
        }
        throw new Error(error.error || 'Failed to add image to collection')
      }

      // Success - close modal
      onClose()
    } catch (error) {
      console.error('[AddToCollectionModal] Error adding image to collection:', error)
      alert('Failed to add image to collection. Please try again.')
    } finally {
      setAddingToCollection(null)
    }
  }

  const handleCreateCollection = async () => {
    if (!collectionName.trim()) {
      return
    }

    try {
      setIsCreating(true)
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: collectionName.trim(),
          description: collectionDescription.trim()
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create collection')
      }

      const data = await response.json()
      const newCollectionId = data.collection.id

      // Automatically add the image to the newly created collection
      try {
        const addImageResponse = await fetch(`/api/collections/${newCollectionId}/images`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ imageId: image.id })
        })

        if (!addImageResponse.ok) {
          const error = await addImageResponse.json()
          // If image is already in collection, that's fine - just continue
          if (error.error !== 'Image already in collection') {
            console.warn('[AddToCollectionModal] Failed to add image to new collection:', error)
          }
        }

        // Success - close modal since image has been added
        onClose()
      } catch (addError) {
        console.error('[AddToCollectionModal] Error adding image to new collection:', addError)
        // Still refresh and show collections even if adding image failed
        setCollectionName('')
        setCollectionDescription('')
        setShowCreateForm(false)
        await fetchCollections()
      }
    } catch (error: any) {
      console.error('[AddToCollectionModal] Error creating collection:', error)
      alert(error.message || 'Failed to create collection. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <h2 className="text-xl font-semibold text-gray-900">Add to collection</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left side - Image */}
          <div className="w-1/2 px-6 pb-6 flex items-center justify-center">
            <div className="w-full aspect-square relative rounded-lg overflow-hidden bg-gray-200">
              <img
                src={image.url}
                alt={image.title || 'Image'}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right side - Collections or Create Form */}
          <div className="w-1/2 p-6 overflow-y-auto flex flex-col">
            {showCreateForm ? (
              /* Create Collection Form - Just inputs and buttons */
              <div className="flex flex-col h-full">
                <div className="space-y-4 flex-1">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={collectionName}
                      onChange={(e) => setCollectionName(e.target.value)}
                      className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 bg-[#EEEDEA]"
                      placeholder="Enter collection name"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && collectionName.trim()) {
                          handleCreateCollection()
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={collectionDescription}
                      onChange={(e) => setCollectionDescription(e.target.value)}
                      className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 bg-[#EEEDEA]"
                      placeholder="Enter collection description"
                      rows={4}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 mt-auto">
                  <button
                    onClick={() => {
                      setShowCreateForm(false)
                      setCollectionName('')
                      setCollectionDescription('')
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateCollection}
                    disabled={!collectionName.trim() || isCreating}
                    className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreating ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </div>
            ) : (
              /* Collections List */
              <div className="flex flex-col h-full">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-gray-500">Loading collections...</div>
                  </div>
                ) : collections.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <p className="text-gray-500 mb-4">No collections yet</p>
                    <button
                      onClick={() => setShowCreateForm(true)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Create new collection
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-3 -mt-6">
                      <label className="text-sm font-medium text-gray-700">Your collections</label>
                    </div>
                    <div className="space-y-3 flex-1 overflow-y-auto">
                      {collections.map((collection) => (
                        <button
                          key={collection.id}
                          onClick={() => handleAddToCollection(collection.id)}
                          disabled={addingToCollection === collection.id}
                          className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div className="font-medium text-gray-900">{collection.name}</div>
                          {collection.description && (
                            <div className="text-sm text-gray-500 mt-1">{collection.description}</div>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Create new collection button at the bottom */}
                    <div className="mt-auto pt-4">
                      <button
                        onClick={() => setShowCreateForm(true)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium text-sm"
                      >
                        + Create new collection
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

