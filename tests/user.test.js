const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../api/models/user');
const keys = require('../config/keys')

const userOneId = new mongoose.Types.ObjectId()

const userOne = {
    _id: userOneId,
    name: 'Homero Simpson',
    email: 'homero@gmail.com',
    password: 'homero!!!',
    tokens: [{
        token: jwt.sign( {_id: userOneId}, keys.JWT_KEY)
    }]
}

beforeEach(async () => {
    await User.deleteMany()
    await request(app).post('/user/signup').send(userOne)
})

test('Should signup a new user', async () => {
    const response = await request(app).post('/user/signup').send({
        name: 'Director Skinner',
        email: 'skinner@gmail.com',
        password: 'skinner123'
    }).expect(201)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body.user.name).toBe('Director Skinner')

    expect(response.body).toMatchObject({
        user: {
            name: 'Director Skinner',
            email: 'skinner@gmail.com'
        }
    })

    expect(user.password).not.toBe('skinner123')
})

test('Should login an existing user', async () => {
    const response = await request(app).post('/user/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
})

test('Should not login when wrong credentials', async () => {
    await request(app).post('/user/login').send({
        email: 'wrong@gmail.com',
        password: userOne.password
    }).expect(401)
})

test('Should be able to fetch jobs', async () => {
    await request(app)
        .get(`/projects/${userOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})


// test('Should be able to create project', async () => {
//     await request(app)
//         .post('/projects')
//         .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//         .send()
//         .expect(200)
// })
