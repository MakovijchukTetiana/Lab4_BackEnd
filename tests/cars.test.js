const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

require('dotenv').config();

// Закриваємо з'єднання після тестів, щоб Jest міг нормально завершити роботу
afterAll(async () => {
    await mongoose.connection.close();
});

describe('Cars API Integration Tests (Lab 4 Models)', () => {
    
    // 1. Тести для отримання всіх автомобілів
    describe('GET /api/cars', () => {
        it('should return all cars', async () => {
            const res = await request(app).get('/api/cars');
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    // 2. Тести для створення нового автомобіля
    describe('POST /api/cars', () => {
        it('should add a new car strictly matching the new schema', async () => {
            const res = await request(app).post('/api/cars').send({
                Brand: 'Toyota',
                Model: 'Camry',
                Year: 2024,
                BaseRentalPrice: 1500
            });
            expect(res.statusCode).toBe(201);
            expect(res.body.Brand).toBe('Toyota');
        });

        it('should return 400 if required data is missing', async () => {
            // Відправляємо тільки бренд, без інших обов'язкових полів
            const res = await request(app).post('/api/cars').send({ Brand: 'Ford' });
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBeDefined();
        });
    });

    // 3. Тести для операцій з конкретним ID (Пошук та Видалення)
    describe('Operations with specific ID', () => {
        let carId;

        // Створюємо тестову машину перед початком цих тестів
        beforeAll(async () => {
            const res = await request(app).post('/api/cars').send({
                Brand: 'Temporary',
                Model: 'ForDelete',
                Year: 2020,
                BaseRentalPrice: 2000
            });
            carId = res.body._id;
        });

        // --- Успішні сценарії ---
        it('should return a car by correct ID', async () => {
            const res = await request(app).get(`/api/cars/${carId}`);
            expect(res.statusCode).toBe(200);
            expect(res.body._id).toBe(carId);
        });

        it('should delete the car successfully', async () => {
            const res = await request(app).delete(`/api/cars/${carId}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Автомобіль успішно видалено");
        });

       
        it('should return 404 for a valid but non-existent ID', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app).get(`/api/cars/${fakeId}`);
            expect(res.statusCode).toBe(404);
        });

        it('should return 404 when deleting an already deleted car', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app).delete(`/api/cars/${fakeId}`);
            expect(res.statusCode).toBe(404);
        });

       
        it('should return 500 when GET request has invalid ID format', async () => {
            const invalidId = 'this_is_not_a_real_id';
            const res = await request(app).get(`/api/cars/${invalidId}`);
            expect(res.statusCode).toBe(500);
        });

        it('should return 500 when DELETE request has invalid ID format', async () => {
            const invalidId = 'this_is_not_a_real_id';
            const res = await request(app).delete(`/api/cars/${invalidId}`);
            expect(res.statusCode).toBe(500);
        });
    });
});