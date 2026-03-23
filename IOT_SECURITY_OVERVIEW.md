# 🛡️ SmartAgri: 7-Layer IoT Security Matrix

This document outlines the multi-layered defensive architecture implemented to protect the SmartAgri IoT ecosystem against unauthorized access, data injection, and network-level attacks.

## 🚀 The 7 Layers of Defense

### 1. Intelligent Rate Limiting (Flood Guard)
- **Automatic throttling**: Prevents Denial-of-Service (DoS) and brute-force attacks by limiting any single IP to 100 requests per minute.

### 2. Device authentication (Hardware Handshake)
- **Token-based security**: Every IoT node must present a unique `device_id` and a cryptographically secure token stored in the encrypted database.

### 3. Telegram Shield (Instant Awareness)
- **Proactive Alerts**: Administrators receive encrypted, real-time Telegram notifications for every security violation or blocked attack attempt.

### 4. Replay Protection (Temporal Guard)
- **Smart Auto-Sync**: Every sensor packet is signed with a timestamp. The server verifies freshness within a temporal window, preventing "man-in-the-middle" message injection.

### 5. Behavioral Anomaly Detection (Semantic Filter)
- **Logic Validation**: Incoming data is analyzed for operational realism (e.g., soil moisture validated against raw ADC 0-1024 range). Outliers trigger immediate 400 rejections.

### 6. Automated IP Blacklisting (Attack Deflection)
- **Autonomous Defense**: If an IP triggers multiple security violations (auth fails, tampering), the system automatically **bans the IP** at the firewall level for 1 hour.

### 7. Strict Payload Schema Validation (Injection Guard)
- **Zero-Trust Payload**: The API validates the JSON structure against a strict whitelist. Any "extra" fields or malicious characters (SQLi/XSS) result in immediate rejection.

---

## 🛠️ Graduation Demo Features
- **Admin Security Dashboard**: View real-time security logs and active alerts.
- **One-Click Reset**: Administrative override to clear the IP blacklist during live demonstrations.
- **Hardware-Software Handshake**: Verified end-to-end integration with ESP8266/Arduino hardware.

## 📦 Repository Information
- **GitHub**: [Alentj/iOT-Security](https://github.com/Alentj/iOT-Security.git)
- **Stack**: Node.js, Express, MongoDB, ESP8266 (C++), Chart.js
