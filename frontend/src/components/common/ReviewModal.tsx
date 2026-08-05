import React, { useState, useEffect } from 'react'
import { reviewService } from '@/services/reviewService'

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function ReviewModal({ isOpen, onClose, onSuccess }: ReviewModalProps) {
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Lock scrolling when modal is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !reviewText.trim()) return

    setIsLoading(true)
    try {
      await reviewService.createReview({
        name: name.trim(),
        role: role.trim() || undefined,
        rating,
        text: reviewText.trim(),
      })

      localStorage.setItem('devprep_reviewed', 'true')

      // Reset fields
      setName('')
      setRole('')
      setRating(5)
      setReviewText('')

      onSuccess?.()
      onClose()
      
      // Dispatch custom event to notify components that reviews have updated
      window.dispatchEvent(new CustomEvent('devprep-reviews-updated'))
    } catch (err) {
      console.error('Error submitting review:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div 
        className="relative w-full max-w-lg rounded-3xl border border-white/10 p-6 sm:p-8 overflow-hidden shadow-2xl text-white animate-fade-up"
        style={{
          background: 'linear-gradient(145deg, rgba(28,27,35,0.95) 0%, rgba(18,18,22,0.98) 100%)',
          boxShadow: '0 0 50px rgba(139,92,246,0.15)',
        }}
      >
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="badge mb-2 text-xs">Share your story</span>
            <h2 className="text-2xl font-bold tracking-tight" style={{ fontFamily: '"Inter", sans-serif' }}>
              How is your prep going?
            </h2>
            <p className="text-white/70 text-xs sm:text-sm mt-1">
              Your feedback helps us make DevPrep AI better for everyone.
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center border border-white/10 text-white/60 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Rivera"
              className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1">
              Role / Company
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. SDE II @ Stripe, or CS Student"
              className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-2">
              Rating
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(null)}
                  className="transition-transform active:scale-95 duration-100"
                >
                  <svg
                    className={`w-8 h-8 ${
                      star <= (hoveredRating ?? rating)
                        ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]'
                        : 'text-white/20'
                    } transition-all duration-200`}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1">
              Your Review *
            </label>
            <textarea
              required
              rows={4}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tell us how DevPrep AI helped you practice DSA, System Design, or prep for your interviews..."
              className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-sm resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/80 hover:text-white hover:bg-white/5 font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Maybe Later
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm transition-all hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] active:scale-98 duration-100 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
              }}
            >
              {isLoading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
