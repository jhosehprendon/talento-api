const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

const User = require('../models/user');

exports.user_signup = (req, res, next) => {
    User.find({ email: req.body.email }).exec().then(user => {
        if(user.length >= 1) {
            res.status(409).json({
                message: 'Email already taken'
            })   
            
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    res.status(500).json({
                        error: err
                    })
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        name: req.body.name,
                        email: req.body.email,
                        password: hash
                    })
                    user.save().then(result => {
                        // console.log(result);
                        res.status(201).json({
                            message: 'User created',
                            user: user
                        })
                    }).catch(err => {
                        res.status(500).json({
                            error: err
                        })
                    })
                }
            })
        }
    })
}

exports.user_login = (req, res, next) => {
    User.find({ email: req.body.email }).exec().then(user => {
        console.log(user)
        if(user.length < 1) {
            return res.status(401).json({
                message: 'Auth failed'
            })
        }

        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err) {
                return res.status(401).json({
                    message: 'Auth failed'
                })
            }

            if(result) {
                const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                }, keys.JWT_KEY, { expiresIn: "1h" })
                return res.status(200).json({
                    message: 'Auth successful',
                    token: token,
                    userId: user[0]._id
                })
            }

            return res.status(401).json({
                message: 'Auth failed'
            })

        })
    })
}

exports.user_delete = (req, res, next) => {
    User.remove({ _id: req.params.userId }).exec().then(result => {
        res.status(200).json({
            message: 'User deleted'
        })
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    })
}



exports.user_get_by_email = (req, res, next) => {
    User.find({ email: req.params.email }).select('email _id name').exec().then(user => {
        console.log(user)

        if(user) {
            res.status(200).json({
                user: user,
                request: {
                    type: 'GET',
                    description: 'Get all candidates',
                    url: 'http://localhost:3002/candidates'
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

exports.user_get_by_userId = (req, res, next) => {
    User.find({ _id: req.params.userId }).select('email _id name').exec().then(user => {
        console.log(user)

        if(user) {
            res.status(200).json({
                user: user,
                request: {
                    type: 'GET',
                    description: 'Get all candidates',
                    url: 'http://localhost:3002/candidates'
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

exports.user_update = (req, res, next) => {

    // if(req.body.tasks) {

    //     User.update({ _id: req.params.candidateId }, { $push: { tasks: req.body }}).exec().then(result => {
    //         // console.log(req.body)
    //         res.status(200).json({
    //             message: 'Candidate updated',
    //             request: {
    //                 type: 'GET',
    //                 url: 'http://localhost:3000/candidates/' + req.params.candidateId
    //             }
    //         })
    //     }).catch(err => {
    //         console.log(err)
    //         res.status(500).json({
    //             error: err
    //         })
    //     })
    // } else {
       
    //     if(req.body.length > 1) {
    //         const updateOps = {}
    //         for(const ops of req.body ) {
    //             updateOps[ops.propName] = ops.value
    //         }
        
    //         var data = { $set: updateOps }
    //     } else {
    //         var data = {...req.body, candidateCV: req.file.path}
    
    //     }

        
    User.update({ _id: req.params.userId }, req.body).exec().then(result => {
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