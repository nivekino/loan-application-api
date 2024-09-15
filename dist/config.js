"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const tslib_1 = require("tslib");
const dotenv = tslib_1.__importStar(require("dotenv"));
dotenv.config();
const config = {
    MONGO_ATLAS_USER: process.env.MONGO_ATLAS_USER || '',
    MONGO_ATLAS_PASS: process.env.MONGO_ATLAS_PASS || '',
    MONGO_ATLAS_CLUSTER: process.env.MONGO_ATLAS_CLUSTER || '',
    MONGO_ATLAS_DB: process.env.MONGO_ATLAS_DB || '',
    MONGODB_URI: '', // Initialize as an empty string
    // JWT
    JWT_SECRETS: process.env.JWT_SECRETS || '',
    // Sentry
    SENTRY_DSN: process.env.SENTRY_DSN || '',
    SENTRY_RELEASE: process.env.SENTRY_RELEASE || '',
};
exports.config = config;
// Construct the MongoDB URI
config.MONGODB_URI = `mongodb+srv://${config.MONGO_ATLAS_USER}:${config.MONGO_ATLAS_PASS}@${config.MONGO_ATLAS_CLUSTER}/${config.MONGO_ATLAS_DB}?retryWrites=true&w=majority`;
//# sourceMappingURL=config.js.map