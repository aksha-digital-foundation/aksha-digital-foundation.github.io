---
title: "First Light — NPCWS Welfare Society"
slug: "npcws"
client: "Nagarampalem Police Children Welfare Society"
industry: "Welfare Society / Non-profit"
location: "Guntur, Andhra Pradesh"
date_published: 2026-04-20
status: "draft"
phase: "Phase 1 delivered"
summary: "A solo founder and an AI pair shipped a production-grade member portal for a 20-year-old welfare society in two weeks, then scoped Phase 2 with a compliance-grade Aadhaar research report."
hero_image: "assets/hero.png"
tags: ["welfare", "non-profit", "gcp", "gke", "react", "aadhaar", "digilocker", "andhra-pradesh"]
featured: true
---

# Chapter One — First Light

In the spring of 2026, a small studio called **Aksha Digital Foundation** opened for business in Guntur, Andhra Pradesh. It had no office, no payroll, and exactly one founder. Its purpose fit on a single card:

> *Build honest digital infrastructure for organisations that would otherwise be priced out of it.*

---

## The people the internet forgot

India is full of institutions that live just below the reach of modern software — trade cooperatives, alumni associations, trust-run clinics, welfare societies built by people who spent their careers serving others. They have members to look after, fees to collect, schemes to administer, and no enterprise IT budget. A conventional agency quotes them ₹5–10 lakh for a portal, tells them the ID-card module is "Phase 2," and bills for every round of revisions. The societies, understandably, stay on WhatsApp groups and paper registers.

Aksha was founded to close that gap — to bring banking-grade engineering to ₹500-per-year memberships.

## The first knock on the door

The first client walked in with a three-page PDF: the **Nagarampalem Police Children Welfare Society** (NPCWS) — serving the families of Guntur's police personnel since 2004. Two decades of work. Five hundred member families. Three welfare schemes for housing, health, and education. A requirements document written the way committees write them — numbered clauses, aspirational lines about Aadhaar authentication, an admin dashboard, SMS renewals, printable certificates.

Read the old way, it was a six-month project, four people, fifteen lakh rupees, and a committee that would never entirely approve the last mile.

Read with Claude open in the next window, it was a two-week Phase 1, a clear Phase 2 scope, and a decision tree the committee could actually sign off on.

## The build

Phase 1 was the society's public face — a home page, an about page, membership tiers, scheme descriptions, news and gallery shells, and a contact form. But the plumbing behind it was serious: React 19 on the front, Express on Node 22 at the API, PostgreSQL 15 for the database, containerised with Docker, orchestrated on **Google Kubernetes Engine Autopilot** in Mumbai's `asia-south1` region. GitHub Actions shipped every commit through Artifact Registry to a production cluster, authenticated via Workload Identity Federation — no JSON keys, no secrets in CI — with Google-managed TLS terminating at the Gateway.

From the first commit to the first pageview at [npcws.aksha-digital-foundation.com](https://npcws.aksha-digital-foundation.com) — **about two weeks of active work**. Solo.

## The handover

Shipping code is the easy part. Getting a committee to sign off on what's on the page is harder. So the studio produced **eight Word documents** — one per page plus a dedicated login-and-authentication module — walking the client through every element on the portal with tick-box checkboxes beside every line and a list of the questions the committee needed to answer before Phase 2 could begin.

Aadhaar, in particular, was never going to be "call the API and store the number." So a **twenty-page baseline research report** was authored — tracing the 2019 Amendment Act, the Puttaswamy judgement, the 2025 Good Governance Rules, DigiLocker eligibility for societies, DPDP Act penalties, and a realistic certification budget. It ended with a one-line recommendation the committee could act on: *DigiLocker federated sign-in, offline Aadhaar fallback, full DPDP compliance by 14 May 2027, total certification spend ≈ ₹2 lakh one-time.*

That kind of deliverable used to take a law firm's retainer plus a software consultancy's statement of work. It fit inside an afternoon.

## What this proves

The cost savings are real. The headline is not the savings. The headline is that **the work got done at all**.

A one-person studio, with roughly ten days of active effort and an AI pair working at full capability, shipped a production-grade B2B portal on managed cloud infrastructure, produced a complete set of client sign-off documents, authored a compliance-grade research report, and mapped Phase 2 in enough detail to quote.

Three years ago this took three specialists and three months. Today it takes a founder who knows what they want and an AI that never tires of the details. The rate-limiting step is no longer the building. It is thinking clearly about what to build, and the discipline to ship it.

## What comes next

Phase 2 is already on the calendar — DigiLocker sign-in, Razorpay payments, digital ID cards, admin approval workflows, automated renewals. After NPCWS, the next society. And the next. India has a long tail of them.

Chapter One was about proving the thesis on one small client.

Chapter Two is about scaling it.
