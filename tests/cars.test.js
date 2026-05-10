const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

require('dotenv').config();

// Закриваємо з'єднання після тестів, щоб Jest міг завершити роботу
afterAll(async () => {
    await mongoose.connection.close();
});

describe('Cars API Integration Tests', () => {
    
    // Тест на отримання всіх машин
    describe('GET /api/cars', () => {
        it('should return all cars', async () => {
            const res = await request(app).get('/api/cars');
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    // Тест на створення машини
    describe('POST /api/cars', () => {
        it('should add a new car', async () => {
            const res = await request(app).post('/api/cars').send({
                Brand: 'TestBrand',
                Model: 'TestModel',
                Year: 2024,
                Type: 'Sedan',
                BaseRentalPrice: 1500
            });
            expect(res.statusCode).toBe(201);
            expect(res.body.Brand).toBe('TestBrand');
        });

        it('should return 400 if data is missing', async () => {
            const res = await request(app).post('/api/cars').send({ Brand: 'OnlyBrand' });
            expect(res.statusCode).toBe(400);
        });
    });

    // Тест на отримання за ID та видалення
    describe('Operations with specific ID', () => {
        let carId;

        
        beforeAll(async () => {
            const res = await request(app).post('/api/cars').send({
                Brand: 'Temporary',
                Model: 'ForDelete',
                Year: 2024,
                Type: 'SUV',
                BaseRentalPrice: 2000
            });
            carId = res.body._id;
        });

        it('should return a car by ID', async () => {
            const res = await request(app).get(`/api/cars/${carId}`);
            expect(res.statusCode).toBe(200);
            expect(res.body._id).toBe(carId);
        });

        it('should return 404 for non-existent ID', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app).get(`/api/cars/${fakeId}`);
            expect(res.statusCode).toBe(404);
        });

        it('should delete the car', async () => {
            const res = await request(app).delete(`/api/cars/${carId}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Автомобіль успішно видалено");
        });

        it('should return 404 when deleting already deleted car', async () => {
            const res = await request(app).delete(`/api/cars/${carId}`);
            expect(res.statusCode).toBe(404);
        });
    });
});