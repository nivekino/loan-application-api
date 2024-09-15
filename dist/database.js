"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = connectToDatabase;
const tslib_1 = require("tslib");
const mongoose = tslib_1.__importStar(require("mongoose"));
const logger_1 = tslib_1.__importDefault(require("./utils/logger"));
const config_1 = require("./config");
// Helper function to check if error is an instance of Error
const isError = (error) => error instanceof Error;
async function connectToDatabase(retryAttempts = 5, initialRetryDelay = 5000) {
    const attemptConnection = async (attemptsLeft, retryDelay) => {
        try {
            await mongoose.connect(config_1.config.MONGODB_URI, {
                maxPoolSize: 10, // Consider adjusting based on your workload
                socketTimeoutMS: 20000,
                serverSelectionTimeoutMS: 5000 // Adjust server selection timeout
            });
            logger_1.default.info('Mongoose connected successfully');
        }
        catch (error) {
            if (attemptsLeft <= 0) {
                if (isError(error)) {
                    logger_1.default.error(`Mongoose connection error after final retry: ${error.message}`, error);
                }
                else {
                    logger_1.default.error(`Mongoose connection error after final retry: ${error}`);
                }
                throw error; // Rethrow after last attempt fails
            }
            else {
                if (isError(error)) {
                    logger_1.default.warn(`Mongoose connection attempt failed, retrying in ${retryDelay}ms... Attempts left: ${attemptsLeft}`, error);
                }
                else {
                    logger_1.default.warn(`Mongoose connection attempt failed, retrying in ${retryDelay}ms... Attempts left: ${attemptsLeft}`, { error });
                }
                await new Promise(resolve => setTimeout(resolve, retryDelay)); // Wait before retrying
                return attemptConnection(attemptsLeft - 1, retryDelay * 2); // Retry with exponential backoff
            }
        }
    };
    try {
        await attemptConnection(retryAttempts, initialRetryDelay);
    }
    catch (error) {
        // Handle or log the final error after retries have been exhausted
        if (isError(error)) {
            logger_1.default.error(`Unable to connect to Mongoose after retries: ${error.message}`, error);
        }
        else {
            logger_1.default.error(`Unable to connect to Mongoose after retries: ${error}`);
        }
        // Further error handling or rethrowing if necessary
        throw error;
    }
}
//# sourceMappingURL=database.js.map