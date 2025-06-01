import { ImageAnnotatorClient } from '@google-cloud/vision';
import { GeminiResponse } from '../types';

// Path to service account key file from environment variable
const keyFilePath = process.env.VITE_GOOGLE_CLOUD_CREDENTIALS_PATH;

// Initialize the client with credentials
let visionClient: ImageAnnotatorClient | null = null;

try {
  if (keyFilePath) {
    visionClient = new ImageAnnotatorClient({
      keyFilename: keyFilePath
    });
  } else {
    console.warn('Google Cloud Vision credentials path not set. Set VITE_GOOGLE_CLOUD_CREDENTIALS_PATH environment variable.');
  }
} catch (error) {
  console.error('Failed to initialize Google Vision client:', error);
}

export interface DetectedObject {
  name: string;
  score: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface TextDetectionResult {
  text: string;
  confidence: number;
}

/**
 * Detects objects in an image
 */
export const detectObjects = async (
  imageBase64: string
): Promise<GeminiResponse<DetectedObject[]>> => {
  if (!visionClient) {
    return {
      data: null,
      error: 'Google Vision client not initialized. Check credentials path.'
    };
  }

  try {
    // Remove data URL prefix if present
    const base64Image = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    
    // Call the Vision API
    const [result] = await visionClient.objectLocalization({
      image: { content: base64Image }
    });
    
    const objects = result.localizedObjectAnnotations || [];
    
    // Transform to our format
    const detectedObjects: DetectedObject[] = objects.map(obj => ({
      name: obj.name || 'Unknown',
      score: obj.score || 0,
      boundingBox: obj.boundingPoly?.normalizedVertices ? {
        x: obj.boundingPoly.normalizedVertices[0]?.x || 0,
        y: obj.boundingPoly.normalizedVertices[0]?.y || 0,
        width: (obj.boundingPoly.normalizedVertices[1]?.x || 0) - (obj.boundingPoly.normalizedVertices[0]?.x || 0),
        height: (obj.boundingPoly.normalizedVertices[2]?.y || 0) - (obj.boundingPoly.normalizedVertices[0]?.y || 0)
      } : undefined
    }));
    
    return { data: detectedObjects, error: null };
  } catch (error) {
    console.error('Error detecting objects:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return { data: null, error: errorMessage };
  }
};

/**
 * Extracts text from an image
 */
export const extractText = async (
  imageBase64: string
): Promise<GeminiResponse<TextDetectionResult>> => {
  if (!visionClient) {
    return {
      data: null,
      error: 'Google Vision client not initialized. Check credentials path.'
    };
  }

  try {
    // Remove data URL prefix if present
    const base64Image = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    
    // Call the Vision API
    const [result] = await visionClient.textDetection({
      image: { content: base64Image }
    });
    
    const detections = result.textAnnotations;
    
    if (!detections || detections.length === 0) {
      return { data: { text: '', confidence: 0 }, error: null };
    }
    
    // The first result contains the entire extracted text
    return {
      data: {
        text: detections[0].description || '',
        confidence: detections[0].confidence || 0
      },
      error: null
    };
  } catch (error) {
    console.error('Error extracting text:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return { data: null, error: errorMessage };
  }
};