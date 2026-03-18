const express = require("express")
const router = express.Router()

const SensorData = require("../models/SensorData")

// 🔥 POST (ESP sends data)
router.post("/data", async (req, res) => {

  console.log("BODY:", req.body)

  const { device_id, soil_moisture } = req.body

  await SensorData.create({
    device_id,
    soil_moisture
  })

  res.send("OK")
})

// 🔥 GET (Website fetches data)
router.get("/latest", async (req, res) => {

  const data = await SensorData.find().sort({ timestamp: -1 }).limit(1)

  res.json(data)
})

module.exports = router