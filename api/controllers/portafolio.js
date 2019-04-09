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
