const Device = require("../models/Device")
const SecurityLog = require("../models/SecurityLog")
const sendAlert = require("../utils/telegram")

module.exports = async (req,res,next)=>{

 try{

  const {device_id, token} = req.body

  const device = await Device.findOne({device_id})

  if(!device || device.token !== token){

   // Save attack log
   await SecurityLog.create({
    ip: req.ip,
    event: "Invalid device authentication attempt"
   })
   const sendAlert = require("../utils/telegram")



 sendAlert("⚠️ Unauthorized device attempt from IP: " + req.ip)

 return res.status(403).send("Unauthorized device")

}

   // Send Telegram alert
  

  next()

 }catch(err){

  return res.status(500).send("Server error")

 }

}