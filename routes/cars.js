const express = require('express');
const router = express.Router();

const { getAllCars, addCar, deleteCar, getCarById } = require('../controllers/cars.controller');

router.get('/', getAllCars); 
router.post('/', addCar);
router.get('/:id', getCarById);
router.delete('/:id', deleteCar);

module.exports = router;