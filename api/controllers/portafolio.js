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
    Portafolio.find({ userIds: {$elemMatch: {_id: req.params.userId } }}).select('name').exec().then(docs => {
        const response = {
            count: docs.length,
            projects: docs.map(doc => {
                    return {
                        name: doc.name,
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
