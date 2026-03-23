const mongoose = require('mongoose')

const SecuritySchema = new mongoose.Schema({
  ip: String,
  event: String,
  time: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('SecurityLog', SecuritySchema)
