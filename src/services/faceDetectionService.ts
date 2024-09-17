import axios, { AxiosResponse } from "axios";
import FormData from "form-data";
import logger from "../utils/logger";

interface FaceDetectionResponse {
  results: Array<{
    entities: Array<{
      box: { l: number; t: number; w: number; h: number };
      landmarks?: {
        eyes: [number, number][];
        nose: [number, number][];
        mouth: [number, number][];
      };
    }>;
  }>;
}

export const detectFaces = async (imageUrl: string): Promise<boolean> => {
  try {
    const data = new FormData();
    data.append("url", imageUrl);

    const options = {
      method: "POST",
      url: "https://face-detection14.p.rapidapi.com/v1/results",
      params: { detection: "true", embeddings: "false" },
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY as string,
        "x-rapidapi-host": "face-detection14.p.rapidapi.com",
        ...data.getHeaders(),
      },
      data: data,
    };

    const response: AxiosResponse<any> = await axios.request(options);

    const faceDetectionResult = response.data.results[0];

    logger.debug("Face Detection Result:", faceDetectionResult);

    const hasFace =
      faceDetectionResult?.entities?.[0]?.objects?.[0]?.entities?.some(
        (entity: any) => {
          return entity.classes?.face >= 0.9;
        }
      );

    if (!hasFace) {
      logger.info("No face detected in the image.");
      return false;
    }

    logger.info("Face detected in the image.");
    return true;
  } catch (error: any) {
    logger.error("Error fetching face detection results", error.message);
    throw new Error("Error fetching face detection results: " + error.message);
  }
};
