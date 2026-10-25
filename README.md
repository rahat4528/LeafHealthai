# 🌿 Crop Guardian — AI-Powered Plant Health for Every Farmer

_(powered by LeafHealthAI)_

[![PWA Offline Ready](https://img.shields.io/badge/PWA-Offline%20Ready-10b981.svg)](https://leaf-healthai.vercel.app)
[![Track](https://img.shields.io/badge/AgriSphere%20AI-Crop%20Guardian%20%7C%20Climate%20Smart-emerald.svg)](https://leaf-healthai.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **One-Line Pitch:**  
> **Crop Guardian** is an offline-first AI agronomist that helps rural smallholder farmers detect leaf diseases, predict outbreak risks, and get actionable treatment advice — without requiring constant internet access.

---

## 🚨 The Problem

- **40% of global crop yield is lost annually** to preventable plant diseases and pest infestations (FAO).
- **Severe Agronomist Shortage:** In South and Southeast Asia, there is on average only **1 extension officer for every 1,000+ smallholder farmers**.
- **Connectivity Gap:** Existing digital agronomy apps fail in rural heartlands where cellular networks are erratic, 2G, or completely offline during farm hours.
- **Language & Literacy Barriers:** Complex chemical data sheets prevent smallholders from adopting safe, climate-friendly organic treatments.

---

## 🌱 Our Solution

**Crop Guardian** leverages state-of-the-art computer vision, Google Gemini AI, and resilient on-device heuristic fallbacks to put an **expert plant pathologist directly in every farmer's pocket**.

With full **Progressive Web App (PWA)** offline caching, farmers can inspect leaves, review treatment protocols, consult regional risk alerts, and access a comprehensive 100+ disease encyclopedia even with zero internet.

---

## ✨ Key Features

| Feature                                      | What It Does                                                                                                                                                               |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🔍 **Dual-Stage Leaf & Fruit Diagnosis**     | Multi-leaf and fruit computer vision inspection with bounding boxes, segmentation masks, explainability hotspots, and organic vs. chemical treatments.                     |
| ⚡ **Offline-First & On-Device Engine**      | Works with or without connectivity. Scans taken offline are saved locally and synced seamlessly when internet is restored; fallback diagnostic engine ensures 100% uptime. |
| 🌦️ **Spray Decision AI & Climate Engine**    | Environmental decision support advising farmers on whether today is safe for fungicide spray based on wind drift, heat, and rain forecasts.                                |
| 🦠 **Regional Outbreak Watch & Map**         | Live epidemiological risk tracking across South Asian agro-zones (Dhaka, Rajshahi, Sylhet, Rangpur, etc.) with micro-climate risk rationale.                               |
| 💬 **Multilingual AI Plant Doctor**          | Conversational agronomic assistant answering questions in **Bengali (বাংলা)**, **Hindi (हिन्दी)**, and **English** tailored for local smallholders.                        |
| 📚 **Offline Agricultural Knowledge Center** | Research-grounded encyclopedia covering 40+ major crops and 100+ diseases, pests, and nutrient deficiencies with visual guides.                                            |
| 📋 **One-Click Diagnostic PDF Reports**      | Generates exportable, printable crop health diagnostic sheets formatted for local cooperative officers and input suppliers.                                                |

---

## 🎯 Hackathon Track Alignment

### **AgriSphere AI → Track: Crop Guardian & Climate-Smart Farming**

- **Impact-Driven**: Specifically tailored for the 500M+ smallholder farming families across South and Southeast Asia.
- **Climate Adaptation**: Integrates rainfall windows, evapotranspiration indicators, and heat stress to prevent wasted fungicide runoff into local waterways.
- **Safe Chemical Protocols**: Strict AI guardrails preventing pesticide over-application and prioritizing bio-fungicides and neem extracts.

---

## 📱 Offline-First Architecture

```mermaid
graph TD
    A[Farmer Captures Leaf Photo] --> B{Network Available?}
    B -->|Online| C[Dual-Stage Gemini AI Vision Pipeline]
    B -->|Offline| D[On-Device Heuristic & Spectral Analysis]
    C --> E[Detailed Pathology & Explainable Hotspots]
    D --> E
    E --> F[Organic & Chemical Action Plan]
    E --> G[Local PWA Cache & IndexedDB Sync Queue]
```

1. **Service Worker Pre-caching**: Core assets, styles, and encyclopedic data are cached for instantaneous load.
2. **Offline Diagnostic Queue**: Photos taken in deep fields are queued with geotags and synced automatically once signal is detected.
3. **Resilient Local Diagnostics**: Zero downtime; fallback diagnostic engine guarantees farmers receive actionable remediation immediately.

---

## 🏗️ Tech Stack

- **Framework**: TanStack Start (SSR), TanStack Router
- **Frontend**: React 19, TypeScript
- **Styling & UI**: Tailwind CSS v4, Radix UI (shadcn/ui), Lucide Icons
- **AI & Vision Pipeline**: Google Gemini Vision API via custom high-speed gateway with timeout/error recovery
- **PWA & Offline**: Vite PWA Plugin, Workbox, Service Workers
- **Weather Telemetry**: Open-Meteo High-Resolution Agro Forecast API
- **Deployment**: Nitro, Node.js 22+, Docker

---

## 🚀 Quick Start

### Prerequisites

- Node.js 22+
- npm

### Installation

```bash
# 1. Clone repository
git clone https://github.com/rahat4528/LeafHealthai.git
cd LeafHealthai

# 2. Install dependencies
npm install

# 3. Setup environment variables (optional for AI gateway)
cp .env.example .env

# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view Crop Guardian.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🔮 Future Roadmap

See our detailed [ROADMAP.md](./ROADMAP.md) for planned milestones, including:

- **v2.0 (Q1 2027)**: Satellite NDVI imagery integration, WhatsApp/SMS bot for feature phones, community outbreak crowdsourcing.
- **v3.0 (Q3 2027)**: IoT LoRaWAN soil sensor integration, yield prediction modeling, automated government subsidy reporting.

---

## 🧑‍💻 Team & Contributors

- **Mahamudul Hasan Rahat** ([@rahat4528](https://github.com/rahat4528)) — Creator & Lead Developer
- Powered by open agricultural datasets from ICAR, BARI, and FAO.

---

_Crop Guardian: Dedicated to empowering smallholder farmers with accessible, climate-smart plant pathology._
