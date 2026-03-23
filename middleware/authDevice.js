const Device = require('../models/Device')
const SecurityLog = require('../models/SecurityLog')
const sendAlert = require('../utils/telegram')
const { recordFailure } = require('./ipBlacklist')

module.exports = async (req, res, next) => {
  try {
    const { device_id, token } = req.body

    const device = await Device.findOne({ device_id })
    if (device && device.token === token) {
      return next()
    }

    // Auth Failed
    recordFailure(req.ip)
    
    await SecurityLog.create({
      event: 'Failed Authentication',
      ip: req.ip,
      details: `Device ID: ${device_id} tried to connect with invalid token.`,
      severity: 'high'
    })

    sendAlert(`🚨 Alert! Someone tried to connect as device ${device_id} from ${req.ip} but used the wrong security token! I've blocked the attempt.`, 'security')

    res.status(401).send('ERR_AUTH: Device authentication failed')
  } catch (err) {
    res.status(500).send('Internal Server Error')
  }
}
