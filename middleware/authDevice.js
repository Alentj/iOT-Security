const Device = require('../models/Device')
const SecurityLog = require('../models/SecurityLog')
const sendAlert = require('../utils/telegram')
const { recordFailure } = require('./ipBlacklist')

module.exports = async (req, res, next) => {
  try {
    const { device_id, token } = req.body

    const device = await Device.findOne({ device_id })

    if (!device || device.token !== token) {
      // Record failure for blacklisting
      recordFailure(req.ip)

      // Save attack log
      await SecurityLog.create({
        ip: req.ip,
        event: 'Invalid device authentication attempt',
      })
      
      sendAlert(`Wait a second! An unknown device tried to connect to our system from this address: ${req.ip}. I've blocked it just to be safe.`, 'security')

      return res.status(403).send('Unauthorized device')
    }

    next()
  } catch (err) {
    console.error('Auth device error:', err)
    return res.status(500).send('Server error')
  }
}
