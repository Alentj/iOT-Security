#!/bin/bash

# SmartAgri IoT Security Demo Script (v2.5 - Admin Reset Edition)
# This script demonstrates the 7 security layers of the IoT Dashboard.

SERVER_URL="http://localhost:3000"
API_ENDPOINT="$SERVER_URL/api/data"

# Using your real device ID and Token
DEVICE_ID="esp8266_1773813174090"
TOKEN="2a5d1ee93b3bce13ca88efa73f0ff521"

echo "------------------------------------------------"
echo "🔍 SmartAgri Security Demo: 7-LAYER ACTIVE DEFENSE"
echo "------------------------------------------------"

# Get portable timestamp using python3 (Mac compatible)
get_ts() {
    python3 -c 'import time; print(int(time.time() * 1000))'
}

# Scenario 1: VALID DATA UPLOAD
echo -e "\n[SCENARIO 1] Normal Operation (Success)"
TIMESTAMP=$(get_ts)
curl -s -X POST $API_ENDPOINT \
     -H "Content-Type: application/json" \
     -d "{\"device_id\": \"$DEVICE_ID\", \"token\": \"$TOKEN\", \"soil_moisture\": 45, \"timestamp\": $TIMESTAMP}"
echo -e "\nResult: Expecting 'OK'"

# Scenario 2: SCHEMA TAMPERING
echo -e "\n[SCENARIO 2] Schema Tampering (Data Injection Attempt)"
TIMESTAMP=$(get_ts)
curl -s -X POST $API_ENDPOINT \
     -H "Content-Type: application/json" \
     -d "{\"device_id\": \"$DEVICE_ID\", \"token\": \"$TOKEN\", \"soil_moisture\": 50, \"timestamp\": $TIMESTAMP, \"injected_field\": \"SQL_ATTACK\"}"
echo -e "\nResult: Expecting 'Security Violation: Unexpected fields detected'"

# Scenario 3: DATA ANOMALY
echo -e "\n[SCENARIO 3] Semantic Anomaly (Irrational Sensor Reading)"
TIMESTAMP=$(get_ts)
curl -s -X POST $API_ENDPOINT \
     -H "Content-Type: application/json" \
     -d "{\"device_id\": \"$DEVICE_ID\", \"token\": \"$TOKEN\", \"soil_moisture\": 999, \"timestamp\": $TIMESTAMP}"
echo -e "\nResult: Expecting 'Abnormal value detected'"

# Scenario 4: BRUTE FORCE & BLACKLISTING
echo -e "\n[SCENARIO 4] Automated Blacklisting (Brute Force Defence)"
echo "Simulating 5 consecutive failed authentication attempts..."
TIMESTAMP=$(get_ts)
for i in {1..5}
do
   curl -s -o /dev/null -w "Attack Attempt $i: %{http_code}\n" -X POST $API_ENDPOINT \
        -H "Content-Type: application/json" \
        -d "{\"device_id\": \"$DEVICE_ID\", \"token\": \"MALICIOUS\", \"soil_moisture\": 50, \"timestamp\": $TIMESTAMP}"
done

echo -e "\nAttempt 6 (Automatic Blacklist Triggered):"
curl -s -X POST $API_ENDPOINT \
     -H "Content-Type: application/json" \
     -d "{\"device_id\": \"$DEVICE_ID\", \"token\": \"$TOKEN\", \"soil_moisture\": 45, \"timestamp\": $TIMESTAMP}"
echo -e "\nResult: Expecting 'Your IP is temporarily blacklisted' (403)"

echo -e "\n------------------------------------------------"
echo "✅ Security Proof Complete"
echo "📢 TO UNBLOCK: Use the 'Reset Security' button on your Dashboard!"
echo "------------------------------------------------"
