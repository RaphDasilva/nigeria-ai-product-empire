# Nigeria AI Product Empire — Project Bible

## Mission
An autonomous, self-growing digital product business for the Nigerian market. AI agents research trends, create products, upload them to our store, market to customers, and deliver after purchase — with minimal human intervention.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend / Commerce | Medusa.js v2 |
| Admin Dashboard | Medusa Admin UI (`/app`) |
| Storefront | Next.js 14+ (App Router) |
| Payment | Paystack (NGN) |
| Digital Delivery | Medusa downloadable products + email |
| Database | PostgreSQL |
| Runtime | Node.js v22 |
| Language | TypeScript |
| Styling | Tailwind CSS (mobile-first) |

---

## Project Structure

```
nigeria-ai-product-empire/
├── CLAUDE.md                          ← This file
├── AGENTS.md                          ← AI agent roster and coordination rules
├── skills/                            ← Claude Code agent skill definitions
│   ├── empire-orchestrator/SKILL.md
│   ├── nigeria-market-researcher/SKILL.md
│   ├── digital-product-creator/SKILL.md
│   ├── medusa-product-uploader/SKILL.md
│   ├── marketing-and-sales-agent/SKILL.md
│   └── delivery-agent/SKILL.md
├── assets/
│   └── thumbnail-prompts/             ← [product-slug].md AI image prompts
├── medusa/                            ← Medusa v2 backend + Admin Dashboard
├── storefront/                        ← Next.js 14 storefront
├── .env                               ← Environment variables (never commit)
├── .gitignore
└── README.md
```

---

## AI Agent Architecture

The empire runs on 6 coordinated AI agents. Each is a Claude Code skill that can be invoked independently or as part of a pipeline.

### Agent Pipeline
```
empire-orchestrator
    ├── nigeria-market-researcher  →  product opportunity reports
    ├── digital-product-creator    →  product content + thumbnail prompts
    ├── medusa-product-uploader    →  publishes to Medusa store
    ├── marketing-and-sales-agent  →  outreach + social posts + objection handling
    └── delivery-agent             →  post-purchase file delivery
```

### Invocation Pattern
```bash
# Run full empire cycle for a new product
/empire-orchestrator "Research and launch a new product in the side hustle niche"

# Run individual agents
/nigeria-market-researcher "Find top 5 trending niches for Nigerian students in April 2025"
/digital-product-creator "Create JAMB CBT 2025 practice pack"
/marketing-and-sales-agent "Generate WhatsApp campaign for JAMB product"
```

---

## Lifecycle Hooks

| Event | Trigger | Agent |
|-------|---------|-------|
| Product created | `product.created` | digital-product-creator → save thumbnail prompt |
| Order placed | `order.placed` | delivery-agent → send download link |
| Payment failed | `payment.failed` | marketing-and-sales-agent → follow-up template |
| Low stock | `product.variant.low_stock` | empire-orchestrator → restock alert |

---

## Coding Standards

### General
- TypeScript everywhere (strict mode)
- Mobile-first: design for 375px screens, enhance up
- Low-data mode: lazy images, no autoplay video, minimal JS bundles
- All prices in ₦ (NGN). Store in Medusa as kobo (× 100). Display with `₦` prefix

### Product Pricing Guidelines
| Tier | Price Range | Example |
|------|-------------|---------|
| Entry | ₦500–₦1,500 | Simple PDF guides |
| Standard | ₦2,000–₦5,000 | Full course packs, templates |
| Premium | ₦7,500–₦15,000 | Bundled courses, coaching tools |

### Naming Conventions
- Product slugs: `kebab-case`, descriptive, SEO-friendly (e.g., `jamb-cbt-2025-ultimate-practice-pack`)
- Thumbnail prompts: `assets/thumbnail-prompts/[slug].md`
- Marketing files: `assets/marketing/[slug]/` (whatsapp.md, social.md, objections.md)

---

## Environment Variables

```bash
# Backend
MEDUSA_BACKEND_URL=http://localhost:9000
DATABASE_URL=postgres://localhost/nigeria_empire
JWT_SECRET=<generate-32-char-random>
COOKIE_SECRET=<generate-32-char-random>

# Storefront
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...

# Payment
PAYSTACK_SECRET_KEY=sk_test_...
PAYSTACK_PUBLIC_KEY=pk_test_...

# Email / Delivery
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
STORE_EMAIL=noreply@yourdomain.com

# GitHub
GITHUB_TOKEN=
```

---

## Development URLs

| Service | URL |
|---------|-----|
| Medusa Backend | http://localhost:9000 |
| Admin Dashboard | http://localhost:9000/app |
| Storefront | http://localhost:8000 |
| API Health | http://localhost:9000/health |

---

## Nigerian Market Context

### High-Demand Niches (prioritize these)
1. **Exam Prep** — JAMB, WAEC, NECO, POST-UTME (seasonal, high urgency)
2. **Side Hustles** — Freelancing, crypto basics, dropshipping guides
3. **Business Tools** — Business plan templates, invoice templates, pitch decks
4. **Student Life** — CV templates, scholarship guides, internship toolkits
5. **Digital Skills** — Graphics design basics, social media marketing, copywriting

### Pricing Psychology
- ₦1,500 is the sweet spot — feels like "small money" but profitable at scale
- Always show what the product saves them (time, tutor fees, mistakes)
- Urgency works: tie products to exam dates, application deadlines, seasons

### Channels That Work in Nigeria
- WhatsApp groups (student groups, professional groups)
- Twitter/X (Nigerian Twitter is very active)
- Facebook groups (Nairaland users, student union groups)
- Instagram (visual product showcases)

---

## Git Workflow

1. Branch naming: `feat/[product-slug]`, `fix/[issue]`, `chore/[task]`
2. Commit after every major phase
3. Always push to `main` after a complete product cycle

```bash
git add .
git commit -m "feat: add [product-name] — [brief description]"
git push origin main
```
