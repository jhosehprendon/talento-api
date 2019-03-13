const mongoose = require('mongoose');

const Candidate = require('../models/candidate');

const CANDIDATE_STATUS = [
    {
        prop: 'Interviewing',
        status: true,
        color: '#9b59b6'
    },
    {
        prop: 'Evaluating',
        status: false,
        color: '#3498db'
    },
    {
        prop: 'Analyzing',
        status: false,
        color: '#e67e22'
    },
    {
        prop: 'Sent offer',
        status: false,
        color: '#f1c40f'
    },
    {
        prop: 'Hired',
        status: false,
        color: '#2ecc71'
    },
    {
        prop: 'Rejected',
        status: false,
        color: '#e74c3c'
    }
]

exports.candidates_get_all = (req, res, next) => {
    
    Candidate.find({ projectId: req.params.projectId }).select('name email _id userId candidateStatus').exec().then(docs => {
        const response = {
            count: docs.length,
            candidates: docs.map(doc => {
                    return {
                        name: doc.name,
                        email: doc.email,
                        _id: doc._id,
                        userId: doc.userId,
                        candidateStatus: doc.candidateStatus,
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

    if(req.body.length > 1) {
        const updateOps = {}
        for(const ops of req.body ) {
            updateOps[ops.propName] = ops.value
        }
    
        var data = updateOps
    } else {
        var data = {...req.body, candidateCV: req.file.path}

    }

    const candidateStatus = CANDIDATE_STATUS

    const candidate = new Candidate({
        ...data,
        _id: new mongoose.Types.ObjectId(),
        tasks: req.body.tasks,
        candidateStatus: candidateStatus
    })

    candidate.save().then(result => {
        console.log(result)
        res.status(201).json({
            message: 'Created candidate Successfully',
            createdCandidate: {
                name: result.name,
                email: result.email,
                summary: result.summary,
                linkedin: result.linkedin,
                _id: result._id,
                userId: result.userId,
                candidateStatus: result.candidateStatus,
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
    Candidate.findById(id).select('name email _id tasks candidateCV candidateStatus summary linkedin').exec().then(doc => {        
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

    if(req.body.tasks) {

        Candidate.update({ _id: req.params.candidateId }, { $push: { tasks: req.body }}).exec().then(result => {
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
    } else {
       
        if(req.body.length > 1) {
            const updateOps = {}
            for(const ops of req.body ) {
                updateOps[ops.propName] = ops.value
            }
        
            var data = { $set: updateOps }
        } else {
            var data = {...req.body, candidateCV: req.file.path}
    
        }

        
        Candidate.update({ _id: req.params.candidateId }, data).exec().then(result => {
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
}

exports.candidates_update_task_candidate = (req, res, next) => {

    Candidate.update({ _id: req.params.candidateId }, { $push: { tasks: req.body }}).exec().then(result => {
        console.log(req.body)
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

// TASK STATUS

exports.candidates_update_task_status = (req, res, next) => {
    const taskId = req.params.taskId
    var el = "tasks." + taskId + ".completed"
    var obj = {}
    obj[el] = req.body

    Candidate.update({ _id: req.params.candidateId }, { $set: obj }).exec().then(result => {
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

// CANDIDATE STATUS

exports.candidates_update_candidate_status = (req, res, next) => {

    var candidateStatus = CANDIDATE_STATUS.map(el => {
        if(el.prop === req.body.value) {
            return { ...el, status: true}
        } else if (el.status === true) {
            return { ...el, status: false }
        } else {
            return el
        }
    })

    Candidate.update({ _id: req.params.candidateId }, { $set: {candidateStatus: candidateStatus}  }).exec().then(result => {
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


//NOTES

exports.candidates_update_note = (req, res, next) => {
    const taskId = req.params.taskId
    var el = "tasks." + taskId + ".notes"
    var obj = {}
    obj[el] = req.body
    Candidate.update({ _id: req.params.candidateId }, { $push: obj }).exec().then(result => {
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

exports.candidates_get_cv_candidate = (req, res, next) => {
    console.log(req.params.filePath)
    // res.download('http://localhost:3002/../../uploads/' + req.params.filePath)
    res.download('https://softhunt-api.herokuapp.com/../../uploads/' + req.params.filePath)
}

