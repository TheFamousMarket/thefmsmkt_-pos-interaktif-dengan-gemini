import React, { useState, useRef } from 'react';
import { detectObjects, extractText } from '@services/googleVisionService';
import KioskButton from '@components/common/KioskButton';
import Loader from '@components/common/Loader';

const GoogleVisionDemo: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [detectedObjects, setDetectedObjects] = useState<any[]>([]);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImagePreview(result);
      setDetectedObjects([]);
      setExtractedText('');
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDetectObjects = async () => {
    if (!imagePreview) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const result = await detectObjects(imagePreview);
      
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setDetectedObjects(result.data);
      }
    } catch (err) {
      setError('Failed to process image: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExtractText = async () => {
    if (!imagePreview) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const result = await extractText(imagePreview);
      
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setExtractedText(result.data.text);
      }
    } catch (err) {
      setError('Failed to extract text: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Google Vision AI Demo</h2>
      
      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          ref={fileInputRef}
        />
        <KioskButton 
          onClick={() => fileInputRef.current?.click()}
          className="mb-2"
        >
          Upload Image
        </KioskButton>
      </div>
      
      {imagePreview && (
        <div className="mb-4">
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="max-w-full h-auto max-h-64 mb-2 border rounded"
          />
          
          <div className="flex space-x-2">
            <KioskButton 
              onClick={handleDetectObjects}
              disabled={isProcessing}
            >
              Detect Objects
            </KioskButton>
            
            <KioskButton 
              onClick={handleExtractText}
              disabled={isProcessing}
            >
              Extract Text
            </KioskButton>
          </div>
        </div>
      )}
      
      {isProcessing && <Loader />}
      
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded mb-4">
          {error}
        </div>
      )}
      
      {detectedObjects.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Detected Objects:</h3>
          <ul className="list-disc pl-5">
            {detectedObjects.map((obj, index) => (
              <li key={index}>
                {obj.name} (Confidence: {Math.round(obj.score * 100)}%)
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {extractedText && (
        <div>
          <h3 className="font-semibold mb-2">Extracted Text:</h3>
          <div className="p-3 bg-gray-100 rounded whitespace-pre-wrap">
            {extractedText}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleVisionDemo;