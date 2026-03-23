#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

const char* ssid = "BSNL";
const char* password = "Joyjacob5115";

// 👉 Use your CURRENT ngrok / Railway URL
const String serverURL = "https://192.168.1.71:3000/api/data";

String device_id = "esp8266_1773813174090";
String token = "2a5d1ee93b3bce13ca88efa73f0ff521";

int sensorPin = A0;
int pumpPin = D1;   // Relay connected

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

  Serial.println("\nWiFi connected");
}

void loop() {

  if (WiFi.status() == WL_CONNECTED) {

    int moisture = analogRead(sensorPin);
    Serial.print("Moisture: ");
    Serial.println(moisture);

    // 🌱 Pump control (auto irrigation)
    if (moisture > 700) {
      digitalWrite(pumpPin, HIGH); // ON
      Serial.println("Pump ON");
    } else {
      digitalWrite(pumpPin, LOW); // OFF
      Serial.println("Pump OFF");
    }

    HTTPClient http;
    http.begin(client, serverURL);
    http.addHeader("Content-Type", "application/json");

    String jsonData = "{";
    jsonData += "\"device_id\":\"" + device_id + "\",";
    jsonData += "\"token\":\"" + token + "\",";
    jsonData += "\"soil_moisture\":" + String(moisture) + ",";
    jsonData += "\"timestamp\":" + String(millis());
    jsonData += "}";

    Serial.println("Sending JSON:");
    Serial.println(jsonData);

    int httpResponseCode = http.POST(jsonData);

    Serial.print("Response: ");
    Serial.println(httpResponseCode);

    http.end();

  } else {
    Serial.println("WiFi Disconnected");
  }

  delay(10000); // send every 10 sec
}