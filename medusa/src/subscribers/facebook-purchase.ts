import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"
import { sendCAPIEvent } from "../lib/facebook-capi"

const STORE_URL =
  process.env.STORE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "https://skillshelf.com"

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
      console.warn(`[Facebook CAPI] Order ${orderId} not found`)
      return
    }

    // Order total is stored in the smallest currency unit (kobo for NGN)
    const orderValueNGN = (order.total ?? 0) / 100

    const shippingAddress = order.shipping_address
    const billingAddress = order.billing_address

    // Prefer billing address for name/phone, fall back to shipping
    const firstName =
      billingAddress?.first_name || shippingAddress?.first_name || null
    const lastName =
      billingAddress?.last_name || shippingAddress?.last_name || null
    const phone =
      billingAddress?.phone || shippingAddress?.phone || null

    const countryCode =
      shippingAddress?.country_code?.toLowerCase() || "ng"

    const confirmedUrl = `${STORE_URL}/${countryCode}/order/${orderId}/confirmed`

    await sendCAPIEvent({
      eventName: "Purchase",
      eventSourceUrl: confirmedUrl,
      eventId: orderId,
      userData: {
        email: order.email,
        phone,
        firstName,
        lastName,
        // IP and user agent are not available in a backend subscriber;
        // the storefront CAPI already covers those for the same Purchase event.
        // Deduplication is handled by Facebook via matching event_id = orderId.
      },
      customData: {
        value: orderValueNGN,
        currency: "NGN",
        orderId,
        contentIds: order.items
          ?.map((item) => item.variant_id)
          .filter((id): id is string => Boolean(id)),
        contentType: "product",
        contentName: order.items?.[0]?.title ?? "Digital Product",
        numItems: order.items?.length ?? 0,
      },
    })
  } catch (err) {
    // Never let CAPI errors surface or interrupt delivery processing
    console.error("[Facebook CAPI] Purchase subscriber error:", err)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
