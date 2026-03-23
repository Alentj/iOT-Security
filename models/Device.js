const mongoose = require('mongoose')

const DeviceSchema = new mongoose.Schema({
  device_id: String,
  token: String,
})

module.exports = mongoose.model('Device', DeviceSchema)
