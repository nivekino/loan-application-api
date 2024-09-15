import * as mongoose from 'mongoose';
import logger from './utils/logger';
import { config } from './config';

// Helper function to check if error is an instance of Error
const isError = (error: unknown): error is Error => error instanceof Error;

export async function connectToDatabase(retryAttempts: number = 5, initialRetryDelay: number = 5000): Promise<void> {
    const attemptConnection = async (attemptsLeft: number, retryDelay: number): Promise<void> => {
        try {
            await mongoose.connect(config.MONGODB_URI, {
                maxPoolSize: 10, // Consider adjusting based on your workload
                socketTimeoutMS: 20000,
                serverSelectionTimeoutMS: 5000 // Adjust server selection timeout
            });
            logger.info('Mongoose connected successfully');
        } catch (error: unknown) {
            if (attemptsLeft <= 0) {
                if (isError(error)) {
                    logger.error(`Mongoose connection error after final retry: ${error.message}`, error);
                } else {
                    logger.error(`Mongoose connection error after final retry: ${error}`);
                }
                throw error; // Rethrow after last attempt fails
            } else {
                if (isError(error)) {
                    logger.warn(`Mongoose connection attempt failed, retrying in ${retryDelay}ms... Attempts left: ${attemptsLeft}`, error);
                } else {
                    logger.warn(`Mongoose connection attempt failed, retrying in ${retryDelay}ms... Attempts left: ${attemptsLeft}`, { error });
                }
                await new Promise(resolve => setTimeout(resolve, retryDelay)); // Wait before retrying
                return attemptConnection(attemptsLeft - 1, retryDelay * 2); // Retry with exponential backoff
            }
        }
    };

    try {
        await attemptConnection(retryAttempts, initialRetryDelay);
    } catch (error: unknown) {
        // Handle or log the final error after retries have been exhausted
        if (isError(error)) {
            logger.error(`Unable to connect to Mongoose after retries: ${error.message}`, error);
        } else {
            logger.error(`Unable to connect to Mongoose after retries: ${error}`);
        }
        // Further error handling or rethrowing if necessary
        throw error;
    }
}
