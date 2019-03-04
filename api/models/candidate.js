const mongoose = require('mongoose')

const candidateSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        rerquired: true
    },
    projectId: {
        type: String,
        rerquired: true
    },
    tasks: {
        type: Array,
        rerquired: true
    },
    candidateCV: {
        type: String,
        rerquired: true
    },
    candidateStatus: {
        type: Array,
        rerquired: true
    }
})

module.exports = mongoose.model('Candidate', candidateSchema)