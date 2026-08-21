export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.ts'

export async function POST(req: NextRequest) {
  try {
    const body = await req?.json?.().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const { fullName, email, phone, postcode, propertyType, cameraCount, installationDate, notes } = body ?? {}

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

    const submission = await prisma.contactSubmission.create({
      data: {
        fullName: String(fullName ?? ''),
        email: String(email ?? ''),
        phone: String(phone ?? ''),
        postcode: String(postcode ?? ''),
        propertyType: String(propertyType ?? ''),
        cameraCount: String(cameraCount ?? ''),
        installationDate: installationDate ? String(installationDate) : null,
        notes: notes ? String(notes) : null,
      },
    })

    return NextResponse.json({ success: true, id: submission?.id ?? '' }, { status: 201 })
  } catch (error: any) {
    console.error('Contact form submission error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
