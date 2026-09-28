export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.ts'

import { sendEnquiryNotifications } from '@/lib/notifications'

type DeliveryAddress = {
  line1?: string
  city?: string
  postcode?: string
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
      cameraCount,
      storageCapacity,
      fulfilmentType,
      deliveryAddress,
      notes,
    } = body ?? {}

    // Required for every configuration enquiry.
    if (!fullName || !email || !phone || !cameraCount || !storageCapacity || !fulfilmentType) {
      return NextResponse.json(
        { error: 'Please complete your configuration and contact details.' },
        { status: 400 }
      )
    }

    // Basic email validation (mirrors /api/contact).
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(String(email ?? ''))) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    const isDelivery = String(fulfilmentType) === 'delivery'
    const address: DeliveryAddress = (deliveryAddress ?? {}) as DeliveryAddress

    // For deliveries we need at least a postcode to confirm cost/timescale.
    if (isDelivery && !address?.postcode) {
      return NextResponse.json(
        { error: 'Please provide a delivery postcode so we can confirm cost and timescale.' },
        { status: 400 }
      )
    }

    // Map the configurator fields onto the existing ContactSubmission model so no DB
    // migration is required:
    //  - propertyType encodes the fulfilment route ("Configure: Installation" / "Configure: Delivery")
    //  - cameraCount is stored directly
    //  - postcode uses the delivery postcode (installation postcode confirmed on site survey)
    //  - storageCapacity + delivery address are encoded as a JSON block inside notes,
    //    alongside a human-readable summary for the notification email.
    const propertyType = isDelivery ? 'Configure: Delivery' : 'Configure: Installation'
    const postcode = isDelivery ? String(address?.postcode ?? '') : 'On site survey'

    const structured = {
      source: 'buy-now-configurator',
      cameraCount: String(cameraCount ?? ''),
      storageCapacity: String(storageCapacity ?? ''),
      fulfilmentType: isDelivery ? 'Supply & Delivery Only' : 'Professional Installation',
      deliveryAddress: isDelivery
        ? {
            line1: String(address?.line1 ?? ''),
            city: String(address?.city ?? ''),
            postcode: String(address?.postcode ?? ''),
          }
        : null,
    }

    const summaryLines = [
      'CCTV SYSTEM CONFIGURATION',
      `• Cameras: ${structured.cameraCount}`,
      `• NVR storage: ${structured.storageCapacity}`,
      `• Fulfilment: ${structured.fulfilmentType}`,
    ]
    if (isDelivery) {
      summaryLines.push(
        `• Delivery address: ${[structured.deliveryAddress?.line1, structured.deliveryAddress?.city, structured.deliveryAddress?.postcode]
          .filter(Boolean)
          .join(', ')}`
      )
    }
    const rawNotes = notes ? String(notes) : ''
    const combinedNotes = [
      summaryLines.join('\n'),
      rawNotes ? `Customer notes:\n${rawNotes}` : '',
      `__CONFIG__ ${JSON.stringify(structured)}`,
    ]
      .filter(Boolean)
      .join('\n\n')

    const submission = await prisma.contactSubmission.create({
      data: {
        fullName: String(fullName ?? ''),
        email: String(email ?? ''),
        phone: String(phone ?? ''),
        postcode: String(postcode ?? ''),
        propertyType: String(propertyType ?? ''),
        cameraCount: String(cameraCount ?? ''),
        installationDate: null,
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
      console.error('Configure enquiry notification error:', notifyError)
    }

    return NextResponse.json({ success: true, id: submission?.id ?? '' }, { status: 201 })
  } catch (error: any) {
    console.error('Configure enquiry submission error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
