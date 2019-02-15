const mongoose = require('mongoose')

const projectSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    seniority: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    userIds: {
        type: Array,
        rerquired: true
    }
})

module.exports = mongoose.model('Project', projectSchema)