const mongoose = require('mongoose')

const projectSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    projectImage: {
        type: String,
        rerquired: true
    },
    userId: {
        type: String,
        rerquired: true
    }
})

module.exports = mongoose.model('Project', projectSchema)