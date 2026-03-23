# 📋 Demo Day Checklist

Follow these steps tomorrow morning to ensure your 7-Layer Security system is ready for the professors.

## 1. Start the Base Services
- [ ] **Start MongoDB**: Ensure your database is running.
- [ ] **Start Node.js**: Run `node server.js` in the terminal.
  - Verify it says: `Secure IoT Server Running on port 3000`.

## 2. Check Your Network (Critical)
- [ ] **Find your IP**: Check if your computer's IP is still `192.168.1.71`.
  - To check, run: `ifconfig | grep "inet 192"`
- [ ] **Update Arduino**: If your IP has changed, you **MUST** update **Line 9** in `soil_ardino_code.ino` with the new IP and Re-Flash the Arduino.

## 3. Start ngrok (If using public links)
- [ ] **Start ngrok**: Run `ngrok http 3000`.
- [ ] **Update Documentation**: Note the new ngrok URL if you want to show it on your phone/externally.
- [ ] **Update Arduino**: If you use the ngrok URL on the Arduino, update the code and Re-Flash.

## 4. Hardware Verification
- [ ] **Power on Arduino**: Watch the Serial Monitor.
- [ ] **Verify Sync**: Ensure it says `✅ SYNC SUCCESS!` or successfully sends data.
- [ ] **Test Sensor**: Dip it in a glass of water and watch the dashboard bars drop!

## 5. Security Demo Scenarios
- [ ] **Explain Layer 4**: Mention that you built a "Smart Heartbeat" to sync time locally when NTP was blocked.
- [ ] **Explain Layer 6**: Show that you can clear the Blacklist using the Dashboard button if a demo goes wrong.

🚀 **Go get 'em! You've built a rock-solid system.**
