const mongoose = require('mongoose');

const Project = require('../models/project');

exports.projects_get_all = (req, res, next) => {
    
    Project.find({ userIds: {$elemMatch: {_id: req.params.userId } }}).select('name description company _id userIds').exec().then(docs => {
        const response = {
            count: docs.length,
            projects: docs.map(doc => {
                    return {
                        name: doc.name,
                        description: doc.description,
                        company: doc.company,
                        _id: doc._id,
                        userIds: doc.userIds,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/projects/' + doc._id
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

exports.projects_create_project = (req, res, next) => {

    const project = new Project({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description,
        location: req.body.location,
        seniority: req.body.seniority,
        company: req.body.company,
        userIds: req.body.userIds
    })

    project.save().then(result => {
        console.log(result)
        res.status(201).json({
            message: 'Created project Successfully',
            createdProject: {
                name: result.name,
                description: result.description,
                _id: result._id,
                userId: result.userId,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/projects/' + result._id
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

exports.projects_get_project = (req, res, next) => {
    const id = req.params.projectId
    Project.findById(id).select('name description location company seniority _id userIds ').exec().then(doc => {
        console.log(doc)
        
        if(doc) {
            res.status(200).json({
                project: doc,
                request: {
                    type: 'GET',
                    description: 'Get all projects',
                    url: 'http://localhost:3000/projects'
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

exports.projects_update_project = (req, res, next) => {

        if(req.body.userInfo) {
            Project.update({ _id: req.params.projectId }, { $push: { userIds: req.body.userInfo }}).exec().then(result => {
                // console.log(req.body)
                res.status(200).json({
                    message: 'Project updated',
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/projects/' + req.params.projectId
                    }
                })
            }).catch(err => {
                console.log(err)
                res.status(500).json({
                    error: err
                })
            })
        } else {

            Project.update({ _id: req.params.projectId }, req.body).exec().then(result => {
                // console.log(req.body)
                res.status(200).json({
                    message: 'Project updated',
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/projects/' + req.params.projectId
                    }
                })
            }).catch(err => {
                console.log(err)
                res.status(500).json({
                    error: err
                })
            })
        }
    
}

exports.projects_delete_project = (req, res, next) => {
    
    Project.remove({ _id: req.params.projectId }).exec().then(result => {
        res.status(200).json({
            message: 'Project deleted'
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
}