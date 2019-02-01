const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const userRoutes = require('./api/routes/user')

mongoose.connect('mongodb://shop-node:' + process.env.MONGO_ATLAS_PW + '@node-shop-app-shard-00-00-cweaz.mongodb.net:27017,node-shop-app-shard-00-01-cweaz.mongodb.net:27017,node-shop-app-shard-00-02-cweaz.mongodb.net:27017/test?ssl=true&replicaSet=node-shop-app-shard-0&authSource=admin&retryWrites=true', {
    useMongoClient: true
})

mongoose.Promise = global.Promise

app.use(morgan('dev'))
// app.use('/uploads', express.static('uploads'))
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

// app.use('/products', productRoutes)
// app.use('/orders', orderRoutes)
app.use('/user', userRoutes)

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
