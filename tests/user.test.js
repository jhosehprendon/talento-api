const request = require('supertest')
const app = require('../app')

test('should signup a new user', async () => {
    await request(app).post('/user/signup').send({
        name: 'Chino',
        email: 'chino@gmail.com',
        password: 'chino123'
    }).expect(201)
})
