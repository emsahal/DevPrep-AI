import { config } from '@/config'

export async function sendOnboardingEmail(to: string, name: string) {
  if (!config.resend.apiKey) {
    console.log(`[Email Service] RESEND_API_KEY not configured. Skipping onboarding email to ${to}`)
    return
  }

  const logoUrl = 'https://devpreps.tech/fab.png'
  const appUrl = 'https://devpreps.tech'

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to DevPrep AI</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0714; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0b0714; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #140d24; border-radius: 20px; border: 1px solid rgba(139, 92, 246, 0.25); overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
          
          <!-- Header Branding -->
          <tr>
            <td align="center" style="padding: 40px 30px 20px; background: linear-gradient(180deg, #20123a 0%, #140d24 100%);">
              <img src="${logoUrl}" alt="DevPrep AI Logo" width="64" height="64" style="display: block; width: 64px; height: 64px; margin-bottom: 16px; border-radius: 12px;" />
              <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                Welcome to <span style="color: #a78bfa;">DevPrep AI</span>
              </h1>
              <p style="margin: 8px 0 0; font-size: 14px; color: #a1a1aa;">
                Your AI-Powered Technical Career & Interview Preparation Platform
              </p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 30px; font-size: 15px; line-height: 1.6; color: #d4d4d8;">
              <p style="margin-top: 0;">Hi <strong style="color: #ffffff;">${name}</strong>,</p>
              <p>Welcome aboard! We are thrilled to have you join <strong>DevPrep AI</strong>. Whether you are preparing for software engineering interviews, mastering system design, or leveling up your DSA skills, we have built the ultimate suite of tools for you.</p>

              <!-- Feature Cards Grid -->
              <div style="margin: 25px 0;">
                <div style="background-color: #1c1432; border-radius: 12px; padding: 16px; margin-bottom: 12px; border: 1px solid rgba(167, 139, 250, 0.15);">
                  <strong style="color: #c084fc; font-size: 15px;">🗺️ Developer Roadmaps</strong>
                  <p style="margin: 4px 0 0; font-size: 13px; color: #a1a1aa;">Structured learning paths tailored for modern software engineering stacks.</p>
                </div>
                
                <div style="background-color: #1c1432; border-radius: 12px; padding: 16px; margin-bottom: 12px; border: 1px solid rgba(167, 139, 250, 0.15);">
                  <strong style="color: #c084fc; font-size: 15px;">🤖 24/7 AI Tutor & Code Analyzer</strong>
                  <p style="margin: 4px 0 0; font-size: 13px; color: #a1a1aa;">Get real-time code reviews, instant explanation of complex topics, and 1-on-1 interview practice.</p>
                </div>

                <div style="background-color: #1c1432; border-radius: 12px; padding: 16px; border: 1px solid rgba(167, 139, 250, 0.15);">
                  <strong style="color: #c084fc; font-size: 15px;">⚡ Interactive Quizzes & Flashcards</strong>
                  <p style="margin: 4px 0 0; font-size: 13px; color: #a1a1aa;">Lock in long-term memory with spaced-repetition revision and hands-on coding tests.</p>
                </div>
              </div>

              <!-- CTA Button -->
              <div align="center" style="margin: 35px 0 20px;">
                <a href="${appUrl}/learning-paths" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: #ffffff; font-size: 16px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 12px; box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);">
                  Start Your First Learning Path →
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 24px; background-color: #0d0818; border-top: 1px solid rgba(255, 255, 255, 0.05); font-size: 12px; color: #71717a;">
              <p style="margin: 0 0 8px;">© ${new Date().getFullYear()} DevPrep AI. All rights reserved.</p>
              <p style="margin: 0;">
                <a href="${appUrl}/blogs" style="color: #a78bfa; text-decoration: none;">Blogs</a> &nbsp;•&nbsp; 
                <a href="${appUrl}/library" style="color: #a78bfa; text-decoration: none;">Library</a> &nbsp;•&nbsp; 
                <a href="${appUrl}/interview-prep" style="color: #a78bfa; text-decoration: none;">Interview Prep</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.resend.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: config.resend.fromEmail,
        to: [to],
        subject: '🚀 Welcome to DevPrep AI - Let\'s Level Up Your Tech Career!',
        html: htmlContent,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error(`[Resend Email Error] Failed to send email to ${to}:`, errText)
    } else {
      console.log(`[Resend Email Success] Onboarding email sent to ${to}`)
    }
  } catch (error) {
    console.error(`[Resend Email Exception] Error sending onboarding email to ${to}:`, error)
  }
}
