#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

// 📶 REPLACE WITH YOUR NETWORK SETTINGS
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const String serverURL = "http://YOUR_SERVER_IP:3000/api/data";

// 🆔 YOUR DEVICE CREDENTIALS
String device_id = "esp8266_1773813174090";
String token = "2a5d1ee93b3bce13ca88efa73f0ff521";

int sensorPin = A0;
int pumpPin = D1;

WiFiClient client;

void setup() {
  Serial.begin(115200);
  pinMode(pumpPin, OUTPUT);
  digitalWrite(pumpPin, LOW);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ WiFi connected!");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    // 📊 RAW DATA: 1024 = DRY (Air), 300 = WET (Water)
    int moisture = analogRead(sensorPin); 
    
    Serial.print("Moisture Level: "); Serial.println(moisture);

    // 💧 Pump Logic: ABOVE threshold = ON (matches Raw behavior)
    if (moisture > 700) { 
      digitalWrite(pumpPin, HIGH);
      Serial.println("Pump ON (Dry Detected)");
    } else {
      digitalWrite(pumpPin, LOW);
      Serial.println("Pump OFF (Soil Moistened)");
    }

    HTTPClient http;
    http.begin(client, serverURL);
    http.addHeader("Content-Type", "application/json");

    // 🛡️ Sending data with Replay Protection (millis)
    String jsonData = "{";
    jsonData += "\"device_id\":\"" + device_id + "\",";
    jsonData += "\"token\":\"" + token + "\",";
    jsonData += "\"soil_moisture\":" + String(moisture) + ",";
    jsonData += "\"timestamp\":" + String(millis());
    jsonData += "}";

    Serial.println("Sending to: " + serverURL);
    int httpResponseCode = http.POST(jsonData);
    Serial.print("Response: "); Serial.println(httpResponseCode);

    http.end();
  }
  delay(10000); 
}
