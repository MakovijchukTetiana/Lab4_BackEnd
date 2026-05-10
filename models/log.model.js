const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    deletedData: { type: Object, required: true },
    deletedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', logSchema);