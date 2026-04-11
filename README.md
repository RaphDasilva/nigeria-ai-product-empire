# Nigeria AI Product Empire

An autonomous, AI-powered digital product business for the Nigerian market. Six coordinated AI agents research trends, create products, handle marketing, and deliver to customers — with minimal human intervention.

## What's Inside

- **Medusa v2 backend** — Commerce engine, Admin Dashboard, product management
- **Next.js 14 storefront** — Mobile-first, low-data, ₦-priced products
- **Paystack integration** — Nigerian payment gateway
- **6 AI Agents** — Autonomous Claude Code skills for the full product lifecycle
- **First product** — JAMB CBT 2025 Ultimate Practice Pack (₦1,500)

## Quick Start

### Prerequisites
- Node.js v18+
- PostgreSQL running locally
- npm v9+

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/nigeria-ai-product-empire.git
cd nigeria-ai-product-empire
```

### 2. Set Up Environment

```bash
cp .env .env.local
# Edit .env with your actual credentials
```

### 3. Start Medusa Backend

```bash
cd medusa
npm install
npx medusa db:migrate
npm run dev
# Admin Dashboard: http://localhost:9000/app
# API: http://localhost:9000
```

### 4. Start Storefront

```bash
cd storefront
npm install
npm run dev
# Storefront: http://localhost:8000
```

## AI Agents

Invoke agents directly via Claude Code:

```bash
# Full autonomous product cycle
/empire-orchestrator "Launch a new product in the WAEC niche"

# Individual agents
/nigeria-market-researcher "What's trending for Nigerian students this month?"
/digital-product-creator "Create a freelancing guide for Nigerian youths"
/marketing-and-sales-agent "Generate WhatsApp campaign for JAMB product at ₦1,500"
/delivery-agent "Resend download link for order #1234"
```

See [AGENTS.md](AGENTS.md) for full documentation on each agent.

## Project Structure

```
nigeria-ai-product-empire/
├── CLAUDE.md                    ← Project bible (architecture, rules, context)
├── AGENTS.md                    ← AI agent roster and coordination docs
├── skills/                      ← Claude Code skill definitions
│   ├── empire-orchestrator/
│   ├── nigeria-market-researcher/
│   ├── digital-product-creator/
│   ├── medusa-product-uploader/
│   ├── marketing-and-sales-agent/
│   └── delivery-agent/
├── assets/
│   └── thumbnail-prompts/       ← AI image generation prompts per product
├── medusa/                      ← Backend
└── storefront/                  ← Frontend
```

## First Product

**JAMB CBT 2025 Ultimate Practice Pack** — ₦1,500
- 500+ past questions with detailed answers
- Covers: Maths, English, Biology, Chemistry, Physics
- CBT interface tips + time management strategies

## Environment Variables

See `.env` for the full list of required variables:
- `PAYSTACK_SECRET_KEY` — Get from [paystack.com](https://paystack.com)
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` / `COOKIE_SECRET` — Generate random 32-char strings

## Test Purchase Flow

1. Start both servers (Medusa + storefront)
2. Open http://localhost:8000
3. Find the JAMB product and add to cart
4. Checkout using Paystack test card: `4084 0840 8408 4081` (CVV: 408, Expiry: any future date)
5. Check email for download link from delivery-agent

## Contributing / Extending

1. Add new products: run `/digital-product-creator "[product idea]"`
2. Add new agents: create `skills/[name]/SKILL.md`, update `AGENTS.md`
3. Deploy: see `medusa/` and `storefront/` for deployment guides

---

Built with Claude Code · Powered by Medusa.js v2 · Payments by Paystack
