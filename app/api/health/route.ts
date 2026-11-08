export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Read-only deployment health check for Vercel <-> Neon verification.
// Reports only booleans (never connection strings, hostnames or error details),
// and performs no writes.
export async function GET() {
  const databaseUrlConfigured = Boolean(process.env.DATABASE_URL)
  let databaseReachable = false
  let enquiryTableExists = false

  if (databaseUrlConfigured) {
    try {
      await prisma.$queryRaw`SELECT 1`
      databaseReachable = true
      const rows = await prisma.$queryRaw<{ exists: boolean }[]>`
        SELECT to_regclass('public."ContactSubmission"') IS NOT NULL AS "exists"`
      enquiryTableExists = Boolean(rows?.[0]?.exists)
    } catch (error) {
      console.error('Health check database error:', error)
    }
  }

  const ok = databaseUrlConfigured && databaseReachable && enquiryTableExists
  return NextResponse.json(
    {
      ok,
      databaseUrlConfigured,
      databaseReachable,
      enquiryTableExists,
      emailConfigured: Boolean(process.env.RESEND_API_KEY),
      vercelEnv: process.env.VERCEL_ENV ?? null,
      commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
    },
    { status: ok ? 200 : 503, headers: { 'Cache-Control': 'no-store' } }
  )
}
