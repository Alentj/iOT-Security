const express = require('express')
const router = express.Router()

const SensorData = require('../models/SensorData')
const authDevice = require('../middleware/authDevice')
const replayProtection = require('../middleware/replayProtection')
const anomalyDetection = require('../security/anomalyDetection')
const { checkBlacklist, recordFailure } = require('../middleware/ipBlacklist')

// 🕒 TIME SYNC HEARTBEAT (For Hardware)
router.get('/sync', (req, res) => {
  res.json({ serverTime: Date.now() })
})

// 🔥 POST (ESP sends data)
router.post('/data', checkBlacklist, authDevice, replayProtection, anomalyDetection, async (req, res) => {
  try {
    const { device_id, token, soil_moisture, timestamp } = req.body

    // LAYER 7: STRICT SCHEMA VALIDATION
    const allowedFields = ['device_id', 'token', 'soil_moisture', 'timestamp']
    const receivedFields = Object.keys(req.body)
    const extraFields = receivedFields.filter(f => !allowedFields.includes(f))

    if (extraFields.length > 0) {
      recordFailure(req.ip)
      return res.status(400).send(`ERR_SCHEMA: Unexpected fields: ${extraFields.join(', ')}`)
    }

    if (typeof soil_moisture !== 'number' || typeof timestamp !== 'number') {
      recordFailure(req.ip)
      return res.status(400).send('ERR_TYPES: Invalid data types')
    }

    await SensorData.create({
      device_id,
      soil_moisture,
    })

    res.send('OK')
  } catch (err) {
    console.error('Error saving sensor data:', err)
    res.status(500).send('Internal Server Error')
  }
})

// 🔥 GET (Website fetches data)
router.get('/latest', async (req, res) => {
  const data = await SensorData.find().sort({ timestamp: -1 }).limit(1)
  res.json(data)
})

module.exports = router
