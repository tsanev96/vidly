const { Genre } = require('../../../models/genre');
const { User } = require('../../../models/user');
const request = require('supertest');
const mongoose = require('mongoose');

describe('/api/genres', () => {
    let server;

    beforeEach(() => { server = require('../../../index') });
    afterEach(async () => {
        await Genre.remove({});
        server.close();
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' }
            ]);

            const res = await request(server).get('/api/genres');

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return the genre if valid id is passed', async () => {
            const genre = new Genre({ name: 'genre1' });
            await genre.save();

            const res = await request(server).get(`/api/genres/${genre._id}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });

        it('should return 404 if genre does not exist', async () => {
            const res = await request(server).get('/api/genres/1');

            expect(res.status).toBe(404);
        });

        it('should return 404 if valid id is passed but genre is not found', async () => {
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get(`/api/genres/${id}`);

            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {
        // Define (exec) the happy path, and then in each test,
        // we change one parameter that clearly aligns with the name of 
        // the test.
        let token;
        let name;

        const exec = () => {
            return request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name });
        };

        beforeEach(() => {
            // for 200 status, success
            token = new User().generateAuthToken();
            name = 'genre1';
        });

        it('should return 401 if user is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less than 5 char', async () => {
            name = '1234';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is more than 50 char', async () => {
            name = new Array(52).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should save the genre in the database if its valid', async () => {
            await exec();

            const genre = await Genre.find({ name: 'genre1' });

            expect(genre).not.toBeNull();
        });

        it('should return the genre if its valid', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name');
        });
    });

    describe('PUT /id', () => {
        let genre;
        let token;
        let updatedName;
        let id;

        beforeEach(async () => {
            genre = new Genre({ name: 'genre1' });
            await genre.save();

            token = new User().generateAuthToken();
            id = genre._id;
            updatedName = 'genre updated';
        });

        const exec = () => {
            return request(server)
                .put(`/api/genres/${id}`)
                .set('x-auth-token', token)
                .send({ name: updatedName });
        }

        it('should return 401 if user is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less than 5 char', async () => {
            updatedName = '1234';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is more than 50 char', async () => {
            updatedName = new Array(52).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 404 if genre is not found', async () => {
            id = mongoose.Types.ObjectId();

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if genre is with invalid id', async () => {
            id = 1;

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should update the genre if its valid', async () => {
            await exec();

            const updatedGenre = await Genre.findByIdAndUpdate(genre._id);

            expect(updatedGenre.name).toBe(updatedName);
        });

        it('should return the updated genre if its valid', async () => {
            const res = await exec();

            // no need to save the genre since its only sent to the user
            expect(res.body).toHaveProperty('_id', genre._id.toHexString());
            expect(res.body).toHaveProperty('name', updatedName);
        });
    });

    describe('DELETE /id', () => {
        let genre;
        let token;
        let id;

        beforeEach(async () => {
            genre = new Genre({ name: 'genre1' });
            await genre.save();

            id = genre._id;
            token = new User({ isAdmin: true }).generateAuthToken();
        });

        const exec = () => {
            return request(server)
                .delete(`/api/genres/${id}`)
                .set('x-auth-token', token)
                .send(genre);
        }

        it('it should return 401 if user is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 404 if id is invalid', async () => {
            id = 1;

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if genre is not found', async () => {
            id = mongoose.Types.ObjectId();

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 403 if user is not admin', async () => {
            token = new User({ isAdmin: false }).generateAuthToken();

            const res = await exec();

            expect(res.status).toBe(403);
        });

        it('should delete the genre if id is valid', async () => {
            await exec();

            const genreFound = await Genre.findById(genre._id);

            expect(genreFound).toBeNull();
        });

        it('should return the removed genre', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id', genre._id.toHexString());
            expect(res.body).toHaveProperty('name', genre.name);
        });
    });
});


// test suite