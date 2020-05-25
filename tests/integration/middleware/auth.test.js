const request = require('supertest');
const { User } = require('../../../models/user');
const { Genre } = require('../../../models/genre');
let server;

describe('auth middleware', () => {
    beforeEach(() => { server = require('../../../index') });
    afterEach(async () => {
        await Genre.remove({});
        server.close();
    });

    let token;
    //
    //

    const exec = () => {
        return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: 'genre1' });
    }

    beforeEach(() => {
        token = new User().generateAuthToken();
    });

    it('should return 401 if token is not provided', async () => {
        // if we set token to null it will be converted to string and will get 400
        token = '';

        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if token is invalid', async () => {
        token = 'a';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 200 if token is valid', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    });

});