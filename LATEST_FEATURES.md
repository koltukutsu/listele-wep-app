# Listele.io – Latest Features Overview

Welcome to **Listele.io** – the launchpad that turns raw startup ideas into thriving ventures. Below is a concise overview of the current feature-set as of **July 2025**.

---

## 🚀 Core Philosophy – *Founder Mode ON!*
A “cool & inspiring” journey from idea to launch. Whenever *Founder Mode* is enabled, the UI bursts with energy (confetti showers, upbeat copy, and celebratory animations) to motivate founders at every milestone.

---

## ✨ Feature Highlights

| Category | Feature | Description |
| --- | --- | --- |
| **AI Assistance** | **AI Founder Mode** | Uses OpenAI to auto-generate landing-page copy, benefit lists, and FAQs. One-click *magic fill* inside the editor. |
| **Project Builder** | **Visual Project Editor** | Tailwind-powered dashboard for editing hero section, brand colors, benefits, features, FAQs & more – all live-previewed side-by-side. |
|  | **Real-time Confetti** | After a successful publish action, we trigger `canvas-confetti` to celebrate the win. |
| **Auth** | **Google Sign-In** | Firebase Auth with Google provider plus email/password (coming soon). |
| **Data** | **Firestore Integration** | All projects, waitlist entries & user profiles are stored in Firebase Firestore – no more mock data! |
|  | **Auto User Profile** | On first login we create a `userProfiles/{uid}` doc with plan, subscription & stats placeholders. |
| **Launch Pages** | **Public Landing Slugs** | Each project is published under `/{slug}` with its own signup form and theme. |
| **Waitlist Management** | **Leads Dashboard** | View, filter & export collected emails/phones for every project (`/dashboard/leads/[projectId]`). |
| **Analytics** | **Visit & Fill Tracking** | Cloud Functions record page visits & signup events to build growth charts (MVP). |
| **Billing** | **Stripe Customer Portal (WIP)** | Planned paid tiers: *Basic*, *Pro*, *Enterprise* – handled through `/dashboard/billing`. |
| **Admin** | **Dynamic Admin Panel** | Super-admin view to edit field definitions and inspect all user projects. |
| **Docs** | **API Endpoint `/api/generate-project`** | Secure route that proxies OpenAI completions for AI Founder Mode. |

---

## 🛠️ Tech Stack

* **Next.js 15** (`app/` router & React 19)
* **TypeScript** everywhere
* **Tailwind CSS 4** for styling + `clsx`/`cva` for variants
* **Radix UI** component primitives – with custom `Dialog`, `Dropdown`, `Checkbox`, etc.
* **Firebase v10** (Auth, Firestore, Functions & Storage)
* **Framer-Motion** & `motion-dom` for rich animations
* **Canvas-Confetti** for celebratory effects

---

## 📈 Roadmap Snapshot

1. **Form Builder MVP** – drag-and-drop custom fields
2. **Email Notifications** – Resend integration
3. **Stripe Billing GA** – upgrade & usage metering
4. **Embeddable Widgets** – snippet to embed waitlist on any site
5. **Public Templates Gallery** – cloneable landing pages

Stay tuned – *we’re just getting started!* 🎉
