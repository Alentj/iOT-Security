const sendAlert = require('../utils/telegram')

module.exports = (req, res, next) => {
  const { soil_moisture } = req.body

  // Allow raw ADC values (0-1024) for the demo
  if (soil_moisture < 0 || soil_moisture > 1100) {
    sendAlert(`Hey! I just noticed some weird numbers from the soil sensor (${soil_moisture}). You might want to check if the sensor is okay!`, 'warning')

    return res.status(400).send('ERR_ANOMALY: Abnormal value detected')
  }

  next()
}
