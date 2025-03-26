const mongoose = require('mongoose');

require('dotenv').config();

const connectToDatabase = async () => {
    try { 
        const dbURI = process.env.DB_URI;
        if (!dbURI) {
            throw new Error('Database URI is not defined in .env file');
        }

        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to the database successfully');
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectToDatabase;