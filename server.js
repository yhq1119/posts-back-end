const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

// bring routes
const postRoutes = require('./routes/post')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')

// app
const app = express()

// db
mongoose.connect(
    process.env.DATABASE_CLOUD, 
    `${process.env.DATABASE_CONFIG_1}`.json 
    ).then(()=>console.log('Database connected'))

// middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())

// cors
if (process.env.NODE_ENV === 'development') {
    app.use(cors({ origin: `${process.env.CLIENT_URL}` }))
}

// routes middleware
app.use('/api',postRoutes)
app.use('/api',authRoutes)
app.use('/api',userRoutes)

// routes
// app.get('/api', (req, res) => {
//     res.json({ time: Date().toString() })
// })

// port
const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`Server is running on port [${port}]`)
})
