const mongoose = require('mongoose');

const URI = "mongodb://makoviichuktetiana_db_user:jBioudVc0HYrAvbp@ac-zxechpx-shard-00-00.snipz5n.mongodb.net:27017,ac-zxechpx-shard-00-01.snipz5n.mongodb.net:27017,ac-zxechpx-shard-00-02.snipz5n.mongodb.net:27017/carrental?ssl=true&replicaSet=atlas-199f8u-shard-0&authSource=admin&appName=Cluster0";

const connectDB = async () => {
    try {
        await mongoose.connect(URI);
        console.log(' Успішно підключено до MongoDB Atlas!');
    } catch (err) {
        console.error(' Помилка підключення до MongoDB:', err);
        process.exit(1);
    }
};

module.exports = connectDB;