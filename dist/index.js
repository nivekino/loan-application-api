"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const morgan_1 = tslib_1.__importDefault(require("morgan"));
const helmet_1 = tslib_1.__importDefault(require("helmet"));
const body_parser_1 = require("body-parser");
const credit_routes_1 = tslib_1.__importDefault(require("./routes/credit.routes"));
const logger_1 = tslib_1.__importDefault(require("./utils/logger"));
const database_1 = require("./database");
try {
    logger_1.default.info('Server is up and running');
    // Connect to the database
    (0, database_1.connectToDatabase)();
    const app = (0, express_1.default)();
    const port = process.env.PORT || 3000;
    // Middleware setup
    app.use((0, helmet_1.default)()); // Security middleware
    app.use((0, morgan_1.default)('dev')); // Logging middleware
    app.use((0, body_parser_1.json)()); // Body parser middleware
    // Routes
    app.get("/", (req, res) => {
        res.status(200).json({ msg: "Server is up and running" });
    });
    app.use('/api', credit_routes_1.default); // Register the credit routes under '/api'
    // Start server
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}
catch (error) {
    logger_1.default.error(`Error starting the server: ${error}`);
    process.exit(1);
}
//# sourceMappingURL=index.js.map