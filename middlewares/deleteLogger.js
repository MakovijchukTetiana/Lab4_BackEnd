const Log = require('../models/log.model');

const deleteLogger = async (req, res, next) => {
    // Нам цікавий лише метод DELETE
    if (req.method === 'DELETE') {
        // Ми перехопимо дані у контролері, а цей middleware просто підготує грунт
        console.log('🗑️ Виявлено спробу видалення...');
    }
    next();
};

module.exports = deleteLogger;