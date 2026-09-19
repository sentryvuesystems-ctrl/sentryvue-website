export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.ts'

/**
 * Sends a notification for a new enquiry.
 *
 * NOTE: This project does not currently ship a mail transport (no nodemailer /
 * sendgrid / resend dependency and no SMTP_* / EMAIL_* env vars are defined).
 * To keep the enquiry flow working out of the box we log a fully-formatted
 * notification (including the CCTV configurator summary) to the server console.
 *
 * To enable real email delivery, add credentials via environment variables ONLY
 * (e.g. SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, ENQUIRY_NOTIFICATION_TO) and
 * wire a transport in the marked section below — do not hard-code credentials.
 */
async function sendEnquiryNotification(details: {
  fullName: string
  email: string
  phone: string
  postcode: string
  propertyType: string
  cameraCount: string
  installationDate?: string | null
  notes?: string | null
  configuratorSummary?: string | null
}) {
  const emailBody = [
    'New CCTV enquiry received via the SentryVue website.',
    '',
    `Name:          ${details.fullName}`,
    `Email:         ${details.email}`,
    `Phone:         ${details.phone}`,
    `Postcode:      ${details.postcode}`,
    `Property type: ${details.propertyType}`,
    `Cameras:       ${details.cameraCount}`,
    `Install date:  ${details.installationDate || 'Not specified'}`,
    '',
    'Additional notes:',
    details.notes || '(none)',
    '',
    // Include the configurator selections in the notification body when present.
    ...(details.configuratorSummary
      ? ['CCTV Quote Configurator selections:', details.configuratorSummary]
      : []),
  ].join('\n')

  // --- Begin mail transport section (add env-var-based credentials to enable) ---
  // Example (requires adding a transport dependency + env vars):
  //   if (process.env.SMTP_HOST && process.env.ENQUIRY_NOTIFICATION_TO) {
  //     await transport.sendMail({
  //       to: process.env.ENQUIRY_NOTIFICATION_TO,
  //       from: process.env.SMTP_USER,
  //       subject: `New CCTV enquiry — ${details.fullName}`,
  //       text: emailBody,
  //     })
  //   }
  // --- End mail transport section ---

  console.info('[enquiry-notification]\n' + emailBody)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req?.json?.().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const {
      fullName,
      email,
      phone,
      postcode,
      propertyType,
      cameraCount,
      installationDate,
      notes,
      configuratorSummary,
    } = body ?? {}

    if (!fullName || !email || !phone || !postcode || !propertyType || !cameraCount) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(String(email ?? ''))) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    // The configurator summary is an optional, human-readable block. We persist it
    // alongside the notes (the existing schema field) so no DB migration is required,
    // while keeping the raw summary available for the notification email.
    const summary = configuratorSummary ? String(configuratorSummary) : ''
    const rawNotes = notes ? String(notes) : ''
    const combinedNotes = summary && !rawNotes.includes(summary)
      ? (rawNotes ? `${summary}\n\n${rawNotes}` : summary)
      : rawNotes

    const submission = await prisma.contactSubmission.create({
      data: {
        fullName: String(fullName ?? ''),
        email: String(email ?? ''),
        phone: String(phone ?? ''),
        postcode: String(postcode ?? ''),
        propertyType: String(propertyType ?? ''),
        cameraCount: String(cameraCount ?? ''),
        installationDate: installationDate ? String(installationDate) : null,
        notes: combinedNotes ? combinedNotes : null,
      },
    })

    // Fire the notification but never let a notification failure break the submission.
    try {
      await sendEnquiryNotification({
        fullName: String(fullName ?? ''),
        email: String(email ?? ''),
        phone: String(phone ?? ''),
        postcode: String(postcode ?? ''),
        propertyType: String(propertyType ?? ''),
        cameraCount: String(cameraCount ?? ''),
        installationDate: installationDate ? String(installationDate) : null,
        notes: rawNotes || null,
        configuratorSummary: summary || null,
      })
    } catch (notifyError) {
      console.error('Enquiry notification error:', notifyError)
    }

    return NextResponse.json({ success: true, id: submission?.id ?? '' }, { status: 201 })
  } catch (error: any) {
    console.error('Contact form submission error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
