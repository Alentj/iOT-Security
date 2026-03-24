# 🧪 Postman & cURL Security Demo Guide

Use this guide to demonstrate your **7-Layer Security** to your professors by simulating both "Good" devices and "Hacker" attacks.

## 🏁 Prerequisites
- **Server URL**: `http://localhost:3000/api/data` (or your ngrok URL)
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`

---

## 🟢 Scenario 1: The "Good" Device (Success)
This simulates your Arduino sending valid data.

**JSON Body**:
```json
{
  "device_id": "esp8266_1773813174090",
  "token": "2a5d1ee93b3bce13ca88efa73f0ff521",
  "soil_moisture": 850,
  "timestamp": 1000
}
```
*   **Result**: `200 OK`
*   **Proof**: The dashboard updates immediately.

---

## 🔴 Scenario 2: The Hacker (Wrong Token)
This simulates an attacker trying to spoof your device ID but using the wrong secret token.

**JSON Body**:
```json
{
  "device_id": "esp8266_1773813174090",
  "token": "HACKER_TOKEN_123",
  "soil_moisture": 0,
  "timestamp": 1000
}
```
*   **Result**: `401 Unauthorized` (ERR_AUTH)
*   **Proof**: Check your Telegram! You should receive an "Alert! Wrong Security Token" message.

---

## 🔴 Scenario 3: The Replay Attack (Old Data)
This simulates a hacker capturing a valid message and trying to "Re-play" it 2 hours later.

**JSON Body**:
```json
{
  "device_id": "esp8266_1773813174090",
  "token": "2a5d1ee93b3bce13ca88efa73f0ff521",
  "soil_moisture": 500,
  "timestamp": 1600000000000
}
```
*(Note: Use a timestamp that is very old compared to the current time).*

*   **Result**: `400 Bad Request` (ERR_REPLAY)
*   **Proof**: The server terminal will log `[SECURITY] Replay Attack Detected`.

---

## 🔴 Scenario 4: The Anomaly (Impossible Data)
This simulates a sensor being tampered with to show impossible values.

**JSON Body**:
```json
{
  "device_id": "esp8266_1773813174090",
  "token": "2a5d1ee93b3bce13ca88efa73f0ff521",
  "soil_moisture": 9999,
  "timestamp": 1000
}
```
*   **Result**: `400 Bad Request` (ERR_ANOMALY)
*   **Proof**: The dashboard will not update, and a "Weird sensor numbers" alert is sent to Telegram.

---

## 🔴 Scenario 5: Tampered Payload (Extra Fields)
This simulates a hacker trying to inject extra "System" commands into your metadata.

**JSON Body**:
```json
{
  "device_id": "esp8266_1773813174090",
  "token": "2a5d1ee93b3bce13ca88efa73f0ff521",
  "soil_moisture": 500,
  "timestamp": 1000,
  "hacker_command": "rm -rf /"
}
```
*   **Result**: `400 Bad Request` (ERR_SCHEMA)
*   **Proof**: Our "Zero-Trust" Layer 7 detects the extra field and kills the request.

---

## 💻 Bonus: Using Terminal (cURL)
If you don't have Postman, copy and paste this into your terminal:

**To Test "Good" Data**:
```bash
curl -X POST http://localhost:3000/api/data \
     -H "Content-Type: application/json" \
     -d '{"device_id":"esp8266_1773813174090","token":"2a5d1ee93b3bce13ca88efa73f0ff521","soil_moisture":850,"timestamp":1000}'
```
