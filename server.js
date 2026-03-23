require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')

const connectDB = require('./config/database')
const limiter = require('./middleware/rateLimiter')
const errorHandler = require('./middleware/errorHandler')

const dataRoutes = require('./routes/dataRoutes')
const authRoutes = require('./routes/authRoutes')
const adminRoutes = require('./routes/adminRoutes')
const deviceRoutes = require('./routes/deviceRoutes')

const app = express() // ✅ MUST BE HERE

connectDB()

// Common Middleware
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.static('public'))
app.use(helmet())
app.use(limiter)

/* ROUTES */

app.use('/api', dataRoutes)
app.use('/auth', authRoutes)
app.use('/admin', adminRoutes)
app.use('/devices', deviceRoutes) // ✅ ONLY HERE

// Global Error Handler
app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Secure IoT Server Running on port ${PORT}`)
})
