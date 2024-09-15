"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCredit = exports.updateCredit = exports.getCreditById = exports.getCredits = exports.loginUsers = exports.createUser = exports.createCredit = void 0;
const tslib_1 = require("tslib");
const credit_schema_1 = require("../models/credit.schema");
const user_schema_1 = require("../models/user.schema");
const multer_1 = tslib_1.__importDefault(require("multer"));
const path_1 = tslib_1.__importDefault(require("path"));
const axios_1 = tslib_1.__importDefault(require("axios"));
const form_data_1 = tslib_1.__importDefault(require("form-data"));
const { Storage } = require("@google-cloud/storage");
// Initialize Google Cloud Storage
const bucketName = "bucket-nivekino";
const gcs = new Storage({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
const bucket = gcs.bucket(bucketName);
// Configure Multer storage
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images'); // Save files to 'images' folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
// Multer middleware for handling image upload
const upload = (0, multer_1.default)({ storage: storage }).single('image');
// Function to call the face detection API
const detectFaces = async (imageUrl) => {
    try {
        const data = new form_data_1.default();
        data.append('url', imageUrl);
        const options = {
            method: 'POST',
            url: 'https://face-detection14.p.rapidapi.com/v1/results',
            params: {
                detection: 'true',
                embeddings: 'false'
            },
            headers: Object.assign({ 'x-rapidapi-key': '8997096dbcmshb82895cdc27be57p1b26ddjsn90231e4018af', 'x-rapidapi-host': 'face-detection14.p.rapidapi.com' }, data.getHeaders()),
            data: data
        };
        const response = await axios_1.default.request(options);
        return response.data;
    }
    catch (error) {
        throw new Error('Error fetching face detection results: ' + error.message);
    }
};
const uploadImageToGCS = async (imageFile) => {
    if (!imageFile) {
        return null;
    }
    const { originalname, buffer } = imageFile;
    const gcsFileName = `${Date.now()}-${originalname}`;
    const file = bucket.file(gcsFileName);
    const stream = file.createWriteStream({
        metadata: {
            contentType: imageFile.mimetype,
        },
    });
    return new Promise((resolve, reject) => {
        stream.on("error", (error) => reject(error));
        stream.on("finish", () => resolve(`https://storage.googleapis.com/${bucketName}/${gcsFileName}`));
        stream.end(buffer);
    });
};
// Create a new credit entry
const createCredit = async (req, res) => {
    try {
        const creditData = req.body; // Get data from the request body
        const newCredit = new credit_schema_1.CreditModel(creditData);
        await newCredit.save(); // Save to the database
        res.status(201).json({ message: 'Credit created successfully', data: newCredit });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating credit', error });
    }
};
exports.createCredit = createCredit;
const createUser = async (req, res) => {
    try {
        const userData = req.body; // Get data from the request body
        const newUser = new user_schema_1.UserModel(userData);
        await newUser.save(); // Save to the database
        res.status(201).json({ message: 'User created successfully', data: newUser });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
};
exports.createUser = createUser;
const loginUsers = async (req, res) => {
    try {
        const { correoElectronico, password } = req.body;
        const user = await user_schema_1.UserModel.findOne({ correoElectronico, password });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
};
exports.loginUsers = loginUsers;
// Get all credit entries
const getCredits = async (req, res) => {
    try {
        const credits = await credit_schema_1.CreditModel.find(); // Retrieve all credits
        res.status(200).json(credits);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching credits', error });
    }
};
exports.getCredits = getCredits;
// Get a single credit entry by ID
const getCreditById = async (req, res) => {
    try {
        const { id } = req.params; // Get ID from the URL params
        const credit = await credit_schema_1.CreditModel.findById(id); // Find by ID
        if (!credit) {
            return res.status(404).json({ message: 'Credit not found' });
        }
        res.status(200).json(credit);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching credit', error });
    }
};
exports.getCreditById = getCreditById;
// Update a credit entry by ID
const updateCredit = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body; // Get the updated data from the request body
        const updatedCredit = await credit_schema_1.CreditModel.findByIdAndUpdate(id, updatedData, { new: true }); // Update and return the new document
        if (!updatedCredit) {
            return res.status(404).json({ message: 'Credit not found' });
        }
        res.status(200).json({ message: 'Credit updated successfully', data: updatedCredit });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating credit', error });
    }
};
exports.updateCredit = updateCredit;
// Delete a credit entry by ID
const deleteCredit = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCredit = await credit_schema_1.CreditModel.findByIdAndDelete(id); // Find by ID and delete
        if (!deletedCredit) {
            return res.status(404).json({ message: 'Credit not found' });
        }
        res.status(200).json({ message: 'Credit deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting credit', error });
    }
};
exports.deleteCredit = deleteCredit;
//# sourceMappingURL=credit.controller.js.map