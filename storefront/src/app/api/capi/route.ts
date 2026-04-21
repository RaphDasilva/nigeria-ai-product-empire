import { NextRequest, NextResponse } from "next/server"
import { sendCAPIEvent, CAPIEventPayload, CAPIUserData } from "@lib/facebook/capi"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { eventName, eventSourceUrl, customData, eventId, userData } = body

    if (!eventName || !eventSourceUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Enrich server-side user data the client cannot provide
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      null
    const ua = req.headers.get("user-agent") || null
    const fbp = req.cookies.get("_fbp")?.value || null
    const fbc = req.cookies.get("_fbc")?.value || null

    const enrichedUserData: CAPIUserData = {
      ...(userData ?? {}),
      clientIpAddress: ip,
      clientUserAgent: ua,
      fbp: fbp ?? userData?.fbp,
      fbc: fbc ?? userData?.fbc,
    }

    const event: CAPIEventPayload = {
      eventName,
      eventSourceUrl,
      userData: enrichedUserData,
      customData,
      eventId,
    }

    await sendCAPIEvent(event)

    return NextResponse.json({ ok: true })
  } catch {
    // Never let CAPI errors surface to the user
    return NextResponse.json({ ok: true })
  }
}
