<div align="center">

<img src="public/logo.png" alt="MegaReview Logo" width="80" height="80" />

# 🌟 MegaReview

### Intelligent Review Management Platform

*Automate your social proof. Shield your brand. Scale your reputation.*

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

<br/>

![License](https://img.shields.io/badge/License-Private-red?style=flat-square)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square)
![Version](https://img.shields.io/badge/Version-0.1.0-blue?style=flat-square)

</div>

---

## 📖 Overview

**MegaReview** is a full-stack, multi-tenant SaaS platform that helps businesses automate Google review collection and protect their brand reputation. Happy customers are guided to leave 5-star public reviews, while negative feedback is silently routed to a private resolution channel — before it ever reaches Google.

```
Customer places order
        │
        ▼
  Personalized review link generated (30-day token)
        │
        ├──► 📲 WhatsApp (Meta Cloud API)
        │         └── Fallback → 📧 Email (Resend / SMTP)
        │
        ▼
  Customer opens /r/[token] review page
        │
        ├── ⭐⭐⭐⭐⭐ (4–5 stars) ──► 🌐 Redirect to Google Reviews
        │
        └── ⭐⭐⭐ (1–3 stars) ────► 🔒 Private feedback (never public)
```

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🛡️ Feedback Shield
Automatically intercept low-rating signals and redirect them to a private resolution channel — protecting your public reputation.

### 🎯 Smart Review Routing
Happy customers are guided to leave reviews on **Google**, **Trustpilot**, or **Facebook** with a single personalized link.

### 📲 Multi-Channel Delivery
- **WhatsApp** via Meta Cloud API with custom templates
- **Email** via Resend API or custom SMTP
- Intelligent fallback: WhatsApp fails → Email auto-sent

</td>
<td width="50%">

### 🛒 Shopify Integration
- Webhook trigger on order fulfillment
- Paginated order sync via Shopify Admin REST API
- CSV bulk import for manual uploads

### 🏢 Multi-Brand Architecture
- Unlimited brands under one admin account
- Per-brand: Google Place ID, logo, colors, templates, SMTP
- Localized WhatsApp message drafts (multi-language)

### 📊 Unified Analytics
- Review volume trends per brand
- Sentiment tracking and funnel conversion
- Single dashboard for all brands

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology |
|:---:|:---|
| ![Next.js](https://img.shields.io/badge/-Next.js-000?logo=nextdotjs&logoColor=white&style=flat-square) | **Next.js 16** — App Router, Server Components, API Routes |
| ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black&style=flat-square) | **React 19** — UI library with hooks |
| ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?logo=postgresql&logoColor=white&style=flat-square) | **PostgreSQL** — Primary relational database |
| ![Prisma](https://img.shields.io/badge/-Prisma-2D3748?logo=prisma&logoColor=white&style=flat-square) | **Prisma ORM** — Type-safe DB access + migrations |
| ![Auth.js](https://img.shields.io/badge/-NextAuth.js-9B59B6?logo=auth0&logoColor=white&style=flat-square) | **NextAuth.js v5** — JWT-based authentication + RBAC |
| ![TailwindCSS](https://img.shields.io/badge/-TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square) | **TailwindCSS v4** — Utility-first styling |
| ![Framer Motion](https://img.shields.io/badge/-Framer_Motion-0055FF?logo=framer&logoColor=white&style=flat-square) | **Framer Motion** — Smooth UI animations |
| ![WhatsApp](https://img.shields.io/badge/-WhatsApp_API-25D366?logo=whatsapp&logoColor=white&style=flat-square) | **Meta Cloud API** — WhatsApp Business messaging |
| ![Resend](https://img.shields.io/badge/-Resend-000000?logo=mail.ru&logoColor=white&style=flat-square) | **Resend / Nodemailer** — Transactional email delivery |
| ![Shopify](https://img.shields.io/badge/-Shopify-96BF48?logo=shopify&logoColor=white&style=flat-square) | **Shopify REST API** — Order sync + webhooks |
| ![Zod](https://img.shields.io/badge/-Zod-3E67B1?logo=zod&logoColor=white&style=flat-square) | **Zod + React Hook Form** — Schema validation |

</div>

---

## 📁 Project Structure

```
megareview/
├── 📂 app/
│   ├── 📄 page.js                   # Landing page (hero, features, pricing)
│   ├── 📂 login/                    # Authentication
│   ├── 📂 register-super/           # Super admin registration
│   ├── 📂 r/[token]/                # 🔗 Public customer review page
│   ├── 📂 share/                    # Shareable review collection page
│   └── 📂 admin/                    # 🔐 Protected admin dashboard
│       ├── 📄 page.js               # Dashboard overview & analytics
│       ├── 📂 reviews/              # Review management
│       ├── 📂 customers/            # Customer management + CSV import
│       ├── 📂 brands/               # Brand management (super admin)
│       ├── 📂 settings/             # Brand settings & integrations
│       └── 📂 share/                # Share link management
│
├── 📂 app/api/
│   ├── 📂 reviews/                  # Review CRUD endpoints
│   ├── 📂 send-review-link/         # Manual & bulk link dispatch
│   ├── 📂 shopify/webhook/          # 🛒 Shopify order webhook handler
│   ├── 📂 admin/                    # Admin management APIs
│   ├── 📂 auth/                     # NextAuth route handlers
│   └── 📂 contact/                  # Landing page contact form
│
├── 📂 components/
│   ├── 📂 admin/                    # Admin UI components
│   ├── 📂 review/                   # Public review flow components
│   └── 📂 share/                    # Share page components
│
├── 📂 lib/
│   ├── 📄 prisma.js                 # Prisma client singleton
│   ├── 📄 sendReviewLink.js         # Core link generation & dispatch logic
│   ├── 📄 mail.js                   # Email sending (Resend + SMTP)
│   ├── 📄 shopify.js                # Shopify order fetching (paginated)
│   └── 📄 utils.js                  # Token generation utilities
│
├── 📂 prisma/
│   └── 📄 schema.prisma             # Database schema & relations
│
├── 📄 auth.js                       # NextAuth configuration
├── 📄 middleware.js                 # Route protection middleware
└── 📄 next.config.mjs              # Next.js configuration
```

---

## 🗄️ Database Schema

```
┌─────────────┐     ┌───────────────┐     ┌────────────┐
│    User     │────▶│     Brand     │◀────│  Customer  │
│─────────────│     │───────────────│     │────────────│
│ id (uuid)   │     │ id (uuid)     │     │ id (uuid)  │
│ name        │     │ name          │     │ name       │
│ email       │     │ googlePlaceId │     │ email      │
│ password    │     │ whatsappApiKey│     │ phone      │
│ role        │     │ resendApiKey  │     │ orderId    │
│ brandId     │     │ smtpHost/Pass │     │ brandId    │
└─────────────┘     │ primaryColor  │     └────────────┘
                    └───────────────┘           │
                           │                   │
              ┌────────────┴──────┐    ┌────────▼────────┐
              │      Review       │    │   ReviewLink    │
              │───────────────────│    │─────────────────│
              │ id (uuid)         │    │ id (uuid)       │
              │ rating            │    │ token (unique)  │
              │ feedback          │    │ isUsed          │
              │ isPublic          │    │ whatsappSent    │
              │ brandId           │    │ emailSent       │
              │ customerId        │    │ expiresAt       │
              └───────────────────┘    └─────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

![Node](https://img.shields.io/badge/Node.js-18%2B-339933?logo=nodedotjs&logoColor=white&style=flat-square)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Required-4169E1?logo=postgresql&logoColor=white&style=flat-square)
![npm](https://img.shields.io/badge/npm-Required-CB3837?logo=npm&logoColor=white&style=flat-square)

### 1. Clone the repository

```bash
git clone https://github.com/satishjadav01/Review_Management.git
cd Review_Management
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root and add the following:

```env
# ─── Database ──────────────────────────────────────────
DATABASE_URL="postgresql://user:password@localhost:5432/megareview"

# ─── NextAuth ──────────────────────────────────────────
NEXTAUTH_SECRET="your-super-secret-key"
NEXTAUTH_URL="http://localhost:8018"
NEXT_PUBLIC_APP_URL="http://localhost:8018"

# ─── WhatsApp (Meta Cloud API) ─────────────────────────
WHATSAPP_ACCESS_TOKEN="your-meta-access-token"
WHATSAPP_PHONE_NUMBER_ID="your-phone-number-id"
WHATSAPP_TEMPLATE_NAME="your-template-name"
WHATSAPP_TEMPLATE_LANGUAGE="en_US"

# ─── Email (Resend) ────────────────────────────────────
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxx"

# ─── Shopify ───────────────────────────────────────────
SHOPIFY_WEBHOOK_SECRET="your-shopify-webhook-secret"
```

### 4. Set up the database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:8018](http://localhost:8018) 🚀

---

## 🔗 Shopify Webhook Setup

1. In Shopify Admin → **Settings** → **Notifications** → **Webhooks**
2. Add a webhook for event: `orders/fulfilled`
3. Set the endpoint URL to: `https://your-domain.com/api/shopify/webhook`
4. Add `SHOPIFY_WEBHOOK_SECRET` to your `.env`

---

## 💰 Pricing Tiers

| Plan | Price | Brands | Credits | WhatsApp |
|:---|:---:|:---:|:---:|:---:|
| **Scale** | $49/mo | 1 | 1,000 | ❌ |
| **Growth** | $119/mo | 5 | 5,000 | ✅ |
| **Enterprise** | $499/mo | Unlimited | Unlimited | ✅ |

---

## 🔐 Authentication & Roles

| Role | Access |
|:---|:---|
| `super_admin` | Full platform access, all brands, contact requests |
| `brand_admin` | Scoped to their assigned brand only |

---

## 🌐 Deployment

### Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/satishjadav01/Review_Management)

```bash
npm run build
npm start
```

> ⚠️ **Important:** Set all environment variables in your Vercel project dashboard before deploying.

---

## 📄 License

This project is **proprietary and private**. All rights reserved © 2026 MegaReview.

---

<div align="center">

**Built with ❤️ using Next.js · PostgreSQL · WhatsApp Cloud API**

[![GitHub](https://img.shields.io/badge/GitHub-satishjadav01-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/satishjadav01)

</div>
