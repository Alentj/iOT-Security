const express = require('express')
const router = express.Router()

const SensorData = require('../models/SensorData')
const SecurityLog = require('../models/SecurityLog')
const authUser = require('../middleware/authUser')
const checkRole = require('../middleware/checkRole')
const { clearAll: clearBlacklist } = require('../middleware/ipBlacklist')

// ✅ SENSOR DATA
router.get('/sensor-data', authUser, checkRole(['admin', 'owner', 'farmer']), async (req, res) => {
  const data = await SensorData.find()
  res.json(data)
})

// ✅ SECURITY LOGS (Admin only)
router.get('/security-logs', authUser, checkRole(['admin']), async (req, res) => {
  const logs = await SecurityLog.find()
  res.json(logs)
})

// ✅ CLEAR BLACKLIST (Manual Override for Demo)
router.post('/clear-blacklist', authUser, checkRole(['admin']), (req, res) => {
  clearBlacklist()
  res.json({ message: 'Security blacklist cleared successfully.' })
})

// ✅ GRAPH DATA
router.get('/graph-data', authUser, checkRole(['admin', 'owner', 'farmer']), async (req, res) => {
  const data = await SensorData.find()

  const formatted = data.map((d) => ({
    moisture: d.soil_moisture,
    time: d.timestamp,
  }))

  res.json(formatted)
})

// ✅ DEVICE STATUS (Admin / Owner only)
router.get('/device-status', authUser, checkRole(['admin', 'owner']), async (req, res) => {
  const devices = await SensorData.find().sort({ timestamp: -1 })

  const latest = {}

  devices.forEach((d) => {
    if (!latest[d.device_id]) {
      latest[d.device_id] = d
    }
  })

  const status = Object.values(latest).map((d) => {
    const online = Date.now() - d.timestamp < 60000

    return {
      device: d.device_id,
      moisture: d.soil_moisture,
      status: online ? 'Online' : 'Offline',
    }
  })

  res.json(status)
})

// ✅ IRRIGATION MOTOR STATE
let motorStatus = false

router.post(
  '/motor-control',
  authUser,
  checkRole(['admin', 'owner', 'farmer']),
  async (req, res) => {
    const { action } = req.body
    if (action === 'on') motorStatus = true
    if (action === 'off') motorStatus = false
    res.json({ motorStatus })
  }
)

router.get('/motor-status', authUser, async (req, res) => {
  res.json({ motorStatus })
})

module.exports = router
