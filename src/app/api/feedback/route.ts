import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { type, message, username, email } = await request.json()

    if (!message || !type) {
      return NextResponse.json(
        { error: 'Message and type are required' },
        { status: 400 }
      )
    }

    const emailSubject = type === 'request-feature' 
      ? `Feature Request from ${username}`
      : `Bug Report from ${username}`
    
    const emailBody = `
Type: ${type === 'request-feature' ? 'Feature Request' : 'Bug Report'}
User: ${username} (${email || 'No email provided'})
Message:
${message}
    `.trim()

    // Send email using Resend
    if (!process.env.RESEND_API_KEY) {
      console.error('[feedback] RESEND_API_KEY is not configured')
      // Fallback: log to console if API key is missing
      console.log('Feedback email (not sent - missing API key):', {
        to: 'victor.jacobsson@hyperisland.se',
        subject: emailSubject,
        body: emailBody,
      })
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@pslame.resend.app'
    console.log('[feedback] Attempting to send email:', {
      from: fromEmail,
      to: 'victor.jacobsson@hyperisland.se',
      subject: emailSubject,
      hasApiKey: !!process.env.RESEND_API_KEY,
    })

    try {
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: 'victor.jacobsson@hyperisland.se',
        subject: emailSubject,
        text: emailBody,
      })

      if (error) {
        console.error('[feedback] Resend error:', JSON.stringify(error, null, 2))
        return NextResponse.json(
          { error: `Failed to send email: ${error.message || JSON.stringify(error)}` },
          { status: 500 }
        )
      }

      console.log('[feedback] Email sent successfully:', JSON.stringify(data, null, 2))
    } catch (sendError: any) {
      console.error('[feedback] Exception while sending email:', {
        error: sendError.message,
        stack: sendError.stack,
        name: sendError.name,
      })
      return NextResponse.json(
        { error: `Failed to send email: ${sendError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[feedback] Error:', error)
    return NextResponse.json(
      { error: 'Failed to send feedback' },
      { status: 500 }
    )
  }
}

