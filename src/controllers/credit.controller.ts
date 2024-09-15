import { Request, Response } from 'express';
import { CreditModel } from '../models/credit.schema';
import { UserModel } from '../models/user.schema';
import multer from 'multer';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
const { Storage } = require("@google-cloud/storage");

// Initialize Google Cloud Storage
const bucketName = "bucket-nivekino";
const gcs = new Storage({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
const bucket = gcs.bucket(bucketName);

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images'); // Save files to 'images' folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Multer middleware for handling image upload
const upload = multer({ storage: storage }).single('image');

// Function to call the face detection API
const detectFaces = async (imageUrl: string) => {
    try {
        const data = new FormData();
        data.append('url', imageUrl);

        const options = {
            method: 'POST',
            url: 'https://face-detection14.p.rapidapi.com/v1/results',
            params: {
                detection: 'true',
                embeddings: 'false'
            },
            headers: {
                'x-rapidapi-key': '8997096dbcmshb82895cdc27be57p1b26ddjsn90231e4018af',
                'x-rapidapi-host': 'face-detection14.p.rapidapi.com',
                ...data.getHeaders(),
            },
            data: data
        };

        const response = await axios.request(options);
        return response.data;
    } catch (error) {
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
        stream.on("finish", () =>
            resolve(`https://storage.googleapis.com/${bucketName}/${gcsFileName}`)
        );
        stream.end(buffer);
    });
};

// Create a new credit entry
export const createCredit = async (req: Request, res: Response) => {
    try {
        const creditData = req.body; // Get data from the request body
        const newCredit = new CreditModel(creditData);
        await newCredit.save(); // Save to the database
        res.status(201).json({ message: 'Credit created successfully', data: newCredit });
    } catch (error) {
        res.status(500).json({ message: 'Error creating credit', error });
    }
}

export const createUser = async (req: Request, res: Response) => {
    try {
        const userData = req.body; // Get data from the request body
        const newUser = new UserModel(userData);
        await newUser.save(); // Save to the database
        res.status(201).json({ message: 'User created successfully', data: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
}

export const loginUsers = async (req: Request, res: Response) => {
    try {
        const { correoElectronico, password } = req.body;
        const user = await UserModel.findOne({ correoElectronico, password });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
}

// Get all credit entries
export const getCredits = async (req: Request, res: Response) => {
    try {
        const credits = await CreditModel.find(); // Retrieve all credits
        res.status(200).json(credits);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching credits', error });
    }
};

// Get a single credit entry by ID
export const getCreditById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Get ID from the URL params
        const credit = await CreditModel.findById(id); // Find by ID
        if (!credit) {
            return res.status(404).json({ message: 'Credit not found' });
        }
        res.status(200).json(credit);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching credit', error });
    }
};

// Update a credit entry by ID
export const updateCredit = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedData = req.body; // Get the updated data from the request body
        const updatedCredit = await CreditModel.findByIdAndUpdate(id, updatedData, { new: true }); // Update and return the new document
        if (!updatedCredit) {
            return res.status(404).json({ message: 'Credit not found' });
        }
        res.status(200).json({ message: 'Credit updated successfully', data: updatedCredit });
    } catch (error) {
        res.status(500).json({ message: 'Error updating credit', error });
    }
};

// Delete a credit entry by ID
export const deleteCredit = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedCredit = await CreditModel.findByIdAndDelete(id); // Find by ID and delete
        if (!deletedCredit) {
            return res.status(404).json({ message: 'Credit not found' });
        }
        res.status(200).json({ message: 'Credit deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting credit', error });
    }
};
