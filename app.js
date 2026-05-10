const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const carRoutes = require('./routes/cars');

require('dotenv').config();

const app = express();

// Міддлвар для парсингу JSON
app.use(express.json());

// Підключення до бази даних MongoDB Atlas
connectDB();

// Налаштування Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Car Rental API (Lab 4 - MongoDB)',
            version: '1.0.0',
            description: 'Документація для API оренди авто з використанням MongoDB Atlas',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Локальний сервер'
            }
        ],
        paths: {
            '/api/cars': {
                get: {
                    summary: 'Отримати всі автомобілі',
                    tags: ['Cars'],
                    responses: {
                        '200': { 
                            description: 'Список автомобілів отримано успішно',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/Car' }
                                    }
                                }
                            }
                        }
                    }
                },
                post: {
                    summary: 'Створити новий автомобіль',
                    tags: ['Cars'],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Car' }
                            }
                        }
                    },
                    responses: {
                        '201': { description: 'Автомобіль успішно створено' },
                        '400': { description: 'Помилка валідації даних' }
                    }
                }
            },
            '/api/cars/{id}': {
                get: {
                    summary: 'Отримати автомобіль за ID',
                    tags: ['Cars'],
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            description: 'Унікальний ID автомобіля в MongoDB',
                            schema: { type: 'string' }
                        }
                    ],
                    responses: {
                        '200': { description: 'Інформацію отримано успішно' },
                        '404': { description: 'Автомобіль не знайдено' }
                    }
                },
                delete: {
                    summary: 'Видалити автомобіль за ID',
                    tags: ['Cars'],
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'string' }
                        }
                    ],
                    responses: {
                        '200': { description: 'Автомобіль успішно видалено' },
                        '404': { description: 'Автомобіль не знайдено' }
                    }
                }
            }
        },
        components: {
            schemas: {
                Car: {
                    type: 'object',
                    properties: {
                        Brand: { type: 'string', example: 'Toyota' },
                        Model: { type: 'string', example: 'Camry' },
                        Year: { type: 'string', example: '2023' },
                        Type: { type: 'string', example: 'Sedan' },
                        BaseRentalPrice: { type: 'string', example: '1200' }
                    }
                }
            }
        }
    },
    apis: ['./routes/*.js'], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Налаштування статичних файлів (для перегляду через /view)
app.use(express.static(path.join(__dirname, 'public')));

// Маршрути API
app.use('/api/cars', carRoutes);

// Маршрут для візуального перегляду
app.get('/view', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


module.exports = app;