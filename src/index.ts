import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import { json } from 'body-parser';
import creditRoutes from './routes/credit.routes';
import logger from './utils/logger';
import { connectToDatabase } from './database';
import { config } from './config';



try {
    logger.info('Server is up and running');
    // Connect to the database
    connectToDatabase();
    const app = express();
    const port = process.env.PORT || 3000;

    // Middleware setup
    app.use(helmet()); // Security middleware
    app.use(morgan('dev')); // Logging middleware
    app.use(json()); // Body parser middleware


    // Routes
    app.get("/", (req, res) => {
        res.status(200).json({ msg: "Server is up and running" });
    });
    app.use('/api', creditRoutes); // Register the credit routes under '/api'

    // Start server
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

} catch (error) {
    logger.error(`Error starting the server: ${error}`);
    process.exit(1);
}