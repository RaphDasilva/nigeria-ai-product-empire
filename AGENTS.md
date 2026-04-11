# Nigeria AI Product Empire — Agent Roster

## Agent Overview

| Agent | Skill Path | Trigger Phrase | Role |
|-------|-----------|----------------|------|
| Empire Orchestrator | `skills/empire-orchestrator` | `/empire-orchestrator` | CEO — coordinates all agents, runs full cycles |
| Nigeria Market Researcher | `skills/nigeria-market-researcher` | `/nigeria-market-researcher` | Identifies trending product niches |
| Digital Product Creator | `skills/digital-product-creator` | `/digital-product-creator` | Creates product content, sales copy, thumbnail prompts |
| Medusa Product Uploader | `skills/medusa-product-uploader` | `/medusa-product-uploader` | Publishes products to Medusa store via API |
| Marketing & Sales Agent | `skills/marketing-and-sales-agent` | `/marketing-and-sales-agent` | Full sales AI: outreach, social posts, objection handling |
| Delivery Agent | `skills/delivery-agent` | `/delivery-agent` | Post-purchase: sends download links via email |

---

## Agent Collaboration Flow

```
User / Cron Trigger
        │
        ▼
┌─────────────────────┐
│  Empire Orchestrator │  ← Main CEO agent
└─────────┬───────────┘
          │
    ┌─────┴──────┐
    │            │
    ▼            ▼
┌────────────┐  ┌─────────────────────┐
│  Nigeria   │  │  Digital Product    │
│  Market    │  │  Creator            │
│  Researcher│  │  (content + thumb)  │
└─────┬──────┘  └──────────┬──────────┘
      │                    │
      └──────────┬──────────┘
                 │
                 ▼
      ┌──────────────────────┐
      │  Medusa Product      │
      │  Uploader            │
      │  (publishes to store)│
      └──────────┬───────────┘
                 │
        ┌────────┴─────────┐
        │                  │
        ▼                  ▼
┌──────────────┐   ┌───────────────────┐
│  Marketing   │   │  Delivery Agent   │
│  & Sales     │   │  (post-purchase)  │
│  Agent       │   └───────────────────┘
└──────────────┘
```

---

## Agent 1: Empire Orchestrator

**Role:** Main CEO agent. Receives high-level goals and orchestrates the full product lifecycle.

**Responsibilities:**
- Receive user goals ("launch a product in X niche")
- Delegate research to nigeria-market-researcher
- Pass opportunity to digital-product-creator
- Pass product data to medusa-product-uploader
- Trigger marketing-and-sales-agent with product info
- Monitor sales pipeline and report status
- Suggest next product based on market data

**Inputs:**
- High-level goal or niche instruction
- Optional: specific product idea

**Outputs:**
- Full product launch report
- Next product suggestion
- Sales pipeline status

**Invocation Examples:**
```bash
/empire-orchestrator "Run a full product launch cycle for Nigerian students"
/empire-orchestrator "What products are trending right now? Launch the best one."
/empire-orchestrator "Status report: what products are live, what's selling?"
```

---

## Agent 2: Nigeria Market Researcher

**Role:** Identifies high-demand digital product opportunities in the Nigerian market.

**Responsibilities:**
- Monitor exam calendars (JAMB, WAEC, NECO, POST-UTME)
- Track Twitter/X NG trends and Nairaland discussions
- Identify seasonal opportunities (school resumption, NYSC, job hunting periods)
- Score product ideas by: demand level, competition, urgency, profit potential
- Output structured opportunity reports

**Inputs:**
- Niche or category to research (optional — will auto-detect trends if not provided)
- Target audience (students, professionals, entrepreneurs)

**Outputs:**
```markdown
## Product Opportunity Report
- **Product Idea:** [title]
- **Niche:** [category]
- **Target Audience:** [who]
- **Demand Level:** High/Medium/Low
- **Urgency:** [why people need it now]
- **Competition:** [what exists, gaps]
- **Suggested Price:** ₦X,XXX
- **Format:** PDF / Video / Template
- **Next Action:** Pass to digital-product-creator
```

**Invocation Examples:**
```bash
/nigeria-market-researcher "What are the top 5 trending niches for Nigerian students right now?"
/nigeria-market-researcher "JAMB season is coming — what products should we create?"
/nigeria-market-researcher "Research side hustle guides for Nigerian youths aged 18-30"
```

---

## Agent 3: Digital Product Creator

**Role:** Creates complete digital product packages including content, sales copy, and thumbnail prompts.

**Responsibilities:**
- Write full product outline/table of contents
- Create product description (short + long form)
- Write sales copy optimized for Nigerian audience
- Generate AI thumbnail image prompt (save to assets/thumbnail-prompts/[slug].md)
- Output structured product data for medusa-product-uploader

**Inputs:**
- Product opportunity report from nigeria-market-researcher
- OR direct product brief from user

**Outputs:**
```markdown
## Product Package
- **Title:** [product name]
- **Slug:** [kebab-case-slug]
- **Short Description:** (2-3 sentences)
- **Long Description:** (full sales page copy)
- **Table of Contents:** [outline]
- **Price:** ₦X,XXX
- **Tags:** [comma-separated]
- **Thumbnail Prompt:** [saved to assets/thumbnail-prompts/[slug].md]
```

**Thumbnail Prompt Format:**
Each thumbnail prompt is saved as `assets/thumbnail-prompts/[slug].md` containing:
- Visual style, background, colors (hex codes)
- Text overlays (title, subtitle, badges)
- Cultural elements (Nigerian context)
- Composition notes
- Aspect ratio (1:1 or 16:9)
- Optimized for Grok Imagine / Midjourney v6

**Invocation Examples:**
```bash
/digital-product-creator "Create a JAMB CBT practice pack for 2025"
/digital-product-creator "Create a freelancing starter guide for Nigerian youths"
/digital-product-creator "Build a WAEC biology past questions pack — ₦2,000 price point"
```

---

## Agent 4: Medusa Product Uploader

**Role:** Creates and publishes digital products in Medusa v2 store via Admin API.

**Responsibilities:**
- POST product to Medusa Admin API (`/admin/products`)
- Set correct pricing in kobo (₦1,500 = 150000 kobo)
- Configure variant as downloadable digital product
- Upload product file (PDF) via `/admin/uploads`
- Link file to product variant
- Publish product (status: published)
- Return product ID, handle, and storefront URL

**API Reference:**
```bash
# Create product
POST http://localhost:9000/admin/products
Authorization: Bearer <admin-token>

# Upload file
POST http://localhost:9000/admin/uploads
Content-Type: multipart/form-data

# Link download to variant
POST http://localhost:9000/admin/products/:id/variants/:variant_id/inventory-items
```

**Inputs:**
- Product package from digital-product-creator
- PDF file path (if available)
- Admin API token

**Outputs:**
- Product ID
- Product handle
- Admin URL: `http://localhost:9000/app/products/[id]`
- Storefront URL: `http://localhost:8000/products/[handle]`

**Invocation Examples:**
```bash
/medusa-product-uploader "Upload JAMB CBT 2025 pack with the following data: [product data]"
/medusa-product-uploader "Publish all pending products in the queue"
```

---

## Agent 5: Marketing & Sales Agent

**Role:** Full autonomous sales AI. Handles lead qualification, outreach, social media, objection handling, and closing.

**Responsibilities:**

### Outreach
- WhatsApp message templates (informal, Nigerian tone, pidgin options)
- 3-part email drip sequence
- Cold → Follow-up → Close cadence

### Social Media
- Twitter/X thread templates (study tips hook → soft sell → CTA)
- Instagram/Facebook captions (emoji-rich, slang-friendly)
- Story format posts

### Sales
- Lead qualification checklist
- Objection handling scripts:
  - "It's too expensive" → value breakdown
  - "Is it legit/real?" → social proof template
  - "I'll think about it" → urgency + FOMO reply
  - "I don't have data" → offline access tips
- Paystack payment link instructions
- Follow-up schedule (Day 1, 3, 7)

**Inputs:**
- Product name, description, price, Paystack link
- Target audience description
- Specific channel (WhatsApp / Twitter / Instagram / Email)

**Outputs:**
- Structured markdown with copy-paste ready messages
- Tagged by channel and day/stage

**Invocation Examples:**
```bash
/marketing-and-sales-agent "Generate full WhatsApp + social campaign for JAMB CBT 2025 pack at ₦1,500"
/marketing-and-sales-agent "Someone said my product is too expensive — give me 3 objection responses"
/marketing-and-sales-agent "Create a Twitter thread that sells the JAMB pack without being spammy"
```

---

## Agent 6: Delivery Agent

**Role:** Handles all post-purchase digital product delivery.

**Responsibilities:**
- Triggered by `order.placed` event from Medusa
- Generate secure, time-limited download URL (48-hour expiry)
- Send delivery confirmation email with download button
- Handle re-delivery requests ("I didn't get my link")
- Log delivery events for audit

**Email Template:**
```
Subject: Your [Product Name] is Ready! ✅

Hi [First Name],

Thank you for your purchase! Your digital product is ready to download.

[DOWNLOAD NOW →] (button)

⏰ This link expires in 48 hours.
📱 Save the file to your phone after downloading.

If you have any issues, reply to this email.

Warm regards,
Nigeria AI Product Empire Team
```

**Inputs:**
- Order details (customer name, email, product name)
- Download file URL from Medusa
- Order ID

**Outputs:**
- Email sent confirmation
- Download link generated log entry

**Invocation Examples:**
```bash
/delivery-agent "Resend download link for order #12345 to customer@email.com"
/delivery-agent "Process all pending deliveries in the queue"
```

---

## Agent Interaction Rules

1. **Orchestrator-first**: For full cycles, always route through empire-orchestrator
2. **Handoff data format**: Each agent outputs structured markdown that the next agent can consume
3. **No blocking**: Agents can run in parallel (researcher + creator can overlap)
4. **Error escalation**: If an agent fails, it reports to empire-orchestrator with the error and suggested fix
5. **Memory**: Each agent reads CLAUDE.md for project context before starting work
6. **Nigerian tone**: All customer-facing copy must feel local — warm, direct, relatable

---

## Adding New Agents

To add a new agent:
1. Create `skills/[agent-name]/SKILL.md` with proper YAML frontmatter
2. Add entry to this AGENTS.md roster table
3. Update empire-orchestrator SKILL.md to know about the new agent
4. Document the agent's inputs/outputs contract here
