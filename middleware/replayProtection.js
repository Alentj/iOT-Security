const sendAlert = require("../utils/telegram")

module.exports = (req,res,next)=>{

 const {timestamp} = req.body
 const now = Date.now()

 if(Math.abs(now - timestamp) > 30000){

  sendAlert("⚠️ Replay attack detected from IP: " + req.ip)

  return res.status(400).send("Replay attack detected")
 }

 next()
}