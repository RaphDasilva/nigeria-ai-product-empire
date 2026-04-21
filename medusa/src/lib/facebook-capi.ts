import crypto from "crypto"

const PIXEL_ID = process.env.FACEBOOK_PIXEL_ID || "1121593793463761"
const FB_ENDPOINT = `https://graph.facebook.com/v18.0/${PIXEL_ID}/events`

function sha256(value: string): string {
  return crypto
    .createHash("sha256")
    .update(value.toLowerCase().trim())
    .digest("hex")
}

function normalizePhone(phone: string): string {
  return phone.replace(/[^\d]/g, "")
}

export type CAPIUserData = {
  email?: string | null
  phone?: string | null
  firstName?: string | null
  lastName?: string | null
  clientIpAddress?: string | null
  clientUserAgent?: string | null
  fbp?: string | null
  fbc?: string | null
}

export type CAPICustomData = {
  value?: number
  currency?: string
  contentIds?: string[]
  contentName?: string
  contentType?: string
  orderId?: string
  numItems?: number
}

export type CAPIEvent = {
  eventName: "Purchase" | "ViewContent" | "AddToCart" | "InitiateCheckout" | "AddPaymentInfo"
  eventSourceUrl: string
  userData: CAPIUserData
  customData?: CAPICustomData
  eventId?: string
}

function buildUserData(ud: CAPIUserData): Record<string, string> {
  const out: Record<string, string> = {}

  if (ud.email) out.em = sha256(ud.email)
  if (ud.phone) out.ph = sha256(normalizePhone(ud.phone))
  if (ud.firstName) out.fn = sha256(ud.firstName)
  if (ud.lastName) out.ln = sha256(ud.lastName)
  if (ud.clientIpAddress) out.client_ip_address = ud.clientIpAddress
  if (ud.clientUserAgent) out.client_user_agent = ud.clientUserAgent
  if (ud.fbp) out.fbp = ud.fbp
  if (ud.fbc) out.fbc = ud.fbc

  return out
}

function buildCustomData(cd: CAPICustomData): Record<string, unknown> {
  const out: Record<string, unknown> = {}

  if (cd.value !== undefined) out.value = cd.value
  if (cd.currency) out.currency = cd.currency
  if (cd.contentIds?.length) out.content_ids = cd.contentIds
  if (cd.contentName) out.content_name = cd.contentName
  if (cd.contentType) out.content_type = cd.contentType
  if (cd.orderId) out.order_id = cd.orderId
  if (cd.numItems !== undefined) out.num_items = cd.numItems

  return out
}

export async function sendCAPIEvent(event: CAPIEvent): Promise<void> {
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN

  if (!accessToken) {
    console.warn(
      `[Facebook CAPI] FACEBOOK_ACCESS_TOKEN not set — skipping ${event.eventName}`
    )
    return
  }

  const payload = {
    data: [
      {
        event_name: event.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: event.eventSourceUrl,
        action_source: "website",
        user_data: buildUserData(event.userData),
        ...(event.customData
          ? { custom_data: buildCustomData(event.customData) }
          : {}),
        ...(event.eventId ? { event_id: event.eventId } : {}),
      },
    ],
  }

  try {
    const res = await fetch(`${FB_ENDPOINT}?access_token=${accessToken}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const body = await res.text()
      console.error(
        `[Facebook CAPI] ${event.eventName} failed (${res.status}):`,
        body
      )
    } else {
      console.log(`[Facebook CAPI] ${event.eventName} sent — event_id: ${event.eventId ?? "n/a"}`)
    }
  } catch (err) {
    // CAPI errors must never crash order processing
    console.error("[Facebook CAPI] Network error:", err)
  }
}
