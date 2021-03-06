const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const keys = require('./config/keys');

const projectRoutes = require('./api/routes/projects')
const candidateRoutes = require('./api/routes/candidates')
const userRoutes = require('./api/routes/user')
const portafolioRoutes = require('./api/routes/portafolio')

mongoose.connect(keys.MONGO_URI, {
    useMongoClient: true
})

mongoose.Promise = global.Promise

app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )

    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        res.status(200).json({ })
    }
    next()
})

app.use('/projects', projectRoutes)
app.use('/candidates', candidateRoutes)
app.use('/user', userRoutes)
app.use('/portafolio', portafolioRoutes)

app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.staus || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app
