const mongoose = require('mongoose')

const SensorSchema = new mongoose.Schema({
  device_id: {
    type: String,
    required: true,
  },

  soil_moisture: {
    type: Number,
    required: true,
  },

  timestamp: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('SensorData', SensorSchema)
