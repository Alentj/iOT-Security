const express = require("express")
const router = express.Router()

const SensorData = require("../models/SensorData")
const SecurityLog = require("../models/SecurityLog")

// ✅ SENSOR DATA (NO AUTH)
router.get("/sensor-data", async (req, res) => {
  const data = await SensorData.find()
  res.json(data)
})

// ✅ SECURITY LOGS (NO AUTH)
router.get("/security-logs", async (req, res) => {
  const logs = await SecurityLog.find()
  res.json(logs)
})

// ✅ GRAPH DATA (NO AUTH)
router.get("/graph-data", async (req, res) => {
  const data = await SensorData.find()

  const formatted = data.map(d => ({
    moisture: d.soil_moisture,
    time: d.timestamp
  }))

  res.json(formatted)
})

// ✅ DEVICE STATUS (NO AUTH)
router.get("/device-status", async (req, res) => {

  const devices = await SensorData.find().sort({ timestamp: -1 })

  const latest = {}

  devices.forEach(d => {
    if (!latest[d.device_id]) {
      latest[d.device_id] = d
    }
  })

  const status = Object.values(latest).map(d => {

    const online = Date.now() - d.timestamp < 60000

    return {
      device: d.device_id,
      moisture: d.soil_moisture,
      status: online ? "Online" : "Offline"
    }
  })

  res.json(status)
})

module.exports = router