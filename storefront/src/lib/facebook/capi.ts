import crypto from "crypto"

const PIXEL_ID = "1121593793463761"
const API_VERSION = "v18.0"
const FB_ENDPOINT = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events`

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value.toLowerCase().trim()).digest("hex")
}

function normalizePhone(phone: string): string {
  // Strip all non-digit characters, keep leading +
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

export type CAPIEventPayload = {
  eventName:
    | "ViewContent"
    | "AddToCart"
    | "InitiateCheckout"
    | "AddPaymentInfo"
    | "Purchase"
  eventSourceUrl: string
  userData: CAPIUserData
  customData?: Record<string, unknown>
  eventId?: string
}

function buildUserData(ud: CAPIUserData): Record<string, string> {
  const result: Record<string, string> = {}

  if (ud.email) result.em = sha256(ud.email)
  if (ud.phone) result.ph = sha256(normalizePhone(ud.phone))
  if (ud.firstName) result.fn = sha256(ud.firstName)
  if (ud.lastName) result.ln = sha256(ud.lastName)
  if (ud.clientIpAddress) result.client_ip_address = ud.clientIpAddress
  if (ud.clientUserAgent) result.client_user_agent = ud.clientUserAgent
  if (ud.fbp) result.fbp = ud.fbp
  if (ud.fbc) result.fbc = ud.fbc

  return result
}

export async function sendCAPIEvent(event: CAPIEventPayload): Promise<void> {
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN
  if (!accessToken) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[CAPI] FACEBOOK_ACCESS_TOKEN not set — skipping event:", event.eventName)
    }
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
        ...(event.customData ? { custom_data: event.customData } : {}),
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

    if (process.env.NODE_ENV === "development" && !res.ok) {
      const body = await res.text()
      console.error("[CAPI] Event send failed:", event.eventName, body)
    }
  } catch {
    // CAPI failures must never break the storefront
  }
}

/**
 * Extract user data from Next.js request headers (for server actions/routes).
 * Call this inside any "use server" function with headers() from next/headers.
 */
export function extractUserDataFromHeaders(
  headersList: Headers,
  cookiesList: { get: (name: string) => { value: string } | undefined }
): Pick<CAPIUserData, "clientIpAddress" | "clientUserAgent" | "fbp" | "fbc"> {
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    null

  const ua = headersList.get("user-agent") || null
  const fbp = cookiesList.get("_fbp")?.value || null
  const fbc = cookiesList.get("_fbc")?.value || null

  return {
    clientIpAddress: ip,
    clientUserAgent: ua,
    fbp,
    fbc,
  }
}
