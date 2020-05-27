// rental
const { Rental } = require('../../../models/rental');
const { User } = require('../../../models/user');
const { Movie } = require('../../../models/movie');
const mongoose = require('mongoose');
const request = require('supertest');
const moment = require('moment');

const apiEndPoint = '/api/returns';

describe('/api/returns', () => {
    2
    let server;
    let rental;
    let customerId;
    let movieId;
    let token;
    let movie;

    // happy path - success
    const exec = () => {
        return request(server)
            .post(apiEndPoint)
            .set('x-auth-token', token)
            .send({ movieId, customerId });
    };

    beforeEach(async () => {
        server = require('../../../index');

        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        token = new User().generateAuthToken();

        movie = new Movie({
            _id: movieId,
            title: 'movie',
            dailyRentalRate: 1,
            genre: { name: 'genre' },
            numberInStock: 10
        });

        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: 'movie',
                dailyRentalRate: 1
            },
        });

        await rental.save();
    });

    afterEach(async () => {
        await Rental.remove({});
        await Movie.remove({});
        server.close();
    });

    it('should return 401 if user is not logged in', async () => {
        token = '';

        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if customerId is not provided', async () => {
        customerId = '';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 400 if movieId is not provided', async () => {
        movieId = '';
        // or delete paylod.movieId

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 404 if no rental is found for the customer/movie', async () => {
        await Rental.remove({});

        const res = await exec();

        expect(res.status).toBe(404);
    });

    it('should return 400 if rental already processed - return date is set', async () => {
        rental.dateReturned = new Date();
        await rental.save();

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 200 if we have a valid request', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    });

    it('should set the return date if input is valid', async () => {
        const res = await exec();

        const rentalInDb = await Rental.findOne(rental._id);

        // diff in ms - worst case scenario 10 sec
        const diff = new Date() - rentalInDb.dateReturned;

        expect(diff).toBeLessThan(10 * 1000);
        expect(res.status).toBe(200);
    });

    it('should set the rental fee - numberOfDays * dailyRentalRate', async () => {
        rental.dateOut = moment().add(-7, 'days') // 7 days diff
        await rental.save();

        const res = await exec();

        const rentalInDb = await Rental.findOne(rental._id);

        // dailyRentalRate is set to 1 and we have 7 days
        expect(rentalInDb.rentalFee).toBe(7);
        expect(res.status).toBe(200);
    });

    it('should increase the numberInStock by 1', async () => {
        const res = await exec();

        const movieInDb = await Movie.findOne(movieId);

        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
        expect(res.status).toBe(200);
    });

    it('should return the rental if input its valid', async () => {
        const res = await exec();

        // expect(res.body).toHaveProperty('dateOut');
        // expect(res.body).toHaveProperty('dateReturned');
        // expect(res.body).toHaveProperty('movie');
        // expect(res.body).toHaveProperty('customer');
        // expect(res.body).toHaveProperty('rentalFee');

        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['dateOut', 'dateReturned',
                'movie', 'customer', 'rentalFee']));
    });
});