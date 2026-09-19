export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.ts'

import { sendEnquiryNotifications } from '@/lib/notifications'

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

    // Fire the email notification but never let a notification failure break the submission.
    try {
      await sendEnquiryNotifications({
        id: submission.id,
        fullName: submission.fullName,
        email: submission.email,
        phone: submission.phone,
        postcode: submission.postcode,
        propertyType: submission.propertyType,
        cameraCount: submission.cameraCount,
        installationDate: submission.installationDate,
        notes: submission.notes,
        createdAt: submission.createdAt,
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
