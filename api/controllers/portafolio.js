const mongoose = require('mongoose');

const Portafolio = require('../models/portafolio');

exports.portafolio_create_project = (req, res, next) => {
    console.log(req.body)
    const portafolio = new Portafolio({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        objective: req.body.objective,
        platform: req.body.platform,
        results: req.body.results,
        userIds: req.body.userIds
    })

    portafolio.save().then(result => {
        console.log(result)
        res.status(201).json({
            message: 'Created project portafolio Successfully',
            createdProject: {
                name: result.name,
                objective: result.objective,
                _id: result._id,
                userId: result.userId,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3002/projects/' + result._id
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

exports.portafolio_get_all_projects = (req, res, next) => {
    Portafolio.find({ userIds: {$elemMatch: {_id: req.params.userId } }}).select('name _id').exec().then(docs => {
        const response = {
            count: docs.length,
            projects: docs.map(doc => {
                    return {
                        name: doc.name,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3002/projects/' + doc._id
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

exports.portafolio_get_project = (req, res, next) => {
    const id = req.params.projectId
    Portafolio.findById(id).select('name _id objective platform results').exec().then(doc => {
        console.log(doc)
        
        if(doc) {
            res.status(200).json({
                project: doc,
                request: {
                    type: 'GET',
                    description: 'Get all projects',
                    url: 'http://localhost:3002/projects'
                }
            })
        } else {
            res.status(404).json({
                message: 'No valid entry found for that project ID'
            })
        }

    }).catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
    
}

exports.portafolio_update_project = (req, res, next) => {
    Portafolio.update({ _id: req.params.projectId }, req.body).exec().then(result => {
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
