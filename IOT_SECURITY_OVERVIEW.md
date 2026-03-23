# SmartAgri IoT Platform: Advanced 7-Layer Security

This documentation specifies the comprehensive 7-layer security matrix designed to protect the SmartAgri IoT ecosystem.

## 🛡️ The 7 Layers of Defense

### 1. Device Authentication (Hardware Handshake)
- Every IoT node must present a unique `device_id` and a secure `token`.

### 2. Replay Attack Protection (Temporal Guard)
- Requests must include a cryptographic `timestamp` within a **30-second window**.

### 3. Automated IP Blacklisting (Attack Deflection)
- **Automatic Defense**: If an IP triggers 5 security violations (auth fails, tampering), it is automatically **BLACKLISTED** for 1 hour. No data from that IP will be processed.

### 4. Strict Payload Schema Validation (Injection Guard)
- The API strictly validates the incoming JSON. Any "extra" fields or "malicious" characters often used in hacking (SQL injection, etc.) trigger an immediate 400 rejection.

### 5. Semantic Anomaly Detection (Logic Filter)
- Data is analyzed for operational logic (e.g., soil moisture must be between 0-100%).

### 6. Intelligent Rate Limiting (Flood Guard)
- Global traffic monitoring limits any single IP to 100 requests per minute.

### 7. Real-time Telegram Alerts (Instant Awareness)
- The administrator receives instant encrypted notifications for every blocked attack.

---

## 🛠️ Demonstration: Advanced Admin Control

To solve the "Demo Paradox" (where you get blocked while showing an attack), I have implemented an **Administrative Reset**:

1.  **Run the Attack**: Use `security_demo.sh` to trigger the blacklist.
2.  **Verify Blocking**: Show that your sensor data stops updating (Dashboard goes red/offline for that device).
3.  **The Reveal**: On the Dashboard under **Active Alerts**, click **"Reset Security Blacklist"**.
4.  **Proof of Control**: Show that the system instantly resumes normal operations!

> [!IMPORTANT]
> This platform follows a "Security-by-Design" approach, providing both automated defense and administrative oversight.
