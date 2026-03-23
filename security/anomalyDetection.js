const sendAlert = require('../utils/telegram')

module.exports = (req, res, next) => {
  const { soil_moisture } = req.body

  if (soil_moisture < 0 || soil_moisture > 100) {
    sendAlert(`Hey! I just noticed some weird numbers from the soil sensor (${soil_moisture}). You might want to check if the sensor is okay!`, 'warning')

    return res.status(400).send('Abnormal value detected')
  }

  next()
}
