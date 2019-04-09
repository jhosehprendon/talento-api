const mongoose = require('mongoose')

const portafolioSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    objective: {
        type: String,
        required: true
    },
    platform: {
        type: String,
        required: true
    },
    results: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Portafolio', portafolioSchema)