# DentAgent AI — Dental Patient Re-Activation & Hygiene Booking Agent SaaS

A commercial-grade, multi-tenant SaaS web application built with **Next.js (App Router)**, **Node.js + Express.js**, and **MongoDB (Mongoose)**.

---

## 🌟 Key Features & Business Logic

1. **Strict Monetization Ledger**:
   - **$600.00 / month flat base platform fee** + **$20.00 per confirmed booked hygiene chair**.
   - Real-time Clinic ROI Calculation Engine: dynamically calculates gross production recovered, net practice profit, multiple return (e.g. 4.8x cash return), and compares against traditional $4,200/mo phone staff salaries ($3,280/mo direct labor savings).

2. **Overdue Patient Scanner**:
   - MongoDB aggregation scanner filtering patients overdue by >6 months (>180 days) for routine prophylaxis or high-value unscheduled crown seating (D2740, ~$1,150 fee).
   - Multi-parameter filters: recall severity (6-8 mo, 8-12 mo, >12 mo), insurance carrier, and procedure reason.
   - Batch re-activation campaign launcher sending automated Twilio SMS sequences.

3. **Conversational AI Engine (Delta Dental, MetLife, Cigna RAG)**:
   - RAG service answering patient co-pay queries with exact CDT fee rules ($0 co-pay for Delta Dental PPO preventive, $575 co-pay for MetLife ceramic crowns).
   - Chair bay slot negotiator that queries open 60-minute openings in Hygiene Bay 1 & 2, parses natural language affirmations, and automatically reserves chairs while accruing $20 commission on the billing ledger.

4. **Multi-Role Portals & Complete Authentication**:
   - **👑 Practice Owner / Clinic Admin**: Full access to real-time ROI ledger, overdue patient scanner, practice settings, and chair configurations.
   - **🩺 Hygiene Coordinator / Staff**: Live 2-way SMS inbox with AI takeover toggle, hygiene bays schedule, and patient CRM.
   - **🌐 Platform Superadmin**: Fleet-wide SaaS MRR metrics ($600/clinic + $20/chair platform-wide), multi-tenant onboarding, and practice health.

5. **Live Interactive Twilio SMS & RAG Simulator**:
   - Test end-to-end 2-way SMS conversations directly in your browser without requiring live carrier fees. Inspect RAG citations, watch slot negotiation, and observe ledger updates in real-time.

---

## 🚀 Quick Start & Demo Accounts

### Pre-Seeded Demo Credentials

| Role | Email | Password | Access / Dashboard |
| :--- | :--- | :--- | :--- |
| **👑 Clinic Admin (Practice Owner)** | `dr.apex@dentalarts.com` | `password123` | Lands on `/dashboard` (ROI & Overdue Command) |
| **🩺 Hygiene Coordinator (Staff)** | `coordinator@dentalarts.com` | `password123` | Lands on `/dashboard/inbox` (Live SMS & Schedule) |
| **🌐 Platform Superadmin** | `superadmin@antigravitysaas.com` | `password123` | Lands on `/dashboard/admin` (Master MRR Fleet) |

*You can also use the **One-Click Quick Persona Switcher** on the login page or sidebar dropdown to switch accounts instantly!*

---

## 🛠️ Tech Stack & Directory Structure

- **Frontend**: Next.js 14 (App Router, Tailwind CSS, Lucide React, Recharts, Glassmorphism UI)
  - Port: `http://localhost:3000`
- **Backend**: Node.js + Express.js (REST APIs, Socket.io, Twilio Webhook Receiver, RAG Engine)
  - Port: `http://localhost:5000`
- **Database**: MongoDB (Mongoose ORM)
  - Connection: `mongodb://127.0.0.1:27017/dental_reactivation_saas`

```
Dental Patient/
├── backend/
│   ├── src/
│   │   ├── config/ (db.js, config.js)
│   │   ├── models/ (Tenant.js, User.js, Patient.js, Appointment.js, Conversation.js, BillingLedger.js)
│   │   ├── controllers/ (auth, patient, appointment, conversation, billing, tenant, webhook)
│   │   ├── services/ (ragService.js, slotNegotiatorService.js, billingLedgerService.js, overdueScannerService.js, twilioService.js)
│   │   ├── knowledge/ (insuranceRules.json, clinicProtocols.json)
│   │   ├── middlewares/ (auth, rbac, errorHandler)
│   │   ├── seed/ (seedData.js)
│   │   └── server.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx (Luxury Commercial Landing Page & ROI Widget)
│   │   │   ├── login/page.tsx (Auth with Quick Persona Switcher)
│   │   │   ├── register/page.tsx (Tenant Onboarding)
│   │   │   └── dashboard/
│   │   │       ├── layout.tsx (Multi-Tenant Sidebar & Live Agent Pulse)
│   │   │       ├── page.tsx (Practice Overview & Production Metrics)
│   │   │       ├── scanner/page.tsx (Overdue Patient Scanner)
│   │   │       ├── inbox/page.tsx (3-Pane 2-Way SMS Messenger)
│   │   │       ├── appointments/page.tsx (Hygiene Chair Schedule & Slots)
│   │   │       ├── billing/page.tsx ($600+$20 Monetization Ledger & ROI)
│   │   │       ├── patients/page.tsx (Patient CRM Roster)
│   │   │       ├── simulator/page.tsx (Interactive Twilio SMS Sandbox)
│   │   │       └── admin/page.tsx (Superadmin Multi-Tenant MRR)
│   │   ├── lib/ (api.ts, authContext.tsx, utils.ts)
│   │   └── components/
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

---

## 🏃 Running the Application

### 1. Database & Backend
```bash
# In backend/
npm install
node src/seed/seedData.js   # Seeds rich dental data, overdue patients & appointments
npm start                  # Starts Express server at http://localhost:5000
```

### 2. Frontend
```bash
# In frontend/
npm install
npm run build              # Builds optimized Next.js application
npm start                  # Starts Next.js production server at http://localhost:3000
```

---

## 🔒 Security & HIPAA Compliance
- 256-bit JWT token encryption with secure bearer authentication headers.
- Multi-tenant tenant scoping middleware ensuring strict cross-practice data isolation.
- Bcrypt password hashing with cryptographic salt rounds.
