import { useState, useEffect } from 'react'
import { resumeOptimizerService } from '@/services/resumeOptimizerService'
import { useResumeOptimizerStore } from '@/store/resumeOptimizerStore'
import type { PricingPlan } from '@/types'

export function PricingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [pricing, setPricing] = useState<PricingPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState<string | null>(null)
  const setCredits = useResumeOptimizerStore(s => s.setCredits)

  useEffect(() => {
    if (open) {
      setLoading(true)
      resumeOptimizerService.getPricing()
        .then(setPricing)
        .finally(() => setLoading(false))
      resumeOptimizerService.getCredits().then(setCredits)
    }
  }, [open])

  const handlePurchase = async (credits: number) => {
    setPurchasing(`${credits}`)
    try {
      await resumeOptimizerService.purchaseCredits(credits)
      const updated = await resumeOptimizerService.getCredits()
      setCredits(updated)
    } catch {}
    setPurchasing(null)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div className="relative w-full max-w-md rounded-2xl p-6" style={{
        background: 'var(--color-surface-container-lowest)',
        border: '1px solid var(--color-border-subtle)',
      }}>
        <button onClick={onClose} className="absolute top-4 right-4 bg-none border-none cursor-pointer"
          style={{ color: 'var(--color-outline)' }}>
          <span className="material-symbols-outlined">close</span>
        </button>

        <h2 className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-sans)' }}>Buy Credits</h2>
        <p className="text-xs mb-5" style={{ color: 'var(--color-outline)' }}>
          1 credit per resume optimization. Payment will be added soon.
        </p>

        {loading ? (
          <div className="flex justify-center py-8">
            <span className="material-symbols-outlined animate-spin" style={{ color: 'var(--color-primary)' }}>progress_activity</span>
          </div>
        ) : (
          <div className="space-y-3">
            {pricing?.plans.map((plan) => (
              <div key={plan.credits}
                className="flex items-center justify-between p-4 rounded-xl transition-all"
                style={{
                  background: 'var(--color-surface-container)',
                  border: '1px solid var(--color-border-subtle)',
                }}>
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--color-on-surface)' }}>{plan.credits} Credits</p>
                  <p className="text-xs" style={{ color: 'var(--color-outline)' }}>
                    Rs. {plan.price} · Rs. {Math.round(plan.price / plan.credits)}/credit
                  </p>
                </div>
                <button
                  onClick={() => handlePurchase(plan.credits)}
                  disabled={purchasing === `${plan.credits}`}
                  className="px-4 py-2 rounded-lg text-xs font-bold border-none cursor-pointer transition-all"
                  style={{
                    background: 'var(--color-primary)',
                    color: 'var(--color-on-primary-fixed)',
                    opacity: purchasing === `${plan.credits}` ? 0.7 : 1,
                  }}
                >
                  {purchasing === `${plan.credits}` ? (
                    <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                  ) : (
                    `Rs. ${plan.price}`
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs mt-4 text-center" style={{ color: 'var(--color-outline)' }}>
          Payment integration coming soon. You'll be able to pay via Easypaisa, JazzCash, and more.
        </p>
      </div>
    </div>
  )
}
