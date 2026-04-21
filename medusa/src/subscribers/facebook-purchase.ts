import crypto from "crypto"
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

// ── helpers ────────────────────────────────────────────────────────────────

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value.toLowerCase().trim()).digest("hex")
}

function hashPhone(phone: string): string {
  return sha256(phone.replace(/[^\d]/g, ""))
}

async function sendFacebookPurchase(params: {
  orderId: string
  email: string | null
  phone: string | null
  firstName: string | null
  lastName: string | null
  valueNGN: number
  contentIds: string[]
  contentName: string
  numItems: number
  eventSourceUrl: string
}) {
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN
  const pixelId = process.env.FACEBOOK_PIXEL_ID || "1121593793463761"

  if (!accessToken) {
    console.warn("[Facebook CAPI] FACEBOOK_ACCESS_TOKEN not set — Purchase event skipped")
    return
  }

  const userData: Record<string, string> = {}
  if (params.email) userData.em = sha256(params.email)
  if (params.phone) userData.ph = hashPhone(params.phone)
  if (params.firstName) userData.fn = sha256(params.firstName)
  if (params.lastName) userData.ln = sha256(params.lastName)

  const payload = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: params.eventSourceUrl,
        action_source: "website",
        event_id: params.orderId,
        user_data: userData,
        custom_data: {
          value: params.valueNGN,
          currency: "NGN",
          order_id: params.orderId,
          content_ids: params.contentIds,
          content_type: "product",
          content_name: params.contentName,
          num_items: params.numItems,
        },
      },
    ],
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    )

    if (res.ok) {
      console.log(`[Facebook CAPI] Purchase sent — order: ${params.orderId}, value: ₦${params.valueNGN}`)
    } else {
      const body = await res.text()
      console.error(`[Facebook CAPI] Purchase failed (${res.status}): ${body}`)
    }
  } catch (err) {
    console.error("[Facebook CAPI] Network error:", err)
  }
}

// ── subscriber ─────────────────────────────────────────────────────────────

export default async function facebookPurchaseHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const orderId = data.id

  try {
    const orderService = container.resolve(Modules.ORDER)

    const order = await orderService.retrieveOrder(orderId, {
      relations: ["items", "shipping_address", "billing_address"],
    })

    if (!order) {
      console.warn(`[Facebook CAPI] Order ${orderId} not found — skipping`)
      return
    }

    const shipping = order.shipping_address
    const billing = order.billing_address

    const storeUrl = process.env.STORE_URL || "https://skillshelf.com"
    const countryCode = shipping?.country_code?.toLowerCase() || "ng"

    await sendFacebookPurchase({
      orderId,
      email: order.email ?? null,
      phone: billing?.phone || shipping?.phone || null,
      firstName: billing?.first_name || shipping?.first_name || null,
      lastName: billing?.last_name || shipping?.last_name || null,
      valueNGN: Number(order.total ?? 0) / 100,
      contentIds: (order.items ?? [])
        .map((i) => i.variant_id)
        .filter((id): id is string => Boolean(id)),
      contentName: order.items?.[0]?.title ?? "Digital Product",
      numItems: order.items?.length ?? 0,
      eventSourceUrl: `${storeUrl}/${countryCode}/order/${orderId}/confirmed`,
    })
  } catch (err) {
    // Never let CAPI errors interrupt order processing
    console.error("[Facebook CAPI] Subscriber error:", err)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
