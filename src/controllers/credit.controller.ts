import { Request, Response } from "express";
import { CreditModel, ICredit } from "../models/credit.schema";
import { detectFaces } from "../services/faceDetectionService";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { File as MulterFile } from "multer";

interface MulterRequest extends Request {
  files: {
    [fieldname: string]: MulterFile[];
  };
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dssuxyzhp",
  api_key: "984813711419818",
  api_secret: "Ob37IXKdu62s7-2l7Bws6Wn5wnk",
});

const upload = multer({ storage: multer.memoryStorage() });

// Controller for creating a new credit
export const createCredit = async (req: MulterRequest, res: Response) => {
  upload.fields([
    { name: "selfie", maxCount: 1 },
    { name: "documentoIdentidad", maxCount: 3 },
  ])(req, res, async (err: any) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Error uploading files", error: err.message });
    }

    try {
      const selfieFile = req.files?.["selfie"]?.[0];
      const idFiles = req.files?.["documentoIdentidad"];

      if (!selfieFile) {
        return res
          .status(400)
          .json({ message: "Selfie is required for face detection" });
      }

      // Upload the selfie image to Cloudinary
      const selfieUploadResult = await new Promise<string>(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "images/selfies" }, (error, result) => {
              if (error) reject(error);
              else resolve(result?.url as string);
            })
            .end(selfieFile.buffer);
        }
      );

      // Call the face detection function
      const isFaceDetected = await detectFaces(selfieUploadResult);

      if (!isFaceDetected) {
        return res
          .status(404)
          .json({ message: "No face detected in the uploaded selfie" });
      }

      // Upload the documentoIdentidad images to Cloudinary
      const documentoIdentidadPaths: string[] = [];

      if (idFiles && idFiles.length > 0) {
        for (const file of idFiles) {
          const idFileUploadResult = await new Promise<string>(
            (resolve, reject) => {
              cloudinary.uploader
                .upload_stream(
                  { folder: "credits/documents" },
                  (error, result) => {
                    if (error) reject(error);
                    else resolve(result?.url as string);
                  }
                )
                .end(file.buffer);
            }
          );

          documentoIdentidadPaths.push(idFileUploadResult);
        }
      }

      // Save the credit data to the database
      const creditData: ICredit = {
        ...req.body,
        selfiePath: selfieUploadResult,
        documentoIdentidadPath: documentoIdentidadPaths,
      };

      const newCredit = new CreditModel(creditData);
      await newCredit.save();

      res.status(201).json({
        message: "Credit created successfully",
        data: newCredit,
      });
    } catch (error) {
      console.error("Error creating credit", error);
      res.status(500).json({
        message: "Error creating credit",
        error: error.message,
      });
    }
  });
};

export const getCredits = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const credits = await CreditModel.find()
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.status(200).json(credits);
  } catch (error) {
    res.status(500).json({ message: "Error fetching credits", error });
  }
};

export const getCreditById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const credit = await CreditModel.findById(id);

    if (!credit) {
      return res.status(404).json({ message: "Credit not found" });
    }

    res.status(200).json(credit);
  } catch (error) {
    res.status(500).json({ message: "Error fetching credit", error });
  }
};

export const updateCredit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedCredit = await CreditModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedCredit) {
      return res.status(404).json({ message: "Credit not found" });
    }

    res
      .status(200)
      .json({ message: "Credit updated successfully", data: updatedCredit });
  } catch (error) {
    res.status(500).json({ message: "Error updating credit", error });
  }
};

export const deleteCredit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedCredit = await CreditModel.findByIdAndDelete(id);

    if (!deletedCredit) {
      return res.status(404).json({ message: "Credit not found" });
    }

    res.status(200).json({ message: "Credit deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting credit", error });
  }
};
