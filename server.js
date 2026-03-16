const express = require("express")
const helmet = require("helmet")

const connectDB = require("./config/database")
const limiter = require("./middleware/rateLimiter")

const dataRoutes = require("./routes/dataRoutes")
const authRoutes = require("./routes/authRoutes")
const adminRoutes = require("./routes/adminRoutes")
const deviceRoutes = require("./routes/deviceRoutes")
const deviceRoutes = require("./routes/deviceRoutes")

app.use("/devices", deviceRoutes)

const app = express()

connectDB()

app.use(express.json())
app.use(express.static("public"))
app.use(helmet())
app.use(limiter)

app.use("/api",dataRoutes)
app.use("/auth",authRoutes)
app.use("/admin",adminRoutes)
app.use("/devices",deviceRoutes)

app.listen(3000,()=>{

 console.log("Secure IoT Server Running")

})