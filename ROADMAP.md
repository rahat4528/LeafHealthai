# 🔮 Crop Guardian — Future Roadmap

This document outlines the strategic product and engineering roadmap for **Crop Guardian** (powered by LeafHealthAI) as part of our long-term vision to build an end-to-end intelligent ecosystem for smallholder farmers.

---

## 🌟 Vision

To build an inclusive, accessible **AgriSphere Intelligence Layer** spanning from seed selection and soil preparation to active crop protection, harvest, and fair market linkage — operable completely offline, in local dialects, and resilient against climate volatility.

---

## ✅ Done (Production Features)

- [x] **Dual-Stage Leaf & Fruit Computer Vision**: Multi-leaf bounding boxes, mask outlines, severity scores, and organic vs. chemical treatment regimens.
- [x] **Explainable Pathology Visualizer**: Symptom hotspot detection with plain-language diagnostic reasoning.
- [x] **Climate-Smart Spray Decision AI**: Real-time spray viability verdict (wind drift, rain wash-off, temperature thresholds) and 48-hour ranked windows.
- [x] **Regional Outbreak Epidemiology Watch**: Live risk radar for South Asian agro-zones (Dhaka, Rajshahi, Rangpur, Sylhet, Khulna) with micro-climate risk triggers.
- [x] **PWA Offline-First Architecture**: Service worker caching of application shell, styles, and encyclopedic data with background sync queue for deep-field scans.
- [x] **Multilingual Localization**: Native agronomic vocabulary support for English, Bengali (বাংলা), and Hindi (हिन्दी).
- [x] **Comprehensive Offline Knowledge Base**: 100+ disease, pest, and nutrient entries with high-impact regional disease filters (Bangladesh & India).
- [x] **Diagnostic PDF Reports**: One-click downloadable field reports for extension officers and input suppliers.
- [x] **Voice-First Mode (BN / HI / EN)**: Web Speech API microphone voice search and text-to-speech "Read Aloud" on diagnoses and spray verdicts.
- [x] **IndexedDB Persistent Offline History**: High-capacity local diagnosis database replacing localStorage to prevent quota exhaustion with high-res thumbnails.
- [x] **Treatment Cost & Dosage Estimator**: Real-time input cost calculations in BDT and INR based on plot size (Bigha, Acre, Decimal) with Pre-Harvest Interval (PHI) safety countdowns.
- [x] **Community Outbreak Reporting**: Citizen-science "Report a sighting" form pinned to the regional outbreak radar.
- [x] **Judge Demo Mode & Offline Simulation**: Interactive 60-second guided tour and client-side offline toggle switch for hackathon reviewers.
- [x] **Expert Escalation & Helplines**: Toll-free direct access to Bangladesh Krishi Call Centre (16123) and India Kisan Helpline (1800-180-1551) plus one-click WhatsApp diagnosis report sharing.

---

## 🔮 Next (Future Milestones)

### 1. Satellite & Drone Remote Sensing Integration

- [ ] Integration with Sentinel-2 and Landsat multispectral imagery for automated field-level NDVI (Normalized Difference Vegetation Index) calculation.
- [ ] Early canopy stress detection before visual leaf symptoms manifest on the ground.
- [ ] Automated drought and soil moisture indexing from space.

### 2. Low-Tech Access: WhatsApp & SMS Agronomist Bot

- [ ] Lightweight 2-way WhatsApp and Telegram bot for farmers with limited storage or entry-level phones.
- [ ] Interactive Voice Response (IVR) and SMS hotline for voice-based disease advisory in rural dialects.

### 3. Crowdsourced Epidemiological Network

- [ ] Geo-tagged anonymous community outbreak reporting: when 3+ farmers within a 5 km radius report Late Blight, neighboring farmers receive instant push warning notifications.
- [ ] Verification loop connecting validated reports directly into local district agricultural dashboards.

### 4. Eco-Agro Marketplace Linkage

- [ ] Contextual referral to certified organic input suppliers and bio-fungicides based directly on the diagnosed pathogen.
- [ ] Price transparency tracker for essential certified seeds, copper fungicides, and biocontrol agents.

---

## 🛰️ v3.0 (Target: Q3 2027) — Climate Smart Hardware & Carbon Credits

### 1. IoT LoRaWAN Micro-Weather & Soil Sensors

- [ ] Open-hardware solar-powered telemetry nodes measuring soil NPK, volumetric water content, EC, and leaf wetness duration.
- [ ] Micro-climate disease risk calibration: replacing regional weather forecasts with sub-acre farm sensor data.

### 2. Predictive Yield Loss Modeling

- [ ] Machine learning yield impact estimation based on historical crop disease progression, weather trajectory, and intervention timing.
- [ ] Actionable loss mitigation suggestions prioritizing high-ROI interventions for cash-strapped farmers.

### 3. Verified Climate-Smart Practices & Carbon Credits

- [ ] Measurement and reporting verification (MRV) for water-saving Alternate Wetting and Drying (AWD) in rice paddies.
- [ ] Reward tokens and micro-grants for farmers transitioning from synthetic chemicals to regenerative bio-inputs.

### 4. Government & Insurance Integration

- [ ] API connectors for automated crop insurance verification and natural disaster compensation claims.
- [ ] District agricultural department portal providing real-time disease spread heatmaps.

---

## 🤝 Community & Contributions

We welcome agricultural researchers, data scientists, and developers passionate about rural development to join us. Check our [GitHub Repository](https://github.com/rahat4528/LeafHealthai) to contribute.
