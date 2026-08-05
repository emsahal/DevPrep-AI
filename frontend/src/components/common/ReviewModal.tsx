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
        className="relative w-full max-w-md rounded-2xl border border-white/10 p-5 sm:p-6 overflow-hidden shadow-2xl text-white animate-fade-up"
        style={{
          background: 'linear-gradient(145deg, rgba(22,21,28,0.96) 0%, rgba(14,14,18,0.99) 100%)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 40px rgba(139,92,246,0.12)',
        }}
      >
        {/* Glow effect */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex justify-between items-start mb-5">
          <div>
            <span className="badge mb-1.5 text-[10px] py-0.5 px-2 bg-primary/20 text-primary border border-primary/25">Share your story</span>
            <h2 className="text-xl font-bold tracking-tight" style={{ fontFamily: '"Inter", sans-serif' }}>
              How is your prep going?
            </h2>
            <p className="text-white/60 text-xs mt-0.5">
              Your feedback helps us make DevPrep AI better.
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center border border-white/10 text-white/50 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-white/70 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivera"
                className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/25 focus:outline-none focus:border-primary/50 focus:bg-white/10 focus:shadow-[0_0_10px_rgba(139,92,246,0.15)] transition-all text-xs"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-white/70 uppercase tracking-wider mb-1">
                Role / Company
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="SDE II @ Stripe"
                className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/25 focus:outline-none focus:border-primary/50 focus:bg-white/10 focus:shadow-[0_0_10px_rgba(139,92,246,0.15)] transition-all text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-white/70 uppercase tracking-wider mb-1.5">
              Rating
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(null)}
                  className="transition-transform active:scale-90 duration-100"
                >
                  <svg
                    className={`w-6 h-6 ${
                      star <= (hoveredRating ?? rating)
                        ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.4)]'
                        : 'text-white/15'
                    } transition-all duration-150`}
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
            <label className="block text-[10px] font-semibold text-white/70 uppercase tracking-wider mb-1">
              Your Review *
            </label>
            <textarea
              required
              rows={3}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tell us how DevPrep AI helped you practice DSA, System Design, or prep for your interviews..."
              className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/25 focus:outline-none focus:border-primary/50 focus:bg-white/10 focus:shadow-[0_0_10px_rgba(139,92,246,0.15)] transition-all text-xs resize-none leading-relaxed"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-2 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 font-semibold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Maybe Later
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2 rounded-xl text-white font-semibold text-xs transition-all hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] active:scale-98 duration-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
