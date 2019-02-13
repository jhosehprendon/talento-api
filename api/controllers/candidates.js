const mongoose = require('mongoose');

const Candidate = require('../models/candidate');

exports.candidates_get_all = (req, res, next) => {
    
    Candidate.find({ projectId: req.params.projectId }).select('name email _id userId').exec().then(docs => {
        const response = {
            count: docs.length,
            candidates: docs.map(doc => {
                    return {
                        name: doc.name,
                        email: doc.email,
                        _id: doc._id,
                        userId: doc.userId,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3002/candidates/' + doc._id
                        } 
                    }
            })
        }
        res.status(200).json(response)

    }).catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
}

exports.candidates_create_candidate = (req, res, next) => {

    const candidate = new Candidate({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        userId: req.body.userId,
        projectId: req.body.projectId
    })

    candidate.save().then(result => {
        console.log(result)
        res.status(201).json({
            message: 'Created candidate Successfully',
            createdCandidate: {
                name: result.name,
                email: result.email,
                _id: result._id,
                userId: result.userId,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3002/candidates/' + result._id
                }
            }
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })

}

exports.candidates_get_candidate = (req, res, next) => {
    const id = req.params.candidateId
    Candidate.findById(id).select('name email _id ').exec().then(doc => {        
        if(doc) {
            res.status(200).json({
                candidate: doc,
                request: {
                    type: 'GET',
                    description: 'Get all candidates',
                    url: 'http://localhost:3000/candidates'
                }
            })
        } else {
            res.status(404).json({
                message: 'No valid entry found for that candidate ID'
            })
        }

    }).catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
    
}

exports.candidates_update_candidate = (req, res, next) => {

    Candidate.update({ _id: req.params.candidateId }, req.body).exec().then(result => {
        // console.log(req.body)
        res.status(200).json({
            message: 'Candidate updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/candidates/' + req.params.candidateId
            }
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
}

exports.candidates_delete_candidate = (req, res, next) => {
    
    Candidate.remove({ _id: req.params.candidateId }).exec().then(result => {
        res.status(200).json({
            message: 'Candidate deleted'
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
}