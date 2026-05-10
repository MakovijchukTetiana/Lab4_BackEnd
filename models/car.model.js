const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    Brand: { type: String, required: true },
    Model: { type: String, required: true },
    Year: { type: Number, required: true },
    BaseRentalPrice: { type: Number, required: true }
});

const Car = mongoose.model('Car', carSchema);
module.exports = { Car };