import express from 'express';
import exphbs from 'express-handlebars';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import api from './api/api';
import redirect from './routes/redirect';
import homepage from './routes/homepage';
import errorMiddleware from './middleware/errorMiddleware';
import notFoundMiddleware from './middleware/notFoundMiddleware';
import loggerMiddleware from './middleware/loggerMiddleware';
import adminbro from './adminpanel/adminbro';

const startServer = async () => {
    dotenv.config();

    if (process.env.NODE_ENV === 'production') {
        console.log(`[server]: Server is running in production`);
    } else {
        console.log(`[server]: Server is running in development`);

    }

    let mongooseConnection;
    try {
        console.log('[server]: Connecting to MongoDB...');
        // connect to MongoDB
        mongooseConnection = await mongoose.connect(`${process.env.MONGO_URL}`, {
            useCreateIndex: true,
            useFindAndModify: false,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('[server]: Connected to MongoDB');

    } catch (err) {
        console.log(`[server]: Could not connect to MongoDB: ${err}`);
        process.exit(1);
    }

    // set up expressJS
    const app = express();

    // set handlebars as rendering engine
    app.set('views', path.join(__dirname, '..', 'resources', 'views'));
    app.engine('handlebars', exphbs());
    app.set('view engine', 'handlebars');

    // use logger
    app.use(loggerMiddleware);

    // admin bro admin panel
    app.use('/admin', adminbro(mongooseConnection));

    app.use('/api', api);

    app.use('/objects', redirect);
    app.use('/', homepage);

    // error handling
    app.use(notFoundMiddleware);
    app.use(errorMiddleware);

    const PORT = process.env.PORT || 8000;

    app.listen(PORT, () => {
        console.log(`[server]: Server is listening at https://localhost:${PORT}`);
    });
};

startServer();
