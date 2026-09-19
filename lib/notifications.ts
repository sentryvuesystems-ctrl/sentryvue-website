type Enquiry = {
  id: string
  fullName: string
  email: string
  phone: string
  postcode: string
  propertyType: string
  cameraCount: string
  installationDate?: string | null
  notes?: string | null
  createdAt: Date
}

const escapeHtml = (value: unknown) => String(value ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#039;')

const row = (label: string, value: unknown) => `<tr><td style="padding:10px 12px;border-bottom:1px solid #dbe5f2;color:#52637a;font-weight:600;width:38%;">${label}</td><td style="padding:10px 12px;border-bottom:1px solid #dbe5f2;color:#0a0f1f;">${escapeHtml(value) || 'Not provided'}</td></tr>`

const formatDate = (date: Date) => date.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC')

export async function sendEnquiryNotifications(enquiry: Enquiry) {
  const emailConfigured = Boolean(process.env.RESEND_API_KEY)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sentryvue.co.uk'
  const logoUrl = `${siteUrl.replace(/\/$/, '')}/favicon.svg`
  const subject = `New SentryVue quote enquiry — ${enquiry.fullName}`
  const emailHtml = `<!doctype html><html><body style="margin:0;background:#eef4fb;font-family:Arial,sans-serif;color:#0a0f1f;"><div style="max-width:680px;margin:24px auto;background:#fff;border:1px solid #cbd8e8;border-radius:12px;overflow:hidden;"><div style="background:#0a0f1f;padding:22px 26px;text-align:center;"><img src="${logoUrl}" alt="SentryVue Systems" style="height:52px;max-width:220px;"><div style="color:#fff;font-size:12px;letter-spacing:2px;margin-top:8px;">SEE MORE. STAY SECURE.</div></div><div style="padding:24px 26px;"><div style="color:#0066ff;font-weight:700;font-size:12px;letter-spacing:1.5px;">NEW CUSTOMER ENQUIRY</div><h1 style="margin:8px 0 20px;font-size:24px;">Quote Request Order Sheet</h1><table style="width:100%;border-collapse:collapse;border:1px solid #dbe5f2;">${row('Reference', enquiry.id)}${row('Submitted', formatDate(enquiry.createdAt))}${row('Full name', enquiry.fullName)}${row('Email', enquiry.email)}${row('Phone', enquiry.phone)}${row('Postcode', enquiry.postcode)}${row('Property type', enquiry.propertyType)}${row('Number of cameras', enquiry.cameraCount)}${row('Preferred installation', enquiry.installationDate)}${row('Additional notes', enquiry.notes)}</table><p style="margin:22px 0 0;color:#52637a;font-size:13px;">Please contact the customer to arrange the free site survey.</p></div><div style="background:#f4f8fd;padding:14px 26px;color:#52637a;font-size:12px;">SentryVue Systems · sentryvue.co.uk</div></div></body></html>`
  const tasks: Promise<unknown>[] = []
  if (emailConfigured) {
    tasks.push(fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: process.env.RESEND_FROM_EMAIL || 'SentryVue Website <onboarding@resend.dev>', to: [process.env.ENQUIRY_ALERT_EMAIL || 'sentryvuesystems@gmail.com'], subject, html: emailHtml }) }).then(async response => { if (!response.ok) throw new Error(`Email notification failed: ${response.status}`) }))
  }
  if (!tasks.length) { console.warn('Email notifications are not configured; enquiry was saved without an alert.'); return }
  const results = await Promise.allSettled(tasks)
  for (const result of results) if (result.status === 'rejected') console.error(result.reason)
}
