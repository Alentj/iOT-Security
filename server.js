const express = require("express")
const helmet = require("helmet")

const connectDB = require("./config/database")
const limiter = require("./middleware/rateLimiter")

const dataRoutes = require("./routes/dataRoutes")
const authRoutes = require("./routes/authRoutes")
const adminRoutes = require("./routes/adminRoutes")
const deviceRoutes = require("./routes/deviceRoutes")

const app = express()   // ✅ MUST BE HERE

connectDB()

app.use(express.json())
app.use(express.static("public"))
app.use(helmet())
app.use(limiter)

/* ROUTES */

app.use("/api", dataRoutes)
app.use("/auth", authRoutes)
app.use("/admin", adminRoutes)
app.use("/devices", deviceRoutes)   // ✅ ONLY HERE

app.listen(3000, ()=>{
 console.log("Secure IoT Server Running")
})