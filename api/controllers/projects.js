const mongoose = require('mongoose');

const Project = require('../models/project');

const PROJECT_STATUS = [
    {
        prop: 'Open',
        status: true,
        color: '#27ae60'
    },
    {
        prop: 'Closed',
        status: false,
        color: '#e74c3c'
    }
]

exports.projects_get_all = (req, res, next) => {
    
    Project.find({ userIds: {$elemMatch: {_id: req.params.userId } }}).select('name description company _id userIds projectStatus location').exec().then(docs => {
        const response = {
            count: docs.length,
            projects: docs.map(doc => {
                    return {
                        name: doc.name,
                        description: doc.description,
                        company: doc.company,
                        projectStatus: doc.projectStatus,
                        _id: doc._id,
                        userIds: doc.userIds,
                        location: doc.location,
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

exports.projects_create_project = (req, res, next) => {

    const projectStatus = PROJECT_STATUS

    const project = new Project({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description,
        location: req.body.location,
        seniority: req.body.seniority,
        company: req.body.company,
        userIds: req.body.userIds,
        projectStatus: projectStatus
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
                projectStatus: result.projectStatus,
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

exports.projects_get_project = (req, res, next) => {
    const id = req.params.projectId
    Project.findById(id).select('name description location company seniority _id userIds projectStatus').exec().then(doc => {
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

exports.projects_update_project = (req, res, next) => {

        if(req.body.status) {

            const projectStatus = PROJECT_STATUS.map(el => {
                if(el.prop === req.body.status) { 
                    return { ...el, status: true}
                } else if (el.status === true) {
                    return { ...el, status: false}
                } else {
                    return el
                }
            })

            Project.update({ _id: req.params.projectId }, {$set: {projectStatus: projectStatus}}).exec().then(result => {
                // console.log(req.body)
                res.status(200).json({
                    message: 'Project updated',
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3002/projects/' + req.params.projectId
                    }
                })
            }).catch(err => {
                console.log(err)
                res.status(500).json({
                    error: err
                })
            })
        }

        if(req.body.userInfo) {

            Project.find({ _id: req.params.projectId }).exec().then(result => {
                return result[0].userIds.find(el => {
                    return el.name === req.body.userInfo.name
                })
            }).then((check) => {
                if(!check) {
                    Project.update({ _id: req.params.projectId }, { $push: { userIds: req.body.userInfo }}).exec().then(result => {
                        // console.log(req.body)
                        res.status(200).json({
                            message: 'Project updated',
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3002/projects/' + req.params.projectId
                            }
                        })
                    }).catch(err => {
                        console.log(err)
                        res.status(500).json({
                            error: err
                        })
                    })
                } else {
                    console.log('COLLEAGUE EXIST!!!!!!!!!!')
                }

            })
            
        } else {

            Project.update({ _id: req.params.projectId }, req.body).exec().then(result => {
                // console.log(req.body)
                res.status(200).json({
                    message: 'Project updated',
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3002/projects/' + req.params.projectId
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