const request = require('supertest');
const app = require('../app');
const User = require('../api/models/user');

const userOne = {
    name: 'Homer Simpson',
    email: 'homer@gmail.com',
    password: 'homer!!!'
}

beforeEach(async () => {
    await User.deleteMany()
    await request(app).post('/user/signup').send(userOne)
})

test('Should signup a new user', async () => {
    await request(app).post('/user/signup').send({
        name: 'Chino',
        email: 'chino@gmail.com',
        password: 'chino123'
    }).expect(201)
})

test('Should login an existing user', async () => {
    await request(app).post('/user/login').send({
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
